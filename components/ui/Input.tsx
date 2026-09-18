"use client";

import { useId, type InputHTMLAttributes, type ReactNode } from "react";
import { cx } from "@/lib/cx";
import { Field, descritoPor } from "./Field";

export type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "className"> & {
  label: string;
  hint?: ReactNode;
  error?: string;
  optional?: boolean;
  className?: string;
};

export function Input({ label, hint, error, optional, className, id, ...resto }: InputProps) {
  const gerado = useId();
  const campoId = id ?? gerado;

  return (
    <Field id={campoId} label={label} hint={hint} error={error} optional={optional}>
      <input
        id={campoId}
        className={cx("campo__controle", className)}
        aria-invalid={error ? true : undefined}
        aria-describedby={descritoPor(campoId, hint, error)}
        {...resto}
      />
    </Field>
  );
}
