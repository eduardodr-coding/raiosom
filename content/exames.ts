import type { UnidadeSlug } from "./clinica";

/**
 * Catálogo de exames.
 *
 * Todo o conteúdo de preparo vem do site atual da clínica e do material
 * aprovado — nada aqui é redação livre. É tipado de propósito: no dia em que a
 * clínica quiser editar sem deploy, este arquivo vira uma tabela do banco e as
 * páginas continuam iguais, porque só consomem `Exame`.
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
  /** Itens que o paciente precisa providenciar antes de vir. */
  preparo: string[];
  restricoes?: string[];
  recomendacoes?: string[];
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

/**
 * Preparo comum a todos os exames. A página de cada exame já traz estes itens
 * na lista; ficam aqui para não repetir texto e não sair do ar quando um
 * exame novo for cadastrado.
 */
export const REGRAS_GERAIS = [
  "O exame é realizado sempre com agendamento e protocolo prévios.",
  "Não realizamos exames sem a solicitação médica, conforme o protocolo de atendimento da clínica.",
  "Documento com foto é obrigatório (RG, CNH ou CTPS). Para pacientes de 0 a 12 anos, certidão de nascimento.",
  "Traga exames anteriores da mesma região, se houver.",
];

// Unidades: a matriz de Gravataí realiza todas as modalidades; a filial de
// Cachoeirinha é a unidade de tomografia. O paciente pode pedir qualquer uma
// no formulário — quem confirma a agenda do equipamento é a central.
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
    preparo: [
      "Chegar 30 minutos antes do horário agendado.",
      "Trazer a solicitação médica. Não realizamos o exame sem ela.",
      "Trazer documento com foto (RG, CNH ou CTPS). Para 0 a 12 anos, certidão de nascimento.",
      "Trazer exames anteriores da mesma região, se tiver.",
      "Avisar a equipe se usa marca-passo, prótese, implante ou qualquer objeto metálico no corpo.",
    ],
    contraste:
      "Alguns exames de ressonância mais complexos exigem injeção de contraste. Quando for o seu caso, a central avisa no agendamento e passa as orientações de preparo com antialérgico.",
    chegarAntesMin: 30,
    imagem: "/exames/resso.jpg",
    unidades: TODAS_GRAVATAI,
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
    preparo: [
      "Chegar 30 minutos antes do horário agendado.",
      "Trazer a solicitação médica. Não realizamos o exame sem ela.",
      "Trazer documento com foto (RG, CNH ou CTPS). Para 0 a 12 anos, certidão de nascimento.",
      "Trazer exames anteriores da mesma região, se tiver.",
    ],
    contraste:
      "O contraste é utilizado para evidenciar tecidos, órgãos e vasos. Não há contraindicação geral — as restrições são avaliadas caso a caso pela equipe.",
    chegarAntesMin: 30,
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
    preparo: [
      "Chegar 15 minutos antes do horário agendado.",
      "Trazer a solicitação médica. Não realizamos o exame sem ela.",
      "Trazer documento com foto (RG, CNH ou CTPS). Para 0 a 12 anos, certidão de nascimento.",
      "Trazer exames anteriores da mesma região, se tiver.",
      "Ecografia mamária em pacientes acima de 40 anos: trazer a mamografia atual.",
    ],
    contraste: null,
    chegarAntesMin: 15,
    laudo: "Laudo disponível na Matriz em 2 dias úteis e também pelo portal de resultados.",
    imagem: "/exames/eco.jpg",
    // Além da matriz, a Millenarium também realiza ultrassonografia — é a
    // única das 3 unidades novas (Solaris, IOG, Millenarium) que faz exame
    // no local; as outras duas são só ponto de marcação.
    unidades: [...TODAS_GRAVATAI, "millenarium"],
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
    preparo: [
      "Chegar 15 minutos antes do horário agendado.",
      "Trazer a solicitação médica. Não realizamos o exame sem ela.",
      "Trazer documento com foto (RG, CNH ou CTPS).",
      "Trazer exames anteriores — é essencial trazer a mamografia anterior para comparação.",
    ],
    recomendacoes: [
      "No dia do exame, não use creme corporal nem talco nas mamas.",
      "No dia do exame, não use desodorante nas axilas.",
    ],
    contraste: null,
    chegarAntesMin: 15,
    laudo: "Laudo disponível na Matriz em 3 dias úteis.",
    imagem: "/exames/mamo.jpg",
    unidades: TODAS_GRAVATAI,
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
    preparo: [
      "Chegar 15 minutos antes do horário agendado.",
      "Trazer a solicitação médica. Não realizamos o exame sem ela.",
      "Trazer documento com foto (RG, CNH ou CTPS). Para 0 a 12 anos, certidão de nascimento.",
      "Evitar acessórios de metal na região a ser radiografada.",
      "Evitar calça jeans.",
    ],
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
    preparo: [
      "Chegar 15 minutos antes do horário agendado.",
      "Trazer a solicitação médica. Não realizamos o exame sem ela.",
      "Trazer documento com foto (RG, CNH ou CTPS).",
      "Trazer exames anteriores, se tiver.",
    ],
    restricoes: [
      "Não pode ter realizado exame com contraste (oral ou endovenoso) na semana anterior.",
      "Capacidade máxima do equipamento: 140 kg.",
    ],
    recomendacoes: [
      "Suspender medicamento com cálcio um dia antes do exame e retomar depois.",
      "Jejum de 4 horas.",
      "Não ingerir grandes quantidades de líquido.",
    ],
    contraste: null,
    chegarAntesMin: 15,
    // do.jpg = densitômetro GE Lunar. O documento de briefing associava
    // este arquivo à radiografia odontológica, mas a foto é do equipamento
    // de densitometria; radio.jpg é que é o panorâmico odontológico.
    imagem: "/exames/do.jpg",
    unidades: TODAS_GRAVATAI,
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
    preparo: [
      "Trazer a solicitação do dentista ou do médico. Não realizamos o exame sem ela.",
      "Trazer documento com foto (RG, CNH ou CTPS).",
      "Retirar acessórios de metal da região do pescoço e da cabeça.",
    ],
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
    preparo: [
      "Chegar 15 minutos antes do horário agendado.",
      "Trazer a solicitação médica. Não realizamos o exame sem ela.",
      "Trazer documento com foto (RG, CNH ou CTPS).",
      "Trazer exames anteriores, se tiver.",
      "Trazer exame de creatinina com no máximo 6 meses.",
    ],
    restricoes: [
      "Nas 24 horas anteriores, não ingerir frutas cítricas, café, chá, chimarrão, refrigerante nem medicamentos com cafeína.",
      "Jejum de 4 horas.",
    ],
    recomendacoes: [
      "Vir com os cabelos secos, sem creme ou gel.",
      "Não usar acessórios de metal no dia do exame (relógio, correntes, brincos, anéis).",
    ],
    contraste: null,
    chegarAntesMin: 15,
    imagem: "/exames/ecocardio.jpg",
    unidades: TODAS_GRAVATAI,
    agendamento: "solicitacao",
    termosBusca: ["ec", "eco", "ecocardiograma", "cardiologico", "coracao", "cardio"],
  },
];

export function examePorSlug(slug: string): Exame | undefined {
  return EXAMES.find((exame) => exame.slug === slug);
}

/** Normaliza para busca: minúsculas, sem acento e sem pontuação. */
export function normalizar(texto: string): string {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Busca por nome, resumo ou sinônimo. O paciente digita o que está escrito no
 * pedido médico ("resso de joelho"), então casar palavra a palavra funciona
 * melhor do que exigir o nome exato da modalidade.
 */
export function buscarExames(termo: string): Exame[] {
  const alvo = normalizar(termo);
  if (!alvo) return EXAMES;

  const palavras = alvo.split(" ");

  return EXAMES.map((exame) => {
    const textoExame = normalizar(
      [exame.nome, exame.sigla, exame.resumo, ...exame.termosBusca, ...(exame.modalidades ?? [])].join(
        " ",
      ),
    );
    const pontos = palavras.reduce(
      (total, palavra) => (palavra.length >= 2 && textoExame.includes(palavra) ? total + 1 : total),
      0,
    );
    return { exame, pontos };
  })
    .filter((item) => item.pontos > 0)
    .sort((a, b) => b.pontos - a.pontos)
    .map((item) => item.exame);
}
