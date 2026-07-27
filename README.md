# Impulso Criativo — Landing Diagnóstico Tributário

## Setup local

```bash
npm install
cp .env.example .env.local
# preencha as variáveis
npm run dev
```

## Scripts

- `npm run dev` — desenvolvimento
- `npm run build` — build de produção
- `npm run test` — testes do motor de cálculo
- `npm run lint` — ESLint

## Supabase

1. Crie um projeto no Supabase
2. Rode `supabase/migrations/20260724000000_leads_diagnostico.sql`
3. (Opcional) rode `supabase/seed.sql` em ambiente de desenvolvimento
4. Preencha `NEXT_PUBLIC_SUPABASE_URL` e `SUPABASE_SERVICE_ROLE_KEY`

Sem Supabase configurado, o funil funciona em modo demo (cálculo + UI), sem persistir leads.

## Logo

- Fonte: `logo.ai` (Illustrator/PDF)
- Exportados: `public/logo.png`, `public/logo.svg`
