import type { Metadata } from "next";
import Link from "next/link";
import { Revelar } from "@/components/Revelar";
import { Aviso } from "@/components/ui/Aviso";
import { Button } from "@/components/ui/Button";
import { CLINICA } from "@/content/clinica";
import { IGUALDADE_SALARIAL as R } from "@/content/transparencia";

import "@/styles/exames.css";
import "@/styles/transparencia.css";

export const metadata: Metadata = {
  title: "Relatório de Igualdade Salarial",
  description: `Relatório de Transparência e Igualdade Salarial de Mulheres e Homens do ${CLINICA.nomeCompleto} — ${R.periodo}, publicado conforme a Lei 14.611/2023.`,
};

/** Vírgula decimal, como no relatório oficial. */
function pct(valor: number): string {
  return `${valor.toFixed(1).replace(".", ",")}%`;
}

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
            {R.periodo} · CNPJ {R.cnpj} · {R.trabalhadoresAtivos} trabalhadores ativos em{" "}
            {R.dataBase}. Publicação exigida pela Lei 14.611/2023, com dados apurados pelo
            Ministério do Trabalho e Emprego.
          </p>
          <div style={{ marginTop: "var(--e-6)" }}>
            <Button href={R.pdf} external variant="contorno">
              Baixar o relatório oficial (PDF)
            </Button>
          </div>
        </div>
      </div>

      {/* ── Os dois indicadores principais ───────────────────────────────── */}
      <section className="secao">
        <div className="container">
          <Revelar>
            <span className="kicker">Diferença salarial</span>
            <h2>Quanto a remuneração das mulheres equivale à dos homens</h2>
            <p className="subtitulo">
              A razão M/H compara mulheres e homens no mesmo indicador. 100% significa
              equivalência entre os dois grupos.
            </p>
          </Revelar>

          <div className="razoes" style={{ marginTop: "var(--e-8)" }}>
            <Revelar className="razao-card">
              <span className="razao-card__valor">{pct(R.salarioContratualMediano)}</span>
              <h3 className="razao-card__titulo">Salário contratual mediano</h3>
              <p className="razao-card__texto">
                O salário contratual mediano das mulheres equivale a{" "}
                {pct(R.salarioContratualMediano)} do recebido pelos homens.
              </p>
            </Revelar>

            <Revelar className="razao-card">
              <span className="razao-card__valor">{pct(R.remuneracaoMensalMedia)}</span>
              <h3 className="razao-card__titulo">Remuneração mensal média</h3>
              <p className="razao-card__texto">
                A remuneração média mensal das mulheres equivale a{" "}
                {pct(R.remuneracaoMensalMedia)} da recebida pelos homens.
              </p>
            </Revelar>
          </div>
        </div>
      </section>

      {/* ── Quadro de pessoal ────────────────────────────────────────────── */}
      <section className="secao secao--alt">
        <div className="container">
          <Revelar>
            <span className="kicker">Quadro de pessoal</span>
            <h2>Composição do total de empregados</h2>
          </Revelar>

          <div className="composicoes" style={{ marginTop: "var(--e-8)" }}>
            <Revelar>
              <h3 className="composicao__titulo">Por sexo</h3>
              <ul className="barras">
                {R.composicaoPorSexo.map((item) => (
                  <li className="barra" key={item.rotulo}>
                    <span className="barra__rotulo">{item.rotulo}</span>
                    <span className="barra__trilho">
                      <span
                        className="barra__preenchimento"
                        style={{ width: `${item.percentual}%` }}
                      />
                    </span>
                    <span className="barra__valor">{pct(item.percentual)}</span>
                  </li>
                ))}
              </ul>
            </Revelar>

            <Revelar>
              <h3 className="composicao__titulo">Por sexo e raça/cor</h3>
              <ul className="barras">
                {R.composicaoPorSexoERaca.map((item) => (
                  <li className="barra" key={item.rotulo}>
                    <span className="barra__rotulo">{item.rotulo}</span>
                    <span className="barra__trilho">
                      <span
                        className="barra__preenchimento"
                        style={{ width: `${item.percentual}%` }}
                      />
                    </span>
                    <span className="barra__valor">{pct(item.percentual)}</span>
                  </li>
                ))}
              </ul>
            </Revelar>
          </div>
        </div>
      </section>

      {/* ── Por grupo ocupacional ────────────────────────────────────────── */}
      <section className="secao">
        <div className="container">
          <Revelar>
            <span className="kicker">Por grupo ocupacional</span>
            <h2>Diferença salarial em cada grande grupo</h2>
            <p className="subtitulo">
              Os valores mostram quanto a remuneração das mulheres vale em relação à dos homens.
              Situações positivas são iguais ou maiores que 100%.
            </p>
          </Revelar>

          <Revelar style={{ marginTop: "var(--e-8)", overflowX: "auto" }}>
            <table className="tabela">
              <caption className="sr-only">
                Razão entre a remuneração de mulheres e homens por grande grupo ocupacional
              </caption>
              <thead>
                <tr>
                  <th scope="col">Grupo ocupacional</th>
                  <th scope="col">Remuneração mensal média</th>
                  <th scope="col">Salário contratual mediano</th>
                </tr>
              </thead>
              <tbody>
                {R.porGrupoOcupacional.map((item) => (
                  <tr key={item.grupo}>
                    <th scope="row" style={{ fontWeight: "var(--peso-medio)" }}>
                      {item.grupo}
                    </th>
                    <td>
                      {item.remuneracaoMedia === null ? (
                        <span className="tabela__vazio">Não calculado</span>
                      ) : (
                        pct(item.remuneracaoMedia)
                      )}
                    </td>
                    <td>
                      {item.salarioMediano === null ? (
                        <span className="tabela__vazio">Não calculado</span>
                      ) : (
                        pct(item.salarioMediano)
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Revelar>

          <Revelar style={{ marginTop: "var(--e-6)", maxWidth: 760 }}>
            <Aviso tipo="info" titulo="Por que alguns grupos aparecem sem cálculo">
              O relatório oficial omite o percentual quando o grupo é pequeno demais para
              comparar sem permitir identificar pessoas. Isso acontece por um destes motivos:
              <ul style={{ marginTop: "var(--e-3)", paddingLeft: "var(--e-5)" }}>
                {R.motivosSemCalculo.map((motivo) => (
                  <li key={motivo}>{motivo}</li>
                ))}
              </ul>
            </Aviso>
          </Revelar>
        </div>
      </section>

      {/* ── Critérios e diversidade ──────────────────────────────────────── */}
      <section className="secao secao--alt">
        <div className="container">
          <Revelar style={{ maxWidth: 760 }}>
            <span className="kicker">Critérios</span>
            <h2>Critérios de remuneração e ações para garantir diversidade</h2>
            <p className="subtitulo">{R.criteriosEDiversidade}</p>
          </Revelar>
        </div>
      </section>

      {/* ── Fonte ────────────────────────────────────────────────────────── */}
      <section className="secao">
        <div className="container">
          <Revelar style={{ maxWidth: 760 }}>
            <h2>Fonte dos dados</h2>
            <p className="bloco__texto" style={{ marginTop: "var(--e-4)" }}>
              {R.fonte}
            </p>
            <p className="bloco__texto" style={{ marginTop: "var(--e-3)" }}>
              {R.nota}
            </p>
            <div style={{ display: "flex", gap: "var(--e-3)", marginTop: "var(--e-6)", flexWrap: "wrap" }}>
              <Button href={R.pdf} external>
                Baixar o relatório oficial (PDF)
              </Button>
              <Button href="/transparencia" variant="contorno">
                Ver todas as publicações
              </Button>
            </div>
          </Revelar>
        </div>
      </section>
    </>
  );
}
