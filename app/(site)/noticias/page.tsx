import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Revelar } from "@/components/Revelar";
import { Button } from "@/components/ui/Button";
import { CLINICA } from "@/content/clinica";
import { dataPorExtenso, noticiasOrdenadas } from "@/content/noticias";

import "@/styles/noticias.css";

export const metadata: Metadata = {
  title: "Notícias",
  description: "Novidades da Raio Som: unidades, exames, serviços e atendimento.",
};

export default function PaginaNoticias() {
  const noticias = noticiasOrdenadas();

  return (
    <>
      <div className="pagina-topo">
        <div className="container">
          <ol className="trilha">
            <li>
              <Link href="/">Início</Link>
            </li>
            <li>Notícias</li>
          </ol>
          <h1>Notícias</h1>
          <p className="pagina-topo__texto">
            Novidades da Raio Som sobre exames, unidades e atendimento.
          </p>
        </div>
      </div>

      <section className="secao">
        <div className="container">
          {noticias.length === 0 ? (
            // Sem notícia publicada, a aba não fica vazia: aponta para onde a
            // clínica já publica novidades.
            <div className="noticias-vazio">
              <p>Em breve, novidades da Raio Som por aqui.</p>
              <div className="noticias-vazio__acoes">
                <Button href={CLINICA.links.instagram} external variant="contorno">
                  Seguir no Instagram
                </Button>
                <Button href={CLINICA.links.facebook} external variant="contorno">
                  Seguir no Facebook
                </Button>
              </div>
            </div>
          ) : (
            <div className="lista-noticias">
              {noticias.map((noticia, indice) => (
                <Revelar key={noticia.slug} delay={indice * 60}>
                  <Link
                    className="card card--interativo card-exame noticia-card"
                    href={`/noticias/${noticia.slug}`}
                    style={{ height: "100%" }}
                  >
                    {noticia.imagem && (
                      <div className="noticia-card__figura">
                        <Image
                          src={noticia.imagem}
                          alt=""
                          width={800}
                          height={450}
                          sizes="(max-width: 700px) 100vw, 50vw"
                        />
                      </div>
                    )}
                    <time className="noticia-card__data" dateTime={noticia.data}>
                      {dataPorExtenso(noticia.data)}
                    </time>
                    <h2 className="card-exame__titulo">{noticia.titulo}</h2>
                    <p className="card__texto">{noticia.resumo}</p>
                    <span className="card-exame__acao">Ler notícia →</span>
                  </Link>
                </Revelar>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
