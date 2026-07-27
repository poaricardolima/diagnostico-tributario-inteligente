import { z } from "zod";
import { EmpresaCnpjSchema, type EmpresaCnpj } from "@/lib/schemas";
import { onlyDigits } from "@/lib/utils";

function isValidCnpj(cnpj: string): boolean {
  const digits = onlyDigits(cnpj);
  if (digits.length !== 14) return false;
  if (/^(\d)\1+$/.test(digits)) return false;

  const calc = (base: string, factors: number[]) => {
    const sum = factors.reduce(
      (acc, factor, i) => acc + Number(base[i]) * factor,
      0
    );
    const mod = sum % 11;
    return mod < 2 ? 0 : 11 - mod;
  };

  const base12 = digits.slice(0, 12);
  const d1 = calc(base12, [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]);
  const d2 = calc(base12 + d1, [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]);
  return digits.endsWith(`${d1}${d2}`);
}

async function fetchJson(
  url: string,
  timeoutMs = 8_000
): Promise<{ ok: boolean; status: number; json: unknown }> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      cache: "no-store",
      headers: { Accept: "application/json" },
    });
    let json: unknown = null;
    try {
      json = await res.json();
    } catch {
      json = null;
    }
    return { ok: res.ok, status: res.status, json };
  } finally {
    clearTimeout(timer);
  }
}

function toEmpresa(partial: {
  cnpj: string;
  razaoSocial: string;
  nomeFantasia?: string | null;
  cnaePrincipal?: string | null;
  cnaeDescricao?: string | null;
  cidade?: string | null;
  uf?: string | null;
  situacao?: string | null;
}): EmpresaCnpj {
  return EmpresaCnpjSchema.parse({
    cnpj: partial.cnpj,
    razaoSocial: partial.razaoSocial,
    nomeFantasia: partial.nomeFantasia ?? null,
    cnaePrincipal: String(partial.cnaePrincipal ?? "—"),
    cnaeDescricao: partial.cnaeDescricao ?? null,
    cidade: partial.cidade ?? "—",
    uf: partial.uf ?? "—",
    situacao: (partial.situacao ?? "DESCONHECIDA").toUpperCase(),
  });
}

const BrasilApiSchema = z.object({
  cnpj: z.string().optional(),
  razao_social: z.string(),
  nome_fantasia: z.string().nullable().optional(),
  cnae_fiscal: z.union([z.number(), z.string()]).optional(),
  cnae_fiscal_descricao: z.string().nullable().optional(),
  municipio: z.string().nullable().optional(),
  uf: z.string().nullable().optional(),
  descricao_situacao_cadastral: z.string().nullable().optional(),
});

async function fromBrasilApi(cnpj: string): Promise<EmpresaCnpj | null> {
  const { ok, status, json } = await fetchJson(
    `https://brasilapi.com.br/api/cnpj/v1/${cnpj}`
  );
  if (status === 404) return null;
  if (!ok || !json) throw new Error("brasilapi_unavailable");

  const parsed = BrasilApiSchema.safeParse(json);
  if (!parsed.success) throw new Error("brasilapi_parse");

  return toEmpresa({
    cnpj,
    razaoSocial: parsed.data.razao_social,
    nomeFantasia: parsed.data.nome_fantasia,
    cnaePrincipal: String(parsed.data.cnae_fiscal ?? "—"),
    cnaeDescricao: parsed.data.cnae_fiscal_descricao,
    cidade: parsed.data.municipio,
    uf: parsed.data.uf,
    situacao: parsed.data.descricao_situacao_cadastral,
  });
}

const OpenCnpjSchema = z.object({
  cnpj: z.string().optional(),
  razao_social: z.string(),
  nome_fantasia: z.string().nullable().optional(),
  situacao_cadastral: z.string().nullable().optional(),
  cnae_principal: z.union([z.string(), z.number()]).nullable().optional(),
  municipio: z.string().nullable().optional(),
  uf: z.string().nullable().optional(),
  cnaes: z
    .array(
      z.object({
        codigo: z.union([z.string(), z.number()]).optional(),
        descricao: z.string().optional(),
        is_principal: z.boolean().optional(),
      })
    )
    .optional(),
});

async function fromOpenCnpj(cnpj: string): Promise<EmpresaCnpj | null> {
  const { ok, status, json } = await fetchJson(
    `https://api.opencnpj.org/${cnpj}`
  );
  if (status === 404) return null;
  if (!ok || !json) throw new Error("opencnpj_unavailable");

  const parsed = OpenCnpjSchema.safeParse(json);
  if (!parsed.success) throw new Error("opencnpj_parse");

  const principal = parsed.data.cnaes?.find((c) => c.is_principal);
  return toEmpresa({
    cnpj,
    razaoSocial: parsed.data.razao_social,
    nomeFantasia: parsed.data.nome_fantasia,
    cnaePrincipal: String(
      parsed.data.cnae_principal ?? principal?.codigo ?? "—"
    ),
    cnaeDescricao: principal?.descricao ?? null,
    cidade: parsed.data.municipio,
    uf: parsed.data.uf,
    situacao: parsed.data.situacao_cadastral,
  });
}

const ReceitaWsSchema = z.object({
  status: z.string().optional(),
  nome: z.string().optional(),
  fantasia: z.string().nullable().optional(),
  situacao: z.string().nullable().optional(),
  municipio: z.string().nullable().optional(),
  uf: z.string().nullable().optional(),
  atividade_principal: z
    .array(z.object({ code: z.string().optional(), text: z.string().optional() }))
    .optional(),
  message: z.string().optional(),
});

async function fromReceitaWs(cnpj: string): Promise<EmpresaCnpj | null> {
  const { ok, status, json } = await fetchJson(
    `https://www.receitaws.com.br/v1/cnpj/${cnpj}`
  );
  if (status === 404) return null;
  if (!ok || !json) throw new Error("receitaws_unavailable");

  const parsed = ReceitaWsSchema.safeParse(json);
  if (!parsed.success) throw new Error("receitaws_parse");

  if (parsed.data.status === "ERROR") {
    if (/não encontrado|nao encontrado/i.test(parsed.data.message ?? "")) {
      return null;
    }
    throw new Error("receitaws_error");
  }

  if (!parsed.data.nome) throw new Error("receitaws_empty");

  const atividade = parsed.data.atividade_principal?.[0];
  return toEmpresa({
    cnpj,
    razaoSocial: parsed.data.nome,
    nomeFantasia: parsed.data.fantasia,
    cnaePrincipal: atividade?.code ?? "—",
    cnaeDescricao: atividade?.text ?? null,
    cidade: parsed.data.municipio,
    uf: parsed.data.uf,
    situacao: parsed.data.situacao,
  });
}

/**
 * Consulta CNPJ com múltiplos provedores (independente de OpenAI).
 * Ordem: BrasilAPI → OpenCNPJ → ReceitaWS.
 */
export async function consultarCnpj(cnpjRaw: string): Promise<EmpresaCnpj> {
  const cnpj = onlyDigits(cnpjRaw);
  if (!isValidCnpj(cnpj)) {
    throw new Error("CNPJ inválido. Verifique os dígitos e tente novamente.");
  }

  const providers = [fromBrasilApi, fromOpenCnpj, fromReceitaWs] as const;
  let notFound = false;
  let lastError: unknown = null;

  for (const provider of providers) {
    try {
      const empresa = await provider(cnpj);
      if (empresa) return empresa;
      notFound = true;
    } catch (err) {
      lastError = err;
    }
  }

  if (notFound && !lastError) {
    throw new Error("CNPJ não encontrado na Receita Federal.");
  }

  console.error("consultarCnpj falhou em todos os provedores", lastError);
  throw new Error(
    "Não foi possível consultar o CNPJ agora. Tente novamente em instantes."
  );
}

export { isValidCnpj };
