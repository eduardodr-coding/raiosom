import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Revelar } from "@/components/Revelar";
import { Aviso } from "@/components/ui/Aviso";
import { Button } from "@/components/ui/Button";
import { CLINICA } from "@/content/clinica";
import { CONVENIOS_LOGOS, CONVENIOS_TOTAL_LOGOS } from "@/content/convenios";

import "@/styles/home.css";
import "@/styles/exames.css";

export const metadata: Metadata = {
  title: "Convênios",
  description:
    "Convênios atendidos pela Raio Som em Gravataí e Cachoeirinha. Confirme a cobertura do seu exame com a central antes de agendar.",
};

// TODO: confirmar com a clínica o pareamento logo↔nome dos convênios — por
// enquanto o alt de cada logo fica genérico (ver comentário mais abaixo).
export default function PaginaConvenios() {
  return (
    <>
      <div className="pagina-topo">
        <div className="container">
          <ol className="trilha">
            <li>
              <Link href="/">Início</Link>
            </li>
            <li>Convênios</li>
          </ol>
          <h1>Convênios atendidos</h1>
          <p className="pagina-topo__texto">
            Atendemos {CONVENIOS_TOTAL_LOGOS} planos de saúde, além do atendimento particular. A cobertura varia
            por exame e por contrato, então a confirmação final é sempre feita pela central antes
            do atendimento.
          </p>
        </div>
      </div>

      <section className="secao">
        <div className="container">
          <Revelar>
            <span className="kicker">Lista de parceiros</span>
            <h2>Convênios Parceiros</h2>
            <p className="subtitulo">
              Logos dos planos com os quais a Raio Som mantém credenciamento.
            </p>
          </Revelar>

          <Revelar className="grade-logos" style={{ marginTop: "var(--e-8)" }}>
            {CONVENIOS_LOGOS.map((logo) => (
              <div className="logo-convenio" key={logo}>
                <Image
                  src={logo}
                  // Sem o pareamento logo↔nome confirmado pela clínica, um alt
                  // específico seria invenção — por isso fica genérico aqui.
                  alt="Convênio atendido pela Raio Som"
                  width={150}
                  height={150}
                  sizes="150px"
                  style={{ width: "100%", height: "auto" }}
                />
              </div>
            ))}
          </Revelar>

          <Revelar style={{ marginTop: "var(--e-10)", maxWidth: 760 }}>
            <Aviso tipo="info" titulo="Não achou o seu plano na lista?">
              Mande o nome do seu convênio e o exame do pedido médico para a central, a resposta
              vem na hora, com a confirmação de cobertura e do que o plano exige (autorização
              prévia, por exemplo).
            </Aviso>
            <div
              style={{
                display: "flex",
                gap: "var(--e-3)",
                marginTop: "var(--e-5)",
                flexWrap: "wrap",
              }}
            >
              <Button href={CLINICA.whatsapp.link} external variant="whatsapp">
                Perguntar no WhatsApp
              </Button>
              <Button href={CLINICA.telefoneLink} variant="contorno">
                Ligar: {CLINICA.telefonePrincipal}
              </Button>
            </div>
          </Revelar>
        </div>
      </section>

      <section className="secao">
        <div className="container" style={{ textAlign: "center" }}>
          <Revelar>
            <h2>Já sabe qual exame precisa?</h2>
            <p className="subtitulo" style={{ marginInline: "auto" }}>
              Envie a foto do pedido médico. A central confirma a cobertura do seu
              plano antes de fechar o horário.
            </p>
            <div style={{ marginTop: "var(--e-6)" }}>
              <Button href="/exames" size="grande">
                Ver exames e agendar
              </Button>
            </div>
          </Revelar>
        </div>
      </section>
    </>
  );
}
