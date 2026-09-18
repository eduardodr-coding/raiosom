"use client";

import { useEffect, useState } from "react";

export type StepperProps = {
  /** Rótulo de cada passo, na ordem. */
  steps: string[];
  /** Passo atual, começando em 1. */
  current: number;
};

/**
 * Indicador de progresso do fluxo de agendamento.
 *
 * A barra começa na posição do passo anterior e anima até a posição atual no
 * primeiro frame depois da montagem — assim a transição acontece mesmo com
 * navegação de página inteira, que sempre remonta o componente.
 */
export function Stepper({ steps, current }: StepperProps) {
  const total = steps.length;
  const destino = (Math.min(current, total) / total) * 100;
  const origem = (Math.max(current - 1, 0) / total) * 100;
  const [largura, setLargura] = useState(origem);

  useEffect(() => {
    const id = requestAnimationFrame(() => setLargura(destino));
    return () => cancelAnimationFrame(id);
  }, [destino]);

  return (
    <div className="stepper">
      <div className="stepper__trilha" aria-hidden="true">
        <div className="stepper__progresso" style={{ width: `${largura}%` }} />
      </div>
      <div className="container">
        <ol className="stepper__passos">
          {steps.map((rotulo, indice) => {
            const numero = indice + 1;
            const estado =
              numero < current ? "feito" : numero === current ? "atual" : "proximo";

            return (
              <li
                key={rotulo}
                className="stepper__passo"
                data-estado={estado}
                aria-current={estado === "atual" ? "step" : undefined}
              >
                <span className="stepper__bolha" aria-hidden="true">
                  {estado === "feito" ? "✓" : numero}
                </span>
                <span className="stepper__rotulo">
                  <span className="sr-only">
                    Passo {numero} de {total}:{" "}
                  </span>
                  {rotulo}
                </span>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
