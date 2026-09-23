import type { ReactNode } from "react";
import { cx } from "@/lib/cx";

export type AvisoTipo = "alerta" | "ok" | "info" | "erro";

const ICONE: Record<AvisoTipo, string> = {
  alerta: "!",
  ok: "✓",
  info: "i",
  erro: "⚠",
};

/**
 * Caixa de aviso (restrição, confirmação, erro).
 * `erro` sai como `role="alert"` para o leitor de tela anunciar na hora.
 */
export function Aviso({
  tipo = "alerta",
  titulo,
  children,
  className,
}: {
  tipo?: AvisoTipo;
  titulo?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cx("aviso", tipo !== "alerta" && `aviso--${tipo}`, className)}
      role={tipo === "erro" ? "alert" : undefined}
    >
      <span aria-hidden="true">{ICONE[tipo]}</span>
      <div>
        {titulo && <p className="aviso__titulo">{titulo}</p>}
        <div>{children}</div>
      </div>
    </div>
  );
}
