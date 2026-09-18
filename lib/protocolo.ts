/** Protocolo no formato `RS-AAAA-NNNNN`. */
export function formatarProtocolo(ano: number, sequencial: number): string {
  return `RS-${ano}-${String(sequencial).padStart(5, "0")}`;
}

/** Aceita `RS-2026-04817` (e tolera minúsculas e espaços ao redor). */
export function protocoloValido(valor: string): boolean {
  return /^RS-\d{4}-\d{5,}$/.test(valor.trim().toUpperCase());
}

export function normalizarProtocolo(valor: string): string {
  return valor.trim().toUpperCase();
}
