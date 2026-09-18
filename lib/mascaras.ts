import { somenteDigitos } from "./validacao";

/**
 * Máscaras dos campos do formulário.
 *
 * Implementação própria em vez de `react-imask`: são três formatos fixos e
 * cada um cabe em cinco linhas — não justifica uma dependência a mais em um
 * formulário que precisa carregar rápido no 3G do celular do paciente.
 *
 * Todas seguem a mesma regra: recebem o que o usuário digitou, devolvem o
 * texto já formatado, e nunca deixam passar mais dígitos que o formato.
 */

export function mascaraCPF(valor: string): string {
  const d = somenteDigitos(valor).slice(0, 11);
  if (d.length <= 3) return d;
  if (d.length <= 6) return `${d.slice(0, 3)}.${d.slice(3)}`;
  if (d.length <= 9) return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6)}`;
  return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6, 9)}-${d.slice(9)}`;
}

export function mascaraTelefone(valor: string): string {
  const d = somenteDigitos(valor).slice(0, 11);
  if (d.length <= 2) return d;
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

export function mascaraData(valor: string): string {
  const d = somenteDigitos(valor).slice(0, 8);
  if (d.length <= 2) return d;
  if (d.length <= 4) return `${d.slice(0, 2)}/${d.slice(2)}`;
  return `${d.slice(0, 2)}/${d.slice(2, 4)}/${d.slice(4)}`;
}

/**
 * CPF mascarado para a mensagem do WhatsApp: `123.***.**9-00`.
 *
 * A URL do wa.me fica no histórico do navegador e do aplicativo. Estes seis
 * dígitos bastam para o atendente confirmar que é a pessoa certa; o CPF
 * inteiro só aparece dentro do painel autenticado.
 */
export function cpfParcial(cpf: string): string {
  const d = somenteDigitos(cpf);
  if (d.length !== 11) return "";
  return `${d.slice(0, 3)}.***.**${d[8]}-${d.slice(9)}`;
}

export function cpfFormatado(cpf: string): string {
  const d = somenteDigitos(cpf);
  if (d.length !== 11) return cpf;
  return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6, 9)}-${d.slice(9)}`;
}

export function telefoneFormatado(numero: string): string {
  return mascaraTelefone(numero);
}
