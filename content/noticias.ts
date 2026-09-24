/**
 * Notícias da Raio Som.
 *
 * Para publicar, acrescente um item no começo de `NOTICIAS` e faça o deploy:
 * a lista, a página da notícia, o sitemap e o menu leem daqui. O `slug` vira
 * o endereço (/noticias/<slug>) e não deve mudar depois de publicado, senão
 * quem compartilhou o link cai numa página que não existe.
 *
 * Cada parágrafo é um item de `paragrafos`. Sem HTML: o texto é exibido como
 * está, o que evita que uma notícia quebre o layout ou injete código.
 */

export type Noticia = {
  slug: string;
  titulo: string;
  /** Data de publicação, no formato AAAA-MM-DD. */
  data: string;
  /** Uma ou duas frases, para o card da lista e para o Google. */
  resumo: string;
  paragrafos: string[];
  /** Foto em /public (ex.: "/noticias/nova-unidade.jpg"), ou null. */
  imagem: string | null;
};

export const NOTICIAS: Noticia[] = [
  {
    // Exemplo inicial: descreve o que o site novo já faz. Ajuste a data para
    // o dia do lançamento, edite ou remova quando publicarem as próximas.
    slug: "novo-site-raio-som",
    titulo: "Conheça o novo site da Raio Som",
    data: "2026-09-24",
    resumo:
      "Agora você encontra o seu exame pelo nome que está no pedido médico e faz o pré-agendamento pelo site, em poucos minutos.",
    paragrafos: [
      "A Raio Som está de site novo, pensado para facilitar o caminho de quem precisa fazer um exame de imagem.",
      "Na busca, basta digitar o nome que está no pedido médico, como “ressonância de joelho” ou “ecografia de abdome total”, para saber se realizamos o exame e em qual unidade.",
      "O pré-agendamento também pode ser feito pelo site: você informa seus dados, anexa a foto do pedido médico, se quiser, e a nossa central entra em contato para confirmar o horário.",
      "Cada exame tem uma página com as orientações para o dia, e os laudos continuam disponíveis no portal de resultados e no aplicativo da Raio Som.",
    ],
    imagem: null,
  },
];

/** Mais recentes primeiro, independentemente da ordem em que foram escritas. */
export function noticiasOrdenadas(): Noticia[] {
  return [...NOTICIAS].sort((a, b) => b.data.localeCompare(a.data));
}

export function noticiaPorSlug(slug: string): Noticia | undefined {
  return NOTICIAS.find((noticia) => noticia.slug === slug);
}

/** "24 de setembro de 2026". A data vem sem horário, então é lida em UTC. */
export function dataPorExtenso(data: string): string {
  return new Date(`${data}T12:00:00Z`).toLocaleDateString("pt-BR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}
