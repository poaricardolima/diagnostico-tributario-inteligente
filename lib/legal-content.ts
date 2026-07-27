export type LegalDocId = "sobre" | "termos" | "privacidade";

export type LegalDoc = {
  id: LegalDocId;
  title: string;
  paragraphs: string[];
};

export const LEGAL_DOCS: Record<LegalDocId, LegalDoc> = {
  sobre: {
    id: "sobre",
    title: "Sobre a Impulso Criativo",
    paragraphs: [
      "É um prazer conhecer você.",
      "Criamos a Impulso Criativo para ajudar pequenas e médias empresas a crescer de forma estruturada, combinando estratégias inteligentes de marketing digital, consultoria e automação com IA.",
      "Nosso compromisso vai além da comunicação: desenhamos estratégias que geram resultados reais, otimizamos processos e estruturamos equipes de vendas altamente produtivas.",
      "Acreditamos que um negócio de sucesso precisa de posicionamento sólido, estratégias bem definidas e tecnologia aplicada à conversão. É por isso que atuamos desde a concepção até a consolidação da marca, sempre impulsionando nossos clientes rumo a um futuro mais próspero.",
      "Nosso objetivo é alavancar empreendedores, oferecendo mecanismos estratégicos para aumentar o faturamento, fortalecer a marca e garantir um crescimento sustentável.",
    ],
  },
  termos: {
    id: "termos",
    title: "Termos de Uso",
    paragraphs: [
      "Última atualização: julho de 2026.",
      "Ao acessar e utilizar o site e o diagnóstico tributário preliminar da Impulso Criativo, você concorda com estes Termos de Uso. Caso não concorde, não utilize os serviços disponibilizados nesta plataforma.",
      "1. Objeto. Esta plataforma oferece informações institucionais e uma ferramenta de análise preliminar baseada em dados informados pelo usuário (incluindo CNPJ e respostas a perguntas cadastrais/fiscais). O resultado apresentado é estimativo e educativo.",
      "2. Natureza do diagnóstico. O diagnóstico tributário é preliminar e não constitui auditoria fiscal, parecer jurídico, consultoria tributária formal nem garantia de recuperação de créditos ou valores. Qualquer estimativa de oportunidade deve ser validada por profissional habilitado com documentos e escrituração da empresa.",
      "3. Cadastro e veracidade. Você se compromete a informar dados verdadeiros, completos e atualizados. A Impulso Criativo não se responsabiliza por prejuízos decorrentes de informações incorretas ou incompletas fornecidas pelo usuário.",
      "4. Uso permitido. É vedado utilizar a plataforma para fins ilícitos, engenharia reversa, sobrecarga de sistemas, coleta automatizada abusiva de dados (scraping), ou qualquer conduta que viole a legislação brasileira ou direitos de terceiros.",
      "5. Propriedade intelectual. Marcas, logotipos, textos, layout e demais conteúdos da Impulso Criativo são protegidos. É proibida a reprodução sem autorização prévia, salvo uso pessoal e não comercial permitido por lei.",
      "6. Contato comercial. Ao concluir o fluxo e informar nome, e-mail e WhatsApp, você autoriza a Impulso Criativo a entrar em contato para apresentar serviços, esclarecimentos e propostas comerciais relacionadas ao diagnóstico.",
      "7. Limitação de responsabilidade. Na máxima extensão permitida pela lei, a Impulso Criativo não responde por lucros cessantes, decisões tomadas exclusivamente com base no diagnóstico preliminar, indisponibilidade temporária do site ou falhas de serviços de terceiros (consulta de CNPJ, hospedagem, provedores de IA).",
      "8. Alterações. Estes Termos podem ser atualizados a qualquer momento. A versão vigente será sempre a publicada neste site.",
      "9. Contato. Dúvidas sobre estes Termos: contato@impulsocriativo.com ou WhatsApp (51) 98909-9973.",
      "10. Foro. Fica eleito o foro da comarca de Porto Alegre/RS, com renúncia a qualquer outro, por mais privilegiado que seja, para dirimir controvérsias oriundas destes Termos, salvo disposição legal em contrário em favor do consumidor.",
    ],
  },
  privacidade: {
    id: "privacidade",
    title: "Política de Privacidade",
    paragraphs: [
      "Última atualização: julho de 2026.",
      "A Impulso Criativo respeita a sua privacidade e trata dados pessoais em conformidade com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018 — LGPD) e demais normas aplicáveis.",
      "1. Controladora. Os dados coletados por meio deste site são controlados pela Impulso Criativo, responsável pelas decisões referentes ao tratamento. Contato: contato@impulsocriativo.com | WhatsApp (51) 98909-9973.",
      "2. Dados que coletamos. Podemos tratar: (a) dados de identificação e contato — nome, e-mail e WhatsApp; (b) dados empresariais — CNPJ, razão social, nome fantasia, CNAE, município/UF e situação cadastral obtidos via consulta pública; (c) respostas do questionário (regime tributário, faturamento aproximado, venda de produtos, quantidade de itens e histórico de revisão fiscal); (d) dados técnicos de navegação (IP, dispositivo, páginas acessadas) quando necessários à segurança e ao funcionamento do site.",
      "3. Finalidades. Utilizamos os dados para: gerar o diagnóstico preliminar; entrar em contato comercial e prestar atendimento; aprimorar a experiência e a segurança da plataforma; cumprir obrigações legais; e, quando aplicável, gerar textos de apoio com ferramentas de inteligência artificial a partir dos resultados já calculados (sem substituir o cálculo determinístico).",
      "4. Bases legais. O tratamento fundamenta-se, conforme o caso, no consentimento do titular, na execução de procedimentos preliminares relacionados a contrato/solicitação do titular, no legítimo interesse (prospecção e melhoria do serviço, com salvaguardas) e no cumprimento de obrigação legal ou regulatória.",
      "5. Compartilhamento. Podemos compartilhar dados com provedores de infraestrutura (hospedagem, banco de dados), serviços de consulta de CNPJ, ferramentas de comunicação e, se configurado, provedores de IA — sempre na medida necessária à prestação do serviço e sob obrigações de confidencialidade. Não vendemos dados pessoais.",
      "6. Armazenamento e retenção. Os dados são armazenados em ambiente controlado pelo tempo necessário às finalidades descritas ou conforme exigido por lei. Após esse período, serão eliminados ou anonimizados, salvo hipóteses legais de retenção.",
      "7. Segurança. Adotamos medidas técnicas e administrativas razoáveis para proteger os dados contra acessos não autorizados, perda ou alteração indevida. Nenhum sistema é absolutamente seguro; recomendamos cautela ao compartilhar informações sensíveis por canais abertos.",
      "8. Direitos do titular. Você pode solicitar confirmação de tratamento, acesso, correção, anonimização, portabilidade, eliminação (quando cabível), informação sobre compartilhamentos e revogação de consentimento, pelos canais de contato acima, nos termos da LGPD.",
      "9. Cookies e tecnologias similares. Podemos utilizar cookies essenciais ao funcionamento do site e, eventualmente, cookies de medição. Você pode gerenciar cookies nas configurações do navegador; a desativação de cookies essenciais pode afetar funcionalidades.",
      "10. Alterações. Esta Política pode ser atualizada. A versão vigente estará sempre disponível neste site.",
      "11. Contato do titular / Encarregado. Para exercer direitos ou esclarecer dúvidas sobre privacidade, utilize contato@impulsocriativo.com ou WhatsApp (51) 98909-9973.",
    ],
  },
};
