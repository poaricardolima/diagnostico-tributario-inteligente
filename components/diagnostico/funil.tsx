"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { useSearchParams } from "next/navigation";
import { Check, Loader2, Lock, Shield } from "lucide-react";
import {
  actionConsultarCnpj,
  actionGerarDiagnostico,
  actionSalvarQuiz,
} from "@/app/actions/diagnostico";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type {
  Contato,
  EmpresaCnpj,
  QuizRespostas,
  RecomendacaoIa,
  ResultadoCalculo,
} from "@/lib/schemas";
import { formatCnpj, formatPhone, onlyDigits } from "@/lib/utils";
import { getWhatsAppUrl } from "@/lib/site";
import { labelPotencial } from "@/lib/schemas";

type Step = "cnpj" | "perguntas" | "contato" | "resultado";
type PreviewKey = Step | "confirmacao";

const STEPS: { id: Step; label: string }[] = [
  { id: "cnpj", label: "CNPJ" },
  { id: "perguntas", label: "Perguntas" },
  { id: "contato", label: "Contato" },
  { id: "resultado", label: "Resultado" },
];

const emptyQuiz: QuizRespostas = {
  regime: "simples_nacional",
  faturamentoMensal: "50k_200k",
  vendeProdutos: true,
  qtdItens: "1_50",
  revisaoRecente: "nao_sei",
};

const DEMO_EMPRESA: EmpresaCnpj = {
  cnpj: "11222333000181",
  razaoSocial: "Comercio Alpha LTDA",
  nomeFantasia: "Alpha Store",
  cnaePrincipal: "4711-3/02",
  cnaeDescricao: "Comércio varejista de mercadorias em geral",
  cidade: "São Paulo",
  uf: "SP",
  situacao: "ATIVA",
};

const DEMO_RESULTADO: ResultadoCalculo = {
  potencial: "MUITO_ALTO",
  score: 92,
  faixaMin: 120000,
  faixaMax: null,
  estimativaTexto: "Superior a R$ 120.000",
  textoComplementar:
    "Sua empresa apresenta um perfil com elevado potencial para identificação de oportunidades tributárias. A estimativa acima é preliminar e deverá ser confirmada por meio da análise documental.",
  oportunidades: [
    "Revisão de PIS/COFINS",
    "Produtos monofásicos",
    "Classificação Fiscal (NCM)",
    "Segregação de Receitas",
    "Reforma Tributária",
  ],
  pontosAtencao: [
    "Revisão de PIS/COFINS",
    "Produtos monofásicos",
    "Classificação Fiscal (NCM)",
    "Segregação de Receitas",
    "Reforma Tributária",
  ],
};

const DEMO_RECOMENDACAO: RecomendacaoIa = {
  titulo: "Alto potencial de revisão fiscal",
  resumo:
    "Com base no regime e no perfil da empresa, há indícios relevantes de créditos e monofásicos a validar com um especialista.",
};

function Stepper({ current }: { current: Step }) {
  const currentIndex = STEPS.findIndex((s) => s.id === current);

  return (
    <ol className="mb-6 flex items-center justify-between gap-1 sm:mb-8 sm:justify-center sm:gap-3">
      {STEPS.map((step, index) => {
        const done = index < currentIndex;
        const active = index === currentIndex;
        return (
          <li key={step.id} className="flex min-w-0 flex-1 flex-col items-center gap-1 sm:flex-none sm:flex-row sm:gap-2">
            <span
              className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold sm:h-8 sm:w-8 ${
                done
                  ? "bg-impulso-success text-white"
                  : active
                    ? "bg-impulso-gold text-impulso-navy"
                    : "bg-slate-200 text-slate-500"
              }`}
            >
              {done ? <Check className="h-4 w-4" /> : index + 1}
            </span>
            <span
              className={`max-w-full truncate text-[11px] font-medium sm:text-sm ${
                active ? "text-impulso-navy" : "text-slate-500"
              }`}
            >
              {step.label}
            </span>
            {index < STEPS.length - 1 && (
              <span className="mx-1 hidden h-px w-6 bg-slate-200 sm:block" />
            )}
          </li>
        );
      })}
    </ol>
  );
}

function ChoiceButton({
  selected,
  onClick,
  children,
}: {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`min-h-12 flex-1 rounded-xl border px-4 text-base font-semibold transition active:scale-[0.98] sm:flex-none sm:min-w-[6.5rem] sm:text-sm ${
        selected
          ? "border-impulso-gold bg-impulso-gold/15 text-impulso-navy"
          : "border-slate-200 bg-white text-slate-600 hover:border-impulso-gold/50"
      }`}
    >
      {children}
    </button>
  );
}

const selectClassName =
  "mt-2 flex h-12 w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 text-base text-impulso-navy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-impulso-gold";


export function DiagnosticoFunil() {
  const searchParams = useSearchParams();
  const [step, setStep] = useState<Step>("cnpj");
  const [cnpjInput, setCnpjInput] = useState("");
  const [empresa, setEmpresa] = useState<EmpresaCnpj | null>(null);
  const [leadId, setLeadId] = useState<string | null>(null);
  const [quiz, setQuiz] = useState<QuizRespostas>(emptyQuiz);
  const [contato, setContato] = useState<Contato>({
    nome: "",
    whatsapp: "",
    email: "",
  });
  const [resultado, setResultado] = useState<ResultadoCalculo | null>(null);
  const [recomendacao, setRecomendacao] = useState<RecomendacaoIa | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  // Preview de etapas: /?preview=perguntas#diagnostico (também: cnpj, confirmacao, contato, resultado)
  useEffect(() => {
    const preview = searchParams.get("preview") as PreviewKey | null;
    if (!preview) return;

    if (preview === "cnpj") {
      setStep("cnpj");
      setEmpresa(null);
      setCnpjInput("");
      return;
    }
    if (preview === "confirmacao") {
      setStep("cnpj");
      setEmpresa(DEMO_EMPRESA);
      setCnpjInput(formatCnpj(DEMO_EMPRESA.cnpj));
      return;
    }
    if (preview === "perguntas" || preview === "contato" || preview === "resultado") {
      setEmpresa(DEMO_EMPRESA);
      setCnpjInput(formatCnpj(DEMO_EMPRESA.cnpj));
      setStep(preview);
      if (preview === "resultado") {
        setResultado(DEMO_RESULTADO);
        setRecomendacao(DEMO_RECOMENDACAO);
      }
    }
  }, [searchParams]);

  const whatsappUrl = useMemo(() => {
    return getWhatsAppUrl(
      `Olá! Fiz o diagnóstico tributário da Impulso Criativo${
        empresa?.razaoSocial ? ` (${empresa.razaoSocial})` : ""
      } e quero falar com um especialista.`
    );
  }, [empresa]);

  function consultarEmpresa() {
    setError(null);
    startTransition(async () => {
      const res = await actionConsultarCnpj(cnpjInput);
      if (!res.ok) {
        setError(res.error);
        setEmpresa(null);
        return;
      }
      const { leadId: id, ...emp } = res.data;
      setEmpresa(emp);
      setLeadId(id);
    });
  }

  function irParaPerguntas() {
    if (!empresa) return;
    setStep("perguntas");
  }

  function irParaContato() {
    setError(null);
    startTransition(async () => {
      if (!empresa) return;
      const res = await actionSalvarQuiz(leadId, empresa.cnpj, quiz);
      if (!res.ok) {
        setError(res.error);
        return;
      }
      if (res.data.leadId) setLeadId(res.data.leadId);
      setStep("contato");
    });
  }

  function verDiagnostico() {
    setError(null);
    if (!empresa) return;
    if (contato.nome.trim().length < 2) {
      setError("Informe seu nome completo.");
      return;
    }
    if (onlyDigits(contato.whatsapp).length < 10) {
      setError("Informe um WhatsApp válido.");
      return;
    }
    if (!contato.email.includes("@")) {
      setError("Informe um e-mail válido.");
      return;
    }

    startTransition(async () => {
      const res = await actionGerarDiagnostico({
        leadId,
        empresa,
        quiz,
        contato,
      });
      if (!res.ok) {
        setError(res.error);
        return;
      }
      setLeadId(res.data.leadId);
      setResultado(res.data.resultado);
      setRecomendacao(res.data.recomendacao);
      setStep("resultado");
    });
  }

  return (
    <section
      id="diagnostico"
      className="scroll-mt-20 bg-slate-50 py-10 sm:py-16 md:py-20"
    >
      <div className="mx-auto max-w-3xl safe-px md:px-6">
        <div className="mb-6 text-center sm:mb-8">
          <h2 className="text-xl font-extrabold text-impulso-navy sm:text-2xl md:text-3xl">
            Diagnóstico tributário preliminar
          </h2>
          <p className="mt-2 text-sm text-slate-500 sm:text-base">
            Em poucos passos, estimamos oportunidades fiscais para a sua empresa.
          </p>
        </div>

        <Card>
          <Stepper current={step} />

          {error && (
            <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {step === "cnpj" && (
            <div className="space-y-5">
              {!empresa ? (
                <>
                  <div>
                    <Label htmlFor="cnpj">CNPJ da empresa</Label>
                    <Input
                      id="cnpj"
                      className="mt-2"
                      placeholder="00.000.000/0000-00"
                      value={cnpjInput}
                      onChange={(e) => setCnpjInput(formatCnpj(e.target.value))}
                      inputMode="numeric"
                    />
                  </div>
                  <Button
                    className="w-full"
                    size="lg"
                    disabled={pending || onlyDigits(cnpjInput).length < 14}
                    onClick={consultarEmpresa}
                  >
                    {pending ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Consultando...
                      </>
                    ) : (
                      "Consultar empresa"
                    )}
                  </Button>
                  <p className="flex items-center justify-center gap-2 text-xs text-slate-500">
                    <Shield className="h-3.5 w-3.5" />
                    Seus dados estão seguros
                  </p>
                </>
              ) : (
                <>
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                    <div className="mb-3 flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs uppercase tracking-wide text-slate-500">
                          Razão social
                        </p>
                        <p className="font-semibold text-impulso-navy">
                          {empresa.razaoSocial}
                        </p>
                      </div>
                      <span className="rounded-full bg-impulso-success/15 px-3 py-1 text-xs font-semibold text-impulso-success">
                        {empresa.situacao || "ATIVA"}
                      </span>
                    </div>
                    <dl className="grid gap-3 text-sm sm:grid-cols-2">
                      <div>
                        <dt className="text-slate-500">Nome fantasia</dt>
                        <dd className="font-medium text-impulso-deep">
                          {empresa.nomeFantasia || "—"}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-slate-500">CNPJ</dt>
                        <dd className="font-medium text-impulso-deep">
                          {formatCnpj(empresa.cnpj)}
                        </dd>
                      </div>
                      <div className="sm:col-span-2">
                        <dt className="text-slate-500">CNAE principal</dt>
                        <dd className="font-medium text-impulso-deep">
                          {empresa.cnaePrincipal}
                          {empresa.cnaeDescricao
                            ? ` — ${empresa.cnaeDescricao}`
                            : ""}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-slate-500">Cidade</dt>
                        <dd className="font-medium text-impulso-deep">
                          {empresa.cidade}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-slate-500">UF</dt>
                        <dd className="font-medium text-impulso-deep">
                          {empresa.uf}
                        </dd>
                      </div>
                    </dl>
                  </div>
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <Button
                      variant="secondary"
                      className="sm:flex-1"
                      onClick={() => {
                        setEmpresa(null);
                        setCnpjInput("");
                      }}
                    >
                      Consultar outro CNPJ
                    </Button>
                    <Button className="sm:flex-1" size="lg" onClick={irParaPerguntas}>
                      Continuar
                    </Button>
                  </div>
                </>
              )}
            </div>
          )}

          {step === "perguntas" && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-impulso-navy">
                Responda algumas perguntas rápidas
              </h3>

              <div>
                <Label htmlFor="regime">Regime tributário</Label>
                <select
                  id="regime"
                  className={selectClassName}
                  value={quiz.regime}
                  onChange={(e) =>
                    setQuiz((q) => ({
                      ...q,
                      regime: e.target.value as QuizRespostas["regime"],
                    }))
                  }
                >
                  <option value="mei">MEI</option>
                  <option value="simples_nacional">Simples Nacional</option>
                  <option value="lucro_presumido">Lucro Presumido</option>
                  <option value="lucro_real">Lucro Real</option>
                </select>
              </div>

              <div>
                <Label htmlFor="fat">Faturamento mensal aproximado</Label>
                <select
                  id="fat"
                  className={selectClassName}
                  value={quiz.faturamentoMensal}
                  onChange={(e) =>
                    setQuiz((q) => ({
                      ...q,
                      faturamentoMensal: e.target
                        .value as QuizRespostas["faturamentoMensal"],
                    }))
                  }
                >
                  <option value="ate_50k">Até R$ 50 mil</option>
                  <option value="50k_200k">R$ 50 mil a R$ 200 mil</option>
                  <option value="200k_500k">R$ 200 mil a R$ 500 mil</option>
                  <option value="500k_1m">R$ 500 mil a R$ 1 milhão</option>
                  <option value="acima_1m">Acima de R$ 1 milhão</option>
                </select>
              </div>

              <div>
                <Label>A empresa vende produtos?</Label>
                <div className="mt-2 flex gap-3">
                  <ChoiceButton
                    selected={quiz.vendeProdutos === true}
                    onClick={() => setQuiz((q) => ({ ...q, vendeProdutos: true }))}
                  >
                    Sim
                  </ChoiceButton>
                  <ChoiceButton
                    selected={quiz.vendeProdutos === false}
                    onClick={() =>
                      setQuiz((q) => ({
                        ...q,
                        vendeProdutos: false,
                        qtdItens: "nenhum",
                      }))
                    }
                  >
                    Não
                  </ChoiceButton>
                </div>
              </div>

              {quiz.vendeProdutos && (
                <div>
                  <Label htmlFor="itens">
                    Quantidade aproximada de itens cadastrados
                  </Label>
                  <select
                    id="itens"
                    className={selectClassName}
                    value={quiz.qtdItens}
                    onChange={(e) =>
                      setQuiz((q) => ({
                        ...q,
                        qtdItens: e.target.value as QuizRespostas["qtdItens"],
                      }))
                    }
                  >
                    <option value="1_50">1 a 50</option>
                    <option value="51_200">51 a 200</option>
                    <option value="201_1000">201 a 1.000</option>
                    <option value="acima_1000">Acima de 1.000</option>
                  </select>
                </div>
              )}

              <div>
                <Label>Fez revisão fiscal nos últimos 5 anos?</Label>
                <div className="mt-2 flex w-full flex-wrap gap-3">
                  {(
                    [
                      ["sim", "Sim"],
                      ["nao", "Não"],
                      ["nao_sei", "Não sei"],
                    ] as const
                  ).map(([value, label]) => (
                    <ChoiceButton
                      key={value}
                      selected={quiz.revisaoRecente === value}
                      onClick={() =>
                        setQuiz((q) => ({ ...q, revisaoRecente: value }))
                      }
                    >
                      {label}
                    </ChoiceButton>
                  ))}
                </div>
              </div>

              <Button
                className="w-full"
                size="lg"
                disabled={pending}
                onClick={irParaContato}
              >
                {pending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  "Continuar"
                )}
              </Button>
            </div>
          )}

          {step === "contato" && (
            <div className="space-y-5">
              <h3 className="text-xl font-bold text-impulso-navy">
                Quase lá! Precisamos dos seus dados
              </h3>
              <div>
                <Label htmlFor="nome">Nome completo</Label>
                <Input
                  id="nome"
                  className="mt-2"
                  value={contato.nome}
                  onChange={(e) =>
                    setContato((c) => ({ ...c, nome: e.target.value }))
                  }
                />
              </div>
              <div>
                <Label htmlFor="whatsapp">WhatsApp</Label>
                <Input
                  id="whatsapp"
                  className="mt-2"
                  placeholder="(00) 00000-0000"
                  value={contato.whatsapp}
                  onChange={(e) =>
                    setContato((c) => ({
                      ...c,
                      whatsapp: formatPhone(e.target.value),
                    }))
                  }
                  inputMode="tel"
                />
              </div>
              <div>
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  className="mt-2"
                  value={contato.email}
                  onChange={(e) =>
                    setContato((c) => ({ ...c, email: e.target.value }))
                  }
                />
              </div>
              <p className="flex items-center gap-2 text-xs text-slate-500">
                <Lock className="h-3.5 w-3.5" />
                Usamos seus dados apenas para entregar o diagnóstico e contato
                comercial, conforme a LGPD.
              </p>
              <Button
                className="w-full"
                size="lg"
                disabled={pending}
                onClick={verDiagnostico}
              >
                {pending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Calculando...
                  </>
                ) : (
                  "Ver meu diagnóstico"
                )}
              </Button>
            </div>
          )}

          {step === "resultado" && resultado && (
            <div className="space-y-5">
              <h3 className="text-center text-xl font-extrabold text-impulso-navy sm:text-2xl">
                Seu diagnóstico está pronto!
              </h3>

              <div className="rounded-2xl bg-impulso-navy p-5 text-white sm:p-6 md:p-8">
                <div className="flex flex-col items-center gap-5 text-center sm:flex-row sm:text-left">
                  <div className="flex h-24 w-24 shrink-0 flex-col items-center justify-center rounded-full border-4 border-impulso-success/50 bg-impulso-success/10">
                    <p className="text-[10px] uppercase tracking-wide text-slate-400">
                      índice
                    </p>
                    <p className="text-2xl font-extrabold text-impulso-success">
                      {resultado.score}
                      <span className="text-sm font-semibold text-slate-400">
                        /100
                      </span>
                    </p>
                  </div>
                  <div className="min-w-0 flex-1 space-y-2">
                    <p className="text-sm text-slate-300">
                      Índice de Oportunidade Tributária:{" "}
                      <strong className="text-impulso-success">
                        {resultado.score}/100
                      </strong>
                    </p>
                    <p className="text-sm text-slate-300">
                      Potencial:{" "}
                      <strong className="text-impulso-yellow">
                        {labelPotencial(resultado.potencial)}
                      </strong>
                    </p>
                    <div>
                      <p className="text-xs uppercase tracking-wide text-slate-400">
                        Estimativa financeira
                      </p>
                      <p className="break-words text-xl font-extrabold text-impulso-yellow sm:text-2xl md:text-3xl">
                        {resultado.estimativaTexto}
                      </p>
                    </div>
                  </div>
                </div>

                <p className="mt-5 text-left text-sm leading-relaxed text-slate-300">
                  {recomendacao?.resumo || resultado.textoComplementar}
                </p>
              </div>

              <div>
                <p className="mb-3 text-sm font-semibold text-impulso-navy">
                  Oportunidades identificadas
                </p>
                <ul className="space-y-2.5">
                  {resultado.oportunidades.map((oportunidade) => (
                    <li
                      key={oportunidade}
                      className="flex items-start gap-2.5 text-sm text-slate-700"
                    >
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-impulso-success" />
                      <span>{oportunidade}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                Esta é uma estimativa preliminar e não substitui uma auditoria
                fiscal completa. Um especialista validará os números com a
                análise documental da empresa.
              </div>

              <Button asChild variant="whatsapp" size="lg" className="w-full">
                <a href={whatsappUrl} target="_blank" rel="noreferrer">
                  Quero falar com um especialista
                </a>
              </Button>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="block text-center text-sm font-medium text-impulso-navy hover:text-impulso-gold"
              >
                Ou fale agora pelo WhatsApp →
              </a>
            </div>
          )}
        </Card>
      </div>
    </section>
  );
}
