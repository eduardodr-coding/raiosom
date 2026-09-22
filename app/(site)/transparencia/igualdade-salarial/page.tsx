import type { Metadata } from "next";
import Link from "next/link";
import { Revelar } from "@/components/Revelar";
import { Button } from "@/components/ui/Button";
import { CLINICA } from "@/content/clinica";
import { IGUALDADE_SALARIAL as R } from "@/content/transparencia";

import "@/styles/exames.css";
import "@/styles/transparencia.css";

export const metadata: Metadata = {
  title: "Relatório de Igualdade Salarial",
  description: `Relatório de Transparência e Igualdade Salarial de Mulheres e Homens do ${CLINICA.nomeCompleto}, ${R.periodo}, publicado conforme a Lei 14.611/2023.`,
};

/**
 * A página mostra o relatório oficial do MTE como documento, sem repetir os
 * números em HTML ao lado: o PDF já traz todos eles, e manter as duas versões
 * abria espaço para divergirem na próxima atualização.
 */
export default function PaginaIgualdadeSalarial() {
  return (
    <>
      <div className="pagina-topo">
        <div className="container">
          <ol className="trilha">
            <li>
              <Link href="/">Início</Link>
            </li>
            <li>
              <Link href="/transparencia">Transparência</Link>
            </li>
            <li>Igualdade salarial</li>
          </ol>
          <h1>{R.titulo}</h1>
          <p className="pagina-topo__texto">
            {R.periodo}. Publicação exigida pela Lei 14.611/2023, com dados apurados pelo
            Ministério do Trabalho e Emprego.
          </p>
        </div>
      </div>

      <section className="secao">
        <div className="container">
          <div className="pdf-visualizador">
            <iframe
              src={`${R.pdf}#toolbar=0&navpanes=0&view=FitH`}
              title={`${R.titulo}, ${R.periodo} (documento oficial)`}
            />
          </div>

          <Revelar style={{ marginTop: "var(--e-8)" }}>
            <Button href="/transparencia" variant="contorno">
              Ver todas as publicações
            </Button>
          </Revelar>
        </div>
      </section>
    </>
  );
}
