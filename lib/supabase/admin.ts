import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let client: SupabaseClient | null = null;

function firstEnv(...keys: string[]): string | undefined {
  for (const key of keys) {
    const value = process.env[key]?.trim();
    if (value) return value;
  }
  return undefined;
}

/** Compatível com nomes manuais e com a integração Supabase → Vercel. */
export function getSupabaseConfig() {
  const url = firstEnv(
    "NEXT_PUBLIC_SUPABASE_URL",
    "NEXT_SUPABASE_URL",
    "SUPABASE_URL",
    "NEXT_PUBLIC_NEXT_SUPABASE_URL"
  );

  const serviceRoleKey = firstEnv(
    "SUPABASE_SERVICE_ROLE_KEY",
    "NEXT_SUPABASE_SERVICE_ROLE_KEY",
    "NEXT_SUPABASE_SECRET_KEY",
    "SUPABASE_SECRET_KEY"
  );

  const anonKey = firstEnv(
    "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    "NEXT_SUPABASE_ANON_KEY",
    "SUPABASE_ANON_KEY",
    "NEXT_PUBLIC_NEXT_SUPABASE_ANON_KEY",
    "NEXT_SUPABASE_PUBLISHABLE_KEY",
    "NEXT_PUBLIC_NEXT_SUPABASE_PUBLISHABLE_KEY"
  );

  return { url, serviceRoleKey, anonKey };
}

export function getSupabaseAdmin(): SupabaseClient | null {
  const { url, serviceRoleKey } = getSupabaseConfig();

  if (!url || !serviceRoleKey) {
    return null;
  }

  if (!client) {
    client = createClient(url, serviceRoleKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }

  return client;
}
