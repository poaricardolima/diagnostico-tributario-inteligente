-- Seed de teste — 3 leads fictícios (diferentes portes/regimes)
-- Rodar apenas em ambientes de desenvolvimento

insert into public.leads (id, cnpj, razao_social, dados_empresa, nome, whatsapp, email, status)
values
  (
    '11111111-1111-1111-1111-111111111111',
    '11222333000181',
    'Comercio Alpha LTDA',
    '{"cidade":"São Paulo","uf":"SP","cnaePrincipal":"4711-3/02","situacao":"ATIVA"}'::jsonb,
    'Ana Silva',
    '11999990001',
    'ana@alpha.example',
    'qualificado'
  ),
  (
    '22222222-2222-2222-2222-222222222222',
    '11444777000161',
    'Servicos Beta ME',
    '{"cidade":"Curitiba","uf":"PR","cnaePrincipal":"6201-5/01","situacao":"ATIVA"}'::jsonb,
    null,
    null,
    null,
    'parcial'
  ),
  (
    '33333333-3333-3333-3333-333333333333',
    '12345678000195',
    'Industria Gama SA',
    '{"cidade":"Belo Horizonte","uf":"MG","cnaePrincipal":"2599-3/99","situacao":"ATIVA"}'::jsonb,
    'Carlos Souza',
    '31988887777',
    'carlos@gama.example',
    'qualificado'
  )
on conflict (cnpj) do nothing;

insert into public.quiz_respostas (lead_id, respostas)
values
  (
    '11111111-1111-1111-1111-111111111111',
    '{"regime":"simples_nacional","faturamentoMensal":"50k_200k","vendeProdutos":true,"qtdItens":"51_200","revisaoRecente":"nao"}'::jsonb
  ),
  (
    '33333333-3333-3333-3333-333333333333',
    '{"regime":"lucro_real","faturamentoMensal":"acima_1m","vendeProdutos":true,"qtdItens":"acima_1000","revisaoRecente":"nao_sei"}'::jsonb
  )
on conflict (lead_id) do nothing;

insert into public.resultados_ia (lead_id, potencial, faixa_min, faixa_max, pontos, score, texto_ia)
values
  (
    '11111111-1111-1111-1111-111111111111',
    'MEDIO',
    30000,
    120000,
    '["PIS/COFINS","Produtos monofásicos","Sem revisão recente"]'::jsonb,
    10,
    '{"titulo":"Oportunidade média identificada","resumo":"Há indícios de créditos e monofásicos a revisar."}'::jsonb
  ),
  (
    '33333333-3333-3333-3333-333333333333',
    'ALTO',
    60000,
    250000,
    '["PIS/COFINS","Volume de itens","Faturamento elevado"]'::jsonb,
    16,
    null
  )
on conflict (lead_id) do nothing;
