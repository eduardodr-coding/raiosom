/**
 * Busca do preparo por exame.
 *
 * ── De onde vem o dado ──────────────────────────────────────────────────────
 * `public/dados/exames-preparos.json`, exportado do sistema da clínica (1447
 * exames). O arquivo é servido como asset estático e lido no navegador: para
 * corrigir o preparo de um exame basta trocar esse JSON no servidor — sem
 * mexer em código e sem refazer o build. O formato de cada registro é:
 *
 *   { exame, chaveBusca, temPreparo, preparo }
 *
 * ── A regra clínica que orienta este módulo ─────────────────────────────────
 * O paciente só pode ver o preparo do exame que ele mesmo selecionou. Nunca um
 * preparo aproximado, nunca um preparo genérico. O acervo tem dezenas de
 * variações quase idênticas (lateralidade, dedos, incidências, com/sem
 * contraste), e entregar a errada faz o paciente quebrar jejum, vir sem bexiga
 * cheia ou não suspender medicação — e perder o exame. Por isso a busca aqui
 * só filtra e ordena; quem escolhe é o paciente.
 */

export type ExamePreparo = {
  /** Nome oficial. É o que aparece na tela, com acento, como está no sistema. */
  exame: string;
  /** Nome normalizado (maiúsculas, sem acento). Chave da busca, única por registro. */
  chaveBusca: string;
  /** `false` quando o exame não exige preparo específico. */
  temPreparo: boolean;
  /** Texto literal do sistema, com quebras de linha em `\n`. Não reescrever. */
  preparo: string;
};

export const CAMINHO_DADOS = "/dados/exames-preparos.json";

/** A partir de quantos caracteres a busca começa a filtrar. */
export const MIN_CARACTERES = 2;

/**
 * Mesma normalização usada para gerar `chaveBusca` na extração — precisa ser
 * idêntica, senão o que o paciente digita nunca casa com a chave.
 */
export function normalizar(texto: string): string {
  return texto
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toUpperCase()
    .replace(/\s+/g, " ")
    .trim();
}

/** 0 = chave exata, 1 = começa com o termo, 2 = apenas contém. */
function relevancia(item: ExamePreparo, alvo: string): number {
  if (item.chaveBusca === alvo) return 0;
  if (item.chaveBusca.startsWith(alvo)) return 1;
  return 2;
}

export function buscarExames(dados: ExamePreparo[], termo: string): ExamePreparo[] {
  const alvo = normalizar(termo);
  if (alvo.length < MIN_CARACTERES) return [];

  return dados
    .filter((item) => item.chaveBusca.includes(alvo))
    .sort(
      (a, b) =>
        relevancia(a, alvo) - relevancia(b, alvo) ||
        a.exame.localeCompare(b.exame, "pt-BR"),
    );
}

export type BlocoPreparo =
  | { tipo: "titulo"; texto: string }
  | { tipo: "itens"; itens: string[] }
  | { tipo: "texto"; texto: string };

/**
 * Quebra o texto do preparo em blocos para exibição, preservando o conteúdo.
 * Só interpreta a formatação que o próprio texto já traz: linha iniciada por
 * `*` ou `-` é item de lista; linha terminada em `:` é um subtítulo
 * ("Recomendações:", "Observação:"). Nenhuma palavra é alterada.
 */
export function estruturarPreparo(preparo: string): BlocoPreparo[] {
  const blocos: BlocoPreparo[] = [];

  for (const linha of preparo.split("\n")) {
    const limpa = linha.trim();
    if (!limpa) continue;

    if (/^[*-]/.test(limpa)) {
      // Tira só os marcadores de lista (inclusive os `***` de ênfase do sistema).
      const texto = limpa.replace(/^[*\-\s]+/, "").replace(/[*\s]+$/, "").trim();
      if (!texto) continue;

      const ultimo = blocos.at(-1);
      if (ultimo?.tipo === "itens") ultimo.itens.push(texto);
      else blocos.push({ tipo: "itens", itens: [texto] });
      continue;
    }

    blocos.push(
      limpa.endsWith(":") ? { tipo: "titulo", texto: limpa } : { tipo: "texto", texto: limpa },
    );
  }

  return blocos;
}
