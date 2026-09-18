import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";

/** Casca das páginas públicas: topbar, cabeçalho com menu e rodapé. */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a className="pular-conteudo" href="#conteudo">
        Pular para o conteúdo
      </a>
      <Header />
      <main id="conteudo">{children}</main>
      <Footer />
    </>
  );
}
