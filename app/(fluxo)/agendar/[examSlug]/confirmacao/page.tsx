import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Confirmacao } from "@/components/agendamento/Confirmacao";
import { Stepper } from "@/components/ui/Stepper";
import { EXAMES, examePorSlug } from "@/content/exames";
import { PASSOS } from "../page";

type Props = { params: Promise<{ examSlug: string }> };

export function generateStaticParams() {
  return EXAMES.map((exame) => ({ examSlug: exame.slug }));
}

export const metadata: Metadata = {
  title: "Solicitação registrada",
  robots: { index: false, follow: false },
};

export default async function PaginaConfirmacao({ params }: Props) {
  const { examSlug } = await params;
  const exame = examePorSlug(examSlug);
  if (!exame) notFound();

  return (
    <>
      <Stepper steps={PASSOS} current={3} />
      <div className="container" style={{ paddingBlock: "var(--e-12)" }}>
        <Suspense fallback={<div className="confirmacao">Carregando…</div>}>
          <Confirmacao
            exameNome={exame.nome}
            porOrdemDeChegada={exame.agendamento === "ordem-de-chegada"}
          />
        </Suspense>
      </div>
    </>
  );
}
