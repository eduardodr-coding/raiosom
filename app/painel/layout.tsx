import type { Metadata } from "next";

import "@/styles/painel.css";

export const metadata: Metadata = {
  title: "Painel da central",
  // Área interna com dado de paciente: fora de qualquer índice de busca.
  robots: { index: false, follow: false, nocache: true },
};

export default function PainelLayout({ children }: { children: React.ReactNode }) {
  return <main id="conteudo">{children}</main>;
}
