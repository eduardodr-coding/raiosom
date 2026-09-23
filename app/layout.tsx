import type { Metadata, Viewport } from "next";
import { Lato, Poppins } from "next/font/google";
import { ToastProvider } from "@/components/ui/Toast";
import { CLINICA } from "@/content/clinica";

import "@/styles/tokens.css";
import "@/styles/base.css";
import "@/styles/layout.css";
import "@/styles/componentes.css";

/** Títulos, rótulos e botões. */
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--fonte-poppins",
  display: "swap",
});

/** Texto corrido: parágrafos, descrições, horários, endereços. */
const lato = Lato({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--fonte-lato",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.raiosom.com.br"),
  title: {
    default: "Raio Som · Diagnóstico por Imagem em Gravataí e Cachoeirinha",
    template: "%s · Raio Som Diagnóstico por Imagem",
  },
  description:
    "Ressonância, tomografia, ultrassom, mamografia, raios X e mais. Confira o convênio e agende enviando a foto do pedido médico.",
  applicationName: CLINICA.nomeCompleto,
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: CLINICA.nomeCompleto,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#16255A",
};

/**
 * Layout raiz: fontes, tokens e o que vale para o site inteiro.
 *
 * Header e rodapé NÃO ficam aqui. Eles vivem em `app/(site)/layout.tsx`,
 * porque o fluxo de agendamento (`app/(fluxo)`) usa um cabeçalho enxuto, sem
 * menu — é uma tela de checkout, e cada link de navegação ali é uma chance a
 * mais de o paciente abandonar a solicitação no meio.
 */
/*
 * suppressHydrationWarning no <html>: extensões de navegador (BRy/Syngular de
 * certificado digital, tradutores, gerenciadores de senha) injetam atributos
 * na tag antes do React hidratar, o que gera um erro de hidratação falso. A
 * supressão vale só para os atributos deste elemento — o conteúdo da página
 * continua sendo verificado normalmente.
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="pt-BR"
      className={`${poppins.variable} ${lato.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Sem JavaScript o IntersectionObserver nunca roda e as seções com
            `.revelar` ficariam invisíveis. Conteúdo de saúde não pode sumir
            por causa de um efeito visual. */}
        <noscript>
          <style>{".revelar{opacity:1;transform:none}"}</style>
        </noscript>
      </head>
      <body>
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
