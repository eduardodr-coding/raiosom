/**
 * Textos institucionais da página "A Clínica".
 *
 * A história e os diferenciais vêm da página de 50 anos do site antigo,
 * reescritos para o momento atual. Missão, Visão e Valores são o texto
 * oficial da clínica, reproduzido sem alteração: é declaração da empresa, não
 * texto de site para melhorar.
 */

export const HISTORIA = {
  titulo: "Nossa história",
  /** `{anos}` é trocado pela idade atual, calculada em content/clinica.ts. */
  paragrafos: [
    "A Raio Som nasceu em 1974 com um propósito que segue o mesmo até hoje: oferecer soluções em saúde por meio do diagnóstico por imagem, com competência profissional, tecnologia e atendimento próximo de cada paciente.",
    "São {anos} anos de um trabalho marcado pela seriedade, pelo investimento constante em equipamentos e pela valorização das pessoas. Nesse caminho enfrentamos desafios, celebramos conquistas e ampliamos nossos serviços, sempre colocando o paciente em primeiro lugar.",
    "Chegar até aqui é resultado de cada detalhe e de cada pessoa que fez parte desta jornada. Agradecemos aos pacientes, colaboradores, médicos e à comunidade que confiam no nosso trabalho.",
  ],
};

export const DIFERENCIAIS = [
  "Acessibilidade",
  "Agilidade no atendimento e na entrega dos laudos",
  "Diversidade de exames",
  "Inovação tecnológica",
  "Protocolos de segurança e confiabilidade",
  "Selo de Qualidade PADI",
  "União e trabalho em equipe",
];

export const PILARES = ["Credibilidade", "Visão estratégica", "Organização financeira"];

export const MISSAO =
  "Oferecer soluções em saúde através do diagnóstico por imagem, prestando assistência e promovendo a qualidade de vida de nossos clientes, buscando superar suas expectativas através da competência profissional, da tecnologia e do atendimento personalizado.";

export const VISAO =
  "Ser a marca de referência em diagnóstico por imagem, através da prestação de serviços de excelência em um ambiente diferenciado, com atendimento personalizado e exclusivo. Promover o crescimento pessoal e profissional da equipe técnica e pessoal administrativo. Buscar a constante inovação e modernização tecnológica.";

/** Cada frase do texto oficial vira um item, sem mudar nenhuma palavra. */
export const VALORES = [
  "Satisfação dos clientes.",
  "Competência, comprometimento e valorização da equipe técnica e do pessoal administrativo.",
  "Inovação tecnológica.",
  "Ética nas relações com clientes, colaboradores e comunidade.",
];
