/**
 * Transparência institucional.
 *
 * Começa com o Relatório de Transparência e Igualdade Salarial, cuja
 * divulgação em canal público é exigida pela Lei 14.611/2023 para empresas
 * com 100 ou mais empregados. Os números abaixo são transcritos do relatório
 * oficial gerado pelo MTE — nada aqui é calculado ou estimado pelo site, e o
 * PDF original fica disponível para download ao lado da versão em texto.
 *
 * A versão em HTML existe porque um PDF sozinho não é acessível a leitor de
 * tela nem indexável, e a lei fala em divulgação "em sítio eletrônico".
 */

export type RazaoOcupacional = {
  grupo: string;
  /** Razão M/H da remuneração mensal média, em %. `null` = sem cálculo. */
  remuneracaoMedia: number | null;
  /** Razão M/H do salário contratual mediano, em %. `null` = sem cálculo. */
  salarioMediano: number | null;
};

export const IGUALDADE_SALARIAL = {
  titulo: "Relatório de Transparência e Igualdade Salarial de Mulheres e Homens",
  periodo: "2º Semestre 2026",
  cnpj: "87.891.503/0001-82",
  dataBase: "30/06/2026",
  trabalhadoresAtivos: 106,

  /** Razão M/H: quanto a remuneração das mulheres equivale à dos homens, em %. */
  salarioContratualMediano: 71.8,
  remuneracaoMensalMedia: 95.0,

  composicaoPorSexo: [
    { rotulo: "Mulheres", percentual: 77.4 },
    { rotulo: "Homens", percentual: 22.6 },
  ],

  composicaoPorSexoERaca: [
    { rotulo: "Mulheres não negras", percentual: 66.0 },
    { rotulo: "Mulheres negras", percentual: 11.3 },
    { rotulo: "Homens não negros", percentual: 20.8 },
    { rotulo: "Homens negros", percentual: 1.9 },
  ],

  /**
   * Grupos sem percentual aparecem como "não calculado" de propósito: o
   * relatório oficial omite o cálculo quando o grupo tem menos de três
   * mulheres ou menos de três homens, para não permitir identificar pessoas.
   */
  porGrupoOcupacional: [
    { grupo: "Dirigentes e gerentes", remuneracaoMedia: null, salarioMediano: null },
    {
      grupo: "Profissionais em ocupações de nível superior",
      remuneracaoMedia: null,
      salarioMediano: null,
    },
    { grupo: "Técnicos de nível médio", remuneracaoMedia: 94.6, salarioMediano: 100.0 },
    {
      grupo: "Trabalhadores de serviços administrativos",
      remuneracaoMedia: 127.9,
      salarioMediano: 100.0,
    },
    {
      grupo: "Trabalhadores em atividades operacionais",
      remuneracaoMedia: null,
      salarioMediano: null,
    },
  ] as RazaoOcupacional[],

  motivosSemCalculo: [
    "por ter menos de três mulheres no grupo;",
    "por ter menos de três homens no grupo;",
    "por não ter mulheres no grupo;",
    "por não ter homens no grupo;",
    "por não ter três homens nem três mulheres naquele grupo ocupacional;",
    "por não ter nem homens nem mulheres naquele grupo ocupacional.",
  ],

  /**
   * Transcrição literal do campo do relatório oficial. A clínica não respondeu
   * ao questionário do MTE neste semestre — publicar outra coisa aqui seria
   * divergir do documento público.
   */
  criteriosEDiversidade: "Questionário não respondido pelo CNPJ informado.",

  fonte: "MTE – eSocial, RAIS Mensal (junho/2026) e Portal Emprega Brasil (agosto/2026).",
  nota: "Os vínculos ativos correspondem à competência de junho de 2026, enquanto as remunerações consideram o período de julho de 2025 a junho de 2026. As demais informações complementares foram coletadas em agosto de 2026.",

  pdf: "/transparencia/relatorio-igualdade-salarial-2026-2s.pdf",
} as const;

export type ItemTransparencia = {
  slug: string;
  titulo: string;
  resumo: string;
  href: string;
};

/** Itens do menu Transparência. Por enquanto só o relatório salarial. */
export const ITENS_TRANSPARENCIA: ItemTransparencia[] = [
  {
    slug: "igualdade-salarial",
    titulo: "Relatório de Igualdade Salarial",
    resumo:
      "Divulgação semestral exigida pela Lei 14.611/2023, com a comparação de salários entre mulheres e homens.",
    href: "/transparencia/igualdade-salarial",
  },
];
