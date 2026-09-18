"use client";

import { useId, type ReactNode, type SelectHTMLAttributes } from "react";
import { cx } from "@/lib/cx";
import { Field, descritoPor } from "./Field";

export type SelectProps = Omit<SelectHTMLAttributes<HTMLSelectElement>, "className"> & {
  label: string;
  hint?: ReactNode;
  error?: string;
  optional?: boolean;
  /** Primeira opção, desabilitada, no lugar de um placeholder. */
  placeholder?: string;
  className?: string;
  children: ReactNode;
};

export function Select({
  label,
  hint,
  error,
  optional,
  placeholder,
  className,
  id,
  children,
  ...resto
}: SelectProps) {
  const gerado = useId();
  const campoId = id ?? gerado;

  return (
    <Field id={campoId} label={label} hint={hint} error={error} optional={optional}>
      <select
        id={campoId}
        className={cx("campo__controle", className)}
        aria-invalid={error ? true : undefined}
        aria-describedby={descritoPor(campoId, hint, error)}
        {...resto}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {children}
      </select>
    </Field>
  );
}
