import { CLINICA, rotuloTurno, rotuloUnidade } from "@/content/clinica";
import { cpfParcial, telefoneFormatado } from "./mascaras";

export type DadosMensagem = {
  /** Nulo quando o banco estava fora do ar e a solicitação não foi gravada. */
  protocolo: string | null;
  exameNome: string;
  pacienteNome: string;
  /** CPF só com dígitos, a mascaragem acontece aqui dentro. */
  cpf: string;
  dataNascimento: string;
  /** Só dígitos; nulo quando o paciente marcou "Não possuo". */
  whatsapp: string | null;
  /** Nulo quando o paciente marcou "Não possuo". */
  email: string | null;
  unidade: string;
  convenio: string;
  turno: string;
  /** Exames por ordem de chegada não reservam turno. */
  comTurno?: boolean;
};

/**
 * Monta a mensagem que o paciente envia para a central, no texto aprovado
 * pela clínica.
 *
 * Duas linhas foram acrescentadas ao modelo porque sem elas a central não
 * consegue atender: o exame (senão o atendente pergunta de novo) e o
 * protocolo, que liga a conversa à ficha no painel, onde estão o pedido
 * médico anexado e o CPF completo.
 *
 * O CPF entra parcialmente mascarado de propósito: esta string vira query
 * string em `wa.me/...?text=`, que fica no histórico do navegador, na lista de
 * compartilhamento do celular e no log de qualquer proxy no caminho.
 */
export function montarMensagem(dados: DadosMensagem): string {
  const atendimento = [
    `Exame: ${dados.exameNome}`,
    `Unidade preferencial: ${rotuloUnidade(dados.unidade)}`,
  ];
  if (dados.comTurno !== false) {
    atendimento.push(`Turno de preferência: ${rotuloTurno(dados.turno)}`);
  }
  atendimento.push(`Atendimento: ${dados.convenio}`);
  if (dados.protocolo) atendimento.push(`Protocolo: ${dados.protocolo}`);

  return [
    "Olá! Gostaria de agendar um exame e preenchi o formulário pelo site.",
    "",
    "Dados do paciente:",
    `Nome: ${dados.pacienteNome}`,
    `CPF: ${cpfParcial(dados.cpf)}`,
    `Data de nascimento: ${dados.dataNascimento}`,
    `WhatsApp: ${dados.whatsapp ? telefoneFormatado(dados.whatsapp) : "Não possui"}`,
    `E-mail: ${dados.email ?? "Não possui"}`,
    "",
    "Informações para o atendimento:",
    ...atendimento,
    "",
    "Poderiam, por favor, verificar os horários disponíveis e me confirmar o agendamento?",
    "",
    "Obrigado!",
  ].join("\n");
}

export function linkWhatsApp(mensagem: string): string {
  return `${CLINICA.whatsapp.link}?text=${encodeURIComponent(mensagem)}`;
}
