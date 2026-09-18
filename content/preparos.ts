/**
 * Catálogo detalhado de preparo por exame — extraído da lista interna de
 * procedimentos da clínica (planilha "Preparos Raio Som").
 *
 * Por quê este arquivo existe além de `content/exames.ts`:
 * `exames.ts` tem 9 categorias amplas (Ressonância, Tomografia...) pensadas
 * para navegação. Mas o pedido médico do paciente quase sempre traz o nome
 * TÉCNICO e específico do procedimento (ex.: "TC ABDOME TOTAL COM
 * CONTRASTE", "RM ARTICULAR - JOELHO", "HISTEROSSALPINGOGRAFIA"), que não
 * bate palavra por palavra com o nome da categoria. Este arquivo cobre essa
 * lacuna: é uma base de busca por procedimento específico, cada um com o
 * preparo exato e um link de volta para a categoria certa em `exames.ts`
 * (de onde sai o fluxo de agendamento com upload do pedido).
 *
 * O que foi feito ao extrair da planilha original (~600 linhas):
 * - Variantes de lateralidade (direita/esquerda) e de contraste (com/sem)
 *   foram unificadas numa entrada só, com nota de que o contraste é
 *   definido pelo médico radiologista no dia do exame — é a mesma regra em
 *   todas elas e duplicar infla o catálogo sem ajudar o paciente.
 * - Entradas puramente internas foram descartadas: preço de anestesista/
 *   laboratório, instrução de "atenção atendente", exames roteados para
 *   médico específico, agendamento em outra clínica (Lucas e Silva) e
 *   exames que a Raio Som não realiza.
 * - Jejum, contraste, pesquisa de alergia e metal são os eixos que mais se
 *   repetem — por isso os textos de preparo reaproveitam frases-padrão em
 *   vez de reescrever a mesma orientação centenas de vezes.
 *
 * TODO: confirmar com a clínica se algum destes preparos mudou desde a
 * extração da planilha (datas, sachês, produtos específicos como Luftal/
 * Ducolax podem trocar de marca).
 */

import type { UnidadeSlug } from "./clinica";

export type ModalidadePreparo =
  | "Ressonância Magnética"
  | "Tomografia Computadorizada"
  | "Raio X"
  | "Ultrassonografia"
  | "Mamografia"
  | "Densitometria Óssea"
  | "Odontológico"
  | "Procedimento";

export type PreparoExame = {
  slug: string;
  /** Nome de exibição, no padrão que aparece no pedido médico. */
  titulo: string;
  /** Outros nomes/variantes do mesmo procedimento, usados só na busca. */
  sinonimos: string[];
  modalidade: ModalidadePreparo;
  /** Horas de jejum, ou null quando o exame não exige jejum. */
  jejumHoras: number | null;
  preparo: string[];
  restricoes?: string[];
  observacoes?: string[];
  /** Slug em content/exames.ts — para onde o CTA de agendamento aponta. */
  exameRelacionado: string | null;
  unidades?: UnidadeSlug[];
};

/** Frases-padrão reaproveitadas em várias entradas de RM. */
const RM_SEM_METAL = [
  "Chegar com os cabelos secos, sem creme de pentear ou gel.",
  "Retirar acessórios de metal (relógio, correntes, brincos, anéis, piercings) antes do exame.",
];
const RM_TATUAGEM =
  "Quem tem tatuagem ou maquiagem definitiva/retoque feito há menos de 30 dias na região do exame não pode realizá-lo.";
const RM_CONTRASTE_NOTA =
  "A necessidade de contraste endovenoso é decidida pelo médico radiologista no dia do exame, mesmo que o pedido não mencione.";

const TC_TRAZER_ANTERIORES =
  "Trazer exames anteriores da mesma região SOMENTE se não foram realizados na Raio Som.";
const TC_SEM_METAL = "Chegar com os cabelos secos, sem creme de pentear ou gel, sem acessórios de metal.";
const TC_ALERGIA_RENAL =
  "Na pesquisa de alergia, avise se tem insuficiência renal ou faz hemodiálise — nesse caso é preciso trazer exame de creatinina recente.";
const TC_DIABETICO =
  "Diabéticos que usam Glibenclamida ou Metformina: a orientação sobre suspender a medicação é dada pelo médico radiologista no dia do exame.";

const RX_SEM_METAL = "Retirar todos os metais da região a ser radiografada.";

export const PREPAROS: PreparoExame[] = [
  // ───────────────────────── Ressonância Magnética ─────────────────────
  {
    slug: "rm-cranio-encefalo",
    titulo: "RM Crânio (Encéfalo)",
    sinonimos: ["ressonância de crânio", "ressonância do encéfalo", "rm cerebral"],
    modalidade: "Ressonância Magnética",
    jejumHoras: 4,
    preparo: [...RM_SEM_METAL, "Fazer 4 horas de jejum, caso o exame seja com contraste."],
    restricoes: [RM_TATUAGEM],
    observacoes: [RM_CONTRASTE_NOTA],
    exameRelacionado: "ressonancia-magnetica",
  },
  {
    slug: "rm-sela-turcica",
    titulo: "RM Sela Túrcica (Hipófise)",
    sinonimos: ["ressonância da hipófise"],
    modalidade: "Ressonância Magnética",
    jejumHoras: 4,
    preparo: [
      ...RM_SEM_METAL,
      "Fazer 4 horas de jejum, caso o exame seja com contraste.",
      "Se tiver exame de prolactina, trazer no dia.",
    ],
    restricoes: [RM_TATUAGEM],
    observacoes: [RM_CONTRASTE_NOTA],
    exameRelacionado: "ressonancia-magnetica",
  },
  {
    slug: "rm-face-seios-da-face",
    titulo: "RM Face / Seios da Face",
    sinonimos: ["ressonância da face", "ressonância dos seios da face"],
    modalidade: "Ressonância Magnética",
    jejumHoras: 4,
    preparo: [...RM_SEM_METAL, "Fazer 4 horas de jejum, caso o exame seja com contraste."],
    restricoes: [RM_TATUAGEM],
    observacoes: [RM_CONTRASTE_NOTA],
    exameRelacionado: "ressonancia-magnetica",
  },
  {
    slug: "rm-base-do-cranio-ossos-temporais",
    titulo: "RM Base do Crânio / Ossos Temporais (ouvidos)",
    sinonimos: ["rm cai", "ressonância dos ouvidos", "ressonância dos rochedos", "ressonância mastoides"],
    modalidade: "Ressonância Magnética",
    jejumHoras: 4,
    preparo: [...RM_SEM_METAL, "Fazer 4 horas de jejum, caso o exame seja com contraste."],
    restricoes: [RM_TATUAGEM],
    observacoes: [RM_CONTRASTE_NOTA],
    exameRelacionado: "ressonancia-magnetica",
  },
  {
    slug: "rm-orbitas",
    titulo: "RM Órbitas",
    sinonimos: ["ressonância dos olhos"],
    modalidade: "Ressonância Magnética",
    jejumHoras: 4,
    preparo: [...RM_SEM_METAL, "Fazer 4 horas de jejum, caso o exame seja com contraste."],
    restricoes: [RM_TATUAGEM],
    observacoes: [RM_CONTRASTE_NOTA],
    exameRelacionado: "ressonancia-magnetica",
  },
  {
    slug: "rm-coluna-cervical",
    titulo: "RM Coluna Cervical",
    sinonimos: ["ressonância da coluna cervical", "rm cervical"],
    modalidade: "Ressonância Magnética",
    jejumHoras: 4,
    preparo: [...RM_SEM_METAL, "Fazer 4 horas de jejum, caso o exame seja com contraste."],
    restricoes: [RM_TATUAGEM],
    observacoes: [RM_CONTRASTE_NOTA],
    exameRelacionado: "ressonancia-magnetica",
  },
  {
    slug: "rm-coluna-toracica",
    titulo: "RM Coluna Torácica (Dorsal)",
    sinonimos: ["ressonância da coluna torácica", "rm dorsal"],
    modalidade: "Ressonância Magnética",
    jejumHoras: 4,
    preparo: [...RM_SEM_METAL, "Fazer 4 horas de jejum, caso o exame seja com contraste."],
    restricoes: [RM_TATUAGEM],
    observacoes: [RM_CONTRASTE_NOTA],
    exameRelacionado: "ressonancia-magnetica",
  },
  {
    slug: "rm-coluna-lombar",
    titulo: "RM Coluna Lombar (Lombossacra)",
    sinonimos: ["ressonância da coluna lombar", "rm lombossacra"],
    modalidade: "Ressonância Magnética",
    jejumHoras: 4,
    preparo: [...RM_SEM_METAL, "Fazer 4 horas de jejum, caso o exame seja com contraste."],
    restricoes: [RM_TATUAGEM],
    observacoes: [RM_CONTRASTE_NOTA],
    exameRelacionado: "ressonancia-magnetica",
  },
  {
    slug: "rm-atm",
    titulo: "RM ATM (Articulação Temporomandibular)",
    sinonimos: ["ressonância da atm", "ressonância da mandíbula"],
    modalidade: "Ressonância Magnética",
    jejumHoras: 4,
    preparo: [...RM_SEM_METAL, "Fazer 4 horas de jejum, caso o exame seja com contraste."],
    restricoes: [RM_TATUAGEM],
    observacoes: [RM_CONTRASTE_NOTA],
    exameRelacionado: "ressonancia-magnetica",
  },
  {
    slug: "rm-ombro",
    titulo: "RM Ombro",
    sinonimos: ["ressonância do ombro"],
    modalidade: "Ressonância Magnética",
    jejumHoras: 4,
    preparo: [...RM_SEM_METAL, "Fazer 4 horas de jejum, caso o exame seja com contraste."],
    restricoes: [RM_TATUAGEM],
    observacoes: [RM_CONTRASTE_NOTA],
    exameRelacionado: "ressonancia-magnetica",
  },
  {
    slug: "rm-cotovelo-ou-punho",
    titulo: "RM Cotovelo ou Punho",
    sinonimos: ["ressonância do cotovelo", "ressonância do punho"],
    modalidade: "Ressonância Magnética",
    jejumHoras: 4,
    preparo: [...RM_SEM_METAL, "Fazer 4 horas de jejum, caso o exame seja com contraste."],
    restricoes: [RM_TATUAGEM],
    observacoes: [RM_CONTRASTE_NOTA],
    exameRelacionado: "ressonancia-magnetica",
  },
  {
    slug: "rm-mao-ou-dedo",
    titulo: "RM Mão ou Dedo (Quirodáctilo)",
    sinonimos: ["ressonância da mão", "ressonância do dedo"],
    modalidade: "Ressonância Magnética",
    jejumHoras: 4,
    preparo: [...RM_SEM_METAL, "Fazer 4 horas de jejum, caso o exame seja com contraste."],
    restricoes: [RM_TATUAGEM],
    observacoes: [RM_CONTRASTE_NOTA],
    exameRelacionado: "ressonancia-magnetica",
  },
  {
    slug: "rm-quadril-coxofemoral",
    titulo: "RM Quadril (Coxofemoral)",
    sinonimos: ["ressonância do quadril"],
    modalidade: "Ressonância Magnética",
    jejumHoras: 4,
    preparo: [...RM_SEM_METAL, "Fazer 4 horas de jejum, caso o exame seja com contraste."],
    restricoes: [RM_TATUAGEM],
    observacoes: [RM_CONTRASTE_NOTA],
    exameRelacionado: "ressonancia-magnetica",
  },
  {
    slug: "rm-joelho",
    titulo: "RM Joelho",
    sinonimos: ["ressonância do joelho"],
    modalidade: "Ressonância Magnética",
    jejumHoras: 4,
    preparo: [...RM_SEM_METAL, "Fazer 4 horas de jejum, caso o exame seja com contraste."],
    restricoes: [RM_TATUAGEM],
    observacoes: [RM_CONTRASTE_NOTA],
    exameRelacionado: "ressonancia-magnetica",
  },
  {
    slug: "rm-tornozelo-ou-pe",
    titulo: "RM Tornozelo ou Pé",
    sinonimos: ["ressonância do tornozelo", "ressonância do pé", "ressonância do calcâneo"],
    modalidade: "Ressonância Magnética",
    jejumHoras: 4,
    preparo: [...RM_SEM_METAL, "Fazer 4 horas de jejum, caso o exame seja com contraste."],
    restricoes: [RM_TATUAGEM],
    observacoes: [RM_CONTRASTE_NOTA],
    exameRelacionado: "ressonancia-magnetica",
  },
  {
    slug: "rm-perna-ou-coxa",
    titulo: "RM Perna ou Coxa",
    sinonimos: ["ressonância da perna", "ressonância da coxa", "ressonância da panturrilha"],
    modalidade: "Ressonância Magnética",
    jejumHoras: 4,
    preparo: [...RM_SEM_METAL, "Fazer 4 horas de jejum, caso o exame seja com contraste."],
    restricoes: [RM_TATUAGEM],
    observacoes: [RM_CONTRASTE_NOTA],
    exameRelacionado: "ressonancia-magnetica",
  },
  {
    slug: "rm-braco-ou-antebraco",
    titulo: "RM Braço ou Antebraço",
    sinonimos: ["ressonância do braço", "ressonância do antebraço"],
    modalidade: "Ressonância Magnética",
    jejumHoras: 4,
    preparo: [...RM_SEM_METAL, "Fazer 4 horas de jejum, caso o exame seja com contraste."],
    restricoes: [RM_TATUAGEM],
    observacoes: [RM_CONTRASTE_NOTA],
    exameRelacionado: "ressonancia-magnetica",
  },
  {
    slug: "rm-pescoco",
    titulo: "RM Pescoço",
    sinonimos: ["ressonância do pescoço", "ressonância da tireoide"],
    modalidade: "Ressonância Magnética",
    jejumHoras: 4,
    preparo: [...RM_SEM_METAL, "Fazer 4 horas de jejum, caso o exame seja com contraste."],
    restricoes: [RM_TATUAGEM],
    observacoes: [RM_CONTRASTE_NOTA],
    exameRelacionado: "ressonancia-magnetica",
  },
  {
    slug: "rm-torax",
    titulo: "RM Tórax",
    sinonimos: ["ressonância do tórax", "ressonância do pulmão", "ressonância do mediastino"],
    modalidade: "Ressonância Magnética",
    jejumHoras: 4,
    preparo: [...RM_SEM_METAL, "Fazer 4 horas de jejum, caso o exame seja com contraste."],
    restricoes: [RM_TATUAGEM],
    observacoes: [RM_CONTRASTE_NOTA],
    exameRelacionado: "ressonancia-magnetica",
  },
  {
    slug: "rm-abdome-superior",
    titulo: "RM Abdome Superior",
    sinonimos: ["ressonância do abdômen superior", "ressonância do fígado"],
    modalidade: "Ressonância Magnética",
    jejumHoras: 6,
    preparo: [...RM_SEM_METAL, "Fazer 6 horas de jejum, caso o exame seja com contraste."],
    restricoes: [RM_TATUAGEM],
    observacoes: [RM_CONTRASTE_NOTA],
    exameRelacionado: "ressonancia-magnetica",
  },
  {
    slug: "rm-abdome-total",
    titulo: "RM Abdome Total (Abdômen + Pelve)",
    sinonimos: ["ressonância do abdômen total"],
    modalidade: "Ressonância Magnética",
    jejumHoras: 6,
    preparo: [
      ...RM_SEM_METAL,
      "Fazer 6 horas de jejum, caso o exame seja com contraste.",
      "Se o pedido tiver alguma indicação adicional (entero-RM, defeco-RM ou avaliação hepato-específica), avise a central ao agendar — o preparo muda.",
    ],
    restricoes: [RM_TATUAGEM],
    observacoes: [RM_CONTRASTE_NOTA],
    exameRelacionado: "ressonancia-magnetica",
  },
  {
    slug: "rm-bacia-ou-pelve",
    titulo: "RM Bacia ou Pelve",
    sinonimos: ["ressonância da pelve", "ressonância da bacia", "ressonância das sacroilíacas"],
    modalidade: "Ressonância Magnética",
    jejumHoras: 6,
    preparo: [...RM_SEM_METAL, "Fazer 6 horas de jejum, caso o exame seja com contraste."],
    restricoes: [RM_TATUAGEM],
    observacoes: [RM_CONTRASTE_NOTA],
    exameRelacionado: "ressonancia-magnetica",
  },
  {
    slug: "rm-mama",
    titulo: "RM Mama",
    sinonimos: ["ressonância da mama", "ressonância mamária"],
    modalidade: "Ressonância Magnética",
    jejumHoras: 4,
    preparo: [
      ...RM_SEM_METAL,
      "Agendar o exame do 5º ao 14º dia após o início da menstruação.",
      "Fazer 4 horas de jejum, caso o exame seja com contraste.",
    ],
    restricoes: [RM_TATUAGEM],
    observacoes: [RM_CONTRASTE_NOTA],
    exameRelacionado: "ressonancia-magnetica",
  },
  {
    slug: "rm-bolsa-escrotal",
    titulo: "RM Bolsa Escrotal",
    sinonimos: ["ressonância dos testículos"],
    modalidade: "Ressonância Magnética",
    jejumHoras: 4,
    preparo: [...RM_SEM_METAL, "Fazer 4 horas de jejum, caso o exame seja com contraste."],
    restricoes: [RM_TATUAGEM],
    observacoes: [RM_CONTRASTE_NOTA],
    exameRelacionado: "ressonancia-magnetica",
  },
  {
    slug: "rm-plexo-braquial-ou-lombar",
    titulo: "RM Plexo Braquial ou Lombossacral",
    sinonimos: ["ressonância do plexo braquial"],
    modalidade: "Ressonância Magnética",
    jejumHoras: 4,
    preparo: [...RM_SEM_METAL, "Fazer 4 horas de jejum, caso o exame seja com contraste."],
    restricoes: [RM_TATUAGEM],
    observacoes: [RM_CONTRASTE_NOTA],
    exameRelacionado: "ressonancia-magnetica",
  },
  {
    slug: "rm-angiografia-qualquer-segmento",
    titulo: "Angio-RM (crânio, pescoço, tórax, abdômen)",
    sinonimos: ["angio ressonância", "angio-rm", "ressonância dos vasos"],
    modalidade: "Ressonância Magnética",
    jejumHoras: 6,
    preparo: [
      ...RM_SEM_METAL,
      "Fazer até 6 horas de jejum, caso o exame seja com contraste (o tempo varia conforme a região pedida — confirme com a central ao agendar).",
    ],
    restricoes: [RM_TATUAGEM],
    observacoes: [RM_CONTRASTE_NOTA],
    exameRelacionado: "ressonancia-magnetica",
  },
  {
    slug: "rm-coracao",
    titulo: "RM Coração (Morfológica, Funcional, Perfusão)",
    sinonimos: ["ressonância cardíaca", "rm cardíaca"],
    modalidade: "Ressonância Magnética",
    jejumHoras: 4,
    preparo: [
      ...RM_SEM_METAL,
      "Fazer 4 horas de jejum.",
      "Nas 24 horas antes do exame, não consumir chocolate, café, chá, chimarrão, refrigerante, energético nem remédios com cafeína (ex.: Neosaldina, Dorflex, Tylenol, Lisador).",
      "Trazer exame de creatinina com no máximo 6 meses.",
    ],
    restricoes: [RM_TATUAGEM],
    observacoes: [RM_CONTRASTE_NOTA],
    exameRelacionado: "exames-cardiologicos",
  },
  {
    slug: "entero-rm-defeco-rm",
    titulo: "Entero-RM ou Defeco-RM (com preparo intestinal)",
    sinonimos: ["ressonância do intestino", "enterorressonância", "defecografia por ressonância"],
    modalidade: "Ressonância Magnética",
    jejumHoras: 12,
    preparo: [
      ...RM_SEM_METAL,
      "Fazer dieta pobre em fibras nas 24 horas antes do exame (evitar verduras, integrais, frutas cruas, gordurosos, carne vermelha e laticínios integrais).",
      "Aplicar 1 supositório de glicerina de 2 a 8 horas antes do exame.",
      "Fazer 12 horas de jejum.",
      "Chegar 1 hora e 30 minutos antes do horário marcado.",
    ],
    restricoes: [RM_TATUAGEM, "Trazer um acompanhante, quando indicado pelo pedido."],
    observacoes: [RM_CONTRASTE_NOTA, "A central passa a solução laxante (Sorbitol) a usar antes do exame."],
    exameRelacionado: "ressonancia-magnetica",
  },

  // ───────────────────────── Tomografia Computadorizada ─────────────────
  {
    slug: "tc-cranio-encefalo",
    titulo: "TC Crânio (Encéfalo)",
    sinonimos: ["tomografia de crânio", "tomografia do encéfalo", "tc cerebral"],
    modalidade: "Tomografia Computadorizada",
    jejumHoras: 4,
    preparo: [TC_SEM_METAL, TC_TRAZER_ANTERIORES, "Fazer 4 horas de jejum, caso o exame seja com contraste."],
    observacoes: [TC_ALERGIA_RENAL, TC_DIABETICO],
    exameRelacionado: "tomografia-computadorizada",
  },
  {
    slug: "tc-sela-turcica-orbitas",
    titulo: "TC Sela Túrcica / Órbitas",
    sinonimos: ["tomografia da hipófise", "tomografia dos olhos"],
    modalidade: "Tomografia Computadorizada",
    jejumHoras: 4,
    preparo: [TC_SEM_METAL, TC_TRAZER_ANTERIORES, "Fazer 4 horas de jejum, caso o exame seja com contraste."],
    observacoes: [TC_ALERGIA_RENAL, TC_DIABETICO],
    exameRelacionado: "tomografia-computadorizada",
  },
  {
    slug: "tc-face-seios-da-face-atm",
    titulo: "TC Face / Seios da Face / ATM",
    sinonimos: ["tomografia da face", "tomografia dos seios da face", "tomografia da atm"],
    modalidade: "Tomografia Computadorizada",
    jejumHoras: 4,
    preparo: [TC_SEM_METAL, TC_TRAZER_ANTERIORES, "Fazer 4 horas de jejum, caso o exame seja com contraste."],
    restricoes: ["Quem amamenta deve ficar 24 horas sem amamentar após o exame com contraste, ou armazenar leite com antecedência."],
    observacoes: [TC_ALERGIA_RENAL, TC_DIABETICO],
    exameRelacionado: "tomografia-computadorizada",
  },
  {
    slug: "tc-mastoides-ouvidos",
    titulo: "TC Mastoides / Ouvidos (CAI)",
    sinonimos: ["tomografia dos ouvidos", "tomografia dos rochedos"],
    modalidade: "Tomografia Computadorizada",
    jejumHoras: 4,
    preparo: [TC_SEM_METAL, TC_TRAZER_ANTERIORES, "Fazer 4 horas de jejum, caso o exame seja com contraste."],
    restricoes: ["Quem amamenta deve ficar 24 horas sem amamentar após o exame com contraste, ou armazenar leite com antecedência."],
    observacoes: [TC_ALERGIA_RENAL, TC_DIABETICO],
    exameRelacionado: "tomografia-computadorizada",
  },
  {
    slug: "tc-coluna-cervical-toracica-lombar",
    titulo: "TC Coluna (Cervical, Torácica ou Lombar)",
    sinonimos: ["tomografia da coluna", "tomografia cervical", "tomografia lombar"],
    modalidade: "Tomografia Computadorizada",
    jejumHoras: 4,
    preparo: [TC_SEM_METAL, TC_TRAZER_ANTERIORES, "Fazer 4 horas de jejum, caso o exame seja com contraste."],
    observacoes: [TC_ALERGIA_RENAL, TC_DIABETICO],
    exameRelacionado: "tomografia-computadorizada",
  },
  {
    slug: "tc-articulacoes-membros",
    titulo: "TC de Articulações e Membros (ombro, cotovelo, punho, mão, quadril, joelho, tornozelo, pé)",
    sinonimos: ["tomografia do ombro", "tomografia do joelho", "tomografia do quadril", "tomografia do punho"],
    modalidade: "Tomografia Computadorizada",
    jejumHoras: 4,
    preparo: [TC_SEM_METAL, TC_TRAZER_ANTERIORES, "Fazer 4 horas de jejum, caso o exame seja com contraste."],
    observacoes: [TC_ALERGIA_RENAL, TC_DIABETICO],
    exameRelacionado: "tomografia-computadorizada",
  },
  {
    slug: "tc-torax",
    titulo: "TC Tórax",
    sinonimos: ["tomografia do tórax", "tomografia do pulmão"],
    modalidade: "Tomografia Computadorizada",
    jejumHoras: 4,
    preparo: [TC_SEM_METAL, TC_TRAZER_ANTERIORES, "Fazer 4 horas de jejum, caso o exame seja com contraste."],
    restricoes: ["Quem amamenta deve ficar 24 horas sem amamentar após o exame com contraste, ou armazenar leite com antecedência."],
    observacoes: [TC_ALERGIA_RENAL, TC_DIABETICO],
    exameRelacionado: "tomografia-computadorizada",
  },
  {
    slug: "tc-abdome-superior",
    titulo: "TC Abdome Superior",
    sinonimos: ["tomografia do abdômen superior"],
    modalidade: "Tomografia Computadorizada",
    jejumHoras: 6,
    preparo: [TC_SEM_METAL, TC_TRAZER_ANTERIORES, "Fazer 6 horas de jejum, caso o exame seja com contraste."],
    observacoes: [TC_ALERGIA_RENAL, TC_DIABETICO],
    exameRelacionado: "tomografia-computadorizada",
  },
  {
    slug: "tc-abdome-total",
    titulo: "TC Abdome Total (Abdômen + Pelve + Retroperitônio)",
    sinonimos: ["tomografia do abdômen total"],
    modalidade: "Tomografia Computadorizada",
    jejumHoras: 6,
    preparo: [
      TC_SEM_METAL,
      TC_TRAZER_ANTERIORES,
      "Fazer 6 horas de jejum, caso o exame seja com contraste.",
      "Para contraste via oral, chegar 1 hora e 30 minutos antes do horário marcado.",
    ],
    observacoes: [TC_ALERGIA_RENAL, TC_DIABETICO],
    exameRelacionado: "tomografia-computadorizada",
  },
  {
    slug: "tc-pelve-ou-bacia",
    titulo: "TC Pelve ou Bacia",
    sinonimos: ["tomografia da pelve", "tomografia da bacia"],
    modalidade: "Tomografia Computadorizada",
    jejumHoras: 6,
    preparo: [TC_SEM_METAL, TC_TRAZER_ANTERIORES, "Fazer 6 horas de jejum, caso o exame seja com contraste."],
    observacoes: [TC_ALERGIA_RENAL, TC_DIABETICO],
    exameRelacionado: "tomografia-computadorizada",
  },
  {
    slug: "angio-tc-aorta-e-arterias",
    titulo: "Angio-TC (aorta, carótidas, pulmonar, membros)",
    sinonimos: ["angiotomografia", "angio-tc", "tomografia dos vasos"],
    modalidade: "Tomografia Computadorizada",
    jejumHoras: 6,
    preparo: [
      TC_SEM_METAL,
      TC_TRAZER_ANTERIORES,
      "Fazer até 6 horas de jejum, caso o exame seja com contraste (o tempo exato varia por região — confirme ao agendar).",
    ],
    observacoes: [TC_ALERGIA_RENAL, TC_DIABETICO],
    exameRelacionado: "tomografia-computadorizada",
  },
  {
    slug: "angio-tc-coronariana",
    titulo: "Angio-TC Coronariana (Escore de Cálcio)",
    sinonimos: ["tomografia do coração", "escore de cálcio coronariano", "angiotomografia coronariana"],
    modalidade: "Tomografia Computadorizada",
    jejumHoras: 4,
    preparo: [
      TC_SEM_METAL,
      "Fazer 4 horas de jejum.",
      "Não tomar Sildenafila (Viagra, Revatio), Tadalafila (Cialis) ou Vardenafila (Levitra, Vivanza) nas 48 horas antes do exame.",
    ],
    restricoes: ["Quem amamenta deve ficar 24 horas sem amamentar após o exame com contraste, ou armazenar leite com antecedência."],
    observacoes: [TC_ALERGIA_RENAL, TC_DIABETICO],
    exameRelacionado: "exames-cardiologicos",
  },
  {
    slug: "entero-tc",
    titulo: "Entero-TC (Tomografia do Intestino)",
    sinonimos: ["tomografia do intestino", "enterotomografia"],
    modalidade: "Tomografia Computadorizada",
    jejumHoras: 12,
    preparo: [
      TC_SEM_METAL,
      "Fazer dieta pobre em fibras nas 24 horas antes do exame (evitar verduras, integrais, frutas cruas, gordurosos, carne vermelha e laticínios integrais).",
      "Fazer 12 horas de jejum.",
      "Chegar 1 hora e 30 minutos antes do horário marcado.",
    ],
    observacoes: [TC_ALERGIA_RENAL, TC_DIABETICO],
    exameRelacionado: "tomografia-computadorizada",
  },

  // ───────────────────────── Raio X ──────────────────────────────────
  {
    slug: "rx-torax",
    titulo: "RX Tórax",
    sinonimos: ["raio x do tórax", "radiografia do tórax", "rx torax pa"],
    modalidade: "Raio X",
    jejumHoras: null,
    preparo: [RX_SEM_METAL],
    restricoes: ["Mulheres: não usar sutiã no dia do exame."],
    exameRelacionado: "raios-x-digital",
  },
  {
    slug: "rx-coluna-cervical-toracica",
    titulo: "RX Coluna Cervical ou Torácica",
    sinonimos: ["raio x da coluna cervical", "raio x da coluna torácica"],
    modalidade: "Raio X",
    jejumHoras: null,
    preparo: [RX_SEM_METAL],
    restricoes: ["Mulheres: não usar sutiã no dia do exame."],
    exameRelacionado: "raios-x-digital",
  },
  {
    slug: "rx-coluna-lombo-sacra-funcional-e-bacia",
    titulo: "RX Coluna Lombo-Sacra Funcional / Bacia",
    sinonimos: ["raio x da coluna lombar", "raio x da bacia"],
    modalidade: "Raio X",
    jejumHoras: null,
    preparo: [
      "Tomar 2 comprimidos de Ducolax (laxante) 24 horas antes do horário marcado.",
      "Se o laxante não fizer efeito, é indicado tomar mais 2 comprimidos.",
      "Beber bastante água e fazer uma dieta leve no dia anterior.",
      RX_SEM_METAL,
      "Evitar calça jeans.",
    ],
    restricoes: ["Mulheres: não usar sutiã no dia do exame."],
    exameRelacionado: "raios-x-digital",
  },
  {
    slug: "rx-cranio-face-seios-da-face-orbitas",
    titulo: "RX Crânio / Face / Seios da Face / Órbitas",
    sinonimos: ["raio x do crânio", "raio x dos seios da face", "raio x das órbitas"],
    modalidade: "Raio X",
    jejumHoras: null,
    preparo: [RX_SEM_METAL + " Inclui prótese dentária com metal e brincos."],
    exameRelacionado: "raios-x-digital",
  },
  {
    slug: "rx-atm",
    titulo: "RX ATM (Articulação Temporomandibular)",
    sinonimos: ["raio x da atm", "raio x da mandíbula"],
    modalidade: "Raio X",
    jejumHoras: null,
    preparo: [RX_SEM_METAL + " Inclui prótese dentária com metal."],
    exameRelacionado: "raios-x-digital",
  },
  {
    slug: "rx-membros-superiores",
    titulo: "RX Membros Superiores (ombro, cotovelo, punho, mão, dedos)",
    sinonimos: ["raio x do ombro", "raio x do punho", "raio x da mão"],
    modalidade: "Raio X",
    jejumHoras: null,
    preparo: [RX_SEM_METAL],
    restricoes: ["Mulheres: não usar sutiã no exame de ombro."],
    exameRelacionado: "raios-x-digital",
  },
  {
    slug: "rx-membros-inferiores",
    titulo: "RX Membros Inferiores (quadril, joelho, tornozelo, pé)",
    sinonimos: ["raio x do quadril", "raio x do joelho", "raio x do tornozelo", "raio x do pé"],
    modalidade: "Raio X",
    jejumHoras: null,
    preparo: [RX_SEM_METAL, "Evitar calça jeans."],
    exameRelacionado: "raios-x-digital",
  },
  {
    slug: "rx-abdome",
    titulo: "RX Abdome (simples, agudo ou ortostático)",
    sinonimos: ["raio x do abdômen"],
    modalidade: "Raio X",
    jejumHoras: null,
    preparo: [RX_SEM_METAL, "Evitar calça jeans."],
    exameRelacionado: "raios-x-digital",
  },
  {
    slug: "rx-esofago",
    titulo: "RX Esôfago",
    sinonimos: ["raio x do esôfago"],
    modalidade: "Raio X",
    jejumHoras: null,
    preparo: [RX_SEM_METAL],
    exameRelacionado: "raios-x-digital",
  },

  // ───────────────────────── Odontológico ────────────────────────────
  {
    slug: "radiografia-periapical-interproximal",
    titulo: "Radiografia Periapical / Interproximal / Bite-wing",
    sinonimos: ["raio x periapical", "raio x interproximal", "levantamento radiográfico"],
    modalidade: "Odontológico",
    jejumHoras: null,
    preparo: ["Evitar acessórios de metal da região do pescoço para cima (correntes, brincos, piercings)."],
    exameRelacionado: "radiografia-odontologica",
  },
  {
    slug: "radiografia-panoramica",
    titulo: "Radiografia Panorâmica (Mandíbula/Maxila)",
    sinonimos: ["raio x panorâmico", "ortopantomografia"],
    modalidade: "Odontológico",
    jejumHoras: null,
    preparo: ["Retirar todos os acessórios de metal da região do pescoço para cima, inclusive prótese dentária."],
    exameRelacionado: "radiografia-odontologica",
  },
  {
    slug: "documentacao-ortodontica",
    titulo: "Documentação Ortodôntica (Básica ou Completa)",
    sinonimos: ["documentação ortopédica", "documentação periodontal"],
    modalidade: "Odontológico",
    jejumHoras: 2,
    preparo: [
      "Fazer 2 horas de jejum.",
      "Evitar acessórios de metal da região do pescoço para cima (correntes, brincos, piercings).",
    ],
    exameRelacionado: "radiografia-odontologica",
  },
  {
    slug: "tomografia-cone-beam",
    titulo: "Tomografia Cone Beam (dente, arcada, face ou mandíbula)",
    sinonimos: ["tomografia odontológica", "tomo cone beam"],
    modalidade: "Odontológico",
    jejumHoras: null,
    preparo: [
      "Cabelos secos, sem gel nem creme capilar.",
      "Não usar acessórios de metal acima do pescoço (brincos, correntes, piercing).",
      TC_TRAZER_ANTERIORES,
    ],
    exameRelacionado: "radiografia-odontologica",
  },

  // ───────────────────────── Ultrassonografia ────────────────────────
  {
    slug: "us-abdome-total-ou-superior",
    titulo: "US Abdome Total ou Superior",
    sinonimos: ["ecografia abdominal", "ultrassom do abdômen", "eco do fígado"],
    modalidade: "Ultrassonografia",
    jejumHoras: 6,
    preparo: ["Fazer 6 horas de jejum."],
    exameRelacionado: "ultrassonografia",
  },
  {
    slug: "us-aparelho-urinario-ou-pelvica",
    titulo: "US Aparelho Urinário ou Pélvica",
    sinonimos: ["ecografia da bexiga", "ultrassom da próstata via abdominal", "eco pélvica"],
    modalidade: "Ultrassonografia",
    jejumHoras: null,
    preparo: [
      "Beber 3 copos de água 1 hora antes do exame e não urinar.",
      "É necessário comparecer ao exame com a bexiga cheia.",
    ],
    exameRelacionado: "ultrassonografia",
  },
  {
    slug: "us-doppler-abdominal-com-preparo-intestinal",
    titulo: "Doppler Abdominal / Aorta / Artérias Renais ou Viscerais",
    sinonimos: ["eco doppler do abdômen", "doppler da aorta", "ecodoppler visceral"],
    modalidade: "Ultrassonografia",
    jejumHoras: 10,
    preparo: [
      "Fazer 10 horas de jejum.",
      "24 horas antes do exame, tomar 2 comprimidos de Ducolax (laxante).",
      "3 horas antes do exame, tomar 2 comprimidos de Luftal.",
      "Beber 3 copos de água 1 hora antes do exame e não urinar.",
    ],
    observacoes: ["Crianças de 2 a 7 anos: 3 horas de jejum e Luftal conforme a bula. Até 2 anos: pedir orientação ao médico do exame."],
    exameRelacionado: "ultrassonografia",
  },
  {
    slug: "us-obstetrica",
    titulo: "US Obstétrica (rotina, com Doppler)",
    sinonimos: ["ecografia obstétrica", "ultrassom da gestante"],
    modalidade: "Ultrassonografia",
    jejumHoras: null,
    preparo: ["Trazer exames anteriores.", "Trazer a carteirinha de gestação."],
    exameRelacionado: "ultrassonografia",
  },
  {
    slug: "us-obstetrica-com-translucencia-nucal",
    titulo: "US Obstétrica com Translucência Nucal (TN)",
    sinonimos: ["ultrassom morfológico do 1º trimestre", "eco com tn"],
    modalidade: "Ultrassonografia",
    jejumHoras: null,
    preparo: [
      "Trazer exames anteriores.",
      "Trazer a carteirinha de gestação.",
      "Exame realizado de 11 a 14 semanas de gestação.",
    ],
    exameRelacionado: "ultrassonografia",
  },
  {
    slug: "us-obstetrica-morfologica",
    titulo: "US Obstétrica Morfológica (2º trimestre)",
    sinonimos: ["ultrassom morfológico"],
    modalidade: "Ultrassonografia",
    jejumHoras: null,
    preparo: [
      "Trazer exames anteriores.",
      "Trazer a carteirinha de gestação.",
      "Exame realizado de 20 a 24 semanas de gestação.",
    ],
    exameRelacionado: "ultrassonografia",
  },
  {
    slug: "us-obstetrica-3d-4d",
    titulo: "US Obstétrica 3D/4D",
    sinonimos: ["ultrassom 3d", "ultrassom 4d"],
    modalidade: "Ultrassonografia",
    jejumHoras: null,
    preparo: [
      "Trazer exames anteriores.",
      "Trazer a carteirinha de gestação.",
      "Exame realizado de 28 a 32 semanas de gestação.",
    ],
    exameRelacionado: "ultrassonografia",
  },
  {
    slug: "us-perfil-biofisico-fetal",
    titulo: "US Perfil Biofísico Fetal",
    sinonimos: ["perfil biofísico"],
    modalidade: "Ultrassonografia",
    jejumHoras: null,
    preparo: [
      "Tomar uma lata de refrigerante (Guaraná) 30 minutos antes do exame.",
      "Trazer exames anteriores.",
      "Trazer a carteirinha de gestação.",
    ],
    exameRelacionado: "ultrassonografia",
  },
  {
    slug: "us-doppler-carotidas-vertebrais-membros",
    titulo: "Doppler de Carótidas, Vertebrais ou Membros",
    sinonimos: ["eco doppler de carótidas", "doppler venoso de membro", "doppler arterial de membro"],
    modalidade: "Ultrassonografia",
    jejumHoras: null,
    preparo: ["Sem preparo especial — comparecer no horário marcado."],
    exameRelacionado: "ultrassonografia",
  },
  {
    slug: "ecocardiograma",
    titulo: "Ecocardiograma / Ecodopplercardiograma",
    sinonimos: ["eco do coração", "ecocardiograma transtorácico"],
    modalidade: "Ultrassonografia",
    jejumHoras: null,
    preparo: ["Sem preparo especial — comparecer no horário marcado."],
    exameRelacionado: "exames-cardiologicos",
  },
  {
    slug: "us-partes-moles-orgaos-superficiais",
    titulo: "US de Órgãos Superficiais (tireoide, glândulas, partes moles)",
    sinonimos: ["ecografia da tireoide", "eco das glândulas salivares", "eco de partes moles"],
    modalidade: "Ultrassonografia",
    jejumHoras: null,
    preparo: [
      "Sem preparo especial.",
      "Para exame de tireoide: é essencial trazer o exame anterior para comparação.",
    ],
    exameRelacionado: "ultrassonografia",
  },
  {
    slug: "puncao-ou-biopsia-guiada-por-us",
    titulo: "Punção ou Biópsia guiada por Ultrassom (PAAF, Core Biopsy)",
    sinonimos: ["paaf", "core biopsy", "punção de nódulo", "biópsia de tireoide", "biópsia de mama"],
    modalidade: "Procedimento",
    jejumHoras: 4,
    preparo: [
      "Chegar 30 minutos antes do horário marcado.",
      "Fazer 4 horas de jejum.",
      "Fazer uma dieta leve.",
      "Suspender o uso de Aspirina 24 horas antes do exame.",
    ],
    exameRelacionado: "ultrassonografia",
  },

  // ───────────────────────── Mamografia ──────────────────────────────
  {
    slug: "mamografia-digital",
    titulo: "Mamografia Digital",
    sinonimos: ["mamografia", "mamografia de rastreamento"],
    modalidade: "Mamografia",
    jejumHoras: null,
    preparo: [
      "No dia do exame, não usar creme corporal, talco nas mamas nem desodorante nas axilas.",
      "Se já tiver feito este exame antes, é essencial trazer o anterior para comparação.",
      "Retirar todos os metais da região a ser examinada.",
    ],
    exameRelacionado: "mamografia",
  },

  // ───────────────────────── Densitometria Óssea ─────────────────────
  {
    slug: "densitometria-ossea-coluna-femur-corpo-inteiro",
    titulo: "Densitometria Óssea (coluna, fêmur ou corpo inteiro)",
    sinonimos: ["densitometria", "exame de osteoporose"],
    modalidade: "Densitometria Óssea",
    jejumHoras: null,
    preparo: [
      "Suspender qualquer medicamento que contenha cálcio no dia anterior ao exame; retomar o uso depois.",
      "Retirar todos os metais da região a ser examinada.",
    ],
    restricoes: [
      "Não ter feito exame com contraste oral ou endovenoso na semana anterior à densitometria.",
      "Capacidade máxima do aparelho: 140kg.",
    ],
    exameRelacionado: "densitometria-ossea",
  },

  // ───────────────────────── Procedimentos invasivos ─────────────────
  {
    slug: "biopsia-de-prostata",
    titulo: "Biópsia de Próstata (transretal, transperineal ou por fusão)",
    sinonimos: ["biópsia prostática"],
    modalidade: "Procedimento",
    jejumHoras: 8,
    preparo: [
      "Retirar na clínica a receita do medicamento Monuril 3g.",
      "Fazer 8 horas de jejum.",
      "Dissolver o conteúdo de 1 sachê em 200ml de água e tomar 3 horas antes do horário marcado; tomar o segundo sachê 24 horas depois do exame.",
      "Trazer o exame de PSA mais recente.",
    ],
    restricoes: [
      "Quem toma medicação para hipertensão ou doenças do coração não deve interromper o uso — em caso de dúvida, entrar em contato com a clínica.",
      "A suspensão de Aspirina, anticoagulante ou AAS antes do exame só deve ser feita conforme orientação médica.",
      "É obrigatório vir acompanhado de um responsável legal, que deve permanecer no local até o final do procedimento.",
      "É preciso assinar o Termo de Consentimento Livre e Esclarecido para Procedimentos Invasivos no ato do agendamento.",
    ],
    exameRelacionado: null,
  },
  {
    slug: "biopsia-de-rim-ou-figado",
    titulo: "Biópsia de Rim ou Fígado",
    sinonimos: ["biópsia hepática", "biópsia renal"],
    modalidade: "Procedimento",
    jejumHoras: 4,
    preparo: [
      "Chegar 30 minutos antes do horário marcado.",
      "Fazer 4 horas de jejum.",
      "Fazer uma dieta leve.",
      "Apresentar exames recentes de coagulação: TP, KTTP e hemograma completo com plaquetas.",
    ],
    restricoes: ["Informar à clínica a lista de medicações em uso, para avaliação médica antes do procedimento."],
    exameRelacionado: null,
  },
  {
    slug: "histerossalpingografia",
    titulo: "Histerossalpingografia",
    sinonimos: ["hsg"],
    modalidade: "Procedimento",
    jejumHoras: 4,
    preparo: [
      "Fazer 4 horas de jejum.",
      "Fazer uma dieta mais leve no dia anterior e beber bastante água.",
      "24 horas antes do exame, tomar 2 comprimidos de Dulcolax (laxante) e 2 de Luftal.",
      "Fazer a higiene íntima antes de vir para o exame.",
      "Chegar 30 minutos antes do horário marcado.",
    ],
    restricoes: [
      "Este exame deve ser agendado do 5º ao 12º dia após o início da menstruação — se menstruar de novo antes de vir, é preciso reagendar.",
      "Não manter relação sexual na véspera do exame.",
      "Não é possível realizar o exame havendo sangramento ou infecção/inflamação ginecológica.",
      "Evitar piercings no umbigo e na região genital.",
      "É preciso trazer um acompanhante e assinar o Termo de Consentimento Livre e Esclarecido para Procedimentos Invasivos.",
    ],
    exameRelacionado: null,
  },
];

/** Normaliza texto para busca: minúsculas e sem acento. */
function normalizar(texto: string): string {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .trim();
}

/**
 * Busca por procedimento específico. Ao contrário de `buscarExames` (que
 * pontua por categoria ampla), aqui cada termo do pedido médico é comparado
 * contra o título e os sinônimos — é o texto mais próximo do que está
 * impresso no papel do paciente.
 */
export function buscarPreparo(termo: string): PreparoExame[] {
  const alvo = normalizar(termo);
  if (!alvo) return PREPAROS;

  const palavras = alvo.split(/\s+/).filter((p) => p.length >= 2);

  return PREPAROS.map((item) => {
    const textoItem = normalizar([item.titulo, item.modalidade, ...item.sinonimos].join(" "));
    const pontos = palavras.reduce(
      (total, palavra) => (textoItem.includes(palavra) ? total + 1 : total),
      0,
    );
    return { item, pontos };
  })
    .filter((r) => r.pontos > 0)
    .sort((a, b) => b.pontos - a.pontos)
    .map((r) => r.item);
}
