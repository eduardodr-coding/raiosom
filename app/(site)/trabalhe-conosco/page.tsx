import type { Metadata } from "next";
import Link from "next/link";
import { Revelar } from "@/components/Revelar";
import { Button } from "@/components/ui/Button";
import { CLINICA } from "@/content/clinica";

import "@/styles/exames.css";

export const metadata: Metadata = {
  title: "Trabalhe Conosco",
  description:
    "Envie seu currículo para o time da Raio Som Diagnóstico por Imagem, em Gravataí e Cachoeirinha.",
};

export default function PaginaTrabalheConosco() {
  const assunto = encodeURIComponent("Currículo via site");

  return (
    <>
      <div className="pagina-topo">
        <div className="container">
          <ol className="trilha">
            <li>
              <Link href="/">Início</Link>
            </li>
            <li>Trabalhe Conosco</li>
          </ol>
          <h1>Trabalhe conosco</h1>
          <p className="pagina-topo__texto">
            Somos um centro clínico de diagnóstico por imagem com {CLINICA.anos} anos de história e
            acreditação PADI. Se você quer fazer parte da equipe, mande seu currículo: entramos em contato
            quando surgir uma vaga no seu perfil.
          </p>
        </div>
      </div>

      <section className="secao">
        <div className="container texto-longo">
          <Revelar>
            <h2 style={{ marginTop: 0 }}>Como enviar seu currículo</h2>
            <p>
              Envie um e-mail para{" "}
              <a href={`mailto:${CLINICA.emails.rh}?subject=${assunto}`}>{CLINICA.emails.rh}</a>{" "}
              com o currículo anexado em PDF e, no corpo da mensagem:
            </p>
            <ul>
              <li>a área de interesse (recepção, técnico em radiologia, enfermagem, TI, etc.);</li>
              <li>a unidade de preferência (Gravataí ou Cachoeirinha);</li>
              <li>seu telefone de contato com DDD;</li>
              <li>
                registro no conselho de classe e número, quando a função exigir (CRTR, COREN, CRM).
              </li>
            </ul>

            <h2>O que acontece depois</h2>
            <p>
              Seu currículo fica guardado com o RH. Quando abrir uma vaga compatível, o RH entra
              em contato pelo telefone ou e-mail que você informou. Não temos prazo fixo de
              retorno: isso depende da abertura de vagas.
            </p>

            <h2>Seus dados</h2>
            <p>
              O currículo enviado é usado exclusivamente para processos seletivos da Raio Som.
              Você pode pedir a exclusão dos seus dados a qualquer momento, escrevendo para{" "}
              <a href={`mailto:${CLINICA.emails.privacidade}`}>{CLINICA.emails.privacidade}</a>.
              Veja a <Link href="/politica-de-privacidade">Política de Privacidade</Link>.
            </p>

            <div style={{ marginTop: "var(--e-8)" }}>
              <Button href={`mailto:${CLINICA.emails.rh}?subject=${assunto}`} size="grande">
                Enviar currículo por e-mail
              </Button>
            </div>
          </Revelar>
        </div>
      </section>
    </>
  );
}
