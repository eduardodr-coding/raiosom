import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Revelar } from "@/components/Revelar";
import { Button } from "@/components/ui/Button";
import { CLINICA, TOTAL_UNIDADES } from "@/content/clinica";
import { EXAMES } from "@/content/exames";
import { DIFERENCIAIS, HISTORIA, MISSAO, PILARES, VALORES, VISAO } from "@/content/institucional";

import "@/styles/home.css";
import "@/styles/exames.css";

export const metadata: Metadata = {
  title: "A Clínica",
  description: `${CLINICA.anos} anos de diagnóstico por imagem em Gravataí, Cachoeirinha e região, com o Selo de Qualidade PADI do Colégio Brasileiro de Radiologia.`,
};

// Cada número leva à parte do site que o explica: quem clica em "unidades"
// quer saber onde elas ficam, não ler o número de novo.
const NUMEROS = [
  { valor: CLINICA.anos, rotulo: "anos de história", href: "#historia" },
  { valor: TOTAL_UNIDADES, rotulo: "unidades na região", href: "/unidades" },
  { valor: EXAMES.length, rotulo: "modalidades de exame", href: "/exames" },
];

export default function PaginaSobre() {
  return (
    <>
      <div className="pagina-topo">
        <div className="container">
          <ol className="trilha">
            <li>
              <Link href="/">Início</Link>
            </li>
            <li>A Clínica</li>
          </ol>
          <h1>{CLINICA.anos} anos cuidando do diagnóstico da região</h1>
          <p className="pagina-topo__texto">
            O {CLINICA.nomeCompleto} é especializado em exames de diagnóstico por imagem e atende
            Gravataí, Cachoeirinha e região desde {CLINICA.desde}.
          </p>
        </div>
      </div>

      <section className="secao" id="historia">
        <div className="container">
          <Revelar style={{ display: "grid", placeItems: "center", marginBottom: "var(--e-12)" }}>
            <Image
              src="/marca/logo.png"
              alt="Raio Som Diagnóstico por Imagem · Qualidade PADI acreditada pelo CBR"
              width={755}
              height={142}
              priority
              sizes="(max-width: 800px) 90vw, 755px"
              style={{ width: "min(100%, 620px)", height: "auto" }}
            />
          </Revelar>

          <div className="sobre-grid" style={{ alignItems: "start" }}>
            <Revelar>
              <span className="kicker">Desde {CLINICA.desde}</span>
              <h2>{HISTORIA.titulo}</h2>
              {HISTORIA.paragrafos.map((paragrafo) => (
                <p className="bloco__texto" key={paragrafo.slice(0, 24)}>
                  {paragrafo.replace("{anos}", String(CLINICA.anos))}
                </p>
              ))}
            </Revelar>

            <Revelar delay={80}>
              <div className="card">
                <h3 className="card__titulo">Nossos diferenciais</h3>
                <ul className="lista-itens" style={{ marginTop: "var(--e-4)" }}>
                  {DIFERENCIAIS.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                <h3 className="card__titulo" style={{ marginTop: "var(--e-6)" }}>
                  Nossos pilares
                </h3>
                <ul className="lista-itens" style={{ marginTop: "var(--e-4)" }}>
                  {PILARES.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </Revelar>
          </div>
        </div>
      </section>

      <section className="secao secao--alt" id="missao">
        <div className="container">
          <Revelar>
            <span className="kicker">Quem somos</span>
            <h2>Missão, visão e valores</h2>
          </Revelar>

          <div className="passos" style={{ marginTop: "var(--e-8)" }}>
            <Revelar>
              <div className="card" style={{ height: "100%" }}>
                <h3 className="passo__titulo" style={{ marginTop: 0 }}>
                  Missão
                </h3>
                <p className="passo__texto">{MISSAO}</p>
              </div>
            </Revelar>
            <Revelar delay={80}>
              <div className="card" style={{ height: "100%" }}>
                <h3 className="passo__titulo" style={{ marginTop: 0 }}>
                  Visão
                </h3>
                <p className="passo__texto">{VISAO}</p>
              </div>
            </Revelar>
            <Revelar delay={160}>
              <div className="card" style={{ height: "100%" }}>
                <h3 className="passo__titulo" style={{ marginTop: 0 }}>
                  Valores
                </h3>
                <ul className="lista-itens passo__texto">
                  {VALORES.map((valor) => (
                    <li key={valor}>{valor}</li>
                  ))}
                </ul>
              </div>
            </Revelar>
          </div>
        </div>
      </section>

      <section className="secao" id="padi">
        <div className="container">
          <div className="sobre-grid">
            <Revelar>
              <span className="kicker">Qualidade acreditada</span>
              <h2>{CLINICA.acreditacao.selo}</h2>
              <p className="subtitulo">
                A Raio Som é acreditada pelo PADI, o {CLINICA.acreditacao.programa} do{" "}
                {CLINICA.acreditacao.orgao}. Na prática, isso significa protocolos de segurança
                auditados, laudos assinados por especialistas e equipe treinada periodicamente.
              </p>
              <div className="numeros-destaque">
                {NUMEROS.map((item) => (
                  <Link
                    className="card card--interativo numero-destaque"
                    href={item.href}
                    key={item.rotulo}
                  >
                    <span className="numero-destaque__valor">{item.valor}</span>
                    <span className="numero-destaque__rotulo">{item.rotulo}</span>
                  </Link>
                ))}
              </div>
            </Revelar>

            <Revelar style={{ display: "grid", placeItems: "center", gap: "var(--e-6)" }}>
              <Image
                src="/marca/padi.png"
                alt="Selo de Qualidade PADI acreditada, CBR"
                width={1250}
                height={1250}
                sizes="(max-width: 900px) 60vw, 280px"
                style={{ width: "min(100%, 240px)", height: "auto" }}
              />
              <Image
                src="/marca/padicbr.png"
                alt="Programa de Acreditação em Diagnóstico por Imagem"
                width={758}
                height={283}
                sizes="(max-width: 900px) 70vw, 300px"
                style={{ width: "min(100%, 280px)", height: "auto" }}
              />
            </Revelar>
          </div>
        </div>
      </section>

      <section className="secao secao--alt">
        <div className="container">
          <Revelar>
            <span className="kicker">Como trabalhamos</span>
            <h2>O que a acreditação muda para você</h2>
          </Revelar>

          <div className="passos" style={{ marginTop: "var(--e-8)" }}>
            <Revelar>
              <div className="card" style={{ height: "100%" }}>
                <h3 className="passo__titulo" style={{ marginTop: 0 }}>
                  Laudo de especialista
                </h3>
                <p className="passo__texto">
                  Todo exame é laudado por especialista, e o laudo fica disponível no portal de
                  resultados e no aplicativo.
                </p>
              </div>
            </Revelar>
            <Revelar delay={80}>
              <div className="card" style={{ height: "100%" }}>
                <h3 className="passo__titulo" style={{ marginTop: 0 }}>
                  Protocolo de segurança
                </h3>
                <p className="passo__texto">
                  Conferência de identificação, questionário de segurança na ressonância e dupla
                  checagem do pedido médico antes de cada exame.
                </p>
              </div>
            </Revelar>
            <Revelar delay={160}>
              <div className="card" style={{ height: "100%" }}>
                <h3 className="passo__titulo" style={{ marginTop: 0 }}>
                  Equipe treinada
                </h3>
                <p className="passo__texto">
                  Treinamento periódico das equipes técnica e de atendimento, uma exigência do
                  programa de acreditação do Colégio Brasileiro de Radiologia.
                </p>
              </div>
            </Revelar>
          </div>
        </div>
      </section>

      <section className="secao">
        <div className="container" style={{ textAlign: "center" }}>
          <Revelar>
            <h2>Já tem o pedido médico em mãos?</h2>
            <p className="subtitulo" style={{ marginInline: "auto" }}>
              Faça o pré-agendamento em 2 minutos e finalize com nossa equipe pelo WhatsApp.
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
              <Button href="/agendar" size="grande">
                Fazer pré-agendamento
              </Button>
              <Button href={CLINICA.whatsapp.link} external variant="whatsapp" size="grande">
                Falar no WhatsApp
              </Button>
            </div>
          </Revelar>
        </div>
      </section>
    </>
  );
}
