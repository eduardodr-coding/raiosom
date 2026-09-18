import type { MetadataRoute } from "next";

/**
 * O formulário de agendamento, a confirmação, o painel e a API ficam fora dos
 * buscadores: são páginas com dado de paciente ou sem valor de busca.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/agendar/", "/painel", "/painel/", "/api/"],
    },
    sitemap: "https://www.raiosom.com.br/sitemap.xml",
  };
}
