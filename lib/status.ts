/** Status de uma solicitação, como aparecem no painel. */
export const STATUS = [
  { valor: "pendente", rotulo: "Pendente" },
  { valor: "em_atendimento", rotulo: "Em atendimento" },
  { valor: "confirmado", rotulo: "Confirmado" },
  { valor: "cancelado", rotulo: "Cancelado" },
] as const;

export type StatusValor = (typeof STATUS)[number]["valor"];

export function formatarDataHora(data: Date): string {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(data);
}
