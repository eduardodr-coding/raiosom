import type { UnidadeSlug } from "./clinica";

/**
 * Catálogo de exames.
 *
 * O conteúdo vem do site antigo da clínica e do material aprovado, nada aqui
 * é redação livre. É tipado de propósito: no dia em que a clínica quiser
 * editar sem deploy, este arquivo vira uma tabela do banco e as páginas
 * continuam iguais, porque só consomem `Exame`.
 *
 * Os textos explicam o exame; não orientam o preparo. Jejum, dieta, remédio e
 * antialérgico saíram do site de propósito e ficam com a central, pelo
 * WhatsApp, onde a orientação é atual e específica de cada pedido.
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
  /** Prazo do laudo. Onde retirar e o portal a página do exame completa. */
  laudo?: string;
  horarioAtendimento?: string;
  imagem: string | null;
  /**
   * Texto alternativo da foto. Sem ele vale "Equipamento de <exame> da Raio
   * Som", que só serve quando a foto mostra o aparelho.
   */
  imagemAlt?: string;
  unidades: UnidadeSlug[];
  agendamento: TipoAgendamento;
  /** Sinônimos e termos do pedido médico, usados pela busca. */
  termosBusca: string[];
};

// Unidades: a matriz de Gravataí realiza todas as modalidades. Cachoeirinha
// faz ressonância, tomografia, ultrassom, mamografia e densitometria (não faz
// raios X, odontológico nem cardiológico). A Millenarium faz ultrassom.
const TODAS_GRAVATAI: UnidadeSlug[] = ["gravatai"];

export const EXAMES: Exame[] = [
  {
    slug: "ressonancia-magnetica",
    nome: "Ressonância Magnética",
    sigla: "RM",
    resumo: "Alta definição para articulações, coluna, crânio e abdome.",
    descricao:
      "Exame de alta definição feito com campo magnético e ondas de radiofrequência, sem radiação. É indolor e realizado com agendamento prévio.",
    comoEFeito:
      "Diferente das radiografias e da tomografia, a ressonância magnética não usa raios X: as imagens são formadas por um campo magnético e por ondas de radiofrequência. Isso permite ao especialista examinar diferentes partes do corpo com alta definição. Por causa do campo magnético, antes do exame você responde a um questionário de segurança, e nossa equipe passa por treinamentos periódicos de segurança em ressonância. O exame não causa dor nem efeitos prejudiciais à saúde, e ficar tranquilo durante o exame ajuda a obter imagens mais nítidas.",
    contraste:
      "O contraste é uma substância que realça tecidos, órgãos e vasos sanguíneos nas imagens. Alguns exames de ressonância exigem injeção de contraste. Quando for o seu caso, nossa equipe passa todas as orientações pelo WhatsApp.",
    chegarAntesMin: 30,
    laudo: "O laudo fica pronto em 3 dias úteis.",
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
      "Exame de imagem não invasivo e indolor, que avalia órgãos e estruturas em cortes finos. Realizado nas duas unidades, com agendamento prévio.",
    comoEFeito:
      "A tomografia computadorizada usa raios X em dose controlada para gerar imagens do corpo em cortes, como fatias, e identificar alterações em órgãos e estruturas de qualquer região, inclusive coração, pulmões e abdome. Trabalhamos sempre com a menor exposição possível à radiação. Assim como os raios X convencionais, o exame não é recomendado para gestantes, a menos que seja indispensável e autorizado pelo médico que o solicitou.",
    contraste:
      "O contraste é uma substância que realça tecidos, órgãos e vasos sanguíneos nas imagens. A tomografia com contraste pode ser realizada pela maioria dos pacientes. Gestantes, asmáticos e pessoas com alergias precisam de avaliação médica e, quando necessário, preparo antialérgico antes do exame.",
    chegarAntesMin: 15,
    laudo: "O laudo fica pronto em 3 dias úteis.",
    imagem: "/exames/tomo.jpg",
    unidades: ["gravatai", "cachoeirinha"],
    agendamento: "solicitacao",
    termosBusca: ["tc", "tomo", "tomografia", "computadorizada", "cortes"],
  },
  {
    slug: "ultrassonografia",
    nome: "Ultrassonografia",
    sigla: "US",
    resumo: "Geral, obstétrica, 3D/4D e com Doppler colorido.",
    descricao:
      "Exame por ultrassom, sem radiação e indolor, que avalia órgãos internos, músculos, articulações e o desenvolvimento do bebê na gestação.",
    comoEFeito:
      "A ultrassonografia, também chamada de ecografia, usa uma sonda que emite ondas sonoras de alta frequência. Elas refletem nos tecidos e voltam para a mesma sonda, formando as imagens em tempo real, como um radar. Um gel é aplicado sobre a pele para melhorar o contato, e o especialista desliza a sonda sobre a região examinada. É um exame simples, acessível e preciso.",
    modalidades: [
      "Abdome superior e abdome total",
      "Aparelho urinário, rins e bexiga",
      "Articulações, músculos e tendões",
      "Bolsa escrotal",
      "Pescoço, tireoide e glândulas salivares",
      "Mamas",
      "Obstétrica: morfológica, translucência nucal e perfil biofísico fetal",
      "Obstétrica 3D/4D",
      "Parede abdominal e região inguinal",
      "Pélvica e transvaginal",
      "Transfontanela (recém-nascidos até 6 meses)",
      "Próstata por via transretal",
      "Doppler colorido",
    ],
    contraste: null,
    chegarAntesMin: 15,
    laudo: "O laudo fica pronto em 2 dias úteis.",
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
      "Exame de raios X específico das mamas e a melhor oportunidade de detectar alterações precocemente. Digital, com mais qualidade de imagem e menos radiação.",
    comoEFeito:
      "O exame padrão tem quatro incidências, com posicionamentos que permitem ver melhor o tecido mamário. Durante a captura, uma placa comprime a mama por alguns segundos para facilitar a visualização de pequenas estruturas. A mamografia digital usa detectores especiais no lugar do filme, o que garante imagens de maior qualidade com menor dose de radiação, e permite ao especialista ajustar brilho, contraste e ampliação para um diagnóstico mais preciso.",
    contraste: null,
    chegarAntesMin: 15,
    laudo: "O laudo fica pronto em 3 dias úteis.",
    imagem: "/exames/mamo.jpg",
    unidades: [...TODAS_GRAVATAI, "cachoeirinha"],
    agendamento: "solicitacao",
    termosBusca: ["mg", "mamo", "mamografia", "mama", "rastreamento"],
  },
  {
    slug: "raios-x-digital",
    nome: "Radiografia Digitais",
    sigla: "RX",
    resumo: "Baixa dose de radiação e resultado rápido.",
    descricao:
      "Exame de imagem rápido, com baixa dose de radiação, realizado com agendamento prévio.",
    comoEFeito:
      "O raio X digital usa detectores especiais no lugar dos filmes convencionais, o que proporciona imagens de melhor qualidade com menor dose de radiação. O sistema digital permite ao especialista ajustar ampliação, brilho e contraste das imagens, contribuindo para um diagnóstico mais preciso.",
    contraste: null,
    chegarAntesMin: 15,
    laudo: "O laudo fica pronto em 2 dias úteis.",
    imagem: "/exames/rxd.jpg",
    unidades: TODAS_GRAVATAI,
    agendamento: "solicitacao",
    termosBusca: ["rx", "raio x", "raios x", "radiografia", "torax", "digital"],
  },
  {
    slug: "densitometria-ossea",
    nome: "Densitometria Óssea",
    sigla: "DO",
    resumo: "Avaliação da densidade dos ossos e da osteoporose.",
    descricao:
      "Exame que mede a densidade dos ossos para diagnosticar e acompanhar a osteopenia e a osteoporose. Indolor e realizado com agendamento prévio.",
    comoEFeito:
      "A densitometria óssea avalia a quantidade de minerais nos ossos e compara o resultado com um amplo banco de dados de referência por idade, sexo e etnia. Assim é possível identificar a osteopenia, quando os ossos perdem minerais e ficam mais frágeis, e a osteoporose, sua forma mais grave, que aumenta o risco de fraturas. Feito periodicamente, o exame também permite acompanhar a evolução da perda óssea ao longo do tempo.",
    restricoes: [
      "Não pode ter realizado exame com contraste (oral ou endovenoso) na semana anterior.",
      "Capacidade máxima do equipamento: 140 kg.",
    ],
    contraste: null,
    chegarAntesMin: 15,
    laudo: "O laudo fica pronto em 3 dias úteis.",
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
    nome: "Radiologia Odontológica",
    sigla: "RO",
    resumo: "Panorâmica, periapical, Cone Beam e documentação.",
    descricao:
      "Radiografias digitais intra e extrabucais, tomografia Cone Beam e documentação ortodôntica, com imagens de alta precisão para o seu dentista.",
    comoEFeito:
      "A aquisição das imagens é totalmente digital, o que traz rapidez para o paciente e confiança para o dentista. Os equipamentos avaliam o complexo dento-maxilo-facial e atendem às diversas especialidades odontológicas, como periodontia, endodontia, cirurgia, prótese, dentística e estomatologia, além das urgências.",
    modalidades: [
      "Radiografias intrabucais",
      "Radiografias extrabucais e panorâmica",
      "Articulação temporomandibular (ATM)",
      "Tomografia computadorizada Cone Beam",
      "Tomografia Cone Beam das ATMs",
      "Documentação ortodôntica",
    ],
    contraste: null,
    chegarAntesMin: null,
    laudo:
      "A documentação ortodôntica fica pronta em 5 dias úteis; os demais exames, em 2 dias úteis.",
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
    descricao: "Exame do coração, não invasivo e indolor, realizado com agendamento prévio.",
    comoEFeito:
      "O ecocardiograma é uma ultrassonografia do coração: com uma sonda apoiada sobre o tórax, o especialista avalia em tempo real as câmaras cardíacas, as válvulas e o fluxo de sangue.",
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
    // As regiões abaixo são as que a clínica confirmou para o site, um
    // subconjunto das regiões da modalidade BIOPSIA no catálogo do sistema.
    resumo: "Punção e coleta guiadas por ultrassom.",
    descricao:
      "Coleta de material para análise laboratorial, guiada por ultrassom e realizada com agendamento prévio.",
    comoEFeito:
      "A coleta é guiada por ultrassom (ecografia), conforme o pedido médico, para que a agulha alcance exatamente a região a ser investigada. O material coletado segue para análise laboratorial.",
    modalidades: ["Mamas", "Próstata", "Tireoide"],
    contraste: null,
    chegarAntesMin: 15,
    // Tela do equipamento durante uma biópsia de próstata, recortada para
    // tirar data, número do exame e nomes que apareciam na foto original.
    imagem: "/exames/biopsia.jpg",
    imagemAlt:
      "Tela do equipamento durante uma biópsia de próstata, com a região a ser coletada marcada na ressonância e no ultrassom",
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
