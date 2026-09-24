import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { NOTICIAS, dataPorExtenso, noticiaPorSlug } from "@/content/noticias";

import "@/styles/noticias.css";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return NOTICIAS.map((noticia) => ({ slug: noticia.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const noticia = noticiaPorSlug(slug);
  if (!noticia) return {};

  return { title: noticia.titulo, description: noticia.resumo };
}

export default async function PaginaNoticia({ params }: Props) {
  const { slug } = await params;
  const noticia = noticiaPorSlug(slug);
  if (!noticia) notFound();

  return (
    <>
      <div className="pagina-topo">
        <div className="container">
          <ol className="trilha">
            <li>
              <Link href="/">Início</Link>
            </li>
            <li>
              <Link href="/noticias">Notícias</Link>
            </li>
            <li>{noticia.titulo}</li>
          </ol>
          <time className="noticia-card__data" dateTime={noticia.data}>
            {dataPorExtenso(noticia.data)}
          </time>
          <h1>{noticia.titulo}</h1>
          <p className="pagina-topo__texto">{noticia.resumo}</p>
        </div>
      </div>

      <article className="secao">
        <div className="container noticia-corpo">
          {noticia.imagem && (
            <Image
              className="noticia-corpo__imagem"
              src={noticia.imagem}
              alt=""
              width={1200}
              height={675}
              sizes="(max-width: 800px) 100vw, 760px"
              priority
            />
          )}
          {noticia.paragrafos.map((paragrafo) => (
            <p key={paragrafo.slice(0, 32)}>{paragrafo}</p>
          ))}

          <div className="noticia-corpo__voltar">
            <Button href="/noticias" variant="contorno">
              ← Todas as notícias
            </Button>
          </div>
        </div>
      </article>
    </>
  );
}
