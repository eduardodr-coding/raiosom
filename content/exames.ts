import type { UnidadeSlug } from "./clinica";

/**
 * Catálogo de exames.
 *
 * O conteúdo vem do site atual da clínica e do material aprovado, nada aqui
 * é redação livre. É tipado de propósito: no dia em que a clínica quiser
 * editar sem deploy, este arquivo vira uma tabela do banco e as páginas
 * continuam iguais, porque só consomem `Exame`.
 */

export type TipoAgendamento =
  /** Fluxo normal: solicitação + protocolo + WhatsApp. */
  | "solicitacao"
  /** Sem reserva de horário: o paciente é atendido por ordem de chegada. */
  | "ordem-de-chegada";

export type Exame = {
  slug: string;
  nome: string;
  /** Usada na busca e como selo quando o exame não tem foto. */
  sigla: string;
  /** Uma linha, para card de listagem. */
  resumo: string;
  /** Parágrafo de abertura da página do exame. */
  descricao: string;
  comoEFeito?: string;
  modalidades?: string[];
  /**
   * O que impede ou inviabiliza o exame — limite do equipamento, conflito com
   * outro exame recente. Não é orientação de véspera: jejum, dieta e o que
   * vestir saíram do site em favor do WhatsApp da central, que é onde a
   * clínica consegue manter a orientação atual e específica do convênio.
   */
  restricoes?: string[];
  /** Texto sobre contraste, ou `null` quando o exame não usa. */
  contraste: string | null;
  /** Minutos de antecedência na recepção. */
  chegarAntesMin: number | null;
  laudo?: string;
  horarioAtendimento?: string;
  imagem: string | null;
  unidades: UnidadeSlug[];
  agendamento: TipoAgendamento;
  /** Sinônimos e termos do pedido médico, usados pela busca. */
  termosBusca: string[];
};

// Unidades: a matriz de Gravataí realiza todas as modalidades. Cachoeirinha
// faz ressonância, tomografia, ultrassom, mamografia e densitometria (não faz
// raios X, odontológico nem cardiológico). O paciente pode pedir qualquer uma
// no formulário, quem confirma a agenda do equipamento é a central.
const TODAS_GRAVATAI: UnidadeSlug[] = ["gravatai"];

export const EXAMES: Exame[] = [
  {
    slug: "ressonancia-magnetica",
    nome: "Ressonância Magnética",
    sigla: "RM",
    resumo: "Alta definição para articulações, coluna, crânio e abdome.",
    descricao:
      "Exame de alta definição que usa campo magnético, sem radiação. Indolor e feito com agendamento prévio.",
    comoEFeito:
      "A ressonância magnética não utiliza raios X. As imagens são formadas por campo magnético e radiofrequência, o que permite ao radiologista examinar diferentes partes do corpo com alta definição. Por causa do campo magnético, antes do exame você responde um questionário de segurança.",
    contraste:
      "Alguns exames de ressonância exigem injeção de contraste. Quando for o seu caso, nossa equipe passa todas as orientações pelo WhatsApp.",
    chegarAntesMin: 30,
    imagem: "/exames/resso.jpg",
    unidades: [...TODAS_GRAVATAI, "cachoeirinha"],
    agendamento: "solicitacao",
    termosBusca: ["rm", "resso", "ressonancia", "magnetica", "joelho", "coluna", "cranio", "ombro"],
  },
  {
    slug: "tomografia-computadorizada",
    nome: "Tomografia Computadorizada",
    sigla: "TC",
    resumo: "Imagens em cortes finos, com e sem contraste.",
    descricao:
      "Exame de imagem em cortes finos, realizado nas duas unidades, com agendamento prévio.",
    contraste:
      "O contraste é utilizado para evidenciar tecidos, órgãos e vasos. Não há contraindicação geral, as restrições são avaliadas caso a caso pela equipe.",
    chegarAntesMin: 15,
    imagem: "/exames/tomo.jpg",
    unidades: ["gravatai", "cachoeirinha"],
    agendamento: "solicitacao",
    termosBusca: ["tc", "tomo", "tomografia", "computadorizada", "cortes"],
  },
  {
    slug: "ultrassonografia",
    nome: "Ultrassonografia",
    sigla: "US",
    resumo: "Geral, obstétrica e com Doppler colorido.",
    descricao:
      "Exame por ultrassom, sem radiação, em diversas modalidades. Laudo disponível na Matriz em 2 dias úteis.",
    modalidades: [
      "Ultrassonografia geral",
      "Ultrassonografia obstétrica",
      "Ultrassonografia com Doppler colorido",
      "Ultrassonografia de partes moles",
      "Ultrassonografia transvaginal com Doppler",
    ],
    contraste: null,
    chegarAntesMin: 15,
    laudo: "Laudo disponível na Matriz em 2 dias úteis e também pelo portal de resultados.",
    imagem: "/exames/eco.jpg",
    // Além da matriz, a Millenarium também realiza ultrassonografia — é a
    // única das 3 unidades novas (Solaris, IOG, Millenarium) que faz exame
    // no local; as outras duas são só ponto de marcação.
    unidades: [...TODAS_GRAVATAI, "cachoeirinha", "millenarium"],
    agendamento: "solicitacao",
    termosBusca: [
      "us",
      "eco",
      "ecografia",
      "ultrassom",
      "ultrassonografia",
      "doppler",
      "obstetrica",
      "transvaginal",
      "gestacao",
      "abdominal",
    ],
  },
  {
    slug: "mamografia",
    nome: "Mamografia",
    sigla: "MG",
    resumo: "Digital, com foco na detecção precoce.",
    descricao:
      "Exame de rastreamento e diagnóstico da mama. Laudo disponível na Matriz em 3 dias úteis.",
    contraste: null,
    chegarAntesMin: 15,
    laudo: "Laudo disponível na Matriz em 3 dias úteis.",
    imagem: "/exames/mamo.jpg",
    unidades: [...TODAS_GRAVATAI, "cachoeirinha"],
    agendamento: "solicitacao",
    termosBusca: ["mg", "mamo", "mamografia", "mama", "rastreamento"],
  },
  {
    slug: "raios-x-digital",
    nome: "Raios X Digital",
    sigla: "RX",
    resumo: "Baixa dose de radiação e resultado rápido.",
    descricao:
      "Exame de imagem rápido, com baixa dose de radiação, realizado com agendamento prévio.",
    contraste: null,
    chegarAntesMin: 15,
    laudo: "Laudo disponível na Matriz em 2 dias úteis.",
    imagem: "/exames/rxd.jpg",
    unidades: TODAS_GRAVATAI,
    agendamento: "solicitacao",
    termosBusca: ["rx", "raio x", "raios x", "radiografia", "torax", "digital"],
  },
  {
    slug: "densitometria-ossea",
    nome: "Densitometria Óssea",
    sigla: "DO",
    resumo: "Avaliação de massa óssea e osteoporose.",
    descricao: "Exame para avaliação de osteoporose, indolor e com agendamento prévio.",
    restricoes: [
      "Não pode ter realizado exame com contraste (oral ou endovenoso) na semana anterior.",
      "Capacidade máxima do equipamento: 140 kg.",
    ],
    contraste: null,
    chegarAntesMin: 15,
    // do.jpg = densitômetro GE Lunar. O documento de briefing associava
    // este arquivo à radiografia odontológica, mas a foto é do equipamento
    // de densitometria; radio.jpg é que é o panorâmico odontológico.
    imagem: "/exames/do.jpg",
    unidades: [...TODAS_GRAVATAI, "cachoeirinha"],
    agendamento: "solicitacao",
    termosBusca: ["do", "densitometria", "ossea", "osteoporose", "massa ossea"],
  },
  {
    slug: "radiografia-odontologica",
    nome: "Radiografia Odontológica",
    sigla: "RO",
    resumo: "Panorâmica, periapical e documentação.",
    descricao:
      "Inclui panorâmica e Tomografia Computadorizada Cone Beam das ATMs, além da documentação ortodôntica.",
    contraste: null,
    chegarAntesMin: null,
    laudo:
      "Documentação ortodôntica disponível na Matriz em 5 dias úteis. Demais exames, em 2 dias úteis.",
    imagem: "/exames/radio.jpg",
    unidades: TODAS_GRAVATAI,
    agendamento: "solicitacao",
    termosBusca: [
      "ro",
      "odontologica",
      "panoramica",
      "cone beam",
      "atm",
      "documentacao ortodontica",
      "dente",
    ],
  },
  {
    slug: "exames-cardiologicos",
    nome: "Exames Cardiológicos",
    sigla: "EC",
    // A clínica confirmou que só realiza ecocardiograma — ECG e ergometria
    // apareciam no material antigo, mas não são feitos aqui.
    resumo: "Ecocardiograma.",
    descricao: "Exame do coração, não invasivo e indolor, com agendamento prévio.",
    contraste: null,
    chegarAntesMin: 15,
    imagem: "/exames/ecocardio.jpg",
    unidades: TODAS_GRAVATAI,
    agendamento: "solicitacao",
    termosBusca: ["ec", "eco", "ecocardiograma", "cardiologico", "coracao", "cardio"],
  },
  {
    slug: "biopsia-puncao",
    nome: "Biópsia / Punção",
    sigla: "BX",
    // As regiões e técnicas abaixo saem do catálogo do sistema (modalidade
    // BIOPSIA), não de redação livre.
    resumo: "Punção e coleta guiadas por imagem.",
    descricao:
      "Coleta de material para análise laboratorial, guiada por imagem, com agendamento prévio.",
    comoEFeito:
      "A coleta é guiada por ultrassom ou por tomografia, conforme o pedido médico, para que a agulha alcance exatamente a região a ser investigada. O material coletado segue para análise laboratorial.",
    modalidades: [
      "Mamas",
      "Próstata",
      "Tireoide",
      "Tórax",
      "Períneo",
      "Vasos e órgãos",
    ],
    contraste: null,
    chegarAntesMin: 15,
    imagem: null,
    unidades: TODAS_GRAVATAI,
    agendamento: "solicitacao",
    termosBusca: [
      "bx",
      "biopsia",
      "puncao",
      "paaf",
      "paf",
      "agulha fina",
      "core biopsy",
    ],
  },
];

export function examePorSlug(slug: string): Exame | undefined {
  return EXAMES.find((exame) => exame.slug === slug);
}
