"use client";

import { useRef } from "react";
import { STATUS } from "@/lib/status";
import { mudarStatus } from "./acoes";

/**
 * Troca de status direto na listagem.
 *
 * É um `<form>` de verdade com server action: sem JavaScript, o atendente
 * ainda consegue mudar o status usando o botão "Salvar" que aparece no
 * `<noscript>`. Com JavaScript, o próprio `change` envia.
 */
export function SelectStatus({ protocolo, status }: { protocolo: string; status: string }) {
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form action={mudarStatus} ref={formRef} style={{ display: "flex", gap: "var(--e-2)" }}>
      <input type="hidden" name="protocolo" value={protocolo} />
      <label className="sr-only" htmlFor={`status-${protocolo}`}>
        Status da solicitação {protocolo}
      </label>
      <select
        id={`status-${protocolo}`}
        name="status"
        className="status-select"
        data-status={status}
        defaultValue={status}
        onChange={() => formRef.current?.requestSubmit()}
      >
        {STATUS.map((opcao) => (
          <option key={opcao.valor} value={opcao.valor}>
            {opcao.rotulo}
          </option>
        ))}
      </select>
      <noscript>
        <button type="submit" className="btn btn--contorno btn--pequeno">
          Salvar
        </button>
      </noscript>
    </form>
  );
}
