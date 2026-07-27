import { getSupabaseAdmin } from "@/lib/supabase/admin";

export type AdminLead = {
  id: string;
  nome: string | null;
  email: string | null;
  whatsapp: string | null;
  cnpj: string | null;
  razao_social: string | null;
  status: string;
  created_at: string;
  potencial: string | null;
  faixa_min: number | null;
  faixa_max: number | null;
};

export async function listAdminLeads(): Promise<{
  leads: AdminLead[];
  error: string | null;
}> {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return {
      leads: [],
      error:
        "Supabase não configurado. Verifique NEXT_PUBLIC_SUPABASE_URL / NEXT_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY / NEXT_SUPABASE_SERVICE_ROLE_KEY na Vercel.",
    };
  }

  const { data, error } = await supabase
    .from("leads")
    .select(
      "id, nome, email, whatsapp, cnpj, razao_social, status, created_at, resultados_ia(potencial, faixa_min, faixa_max)"
    )
    .order("created_at", { ascending: false });

  if (error) {
    return { leads: [], error: error.message };
  }

  const leads: AdminLead[] = (data ?? []).map((row) => {
    const resultado = Array.isArray(row.resultados_ia)
      ? row.resultados_ia[0]
      : row.resultados_ia;

    return {
      id: row.id,
      nome: row.nome,
      email: row.email,
      whatsapp: row.whatsapp,
      cnpj: row.cnpj,
      razao_social: row.razao_social,
      status: row.status,
      created_at: row.created_at,
      potencial: resultado?.potencial ?? null,
      faixa_min: resultado?.faixa_min ?? null,
      faixa_max: resultado?.faixa_max ?? null,
    };
  });

  return { leads, error: null };
}
