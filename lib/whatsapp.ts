import { CLINICA, rotuloTurno, rotuloUnidade } from "@/content/clinica";
import { cpfParcial } from "./mascaras";

export type DadosMensagem = {
  protocolo: string;
  exameNome: string;
  pacienteNome: string;
  /** CPF só com dígitos, a mascaragem acontece aqui dentro. */
  cpf: string;
  dataNascimento: string;
  unidade: string;
  convenio: string;
  turno: string;
  /** Exames por ordem de chegada não reservam turno. */
  comTurno?: boolean;
  /**
   * O paciente anexou o pedido médico. A foto é opcional no formulário, então
   * a mensagem não pode afirmar que ela foi enviada quando não foi.
   */
  comPedido?: boolean;
};

/**
 * Monta a mensagem que o paciente envia para a central.
 *
 * O CPF entra parcialmente mascarado de propósito: esta string vira query
 * string em `wa.me/...?text=`, que fica no histórico do navegador, na lista de
 * compartilhamento do celular e no log de qualquer proxy no caminho. O
 * atendente recupera o CPF completo pelo protocolo, dentro do painel.
 */
export function montarMensagem(dados: DadosMensagem): string {
  const linhas = [
    "Olá! Quero agendar um exame na Raio Som.",
    "",
    `Protocolo: ${dados.protocolo}`,
    `Exame: ${dados.exameNome}`,
    `Paciente: ${dados.pacienteNome}`,
    `CPF: ${cpfParcial(dados.cpf)}`,
    `Nascimento: ${dados.dataNascimento}`,
    `Unidade: ${rotuloUnidade(dados.unidade)}`,
    `Convênio: ${dados.convenio}`,
  ];

  if (dados.comTurno !== false) {
    linhas.push(`Turno de preferência: ${rotuloTurno(dados.turno)}`);
  }

  linhas.push(
    "",
    dados.comPedido === false
      ? "Vou levar o pedido médico no dia do exame."
      : "Já anexei o pedido médico pelo site.",
  );

  return linhas.join("\n");
}

export function linkWhatsApp(mensagem: string): string {
  return `${CLINICA.whatsapp.link}?text=${encodeURIComponent(mensagem)}`;
}
