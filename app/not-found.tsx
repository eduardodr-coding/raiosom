import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";
import { Button } from "@/components/ui/Button";
import { CLINICA } from "@/content/clinica";

/**
 * 404 do site. Traz o cabeçalho e o rodapé explicitamente porque o
 * `not-found` da raiz roda fora do grupo `(site)`, onde eles moram.
 */
export default function NaoEncontrado() {
  return (
    <>
      <Header />
      <main id="conteudo" className="secao">
        <div className="container" style={{ textAlign: "center", maxWidth: 620 }}>
          <p className="kicker">Erro 404</p>
          <h1>Esta página não existe</h1>
          <p className="subtitulo" style={{ marginInline: "auto" }}>
            O endereço pode ter mudado com o novo site. Busque o exame de que você precisa ou fale com
            a central.
          </p>
          <div
            style={{
              display: "flex",
              gap: "var(--e-3)",
              justifyContent: "center",
              marginTop: "var(--e-8)",
              flexWrap: "wrap",
            }}
          >
            <Button href="/exames">Ver exames</Button>
            <Button href={CLINICA.whatsapp.link} external variant="whatsapp">
              Falar no WhatsApp
            </Button>
            <Button href="/" variant="contorno">
              Ir para a página inicial
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
