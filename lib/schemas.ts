import { z } from "zod";

export const RegimeSchema = z.enum([
  "simples_nacional",
  "lucro_presumido",
  "lucro_real",
  "mei",
]);

export const FaturamentoSchema = z.enum([
  "ate_50k",
  "50k_200k",
  "200k_500k",
  "500k_1m",
  "acima_1m",
]);

export const QtdItensSchema = z.enum([
  "nenhum",
  "1_50",
  "51_200",
  "201_1000",
  "acima_1000",
]);

export const RevisaoSchema = z.enum(["sim", "nao", "nao_sei"]);

export const QuizRespostasSchema = z.object({
  regime: RegimeSchema,
  faturamentoMensal: FaturamentoSchema,
  vendeProdutos: z.boolean(),
  qtdItens: QtdItensSchema,
  revisaoRecente: RevisaoSchema,
});

export type QuizRespostas = z.infer<typeof QuizRespostasSchema>;
export type Regime = z.infer<typeof RegimeSchema>;
export type Faturamento = z.infer<typeof FaturamentoSchema>;

export const EmpresaCnpjSchema = z.object({
  cnpj: z.string().min(14).max(18),
  razaoSocial: z.string(),
  nomeFantasia: z.string().nullable(),
  cnaePrincipal: z.string(),
  cnaeDescricao: z.string().nullable(),
  cidade: z.string(),
  uf: z.string(),
  situacao: z.string(),
});

export type EmpresaCnpj = z.infer<typeof EmpresaCnpjSchema>;

export const ContatoSchema = z.object({
  nome: z.string().min(2).max(120),
  whatsapp: z.string().min(10).max(20),
  email: z.string().email(),
});

export type Contato = z.infer<typeof ContatoSchema>;

export const PotencialSchema = z.enum([
  "BAIXO",
  "MEDIO",
  "ALTO",
  "MUITO_ALTO",
]);

export const ResultadoCalculoSchema = z.object({
  potencial: PotencialSchema,
  /** Índice 0–100 exibido ao usuário */
  score: z.number().int().min(0).max(100),
  faixaMin: z.number().nonnegative(),
  /** null = “Superior a faixaMin” */
  faixaMax: z.number().nonnegative().nullable(),
  estimativaTexto: z.string(),
  textoComplementar: z.string(),
  oportunidades: z.array(z.string().min(3).max(120)).min(1).max(8),
  /** @deprecated use oportunidades — mantido para compatibilidade UI/admin */
  pontosAtencao: z.array(z.string()).min(1),
});

export type ResultadoCalculo = z.infer<typeof ResultadoCalculoSchema>;

export const RecomendacaoIaSchema = z.object({
  titulo: z.string(),
  resumo: z.string(),
});

export type RecomendacaoIa = z.infer<typeof RecomendacaoIaSchema>;

export function labelPotencial(potencial: z.infer<typeof PotencialSchema>): string {
  switch (potencial) {
    case "BAIXO":
      return "Baixo";
    case "MEDIO":
      return "Médio";
    case "ALTO":
      return "Alto";
    case "MUITO_ALTO":
      return "Muito Alto";
  }
}
