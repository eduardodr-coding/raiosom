/**
 * Convênios atendidos.
 *
 * TODO: confirmar com a clínica a lista completa e o pareamento logo↔nome dos
 * 32 convênios. Os nomes abaixo vieram do Figma aprovado — são planos
 * plausíveis para a região, mas não há confirmação oficial da clínica, e
 * ninguém sabe qual arquivo de `public/convenios/` corresponde a qual nome.
 * Enquanto isso: a lista de nomes e a grade de logos são exibidas lado a lado,
 * sem afirmar que um é o outro.
 */

export const CONVENIOS_NOMES = [
  "Unimed",
  "IPÊ Saúde",
  "Bradesco",
  "Amil",
  "Cabergs",
  "SulAmérica",
  "IPERGS",
  "Doctor Clin",
  "GEAP",
  "Cassi",
] as const;

/** Quantos convênios existem além dos nomeados acima. */
export const CONVENIOS_OUTROS = 15;

export const CONVENIOS_TOTAL_LOGOS = 25;

/**
 * Arquivos em `public/convenios/`. A numeração original pula o 16 — a lista é
 * explícita justamente para não gerar um `src` de imagem que não existe.
 *
 * O 31 também fica de fora: o arquivo existe, mas é uma imagem em branco (só
 * fundo, sem logo nenhum). Ele continua em `public/` para ser substituído
 * assim que a clínica mandar a arte certa — aí é só devolver o número à lista.
 *
 * Fora da lista por descredenciamento (arquivo mantido caso volte):
 * 6 Biocare Vita · 13 Postal Saúde · 17 IPG · 19 LifeDay · 22 Porto Seguro.
 */
export const CONVENIOS_LOGOS: string[] = [
  1, 2, 3, 4, 5, 7, 8, 9, 10, 11, 12, 14, 15, 18, 20, 21, 23, 24, 25, 26, 27, 28, 29, 30, 32,
].map((numero) => `/convenios/${numero}.png`);

/** Opções do select de convênio no formulário de agendamento. */
export const OPCOES_COBERTURA = [
  { valor: "particular", rotulo: "Particular (sem convênio)" },
  ...CONVENIOS_NOMES.map((nome) => ({ valor: nome, rotulo: nome })),
  { valor: "outro", rotulo: "Outro convênio" },
];
