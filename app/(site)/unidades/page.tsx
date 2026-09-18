import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Revelar } from "@/components/Revelar";
import { Button } from "@/components/ui/Button";
import { CLINICA, ENTREGA_EXAMES, UNIDADES } from "@/content/clinica";
import { EXAMES } from "@/content/exames";

import "@/styles/home.css";
import "@/styles/exames.css";

export const metadata: Metadata = {
  title: "Unidades",
  description:
    "Matriz em Gravataí e filial em Cachoeirinha: endereços, horários de atendimento e retirada de exames da Raio Som.",
};

export default function PaginaUnidades() {
  return (
    <>
      <div className="pagina-topo">
        <div className="container">
          <ol className="trilha">
            <li>
              <Link href="/">Início</Link>
            </li>
            <li>Unidades</li>
          </ol>
          <h1>Onde estamos</h1>
          <p className="pagina-topo__texto">
            {UNIDADES.length} unidades na região metropolitana. A matriz, em Gravataí, realiza
            todas as modalidades; a filial de Cachoeirinha é a unidade de tomografia
            computadorizada.
          </p>
        </div>
      </div>

      <section className="secao">
        <div className="container">
          <div className="grade-unidades">
            {UNIDADES.map((unidade, indice) => {
              const examesDaUnidade = EXAMES.filter((exame) =>
                exame.unidades.includes(unidade.slug),
              );

              return (
                <Revelar key={unidade.slug} delay={indice * 80}>
                  <article className="unidade-card">
                    <div className="unidade-card__mapa">
                      {unidade.foto ? (
                        <Image
                          className="unidade-card__foto"
                          src={unidade.foto}
                          alt=""
                          width={626}
                          height={150}
                          sizes="(max-width: 900px) 100vw, 50vw"
                        />
                      ) : (
                        // Sem foto real ainda: em vez de usar a foto de outra
                        // unidade (enganoso), mostra o nome da unidade.
                        <div className="unidade-card__mapa--sem-foto" aria-hidden="true">
                          {unidade.etiqueta.split("·").pop()?.trim()}
                        </div>
                      )}
                    </div>

                    <div className="unidade-card__corpo">
                      <span className="badge">{unidade.etiqueta.toUpperCase()}</span>
                      <h2 className="unidade-card__nome">{unidade.nome}</h2>
                      <p className="unidade-card__endereco">
                        {unidade.endereco ? (
                          <>
                            {unidade.endereco}
                            <br />
                            {unidade.complemento} · {unidade.cidade}
                          </>
                        ) : (
                          <>
                            {unidade.cidade}
                            {/* TODO: publicar o endereço completo da filial assim que
                                a clínica informar. */}
                            <br />
                            Endereço completo pelo telefone {CLINICA.telefonePrincipal}.
                          </>
                        )}
                      </p>

                      <ul className="unidade-card__horarios">
                        {unidade.horarios.map((horario) => (
                          <li key={horario}>{horario}</li>
                        ))}
                      </ul>

                      <a className="unidade-card__telefone" href={CLINICA.telefoneLink}>
                        {unidade.telefone}
                      </a>

                      <p
                        style={{
                          marginTop: "var(--e-4)",
                          fontSize: "var(--txt-sm)",
                          color: "var(--texto-suave)",
                        }}
                      >
                        {examesDaUnidade.length > 0 ? (
                          <>
                            <strong>Exames nesta unidade:</strong>{" "}
                            {examesDaUnidade.map((exame) => exame.nome).join(", ")}.
                          </>
                        ) : (
                          <>
                            Ponto de atendimento e marcação — não realiza exames neste
                            endereço. Fale pelo WhatsApp para marcar em uma unidade com
                            equipamento.
                          </>
                        )}
                      </p>

                      <div className="unidade-card__acoes">
                        {examesDaUnidade.length > 0 ? (
                          <Button href={`/exames?unidade=${unidade.slug}`}>
                            Agendar nesta unidade
                          </Button>
                        ) : (
                          <Button href={CLINICA.whatsapp.link} external variant="whatsapp">
                            Perguntar no WhatsApp
                          </Button>
                        )}
                        <Button href={unidade.mapa} external variant="contorno">
                          Como chegar
                        </Button>
                      </div>
                    </div>
                  </article>
                </Revelar>
              );
            })}
          </div>
        </div>
      </section>

      <section className="secao secao--alt">
        <div className="container">
          <Revelar>
            <span className="kicker">Retirada</span>
            <h2>Entrega de exames</h2>
            <p className="subtitulo">
              Os laudos também ficam disponíveis no{" "}
              <a href={CLINICA.links.portalResultados} target="_blank" rel="noopener noreferrer">
                portal de resultados
              </a>{" "}
              e no aplicativo — a retirada impressa é para quem prefere o papel.
            </p>
          </Revelar>

          <Revelar className="unidade-card" style={{ marginTop: "var(--e-8)", maxWidth: 480 }}>
            <div className="unidade-card__mapa">
              <Image
                className="unidade-card__foto"
                src={ENTREGA_EXAMES.foto}
                alt=""
                width={626}
                height={150}
                sizes="480px"
              />
            </div>
            <div className="unidade-card__corpo">
              <ul className="unidade-card__horarios">
                {ENTREGA_EXAMES.horarios.map((horario) => (
                  <li key={horario}>{horario}</li>
                ))}
              </ul>
              <p style={{ marginTop: "var(--e-4)", color: "var(--texto-suave)" }}>
                {ENTREGA_EXAMES.endereco}
              </p>
            </div>
          </Revelar>
        </div>
      </section>
    </>
  );
}
