import OpenAI from "openai";
import {
  RecomendacaoIaSchema,
  type EmpresaCnpj,
  type QuizRespostas,
  type RecomendacaoIa,
  type ResultadoCalculo,
} from "@/lib/schemas";

const MODEL = process.env.OPENAI_MODEL || "gpt-4.1";

/**
 * Texto personalizado opcional — NÃO altera pontuação nem faixas financeiras.
 * Se a chave/API falhar, retorna null e a UI usa o texto complementar fixo.
 */
export async function gerarRecomendacaoIa(params: {
  empresa: EmpresaCnpj;
  quiz: QuizRespostas;
  resultado: ResultadoCalculo;
}): Promise<RecomendacaoIa | null> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;

  try {
    const openai = new OpenAI({ apiKey });
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8_000);

    const completion = await openai.chat.completions.create(
      {
        model: MODEL,
        temperature: 0.4,
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content:
              "Você é um especialista tributário brasileiro. Gere apenas JSON com titulo e resumo (máx. 2 frases). Não invente números — use somente os valores já calculados em resultado. Não altere pontuação nem faixas.",
          },
          {
            role: "user",
            content: JSON.stringify({
              empresa: {
                razaoSocial: params.empresa.razaoSocial,
                cnae: params.empresa.cnaeDescricao,
                uf: params.empresa.uf,
              },
              quiz: params.quiz,
              resultado: {
                potencial: params.resultado.potencial,
                score: params.resultado.score,
                estimativaTexto: params.resultado.estimativaTexto,
                oportunidades: params.resultado.oportunidades,
              },
            }),
          },
        ],
      },
      { signal: controller.signal }
    );

    clearTimeout(timeout);
    const raw = completion.choices[0]?.message?.content;
    if (!raw) return null;
    return RecomendacaoIaSchema.parse(JSON.parse(raw));
  } catch {
    return null;
  }
}
