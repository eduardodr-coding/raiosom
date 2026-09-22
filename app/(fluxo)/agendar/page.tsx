import type { Metadata } from "next";
import Link from "next/link";
import { Stepper } from "@/components/ui/Stepper";
import { CLINICA } from "@/content/clinica";
import { EXAMES } from "@/content/exames";
import { PASSOS } from "./[examSlug]/page";

export const metadata: Metadata = {
  title: "Agendar exame",
  robots: { index: false, follow: false },
};

/**
 * Passo 1 do agendamento. Antes, "Agendar exame" levava para /exames — a
 * vitrine institucional — e o paciente tinha que descobrir sozinho que
 * precisava entrar num exame para chegar ao formulário. Aqui ele já está
 * dentro do fluxo, com o stepper mostrando onde está.
 */
export default function PaginaEscolherExame() {
  return (
    <>
      <Stepper steps={PASSOS} current={1} />

      <div className="container" style={{ paddingBlock: "var(--e-10)" }}>
        <h1>Qual exame você precisa agendar?</h1>
        <p className="subtitulo" style={{ marginBottom: "var(--e-8)" }}>
          Escolha pelo nome que está no seu pedido médico. No passo seguinte você anexa o pedido e
          seus dados.
        </p>

        <div className="escolha-exame">
          {EXAMES.map((exame) => (
            <Link key={exame.slug} className="escolha-exame__item" href={`/agendar/${exame.slug}`}>
              <span className="escolha-exame__nome">{exame.nome}</span>
              <span className="escolha-exame__seta" aria-hidden="true">
                →
              </span>
            </Link>
          ))}
        </div>

        <p style={{ marginTop: "var(--e-8)", color: "var(--texto-suave)" }}>
          Não achou o seu exame na lista?{" "}
          <a href={CLINICA.whatsapp.link} target="_blank" rel="noopener noreferrer">
            Fale com a central pelo WhatsApp
          </a>
          , alguém confere o seu pedido e diz na hora se realizamos.
        </p>
      </div>
    </>
  );
}
