/**
 * Dados institucionais da Raio Som.
 *
 * Fonte única de verdade para telefone, endereço, horário e links externos.
 * Nenhuma página escreve esses valores no meio do JSX — mudou aqui, muda no
 * site inteiro (header, footer, páginas de exame, mensagem do WhatsApp).
 */

/** Ano de fundação, conforme a página de história do site antigo. */
const FUNDACAO = 1974;

export const CLINICA = {
  nome: "Raio Som",
  nomeCompleto: "Centro Clínico Raio Som",
  descricao: "Diagnóstico por Imagem",
  /**
   * Anos de história, contados a partir da fundação. Era um número fixo e o
   * site seguia dizendo "50 anos" dois anos depois do aniversário.
   */
  anos: new Date().getFullYear() - FUNDACAO,
  desde: FUNDACAO,

  telefones: ["(51) 3484.4000"],
  /** Número principal, já em formato `tel:`. */
  telefonePrincipal: "(51) 3484.4000",
  telefoneLink: "tel:+555134844000",

  whatsapp: {
    exibicao: "(51) 9 9685.9824",
    /** Formato aceito pelo wa.me: código do país + DDD + número. */
    numero: "5551996859824",
    link: "https://wa.me/5551996859824",
  },

  emails: {
    agendamento: "agendamento@raiosom.com.br",
    privacidade: "privacidade@raiosom.com.br",
    contato: "contato@raiosom.com.br",
    /** Destino dos currículos no site antigo (envia.php). */
    rh: "rh@raiosom.com.br",
  },

  acreditacao: {
    selo: "Selo de Qualidade PADI",
    programa: "Programa de Acreditação em Diagnóstico por Imagem",
    orgao: "Colégio Brasileiro de Radiologia (CBR)",
    resumo: "Acreditação PADI · CBR",
  },

  links: {
    /** Portal de laudos e imagens. Sistema externo, sempre em nova aba. */
    portalResultados: "https://pacs.raiosom.com.br",
    appPlayStore:
      "https://play.google.com/store/apps/details?id=br.com.app.gpu3037035.gpu2bc3a8a9bda9a0fc025744a209f52e90",
    appAppStore: "https://apps.apple.com/br/app/clinica-raio-som/id6468998193",
    facebook: "https://www.facebook.com/raiosom/",
    instagram: "https://www.instagram.com/centro_clinico_raiosom/",
  },

  /** Encarregada de Proteção de Dados (DPO), conforme a política vigente. */
  encarregadaDados: {
    nome: "Katia Santos",
    email: "privacidade@raiosom.com.br",
  },

  /** Última atualização da Política de Privacidade herdada do site atual. */
  politicaAtualizadaEm: "dezembro de 2021",
} as const;

export type UnidadeSlug =
  | "gravatai"
  | "cachoeirinha"
  | "solaris"
  | "iog"
  | "millenarium";

export type Unidade = {
  slug: UnidadeSlug;
  /** Valor gravado no banco (enum UnidadeAtendimento). */
  valor: UnidadeSlug;
  etiqueta: string;
  nome: string;
  cidade: string;
  descricao: string;
  endereco: string | null;
  complemento: string | null;
  horarios: string[];
  telefone: string;
  mapa: string;
  /** null enquanto a clínica não manda uma foto real da unidade. */
  foto: string | null;
};

export const UNIDADES: Unidade[] = [
  {
    slug: "gravatai",
    valor: "gravatai",
    etiqueta: "Matriz · Gravataí",
    nome: "Centro Clínico Raio Som",
    cidade: "Gravataí / RS",
    descricao: "Ressonância, tomografia, ultrassom, mamografia, raios X e densitometria",
    endereco: "Rua Doutor Luiz Bastos do Prado, 1586",
    complemento: "Ao lado do estacionamento GTI Park",
    horarios: ["Seg a Sex: 07h00 às 23h00", "Sábado: 08h00 às 17h00"],
    telefone: "(51) 3484.4000",
    mapa: "https://www.google.com/maps/search/?api=1&query=Rua+Doutor+Luiz+Bastos+do+Prado%2C+1586%2C+Gravata%C3%AD+-+RS",
    foto: "/unidades/matriz.jpg",
  },
  {
    slug: "cachoeirinha",
    valor: "cachoeirinha",
    etiqueta: "Filial · Cachoeirinha",
    nome: "Raio Som Cachoeirinha",
    cidade: "Cachoeirinha / RS",
    descricao: "Ressonância, tomografia, ultrassom, mamografia e densitometria",
    endereco: "Rua Padre Réus, 206",
    complemento: "Vila Regina",
    horarios: ["Seg a Sex: 08h00 às 18h00"],
    telefone: "(51) 3484.4000",
    mapa: "https://www.google.com/maps/search/?api=1&query=Rua+Padre+R%C3%A9us%2C+206%2C+Cachoeirinha+-+RS",
    foto: "/unidades/cachoeirinha.jpg",
  },
  {
    slug: "solaris",
    valor: "solaris",
    etiqueta: "Ponto de atendimento · Solaris",
    nome: "Raio Som Solaris",
    cidade: "Gravataí / RS",
    // Ponto de marcação apenas — não realiza exames no local. Por isso não
    // aparece em `exame.unidades` de nenhum exame em content/exames.ts.
    descricao: "Ponto de atendimento e marcação. Os exames são realizados nas unidades com equipamento",
    endereco: "Rua Benjamin Constant, 169 - Sala 202",
    complemento: "Bairro Passo das Pedras",
    horarios: ["Seg a Sex: 08h00 às 18h00"],
    telefone: "(51) 3484.4000",
    mapa: "https://www.google.com/maps/search/?api=1&query=Raio+Som+Solaris+R.+Benjamin+Constant+169+Gravata%C3%AD+RS",
    foto: "/unidades/solaris.jpg",
  },
  {
    slug: "iog",
    valor: "iog",
    etiqueta: "Ponto de atendimento · IOG",
    nome: "Raio Som IOG",
    cidade: "Gravataí / RS",
    // Ponto de marcação apenas — não realiza exames no local.
    descricao: "Ponto de atendimento e marcação. Os exames são realizados nas unidades com equipamento",
    endereco: "Av. Dorival Cândido Luz de Oliveira, 459",
    complemento: "Centro",
    horarios: ["Seg a Sex: 08h00 às 18h00"],
    telefone: "(51) 3484.4000",
    mapa: "https://www.google.com/maps/search/?api=1&query=Raio+Som+IOG+Av.+Dorival+C%C3%A2ndido+Luz+de+Oliveira+459+Gravata%C3%AD+RS",
    foto: "/unidades/iog.jpg",
  },
  {
    slug: "millenarium",
    valor: "millenarium",
    etiqueta: "Unidade · Millenarium",
    nome: "Raio Som Millenarium",
    cidade: "Gravataí / RS",
    descricao: "Unidade de ultrassonografia (ecografia)",
    endereco: "Rua Adolfo Inácio de Barcelos, 568 - Sala 201",
    complemento: "Centro, Clínica Millenarium Multi Especialidades",
    horarios: ["Seg a Sex: 08h00 às 18h00"],
    telefone: "(51) 3484.4000",
    mapa: "https://www.google.com/maps/search/?api=1&query=Cl%C3%ADnica+Millenarium+R.+Adolfo+In%C3%A1cio+de+Barcelos+568+Gravata%C3%AD+RS",
    foto: "/unidades/millenarium.jpg",
  },
];

export function unidadePorSlug(slug: string): Unidade | undefined {
  return UNIDADES.find((unidade) => unidade.slug === slug);
}

/**
 * Prédio administrativo — é onde o paciente retira o exame impresso.
 *
 * Fica na mesma rua da matriz, no 1617 (a matriz é no 1586). Não realiza
 * exame nenhum e por isso não entra em `UNIDADES`: aquele array alimenta o
 * seletor de unidade do agendamento, e oferecer este endereço ali faria o
 * paciente marcar exame num prédio que só entrega laudo.
 */
export const ENTREGA_EXAMES = {
  nome: "Prédio administrativo",
  descricao: "Somente retirada de exames: não realizamos exames neste endereço",
  horarios: ["Seg a Sex: 07h30 às 19h00"],
  endereco: "Rua Doutor Luiz Bastos do Prado, 1617",
  cidade: "Gravataí / RS",
  mapa: "https://www.google.com/maps/search/?api=1&query=Rua+Doutor+Luiz+Bastos+do+Prado%2C+1617%2C+Gravata%C3%AD+-+RS",
  foto: "/unidades/administrativo.jpg",
};

/**
 * Quantas unidades a Raio Som tem para o paciente: as de `UNIDADES` mais o
 * prédio administrativo, que é a conta que a clínica divulga. Fica aqui para
 * o número do "Sobre" e o texto de "Unidades" não se desencontrarem.
 */
export const TOTAL_UNIDADES = UNIDADES.length + 1;

export const TURNOS = [
  { valor: "manha", rotulo: "Manhã" },
  { valor: "tarde", rotulo: "Tarde" },
  { valor: "noite", rotulo: "Noite" },
  { valor: "sabado", rotulo: "Sábado" },
  { valor: "tanto_faz", rotulo: "Tanto faz" },
] as const;

export type TurnoValor = (typeof TURNOS)[number]["valor"];

export function rotuloTurno(valor: string): string {
  return TURNOS.find((turno) => turno.valor === valor)?.rotulo ?? valor;
}

export function rotuloUnidade(valor: string): string {
  return UNIDADES.find((unidade) => unidade.valor === valor)?.etiqueta ?? valor;
}
