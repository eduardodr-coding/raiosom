import type { MetadataRoute } from "next";
import { EXAMES } from "@/content/exames";

const BASE = "https://www.raiosom.com.br";

/** Páginas públicas. O fluxo de agendamento e o painel ficam de fora. */
export default function sitemap(): MetadataRoute.Sitemap {
  const fixas = [
    "",
    "/exames",
    "/convenios",
    "/unidades",
    "/sobre",
    "/trabalhe-conosco",
    "/transparencia",
    "/transparencia/igualdade-salarial",
    "/politica-de-privacidade",
  ];

  return [
    ...fixas.map((caminho) => ({
      url: `${BASE}${caminho}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: caminho === "" ? 1 : 0.8,
    })),
    ...EXAMES.map((exame) => ({
      url: `${BASE}/exames/${exame.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.9,
    })),
  ];
}
