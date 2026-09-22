import type { Metadata } from "next";
import Link from "next/link";
import { Revelar } from "@/components/Revelar";
import { ITENS_TRANSPARENCIA } from "@/content/transparencia";

import "@/styles/home.css";
import "@/styles/transparencia.css";

export const metadata: Metadata = {
  title: "Transparência",
  description:
    "Publicações institucionais da Raio Som, incluindo o Relatório de Transparência e Igualdade Salarial exigido pela Lei 14.611/2023.",
};

export default function PaginaTransparencia() {
  return (
    <>
      <div className="pagina-topo">
        <div className="container">
          <ol className="trilha">
            <li>
              <Link href="/">Início</Link>
            </li>
            <li>Transparência</li>
          </ol>
          <h1>Transparência</h1>
          <p className="pagina-topo__texto">
            Informações institucionais que a Raio Som publica abertamente, por exigência legal ou
            por compromisso próprio.
          </p>
        </div>
      </div>

      <section className="secao">
        <div className="container">
          <div className="lista-transparencia">
            {ITENS_TRANSPARENCIA.map((item, indice) => (
              <Revelar key={item.slug} delay={indice * 60}>
                <Link
                  className="card card--interativo card-exame"
                  href={item.href}
                  style={{ height: "100%" }}
                >
                  <h2 className="card-exame__titulo">{item.titulo}</h2>
                  <p className="card__texto" style={{ marginTop: "var(--e-2)" }}>
                    {item.resumo}
                  </p>
                  <span className="card-exame__acao">Ver publicação →</span>
                </Link>
              </Revelar>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
