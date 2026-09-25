import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FormularioAgendamento } from "@/components/agendamento/FormularioAgendamento";
import { Stepper } from "@/components/ui/Stepper";
import { CLINICA } from "@/content/clinica";
import { EXAMES, examePorSlug } from "@/content/exames";
import { exameDoCatalogo, paginaDoExame, rotuloVariacao } from "@/lib/catalogo";

export const PASSOS = ["Escolha o exame", "Seus dados e o pedido", "Falar com a central"];

type Props = {
  params: Promise<{ examSlug: string }>;
  searchParams: Promise<{ unidade?: string; exame?: string }>;
};

/**
 * A variação que o paciente escolheu em /exames/grupo/[grupo], resolvida aqui
 * pelo id do catálogo.
 *
 * Confere se a variação pertence mesmo a este exame: um id de outra
 * modalidade colado na URL é ignorado, em vez de mostrar "Mamografia
 * Bilateral" no resumo de uma solicitação de ressonância.
 */
function variacaoEscolhida(id: string | undefined, examSlug: string) {
  if (!id || !/^[0-9]{1,9}$/.test(id)) return null;
  const variacao = exameDoCatalogo(Number(id));
  return variacao && paginaDoExame(variacao) === examSlug ? variacao : null;
}

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
  const { unidade, exame: idCatalogo } = await searchParams;
  const exame = examePorSlug(examSlug);
  if (!exame) notFound();

  const variacao = variacaoEscolhida(idCatalogo, exame.slug);
  const porOrdemDeChegada = exame.agendamento === "ordem-de-chegada";

  return (
    <>
      <Stepper steps={PASSOS} current={2} />

      <div className="container agendar-corpo">
        <FormularioAgendamento
          exame={exame}
          unidadeInicial={unidade}
          catalogoId={variacao?.id}
        />

        <aside className="resumo">
          <h2 className="resumo__titulo">Sua solicitação</h2>

          <div className="resumo__item">
            <p className="resumo__rotulo">Exame</p>
            <p className="resumo__valor">{exame.nome}</p>
            {variacao && (
              <p
                className="resumo__valor"
                style={{ fontSize: "var(--txt-sm)", color: "var(--texto-suave)" }}
              >
                {rotuloVariacao(variacao)}
              </p>
            )}
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
            {CLINICA.horarioAgendamento} Telefone{" "}
            <a href={CLINICA.telefoneLink}>{CLINICA.telefonePrincipal}</a>.
          </p>
        </aside>
      </div>
    </>
  );
}
