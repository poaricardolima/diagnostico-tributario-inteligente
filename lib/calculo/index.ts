import type { EmpresaCnpj, QuizRespostas, ResultadoCalculo } from "@/lib/schemas";
import { labelPotencial } from "@/lib/schemas";

/** Pontuação por dimensão — total normalizado em 0–100. */
const REGIME_PTS: Record<QuizRespostas["regime"], number> = {
  mei: 8,
  simples_nacional: 18,
  lucro_presumido: 28,
  lucro_real: 32,
};

const FATURAMENTO_PTS: Record<QuizRespostas["faturamentoMensal"], number> = {
  ate_50k: 8,
  "50k_200k": 14,
  "200k_500k": 20,
  "500k_1m": 26,
  acima_1m: 30,
};

const ITENS_PTS: Record<QuizRespostas["qtdItens"], number> = {
  nenhum: 0,
  "1_50": 6,
  "51_200": 10,
  "201_1000": 14,
  acima_1000: 18,
};

const REVISAO_PTS: Record<QuizRespostas["revisaoRecente"], number> = {
  sim: 4,
  nao_sei: 12,
  nao: 18,
};

const TEXTO_COMPLEMENTAR =
  "Sua empresa apresenta um perfil com elevado potencial para identificação de oportunidades tributárias. A estimativa acima é preliminar e deverá ser confirmada por meio da análise documental.";

const TEXTO_COMPLEMENTAR_GERAL =
  "A estimativa acima é preliminar e deverá ser confirmada por meio da análise documental completa da empresa.";

function potencialFromScore(score: number): ResultadoCalculo["potencial"] {
  if (score >= 86) return "MUITO_ALTO";
  if (score >= 61) return "ALTO";
  if (score >= 31) return "MEDIO";
  return "BAIXO";
}

function faixaFinanceira(potencial: ResultadoCalculo["potencial"]): {
  faixaMin: number;
  faixaMax: number | null;
  estimativaTexto: string;
} {
  switch (potencial) {
    case "BAIXO":
      return {
        faixaMin: 30_000,
        faixaMax: 50_000,
        estimativaTexto: "R$ 30.000 a R$ 50.000",
      };
    case "MEDIO":
      return {
        faixaMin: 50_000,
        faixaMax: 80_000,
        estimativaTexto: "R$ 50.000 a R$ 80.000",
      };
    case "ALTO":
      return {
        faixaMin: 80_000,
        faixaMax: 120_000,
        estimativaTexto: "R$ 80.000 a R$ 120.000",
      };
    case "MUITO_ALTO":
      return {
        faixaMin: 120_000,
        faixaMax: null,
        estimativaTexto: "Superior a R$ 120.000",
      };
  }
}

function boostCnae(cnaeDescricao: string | null | undefined): number {
  if (!cnaeDescricao) return 2;
  const t = cnaeDescricao.toLowerCase();
  if (
    /com[eé]rcio|varej|atacad|supermerc|mercado|farmac|combust|posto|aliment|bebida|roupa|vestu[aá]rio|ind[uú]str|fabric/.test(
      t
    )
  ) {
    return 10;
  }
  if (/servi[cç]o|consult|tecnolog|software|ti\b|informa/.test(t)) return 2;
  return 5;
}

/** Lista técnica de oportunidades — melhora percepção de valor na tela de resultado. */
function buildOportunidades(
  input: QuizRespostas,
  potencial: ResultadoCalculo["potencial"]
): string[] {
  const itens: string[] = [];

  if (input.regime === "lucro_real" || input.regime === "lucro_presumido") {
    itens.push("Revisão de PIS/COFINS");
  } else {
    itens.push("Revisão de PIS/COFINS");
  }

  if (input.vendeProdutos) {
    itens.push("Produtos monofásicos");
    itens.push("Classificação Fiscal (NCM)");
  } else if (potencial !== "BAIXO") {
    itens.push("Classificação Fiscal (NCM)");
  }

  if (
    input.regime === "simples_nacional" ||
    input.regime === "lucro_presumido" ||
    input.faturamentoMensal === "500k_1m" ||
    input.faturamentoMensal === "acima_1m"
  ) {
    itens.push("Segregação de Receitas");
  }

  if (potencial === "ALTO" || potencial === "MUITO_ALTO" || potencial === "MEDIO") {
    itens.push("Reforma Tributária");
  }

  // Garante checklist rico em potenciais altos (exemplo comercial)
  if (potencial === "MUITO_ALTO" || potencial === "ALTO") {
    const obrigatorios = [
      "Revisão de PIS/COFINS",
      "Produtos monofásicos",
      "Classificação Fiscal (NCM)",
      "Segregação de Receitas",
      "Reforma Tributária",
    ];
    for (const o of obrigatorios) {
      if (!itens.includes(o)) itens.push(o);
    }
  }

  return Array.from(new Set(itens)).slice(0, 6);
}

/**
 * Motor determinístico 0–100.
 * Nenhuma pontuação ou faixa financeira depende de IA.
 */
export function calcularOportunidades(
  input: QuizRespostas,
  empresa?: Pick<EmpresaCnpj, "cnaeDescricao" | "cnaePrincipal" | "uf"> | null
): ResultadoCalculo {
  let raw =
    REGIME_PTS[input.regime] +
    FATURAMENTO_PTS[input.faturamentoMensal] +
    REVISAO_PTS[input.revisaoRecente] +
    boostCnae(empresa?.cnaeDescricao);

  if (input.vendeProdutos) {
    raw += 15 + ITENS_PTS[input.qtdItens];
  } else {
    raw += 2;
  }

  const score = Math.max(0, Math.min(100, Math.round(raw)));
  const potencial = potencialFromScore(score);
  const faixa = faixaFinanceira(potencial);
  const oportunidades = buildOportunidades(input, potencial);

  const textoComplementar =
    potencial === "ALTO" || potencial === "MUITO_ALTO"
      ? TEXTO_COMPLEMENTAR
      : TEXTO_COMPLEMENTAR_GERAL;

  return {
    potencial,
    score,
    faixaMin: faixa.faixaMin,
    faixaMax: faixa.faixaMax,
    estimativaTexto: faixa.estimativaTexto,
    textoComplementar,
    oportunidades,
    pontosAtencao: oportunidades,
  };
}

export { labelPotencial, potencialFromScore, faixaFinanceira };
