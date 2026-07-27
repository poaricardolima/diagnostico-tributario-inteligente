-- Leads e diagnóstico tributário — Impulso Criativo
-- RLS ativo; escrita apenas via service role (Server Actions)

create extension if not exists "pgcrypto";

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  cnpj text not null,
  razao_social text,
  dados_empresa jsonb not null default '{}'::jsonb,
  nome text,
  whatsapp text,
  email text,
  status text not null default 'parcial'
    check (status in ('parcial', 'qualificado')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists leads_cnpj_unique on public.leads (cnpj);

create table if not exists public.quiz_respostas (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.leads (id) on delete cascade,
  respostas jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (lead_id)
);

create table if not exists public.resultados_ia (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.leads (id) on delete cascade,
  potencial text not null check (potencial in ('BAIXO', 'MEDIO', 'ALTO')),
  faixa_min numeric not null,
  faixa_max numeric not null,
  pontos jsonb not null default '[]'::jsonb,
  score integer,
  texto_ia jsonb,
  created_at timestamptz not null default now(),
  unique (lead_id)
);

alter table public.leads enable row level security;
alter table public.quiz_respostas enable row level security;
alter table public.resultados_ia enable row level security;

-- Sem policies de anon/authenticated: acesso apenas com service_role (bypassa RLS)
-- Documentado: Server Actions usam SUPABASE_SERVICE_ROLE_KEY

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists leads_set_updated_at on public.leads;
create trigger leads_set_updated_at
before update on public.leads
for each row execute function public.set_updated_at();

drop trigger if exists quiz_respostas_set_updated_at on public.quiz_respostas;
create trigger quiz_respostas_set_updated_at
before update on public.quiz_respostas
for each row execute function public.set_updated_at();
