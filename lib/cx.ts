/**
 * Junta classes ignorando `false`, `null` e `undefined`.
 * Substitui o `clsx` — são oito linhas e evita mais uma dependência.
 */
export function cx(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}
