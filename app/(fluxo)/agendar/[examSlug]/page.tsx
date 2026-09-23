import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FormularioAgendamento } from "@/components/agendamento/FormularioAgendamento";
import { Stepper } from "@/components/ui/Stepper";
import { CLINICA } from "@/content/clinica";
import { EXAMES, examePorSlug } from "@/content/exames";

export const PASSOS = ["Escolha o exame", "Seus dados e o pedido", "Falar com a central"];

type Props = {
  params: Promise<{ examSlug: string }>;
  searchParams: Promise<{ unidade?: string }>;
};

export function generateStaticParams() {
  return EXAMES.map((exame) => ({ examSlug: exame.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { examSlug } = await params;
  const exame = examePorSlug(examSlug);
  return {
    title: exame ? `Agendar ${exame.nome}` : "Agendar exame",
    // Formulário com dado de paciente não tem por que aparecer em busca.
    robots: { index: false, follow: false },
  };
}

export default async function PaginaAgendar({ params, searchParams }: Props) {
  const { examSlug } = await params;
  const { unidade } = await searchParams;
  const exame = examePorSlug(examSlug);
  if (!exame) notFound();

  const porOrdemDeChegada = exame.agendamento === "ordem-de-chegada";

  return (
    <>
      <Stepper steps={PASSOS} current={2} />

      <div className="container agendar-corpo">
        <FormularioAgendamento exame={exame} unidadeInicial={unidade} />

        <aside className="resumo">
          <h2 className="resumo__titulo">Sua solicitação</h2>

          <div className="resumo__item">
            <p className="resumo__rotulo">Exame</p>
            <p className="resumo__valor">{exame.nome}</p>
          </div>

          <div className="resumo__item">
            <p className="resumo__rotulo">No dia do exame</p>
            <p className="resumo__valor" style={{ fontSize: "var(--txt-sm)" }}>
              {exame.chegarAntesMin
                ? `Chegar ${exame.chegarAntesMin} min antes · `
                : ""}
              trazer o pedido médico e documento com foto
            </p>
          </div>

          {porOrdemDeChegada && exame.horarioAtendimento && (
            <div className="resumo__item">
              <p className="resumo__rotulo">Atendimento</p>
              <p className="resumo__valor" style={{ fontSize: "var(--txt-sm)" }}>
                {exame.horarioAtendimento}
              </p>
            </div>
          )}

          <div className="resumo__caixa">
            <strong>O que acontece depois</strong>
            {porOrdemDeChegada
              ? "Ao continuar, seu WhatsApp abre com a mensagem pronta e o número do protocolo. Como este exame é por ordem de chegada, a central confirma o pedido e orienta o melhor horário para você vir."
              : "Ao continuar, seu WhatsApp abre com a mensagem pronta e o número do protocolo. Um atendente da Raio Som assume dali e fecha o horário com você."}
          </div>

          <p
            style={{
              marginTop: "var(--e-5)",
              fontSize: "var(--txt-sm)",
              color: "var(--texto-suave)",
            }}
          >
            Atendimento de segunda a sexta, 07h às 23h, e sábado até 17h. Telefone{" "}
            <a href={CLINICA.telefoneLink}>{CLINICA.telefonePrincipal}</a>.
          </p>
        </aside>
      </div>
    </>
  );
}
