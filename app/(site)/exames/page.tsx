import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Revelar } from "@/components/Revelar";
import { Aviso } from "@/components/ui/Aviso";
import { Button } from "@/components/ui/Button";
import { CLINICA, UNIDADES, unidadePorSlug } from "@/content/clinica";
import { EXAMES, buscarExames } from "@/content/exames";

import "@/styles/exames.css";

export const metadata: Metadata = {
  title: "Exames",
  description:
    "Ressonância, tomografia, ultrassonografia, mamografia, raios X digital, densitometria óssea, radiografia odontológica e exames cardiológicos. Veja o preparo e agende.",
};

type Props = {
  searchParams: Promise<{ q?: string; unidade?: string }>;
};

export default async function PaginaExames({ searchParams }: Props) {
  const { q = "", unidade = "" } = await searchParams;

  const filtroUnidade = unidadePorSlug(unidade);
  const porTermo = q.trim() ? buscarExames(q) : EXAMES;
  const resultados = filtroUnidade
    ? porTermo.filter((exame) => exame.unidades.includes(filtroUnidade.slug))
    : porTermo;

  return (
    <>
      <div className="pagina-topo">
        <div className="container">
          <ol className="trilha">
            <li>
              <Link href="/">Início</Link>
            </li>
            <li>Exames</li>
          </ol>
          <h1>Nossos exames</h1>
          <p className="pagina-topo__texto">
            Digite o que está escrito no seu pedido médico. Cada exame tem a
            página com o preparo necessário, o que trazer e o botão para
            agendar.
          </p>

          <form
            className="busca-pagina"
            action="/exames"
            method="get"
            role="search"
          >
            <label className="sr-only" htmlFor="busca-exames">
              Buscar exame
            </label>
            <input
              className="busca__campo"
              id="busca-exames"
              name="q"
              type="search"
              defaultValue={q}
              placeholder="Ex.: ressonância de joelho, ecografia abdominal…"
              autoComplete="off"
            />
            {filtroUnidade && (
              <input type="hidden" name="unidade" value={filtroUnidade.slug} />
            )}
            <Button type="submit">Buscar</Button>
          </form>

          <div className="filtros">
            <span>Unidade:</span>
            <Link
              className={`chip${!filtroUnidade ? " chip--ativo" : ""}`}
              href={q ? `/exames?q=${encodeURIComponent(q)}` : "/exames"}
            >
              Todas
            </Link>
            {UNIDADES.map((item) => {
              const params = new URLSearchParams();
              if (q) params.set("q", q);
              params.set("unidade", item.slug);
              return (
                <Link
                  key={item.slug}
                  className={`chip${filtroUnidade?.slug === item.slug ? " chip--ativo" : ""}`}
                  href={`/exames?${params.toString()}`}
                >
                  {item.etiqueta}
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* O preparo detalhado por procedimento vive em /preparos, com a lista
          completa do sistema da clínica. Aqui só encaminhamos: manter dois
          lugares mostrando preparo abriria espaço para respostas divergentes. */}
      <section className="secao" style={{ paddingBottom: 0 }}>
        <div className="container">
          <Aviso tipo="info" titulo="Procurando o preparo do seu exame?">
            Se o seu pedido médico traz um nome mais específico (como “TC abdome
            total com contraste”), busque por ele na página de preparos, lá
            está a lista completa de procedimentos, com jejum, bexiga cheia e o
            que levar no dia.
            <div style={{ marginTop: "var(--e-4)" }}>
              <Button href="/preparos" size="pequeno">
                Ver preparo por exame
              </Button>
            </div>
          </Aviso>
        </div>
      </section>

      <section className="secao">
        <div className="container">
          <p
            style={{
              marginBottom: "var(--e-6)",
              color: "var(--texto-suave)",
            }}
            aria-live="polite"
          >
            {resultados.length === 0
              ? "Nenhum exame encontrado."
              : `${resultados.length} ${resultados.length === 1 ? "exame encontrado" : "exames encontrados"}`}
            {q && ` para “${q}”`}
            {filtroUnidade && ` em ${filtroUnidade.etiqueta}`}.
          </p>

          {resultados.length === 0 ? (
            <div className="busca-vazia">
              <h2 style={{ fontSize: "var(--txt-xl)" }}>
                Não achamos esse exame pelo nome
              </h2>
              <p
                style={{
                  marginTop: "var(--e-3)",
                  color: "var(--texto-suave)",
                }}
              >
                O nome no pedido médico às vezes é diferente do nome da
                modalidade. Fale com a central: alguém confere o seu pedido e
                diz na hora se realizamos.
              </p>
              <div
                style={{
                  display: "flex",
                  gap: "var(--e-3)",
                  justifyContent: "center",
                  marginTop: "var(--e-6)",
                  flexWrap: "wrap",
                }}
              >
                <Button
                  href={CLINICA.whatsapp.link}
                  external
                  variant="whatsapp"
                >
                  Perguntar no WhatsApp
                </Button>
                <Button href="/exames" variant="contorno">
                  Ver todos os exames
                </Button>
              </div>
            </div>
          ) : (
            <div className="lista-exames">
              {resultados.map((exame, indice) => (
                <Revelar key={exame.slug} delay={indice * 40}>
                  <Link
                    className="card card--interativo exame-card"
                    href={`/exames/${exame.slug}`}
                    style={{ height: "100%" }}
                  >
                    {exame.imagem ? (
                      <div className="exame-card__figura">
                        <Image
                          src={exame.imagem}
                          alt=""
                          width={800}
                          height={450}
                          sizes="(max-width: 620px) 100vw, (max-width: 1000px) 50vw, 33vw"
                        />
                      </div>
                    ) : (
                      <div
                        className="exame-card__figura exame-card__figura--sigla"
                        aria-hidden="true"
                      >
                        {exame.sigla}
                      </div>
                    )}

                    <div className="exame-card__corpo">
                      <h2 className="card__titulo">{exame.nome}</h2>
                      <p className="card__texto" style={{ flex: 1 }}>
                        {exame.resumo}
                      </p>

                      <div className="exame-card__etiquetas">
                        {exame.agendamento === "ordem-de-chegada" ? (
                          <span className="badge badge--alerta">
                            Ordem de chegada
                          </span>
                        ) : (
                          <span className="badge badge--neutro">
                            Com agendamento
                          </span>
                        )}
                        {exame.chegarAntesMin && (
                          <span className="badge badge--neutro">
                            Chegar {exame.chegarAntesMin} min antes
                          </span>
                        )}
                        {exame.contraste && (
                          <span className="badge badge--neutro">
                            Pode ter contraste
                          </span>
                        )}
                      </div>

                      <span className="card-exame__acao">
                        Ver preparo e agendar →
                      </span>
                    </div>
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
