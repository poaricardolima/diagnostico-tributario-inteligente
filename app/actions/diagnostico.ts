"use server";

import { cookies } from "next/headers";
import { z } from "zod";
import { consultarCnpj } from "@/lib/cnpj";
import { calcularOportunidades } from "@/lib/calculo";
import { gerarRecomendacaoIa } from "@/lib/ia";
import {
  ContatoSchema,
  QuizRespostasSchema,
  type Contato,
  type EmpresaCnpj,
  type QuizRespostas,
  type RecomendacaoIa,
  type ResultadoCalculo,
} from "@/lib/schemas";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { onlyDigits } from "@/lib/utils";

const LEAD_COOKIE = "impulso_lead_id";

function setLeadCookie(leadId: string) {
  cookies().set(LEAD_COOKIE, leadId, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}

function getLeadCookie(): string | undefined {
  return cookies().get(LEAD_COOKIE)?.value;
}

export type ActionResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string };

export async function actionConsultarCnpj(
  cnpj: string
): Promise<ActionResult<EmpresaCnpj & { leadId: string | null }>> {
  try {
    const empresa = await consultarCnpj(cnpj);
    const supabase = getSupabaseAdmin();
    let leadId: string | null = getLeadCookie() ?? null;

    if (supabase) {
      const payload = {
        cnpj: onlyDigits(empresa.cnpj),
        razao_social: empresa.razaoSocial,
        dados_empresa: empresa,
        status: "parcial" as const,
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from("leads")
        .upsert(payload, { onConflict: "cnpj" })
        .select("id")
        .single();

      if (error) {
        console.error("lead upsert", error.message);
      } else if (data?.id) {
        leadId = data.id;
        setLeadCookie(data.id);
      }
    }

    return { ok: true, data: { ...empresa, leadId } };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Erro ao consultar CNPJ",
    };
  }
}

export async function actionSalvarQuiz(
  leadId: string | null,
  cnpj: string,
  respostas: QuizRespostas
): Promise<ActionResult<{ leadId: string | null }>> {
  const parsed = QuizRespostasSchema.safeParse(respostas);
  if (!parsed.success) {
    return { ok: false, error: "Respostas inválidas. Revise os campos." };
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return { ok: true, data: { leadId } };
  }

  try {
    let id = leadId ?? getLeadCookie() ?? null;
    const digits = onlyDigits(cnpj);

    if (!id) {
      const { data, error } = await supabase
        .from("leads")
        .upsert(
          { cnpj: digits, status: "parcial" },
          { onConflict: "cnpj" }
        )
        .select("id")
        .single();
      if (error || !data) {
        return { ok: false, error: "Não foi possível salvar o progresso." };
      }
      id = data.id as string;
      setLeadCookie(id);
    }

    if (!id) {
      return { ok: false, error: "Não foi possível salvar o progresso." };
    }

    const { error } = await supabase.from("quiz_respostas").upsert(
      {
        lead_id: id,
        respostas: parsed.data,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "lead_id" }
    );

    if (error) {
      return { ok: false, error: "Não foi possível salvar as respostas." };
    }

    return { ok: true, data: { leadId: id } };
  } catch {
    return { ok: false, error: "Erro ao salvar respostas." };
  }
}

const DiagnosticoInputSchema = z.object({
  leadId: z.string().uuid().nullable(),
  empresa: z.object({
    cnpj: z.string(),
    razaoSocial: z.string(),
    nomeFantasia: z.string().nullable(),
    cnaePrincipal: z.string(),
    cnaeDescricao: z.string().nullable(),
    cidade: z.string(),
    uf: z.string(),
    situacao: z.string(),
  }),
  quiz: QuizRespostasSchema,
  contato: ContatoSchema,
});

export type DiagnosticoCompleto = {
  leadId: string | null;
  resultado: ResultadoCalculo;
  recomendacao: RecomendacaoIa | null;
};

export async function actionGerarDiagnostico(input: {
  leadId: string | null;
  empresa: EmpresaCnpj;
  quiz: QuizRespostas;
  contato: Contato;
}): Promise<ActionResult<DiagnosticoCompleto>> {
  const parsed = DiagnosticoInputSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: "Dados incompletos ou inválidos." };
  }

  const { empresa, quiz, contato } = parsed.data;
  // Cálculo 100% determinístico — IA não define pontuação/faixas
  const resultado = calcularOportunidades(quiz, empresa);
  // Texto personalizado opcional (não altera números)
  const recomendacao = await gerarRecomendacaoIa({ empresa, quiz, resultado });

  const supabase = getSupabaseAdmin();
  let leadId = parsed.data.leadId ?? getLeadCookie() ?? null;

  if (supabase) {
    try {
      const digits = onlyDigits(empresa.cnpj);
      const { data: lead, error: leadError } = await supabase
        .from("leads")
        .upsert(
          {
            cnpj: digits,
            razao_social: empresa.razaoSocial,
            dados_empresa: empresa,
            nome: contato.nome.trim(),
            whatsapp: onlyDigits(contato.whatsapp),
            email: contato.email.trim().toLowerCase(),
            status: "qualificado",
            updated_at: new Date().toISOString(),
          },
          { onConflict: "cnpj" }
        )
        .select("id")
        .single();

      if (!leadError && lead?.id) {
        leadId = lead.id;
        setLeadCookie(lead.id);

        await supabase.from("quiz_respostas").upsert(
          {
            lead_id: lead.id,
            respostas: quiz,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "lead_id" }
        );

        await supabase.from("resultados_ia").upsert(
          {
            lead_id: lead.id,
            potencial: resultado.potencial,
            faixa_min: resultado.faixaMin,
            faixa_max: resultado.faixaMax ?? resultado.faixaMin,
            pontos: resultado.pontosAtencao,
            score: resultado.score,
            texto_ia: {
              ...(recomendacao ?? {}),
              estimativaTexto: resultado.estimativaTexto,
              textoComplementar: resultado.textoComplementar,
              fonteCalculo: "heuristica",
            },
          },
          { onConflict: "lead_id" }
        );
      }
    } catch (err) {
      console.error("persist diagnostico", err);
    }
  }

  return {
    ok: true,
    data: { leadId, resultado, recomendacao },
  };
}
