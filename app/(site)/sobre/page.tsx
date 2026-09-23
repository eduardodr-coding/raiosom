import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Revelar } from "@/components/Revelar";
import { Button } from "@/components/ui/Button";
import { CLINICA, UNIDADES } from "@/content/clinica";
import { EXAMES } from "@/content/exames";

import "@/styles/home.css";
import "@/styles/exames.css";

export const metadata: Metadata = {
  title: "A Clínica",
  description:
    "50 anos de diagnóstico por imagem em Gravataí e Cachoeirinha, com o Selo de Qualidade PADI do Colégio Brasileiro de Radiologia.",
};

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
            O {CLINICA.nomeCompleto} é um centro clínico especializado em exames e diagnóstico por
            imagem. Desde {CLINICA.desde}, em Gravataí, e hoje também em Cachoeirinha.
          </p>
        </div>
      </div>

      <section className="secao" id="historia">
        <div className="container">
          <Revelar style={{ display: "grid", placeItems: "center" }}>
            <Image
              src="/marca/logo.png"
              alt="Raio Som Diagnóstico por Imagem · 50 anos · Qualidade PADI acreditada pelo CBR"
              width={755}
              height={142}
              priority
              sizes="(max-width: 800px) 90vw, 755px"
              style={{ width: "min(100%, 620px)", height: "auto" }}
            />
          </Revelar>
        </div>
      </section>

      <section className="secao secao--alt" id="padi">
        <div className="container">
          <div className="sobre-grid">
            <Revelar>
              <span className="kicker">Qualidade acreditada</span>
              <h2>{CLINICA.acreditacao.selo}</h2>
              <p className="subtitulo">
                A Raio Som é certificada com o Selo PADI, o {CLINICA.acreditacao.programa} do{" "}
                {CLINICA.acreditacao.orgao}. Na prática, isso significa protocolo auditado de
                segurança, laudo assinado por médico radiologista e equipe treinada periodicamente.
              </p>
              <div
                style={{
                  display: "flex",
                  gap: "var(--e-4)",
                  marginTop: "var(--e-8)",
                  flexWrap: "wrap",
                }}
              >
                {[
                  { valor: CLINICA.anos, rotulo: "anos de história" },
                  { valor: UNIDADES.length, rotulo: "unidades na região" },
                  { valor: EXAMES.length, rotulo: "modalidades de exame" },
                ].map((item) => (
                  <div className="card numero-destaque" key={item.rotulo}>
                    <p className="numero-destaque__valor">{item.valor}</p>
                    <p className="numero-destaque__rotulo">{item.rotulo}</p>
                  </div>
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

      <section className="secao">
        <div className="container">
          <Revelar>
            <span className="kicker">Como trabalhamos</span>
            <h2>O que a acreditação muda para você</h2>
          </Revelar>

          <div className="passos" style={{ marginTop: "var(--e-8)" }}>
            <Revelar>
              <div className="card" style={{ height: "100%" }}>
                <h3 className="passo__titulo" style={{ marginTop: 0 }}>
                  Laudo de radiologista
                </h3>
                <p className="passo__texto">
                  Todo exame é laudado por médico radiologista, e o laudo fica disponível no portal
                  de resultados e no aplicativo.
                </p>
              </div>
            </Revelar>
            <Revelar delay={80}>
              <div className="card" style={{ height: "100%" }}>
                <h3 className="passo__titulo" style={{ marginTop: 0 }}>
                  Protocolo de segurança
                </h3>
                <p className="passo__texto">
                  Conferência de identificação, questionário de segurança na ressonância e
                  dupla checagem do pedido médico antes de cada exame.
                </p>
              </div>
            </Revelar>
            <Revelar delay={160}>
              <div className="card" style={{ height: "100%" }}>
                <h3 className="passo__titulo" style={{ marginTop: 0 }}>
                  Equipe treinada
                </h3>
                <p className="passo__texto">
                  Treinamento periódico da equipe técnica, exigência do programa de acreditação do
                  Colégio Brasileiro de Radiologia.
                </p>
              </div>
            </Revelar>
          </div>
        </div>
      </section>

      <section className="secao secao--alt">
        <div className="container" style={{ textAlign: "center" }}>
          <Revelar>
            <h2>Já tem o pedido médico em mãos?</h2>
            <p className="subtitulo" style={{ marginInline: "auto" }}>
              Preencha seus dados em 2 minutos e finalize com nossa equipe no WhatsApp.
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
              <Button href="/exames" size="grande">
                Solicitar meu exame
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
