import type { Metadata } from "next";
import Link from "next/link";
import { BuscaPreparo } from "@/components/preparos/BuscaPreparo";
import { Revelar } from "@/components/Revelar";

import "@/styles/home.css";
import "@/styles/preparos.css";

export const metadata: Metadata = {
  title: "Preparo do exame",
  description:
    "Busque o seu exame pelo nome e veja o preparo exato: jejum, bexiga cheia, medicação e o que levar no dia.",
};

type Props = { searchParams: Promise<{ q?: string }> };

export default async function PaginaPreparos({ searchParams }: Props) {
  // Permite chegar aqui já com a busca preenchida (ex.: pelo campo da Home).
  const { q = "" } = await searchParams;

  return (
    <>
      <div className="pagina-topo">
        <div className="container">
          <ol className="trilha">
            <li>
              <Link href="/">Início</Link>
            </li>
            <li>Preparo do exame</li>
          </ol>
          <h1>Preparo do seu exame</h1>
          <p className="pagina-topo__texto">
            Digite o nome do exame como está no seu pedido médico e selecione na lista. O preparo
            muda de um exame para outro, por isso mostramos só o do exame que você escolher.
          </p>
        </div>
      </div>

      <section className="secao">
        <div className="container">
          <Revelar>
            <BuscaPreparo termoInicial={q} />
          </Revelar>
        </div>
      </section>
    </>
  );
}
