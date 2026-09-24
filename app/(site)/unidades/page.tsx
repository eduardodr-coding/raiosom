import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Revelar } from "@/components/Revelar";
import { Button } from "@/components/ui/Button";
import { CLINICA, ENTREGA_EXAMES, TOTAL_UNIDADES, UNIDADES } from "@/content/clinica";
import { EXAMES } from "@/content/exames";

import "@/styles/home.css";
import "@/styles/exames.css";

export const metadata: Metadata = {
  title: "Unidades",
  description:
    "As unidades da Raio Som em Gravataí e Cachoeirinha: endereços, horários de atendimento e retirada de exames.",
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
            São {TOTAL_UNIDADES} unidades na região metropolitana. A matriz, em Gravataí, realiza
            todas as modalidades, e o prédio administrativo, na mesma rua, é onde os exames
            impressos são retirados.
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
                            {/* Unidade nova cadastrada antes de a clínica
                                informar o endereço. */}
                            {unidade.cidade}
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
                            Ponto de atendimento e marcação: não realiza exames neste
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

            {/* O prédio administrativo entra na mesma grade das unidades: é
                mais um endereço que o paciente pode precisar visitar, ainda
                que só para retirar exame. Separado numa seção à parte ele
                passava despercebido. */}
            <Revelar className="unidade-card" delay={UNIDADES.length * 80}>
              <div className="unidade-card__mapa">
                <Image
                  className="unidade-card__foto"
                  src={ENTREGA_EXAMES.foto}
                  alt=""
                  width={626}
                  height={150}
                  sizes="(max-width: 700px) 100vw, 33vw"
                />
              </div>
              <div className="unidade-card__corpo">
                <span className="badge">RETIRADA DE EXAMES</span>
                <h2 className="unidade-card__nome">{ENTREGA_EXAMES.nome}</h2>
                <p className="unidade-card__endereco">
                  {ENTREGA_EXAMES.endereco}
                  <br />
                  {ENTREGA_EXAMES.cidade}
                </p>
                <ul className="unidade-card__horarios">
                  {ENTREGA_EXAMES.horarios.map((horario) => (
                    <li key={horario}>{horario}</li>
                  ))}
                </ul>
                <a className="unidade-card__telefone" href={CLINICA.telefoneLink}>
                  {CLINICA.telefonePrincipal}
                </a>
                <p
                  style={{
                    marginTop: "var(--e-4)",
                    fontSize: "var(--txt-sm)",
                    color: "var(--texto-suave)",
                  }}
                >
                  {ENTREGA_EXAMES.descricao}.
                </p>
                <div className="unidade-card__acoes">
                  <Button href={CLINICA.links.portalResultados} external>
                    Ver exame online
                  </Button>
                  <Button href={ENTREGA_EXAMES.mapa} external variant="contorno">
                    Como chegar
                  </Button>
                </div>
              </div>
            </Revelar>
          </div>
        </div>
      </section>
    </>
  );
}
