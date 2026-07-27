# Impulso Criativo — Landing Page Tributária

> Sessão viva. Atualizado após implementação do funil (2026-07-24).
> Roteamento VDS: Prompt 0 antes de código; Marcos = QA final.

## Identidade
- Cliente: Impulso Criativo (`impulsocriativo.com`)
- Produto: landing + funil de diagnóstico tributário (CNPJ → perguntas → contato → resultado)
- Repo: Next.js 14 App Router + TypeScript + Tailwind + Supabase
- Responsável: Marcos / Vintage DevStack

## Stack
- Next.js 14.2 + React 18 + Tailwind
- Zod (validação server-side)
- Supabase (leads / quiz / resultados) via service role em Server Actions
- BrasilAPI (consulta CNPJ)
- OpenAI opcional: refina cálculo (com sanitização) + texto; fallback = heurística determinística
- Vitest (motor de cálculo)

## Cálculo (fluxo)
1. Score determinístico 0–100 (quiz + CNAE) — **sem IA**
2. Faixas fixas: Baixo 30–50k | Médio 50–80k | Alto 80–120k | Muito Alto >120k
3. Tela de resultado: índice /100, potencial, estimativa e checklist de oportunidades
4. IA opcional apenas para texto personalizado (não altera números)

## Status dos blocos
- [x] Bloco 0 — Pré-requisitos (site ref + logo + plano aprovado)
- [x] Bloco 1 — Fundação (scaffold + tokens Impulso)
- [x] Bloco 2 — Hero / Header / Footer
- [x] Bloco 3 — Schema Supabase + RLS + seed
- [x] Bloco 4 — Quiz multi-step + salvamento incremental
- [x] Bloco 5 — Motor heurístico determinístico + testes
- [x] Bloco 6 — Camada IA com fallback
- [x] Bloco 7 — Resultado + CTA WhatsApp
- [x] Bloco 8 — `.env.example` + `vercel.json` headers
- [x] Painel admin `/admin` — login usuário/senha + lista de leads (nome, e-mail, telefone)

## Fluxo crítico
1. Hero CTA → `#diagnostico`
2. Consulta CNPJ (BrasilAPI) → upsert lead `parcial`
3. Perguntas → upsert `quiz_respostas`
4. Contato → cálculo determinístico → IA opcional → lead `qualificado` + `resultados_ia`
5. CTA WhatsApp (`NEXT_PUBLIC_WHATSAPP_URL`)
6. Admin em `/admin` (cookie JWT httpOnly; credenciais via `ADMIN_USERNAME` / `ADMIN_PASSWORD`)

## Variáveis
Ver `.env.example`. Sem Supabase, UI/cálculo funcionam sem persistência e o admin fica vazio.
Sem `OPENAI_API_KEY`, resultado sai só com dados calculados.

## Logo
- Fonte: `logo.ai` (AI/PDF)
- Web: `public/logo.png` (convertido) + `public/logo.svg` (fallback tipográfico)

## Deploy
- Vercel projeto: `vintage-devstack/impulso-criativo`
- Região runtime: **gru1 (São Paulo)**
- URL produção: https://impulso-criativo-tawny.vercel.app
- Admin: https://impulso-criativo-tawny.vercel.app/admin
- Token local: arquivo `token vcp` (gitignored)

## Pendências / [CONFIRMAR COM MARCOS]
- Criar projeto Supabase e aplicar migration (necessário para o admin listar leads)
- Configurar `NEXT_PUBLIC_SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY` na Vercel
- Refinar regras fiscais definitivas (heurística v1 em uso)
- Trocar `ADMIN_PASSWORD` / `ADMIN_SESSION_SECRET` em produção (já definidos na Vercel; revisar)
## QA pré-deploy (checklist)
- [ ] Migration aplicada no Supabase
- [ ] Preview Vercel validado com Marcos
- [ ] WhatsApp URL real
- [ ] Teste de CNPJ real + abandono parcial
- [ ] Login admin + listagem de leads