"use client";

import { useId, useState, type ReactNode } from "react";

export type AccordionProps = {
  title: string;
  children: ReactNode;
  /** Começa aberto. */
  defaultOpen?: boolean;
};

export function Accordion({ title, children, defaultOpen = false }: AccordionProps) {
  const id = useId();
  const [aberto, setAberto] = useState(defaultOpen);

  return (
    <div className="acordeao">
      <h3>
        <button
          type="button"
          className="acordeao__gatilho"
          aria-expanded={aberto}
          aria-controls={`${id}-corpo`}
          id={`${id}-gatilho`}
          onClick={() => setAberto((valor) => !valor)}
        >
          {title}
          <span className="acordeao__seta" aria-hidden="true">
            ▾
          </span>
        </button>
      </h3>
      <div
        id={`${id}-corpo`}
        role="region"
        aria-labelledby={`${id}-gatilho`}
        className="acordeao__corpo"
        hidden={!aberto}
      >
        {children}
      </div>
    </div>
  );
}
