"use client";

import type { ReactNode } from "react";
import { cx } from "@/lib/cx";

export type FieldProps = {
  id: string;
  label: string;
  /** Texto de apoio abaixo do campo. */
  hint?: ReactNode;
  /** Mensagem de erro; quando presente, o campo fica em estado inválido. */
  error?: string;
  optional?: boolean;
  className?: string;
  children: ReactNode;
};

/**
 * Moldura de um campo: rótulo, ajuda e erro.
 *
 * Existe para que rótulo, dica e erro fiquem ligados ao controle por `id` /
 * `aria-describedby` sempre da mesma forma — quem usa só passa as strings e
 * não tem como esquecer a acessibilidade.
 */
export function Field({ id, label, hint, error, optional, className, children }: FieldProps) {
  return (
    <div className={cx("campo", className)}>
      <label className="campo__rotulo" htmlFor={id}>
        {label}
        {optional && <span className="campo__opcional">(opcional)</span>}
      </label>
      {children}
      {hint && !error && (
        <p className="campo__ajuda" id={`${id}-ajuda`}>
          {hint}
        </p>
      )}
      {error && (
        <p className="campo__erro" id={`${id}-erro`} role="alert">
          <span aria-hidden="true">⚠</span>
          {error}
        </p>
      )}
    </div>
  );
}

/** Monta o `aria-describedby` do controle a partir do que está visível. */
export function descritoPor(id: string, hint: unknown, error: unknown): string | undefined {
  const partes = [error ? `${id}-erro` : null, hint && !error ? `${id}-ajuda` : null].filter(
    Boolean,
  );
  return partes.length > 0 ? partes.join(" ") : undefined;
}
