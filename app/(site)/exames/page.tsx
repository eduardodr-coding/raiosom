import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Revelar } from "@/components/Revelar";
import { Button } from "@/components/ui/Button";
import { CLINICA, UNIDADES, unidadePorSlug } from "@/content/clinica";
import { EXAMES } from "@/content/exames";
import { TOTAL_EXAMES, TOTAL_GRUPOS, buscarGrupos } from "@/lib/catalogo";

import "@/styles/exames.css";

export const metadata: Metadata = {
  title: "Exames",
  description:
    "Ressonância, tomografia, ultrassonografia, mamografia, raios X digital, densitometria óssea, radiografia odontológica e exames cardiológicos. Veja as regras de comparecimento e agende.",
};

type Props = {
  searchParams: Promise<{ q?: string; unidade?: string }>;
};

export default async function PaginaExames({ searchParams }: Props) {
  const { q = "", unidade = "" } = await searchParams;
  const termo = q.trim();

  // Duas telas na mesma rota. Sem busca, o paciente navega pelas modalidades
  // (8 páginas com preço de atenção baixo). Com busca, ele procura o nome que
  // está no pedido médico, e aí quem responde é o catálogo do sistema.
  const grupos = termo ? buscarGrupos(termo) : [];

  const filtroUnidade = unidadePorSlug(unidade);
  const modalidades = filtroUnidade
    ? EXAMES.filter((exame) => exame.unidades.includes(filtroUnidade.slug))
    : EXAMES;

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
            Digite o que está escrito no seu pedido médico. São {TOTAL_EXAMES}{" "}
            exames cadastrados, reunidos em {TOTAL_GRUPOS} grupos.
          </p>

          <form className="busca-pagina" action="/exames" method="get" role="search">
            <label className="sr-only" htmlFor="busca-exames">
              Buscar exame
            </label>
            <input
              className="busca__campo"
              id="busca-exames"
              name="q"
              type="search"
              defaultValue={q}
              placeholder="Ex.: ressonância de joelho"
              autoComplete="off"
            />
            <Button type="submit">Buscar</Button>
          </form>

          {/* O filtro de unidade vale para as modalidades, que é onde a
              clínica sabe qual equipamento fica onde. O catálogo não traz
              essa informação por linha, então ele some durante a busca em
              vez de filtrar por um dado que não existe. */}
          {!termo && (
            <div className="filtros">
              <span>Unidade:</span>
              <Link
                className={`chip${!filtroUnidade ? " chip--ativo" : ""}`}
                href="/exames"
              >
                Todas
              </Link>
              {UNIDADES.map((item) => (
                <Link
                  key={item.slug}
                  className={`chip${filtroUnidade?.slug === item.slug ? " chip--ativo" : ""}`}
                  href={`/exames?unidade=${item.slug}`}
                >
                  {item.etiqueta}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      <section className="secao">
        <div className="container">
          {termo ? (
            <>
              <p className="busca-resumo" aria-live="polite">
                {grupos.length === 0
                  ? "Nenhum exame encontrado"
                  : `${grupos.length} ${grupos.length === 1 ? "exame encontrado" : "exames encontrados"}`}{" "}
                para “{termo}”.
              </p>

              {grupos.length === 0 ? (
                <div className="busca-vazia">
                  <h2 style={{ fontSize: "var(--txt-xl)" }}>
                    Não encontramos esse exame
                  </h2>
                  <p style={{ marginTop: "var(--e-3)", color: "var(--texto-suave)" }}>
                    Confira o nome no pedido médico ou fale com a gente pelo
                    WhatsApp.
                  </p>
                  <div className="busca-vazia__acoes">
                    <Button href={CLINICA.whatsapp.link} external variant="whatsapp">
                      Falar no WhatsApp
                    </Button>
                    <Button href="/exames" variant="contorno">
                      Ver todos os exames
                    </Button>
                  </div>
                </div>
              ) : (
                <ul className="lista-grupos">
                  {grupos.map((grupo) => (
                    <li key={grupo.slug}>
                      <Link className="grupo-card" href={`/exames/grupo/${grupo.slug}`}>
                        <span className="grupo-card__nome">{grupo.nome}</span>
                        <span className="grupo-card__meta">
                          {grupo.variacoes.length}{" "}
                          {grupo.variacoes.length === 1 ? "opção" : "opções"}
                        </span>
                        <span className="grupo-card__seta" aria-hidden="true">
                          →
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </>
          ) : (
            <div className="lista-exames">
              {modalidades.map((exame, indice) => (
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
                          <span className="badge badge--alerta">Ordem de chegada</span>
                        ) : (
                          <span className="badge badge--neutro">Com agendamento</span>
                        )}
                        {exame.chegarAntesMin && (
                          <span className="badge badge--neutro">
                            Chegar {exame.chegarAntesMin} min antes
                          </span>
                        )}
                        {exame.contraste && (
                          <span className="badge badge--neutro">Pode ter contraste</span>
                        )}
                      </div>

                      <span className="card-exame__acao">Ver detalhes e agendar →</span>
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
