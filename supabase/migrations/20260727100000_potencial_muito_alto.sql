-- Permite potencial MUITO_ALTO e scores 0–100

alter table public.resultados_ia
  drop constraint if exists resultados_ia_potencial_check;

alter table public.resultados_ia
  add constraint resultados_ia_potencial_check
  check (potencial in ('BAIXO', 'MEDIO', 'ALTO', 'MUITO_ALTO'));
