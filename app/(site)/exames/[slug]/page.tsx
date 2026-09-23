import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { RegrasExame } from "@/components/exames/RegrasExame";
import { Revelar } from "@/components/Revelar";
import { Aviso } from "@/components/ui/Aviso";
import { Button } from "@/components/ui/Button";
import { CLINICA, UNIDADES } from "@/content/clinica";
import { CONVENIOS_NOMES, CONVENIOS_OUTROS } from "@/content/convenios";
import { EXAMES, examePorSlug } from "@/content/exames";

import "@/styles/exames.css";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return EXAMES.map((exame) => ({ slug: exame.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const exame = examePorSlug(slug);
  if (!exame) return {};

  return {
    title: exame.nome,
    description: `${exame.descricao} Veja as regras de comparecimento, o que trazer e agende enviando a foto do pedido médico.`,
  };
}

export default async function PaginaExame({ params }: Props) {
  const { slug } = await params;
  const exame = examePorSlug(slug);
  if (!exame) notFound();

  const porOrdemDeChegada = exame.agendamento === "ordem-de-chegada";
  const unidadesDoExame = UNIDADES.filter((unidade) => exame.unidades.includes(unidade.slug));

  return (
    <>
      <div className="exame-topo">
        <div className="container exame-topo__grid">
          <div>
            <ol className="trilha">
              <li>
                <Link href="/">Início</Link>
              </li>
              <li>
                <Link href="/exames">Exames</Link>
              </li>
              <li>{exame.nome}</li>
            </ol>

            <h1 className="exame-topo__titulo">{exame.nome}</h1>
            <p className="exame-topo__descricao">{exame.descricao}</p>

            <div className="exame-topo__badges">
              <span className="badge badge--alerta">Exige pedido médico</span>
              {exame.chegarAntesMin && (
                <span className="badge">Chegar {exame.chegarAntesMin} min antes</span>
              )}
              {porOrdemDeChegada && <span className="badge badge--alerta">Ordem de chegada</span>}
              {unidadesDoExame.map((unidade) => (
                <span className="badge" key={unidade.slug}>
                  {unidade.etiqueta}
                </span>
              ))}
              {exame.contraste && <span className="badge">Pode ter contraste</span>}
            </div>
          </div>

          {exame.imagem && (
            <figure className="exame-topo__foto">
              <Image
                src={exame.imagem}
                alt={`Equipamento de ${exame.nome.toLowerCase()} da Raio Som`}
                width={800}
                height={533}
                priority
                sizes="(max-width: 900px) 100vw, 440px"
              />
            </figure>
          )}
        </div>
      </div>

      <div className="container exame-corpo">
        <div>
          {porOrdemDeChegada && (
            <Aviso tipo="info" titulo="Este exame não tem horário marcado">
              O atendimento é por ordem de chegada. {exame.horarioAtendimento} Você não precisa
              escolher um turno, é só vir dentro desse horário com o pedido médico e um documento
              com foto.
            </Aviso>
          )}

          {/* Ordem pensada para quem ainda não conhece o exame: primeiro
              entende o que vai acontecer, depois se tem contraste, e só então
              as regras de comparecimento, que é a parte acionável de véspera. */}
          {exame.comoEFeito && (
            <Revelar className="bloco">
              <h2 className="bloco__titulo">Como é feito</h2>
              <p className="bloco__texto">{exame.comoEFeito}</p>
            </Revelar>
          )}

          {exame.contraste && (
            <Revelar className="bloco">
              <h2 className="bloco__titulo">Meu exame é com contraste?</h2>
              <p className="bloco__texto">{exame.contraste}</p>
            </Revelar>
          )}

          <RegrasExame exame={exame} />

          {exame.restricoes && (
            <Revelar className="bloco">
              <Aviso titulo="Restrições importantes">
                <ul className="lista-itens" style={{ marginTop: "var(--e-3)" }}>
                  {exame.restricoes.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </Aviso>
            </Revelar>
          )}

          {exame.modalidades && (
            <Revelar className="bloco">
              <h2 className="bloco__titulo">Modalidades realizadas</h2>
              <ul className="lista-itens" style={{ marginTop: "var(--e-4)" }}>
                {exame.modalidades.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </Revelar>
          )}

          {exame.laudo && (
            <Revelar className="bloco">
              <h2 className="bloco__titulo">Quando sai o laudo</h2>
              <p className="bloco__texto">{exame.laudo}</p>
              <p className="bloco__texto">
                Os laudos também ficam disponíveis no{" "}
                <a href={CLINICA.links.portalResultados} target="_blank" rel="noopener noreferrer">
                  portal de resultados
                </a>{" "}
                e no aplicativo da Raio Som.
              </p>
            </Revelar>
          )}
        </div>

        <aside className="card-agendar">
          <h2 className="bloco__titulo">
            {porOrdemDeChegada ? "Como ser atendido" : `Agendar ${exame.nome}`}
          </h2>
          <p className="card-agendar__texto">
            {porOrdemDeChegada
              ? "Não há reserva de horário. Se quiser, envie o pedido médico antes: a central confere a cobertura do convênio e avisa o melhor horário para vir."
              : "Preencha seus dados, anexe a foto do pedido e finalize com nossa central no WhatsApp."}
          </p>

          <div className="card-agendar__acoes">
            <Button href={`/agendar/${exame.slug}`} block>
              {porOrdemDeChegada ? "Enviar pedido e tirar dúvidas" : "Solicitar agendamento"}
            </Button>
            <Button href={CLINICA.whatsapp.link} external variant="whatsapp" block>
              Tirar dúvida no WhatsApp
            </Button>
          </div>

          <div className="card-agendar__divisor" />

          <p className="card-agendar__rotulo">Seu convênio cobre?</p>
          <p className="card-agendar__texto">
            Atendemos {CONVENIOS_NOMES.slice(0, 5).join(", ")} e mais {CONVENIOS_OUTROS} convênios.
            A cobertura de cada exame é confirmada pela central antes do atendimento.
          </p>
          <div style={{ marginTop: "var(--e-4)" }}>
            <Button href="/convenios" variant="contorno" block>
              Ver lista de convênios
            </Button>
          </div>
        </aside>
      </div>
    </>
  );
}
