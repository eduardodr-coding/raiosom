"use client";

import { useId, type InputHTMLAttributes, type ReactNode } from "react";
import { cx } from "@/lib/cx";

export type CheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "className"> & {
  children: ReactNode;
  error?: string;
  className?: string;
};

export function Checkbox({ children, error, className, id, ...resto }: CheckboxProps) {
  const gerado = useId();
  const campoId = id ?? gerado;

  return (
    <div className={cx(className)}>
      <label className="check" htmlFor={campoId}>
        <input
          type="checkbox"
          id={campoId}
          className="check__entrada"
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${campoId}-erro` : undefined}
          {...resto}
        />
        <span className="check__texto">{children}</span>
      </label>
      {error && (
        <p className="campo__erro" id={`${campoId}-erro`} role="alert">
          <span aria-hidden="true">⚠</span>
          {error}
        </p>
      )}
    </div>
  );
}
