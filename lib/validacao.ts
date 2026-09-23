import { z } from "zod";

/**
 * Validação da solicitação de agendamento.
 *
 * O mesmo módulo roda no navegador (feedback imediato no formulário) e no
 * servidor (validação que vale). Máscara de campo é conveniência visual, não
 * garantia: quem posta direto na API manda o que quiser.
 */

export const TEXTO_CONSENTIMENTO =
  "Autorizo a Raio Som a tratar meus dados e o pedido médico para o agendamento do exame, conforme a Política de Privacidade e a LGPD.";

export function somenteDigitos(valor: string): string {
  return valor.replace(/\D/g, "");
}

/** Valida CPF pelos dois dígitos verificadores. */
export function cpfValido(entrada: string): boolean {
  const cpf = somenteDigitos(entrada);
  if (cpf.length !== 11) return false;
  // 000.000.000-00, 111.111.111-11 etc. passam na conta, mas não existem.
  if (/^(\d)\1{10}$/.test(cpf)) return false;

  const digito = (ateIndice: number): number => {
    let soma = 0;
    let peso = ateIndice + 1;
    for (let i = 0; i < ateIndice; i++) {
      soma += Number(cpf[i]) * peso--;
    }
    const resto = (soma * 10) % 11;
    return resto === 10 ? 0 : resto;
  };

  return digito(9) === Number(cpf[9]) && digito(10) === Number(cpf[10]);
}

/** Converte `dd/mm/aaaa` (ou `aaaa-mm-dd`) em Date, ou `null` se não for data real. */
export function lerDataNascimento(entrada: string): Date | null {
  const texto = entrada.trim();
  let ano: number;
  let mes: number;
  let dia: number;

  const brasileiro = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(texto);
  const iso = /^(\d{4})-(\d{2})-(\d{2})$/.exec(texto);

  if (brasileiro) {
    dia = Number(brasileiro[1]);
    mes = Number(brasileiro[2]);
    ano = Number(brasileiro[3]);
  } else if (iso) {
    ano = Number(iso[1]);
    mes = Number(iso[2]);
    dia = Number(iso[3]);
  } else {
    return null;
  }

  const data = new Date(Date.UTC(ano, mes - 1, dia));
  // Rejeita 31/02: o Date "conserta" a data e o mês deixa de bater.
  if (
    data.getUTCFullYear() !== ano ||
    data.getUTCMonth() !== mes - 1 ||
    data.getUTCDate() !== dia
  ) {
    return null;
  }

  const hoje = new Date();
  if (data.getTime() > hoje.getTime()) return null;
  if (ano < hoje.getFullYear() - 130) return null;

  return data;
}

export function formatarDataBR(data: Date): string {
  const dia = String(data.getUTCDate()).padStart(2, "0");
  const mes = String(data.getUTCMonth() + 1).padStart(2, "0");
  return `${dia}/${mes}/${data.getUTCFullYear()}`;
}

const UNIDADES_VALIDAS = ["gravatai", "cachoeirinha"] as const;
const TURNOS_VALIDOS = ["manha", "tarde", "noite", "sabado", "tanto_faz"] as const;

/**
 * Formato dos campos de texto da solicitação. O arquivo do pedido médico é
 * validado à parte, pelo conteúdo (ver lib/storage.ts).
 */
export const esquemaSolicitacao = z.object({
  exameSlug: z
    .string()
    .trim()
    .min(1, "Escolha o exame.")
    .max(80)
    .regex(/^[a-z0-9-]+$/, "Exame inválido."),

  /**
   * Id da variação escolhida no catálogo. Vazio quando o paciente entrou pela
   * página da modalidade, sem passar pela busca. Aqui só se confere o
   * formato; quem resolve o id e confere se ele é deste exame é o servidor.
   */
  catalogoId: z.string().trim().regex(/^[0-9]{0,9}$/, "Exame inválido."),

  pacienteNome: z
    .string()
    .trim()
    .min(5, "Escreva o nome completo do paciente.")
    .max(160, "Nome muito longo.")
    .refine((nome) => nome.split(/\s+/).length >= 2, "Informe nome e sobrenome."),

  cpf: z
    .string()
    .transform(somenteDigitos)
    .refine((cpf) => cpf.length === 11, "O CPF precisa ter 11 dígitos.")
    .refine(cpfValido, "Esse CPF não é válido. Confira os números."),

  dataNascimento: z
    .string()
    .trim()
    .refine((valor) => lerDataNascimento(valor) !== null, "Informe uma data no formato dd/mm/aaaa."),

  whatsapp: z
    .string()
    .transform(somenteDigitos)
    .refine(
      (numero) => numero.length === 10 || numero.length === 11,
      "Informe o WhatsApp com DDD, ex.: (51) 99999-9999.",
    ),

  /** `particular`, o nome do convênio, ou `outro`. */
  convenio: z.string().trim().min(1, "Escolha o convênio ou particular.").max(120),

  carteirinha: z.string().trim().max(60).optional().or(z.literal("")),

  unidade: z.enum(UNIDADES_VALIDAS, { message: "Escolha a unidade." }),

  turno: z.enum(TURNOS_VALIDOS, { message: "Escolha o turno de preferência." }),

  consentimento: z
    .string()
    .refine((valor) => valor === "true", "É preciso autorizar o tratamento dos dados."),
});

export type DadosSolicitacao = z.infer<typeof esquemaSolicitacao>;

/**
 * Regra que o zod sozinho não cobre: convênio escolhido pede carteirinha.
 * Retorna os erros por campo, no mesmo formato usado pelo formulário.
 */
export function validarCarteirinha(dados: {
  convenio: string;
  carteirinha?: string;
}): Record<string, string> {
  const ehParticular = dados.convenio === "particular";
  if (!ehParticular && !dados.carteirinha?.trim()) {
    return { carteirinha: "Informe o número da carteirinha do convênio." };
  }
  return {};
}
