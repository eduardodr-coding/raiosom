/**
 * Busca no catálogo de exames da clínica.
 *
 * Os dados saem de `data/*.csv` (editados pela clínica) e viram JSON pelo
 * `scripts/gerar-catalogo.mjs`. Aqui só se lê o JSON gerado, nunca o CSV.
 *
 * São 844 exames em 346 grupos. Cabe na memória do processo, então a busca
 * roda no servidor a cada request, sem banco e sem índice externo: o form de
 * `/exames` é um GET puro, o resultado é uma URL compartilhável e a página
 * funciona sem JavaScript.
 *
 * O paciente procura pelo nome que está no pedido médico, que raramente é o
 * nome do sistema da clínica. Daí as duas etapas antes de filtrar: sinônimos
 * (ultrassom vira ECO) e casamento por palavra, não por frase, para que
 * "ressonancia joelho" e "joelho rm" achem a mesma coisa.
 */

import catalogoJson from "@/content/catalogo/catalogo-exames.json";
import sinonimosJson from "@/content/catalogo/sinonimos.json";

export type ExameCatalogo = {
  id: number;
  /**
   * Códigos do sistema da clínica. Nunca vão para a tela do paciente.
   *
   * São vários quando a clínica fundiu linhas que ficaram idênticas para quem
   * olha de fora. O agendamento usa o primeiro; a central vê todos na ficha.
   */
  codigos: string[];
  /** Nome do grupo exibido na busca, por exemplo "RM Joelho". */
  nomePaciente: string;
  modalidade: string;
  regiao: string | null;
  /** Já em texto ("Com contraste"), não no código do sistema. */
  contraste: string | null;
  lado: string | null;
  detalhe: string | null;
  convenio: string | null;
};

export type GrupoExame = {
  slug: string;
  nome: string;
  modalidade: string;
  variacoes: ExameCatalogo[];
};

export const CATALOGO = catalogoJson as ExameCatalogo[];

/**
 * Normaliza para comparar: sem acento, sem caixa, sem pontuação.
 *
 * A pontuação vira espaço em vez de sumir, senão "Angio-TC Crânio" viraria
 * "angiotc cranio" e quem digitasse "tc" não acharia.
 */
export function normalizar(texto: string): string {
  return texto
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function palavras(texto: string): string[] {
  const limpo = normalizar(texto);
  return limpo ? limpo.split(" ") : [];
}

/**
 * Conectivos que o paciente digita mas que não existem no catálogo.
 *
 * Sem isso, "ressonância de joelho" não acharia nada: o "de" viraria uma
 * palavra obrigatória que nenhum exame tem.
 */
const PALAVRAS_IGNORADAS = new Set([
  "a", "as", "ao", "aos", "com", "da", "das", "de", "do", "dos", "e", "em",
  "na", "nas", "no", "nos", "o", "os", "para", "por", "pra", "sem",
]);

// ── Sinônimos ─────────────────────────────────────────────────────────────

type Sinonimo = { termo: string; canonico: string; tipo: string };

/** termo normalizado -> palavras do canônico, já normalizadas. */
const SINONIMOS = new Map<string, string[]>();
let maiorSinonimo = 1;

for (const { termo, canonico } of sinonimosJson as Sinonimo[]) {
  const chave = normalizar(termo);
  SINONIMOS.set(chave, palavras(canonico));
  maiorSinonimo = Math.max(maiorSinonimo, chave.split(" ").length);
}

/**
 * Troca os termos do paciente pelos canônicos do catálogo.
 *
 * Tenta sempre a sequência mais longa primeiro, senão "ressonancia magnetica"
 * seria consumido por "ressonancia" e sobraria um "magnetica" órfão que
 * nenhum exame tem. Como só casa sequência inteira de palavras, "us" nunca
 * casa dentro de "musculo".
 */
export function expandirSinonimos(entrada: string[]): string[] {
  const saida: string[] = [];

  for (let i = 0; i < entrada.length; ) {
    let casou = false;

    for (let n = Math.min(maiorSinonimo, entrada.length - i); n >= 1; n -= 1) {
      const canonico = SINONIMOS.get(entrada.slice(i, i + n).join(" "));
      if (canonico) {
        saida.push(...canonico);
        i += n;
        casou = true;
        break;
      }
    }

    if (!casou) {
      saida.push(entrada[i]);
      i += 1;
    }
  }

  return saida;
}

// ── Índice ────────────────────────────────────────────────────────────────

/**
 * Palavras pesquisáveis de cada exame.
 *
 * Os códigos internos entram porque são o que está escrito em muitos pedidos
 * médicos ("ABDOMINAL TOTAL"), mesmo sem nunca aparecerem na tela.
 */
const INDICE = new Map<number, string[]>(
  CATALOGO.map((exame) => [
    exame.id,
    [
      ...new Set(
        palavras(
          [
            exame.nomePaciente,
            exame.modalidade,
            exame.regiao,
            exame.detalhe,
            exame.codigos.join(" "),
          ]
            .filter(Boolean)
            .join(" "),
        ),
      ),
    ],
  ]),
);

/** Casa por início de palavra: "joelh" acha joelho, "us" não acha musculo. */
function exameCasa(exame: ExameCatalogo, termos: string[]): boolean {
  const indice = INDICE.get(exame.id) ?? [];
  return termos.every((termo) => indice.some((palavra) => palavra.startsWith(termo)));
}

// ── Grupos ────────────────────────────────────────────────────────────────

export function slugDoGrupo(nomePaciente: string): string {
  return normalizar(nomePaciente).replace(/ /g, "-");
}

const GRUPOS = new Map<string, GrupoExame>();

for (const exame of CATALOGO) {
  const slug = slugDoGrupo(exame.nomePaciente);
  const grupo = GRUPOS.get(slug);
  if (grupo) {
    grupo.variacoes.push(exame);
  } else {
    GRUPOS.set(slug, {
      slug,
      nome: exame.nomePaciente,
      modalidade: exame.modalidade,
      variacoes: [exame],
    });
  }
}

export const TOTAL_GRUPOS = GRUPOS.size;
export const TOTAL_EXAMES = CATALOGO.length;

export function grupoPorSlug(slug: string): GrupoExame | undefined {
  return GRUPOS.get(slug);
}

const POR_ID = new Map<number, ExameCatalogo>(CATALOGO.map((exame) => [exame.id, exame]));

/**
 * A variação escolhida, pelo id que veio na URL do agendamento.
 *
 * É o id que viaja, não o nome interno: o paciente vê a própria URL, e o nome
 * interno não pode aparecer para ele. `null` quando o id não existe mais,
 * o que acontece se a clínica regerar o catálogo com o link já aberto.
 */
export function exameDoCatalogo(id: number): ExameCatalogo | null {
  return POR_ID.get(id) ?? null;
}

/**
 * Ordena como o paciente espera: o que começa com o que ele digitou primeiro.
 *
 * Quem procura "joelho" quer "ECO Joelho" antes de "ECO Doppler Joelho".
 */
function ordenar(grupos: GrupoExame[], alvo: string): GrupoExame[] {
  function posicao(grupo: GrupoExame): number {
    const nome = normalizar(grupo.nome);
    if (alvo && nome.startsWith(alvo)) return 0;
    if (alvo && nome.includes(alvo)) return 1;
    return 2;
  }

  return grupos.sort(
    (a, b) => posicao(a) - posicao(b) || a.nome.localeCompare(b.nome, "pt-BR"),
  );
}

/**
 * Busca grupos pelo texto digitado. Termo vazio devolve o catálogo inteiro.
 */
export function buscarGrupos(termo: string): GrupoExame[] {
  const alvo = normalizar(termo);
  if (!alvo) return ordenar([...GRUPOS.values()], "");

  const termos = expandirSinonimos(palavras(alvo)).filter(
    (palavra) => !PALAVRAS_IGNORADAS.has(palavra),
  );
  if (termos.length === 0) return [];

  const encontrados = new Set<string>();
  for (const exame of CATALOGO) {
    if (exameCasa(exame, termos)) encontrados.add(slugDoGrupo(exame.nomePaciente));
  }

  const grupos: GrupoExame[] = [];
  for (const slug of encontrados) {
    const grupo = GRUPOS.get(slug);
    if (grupo) grupos.push(grupo);
  }

  return ordenar(grupos, alvo);
}

/**
 * Descreve a variação para o paciente escolher a que está no pedido médico.
 * Campos vazios não entram: "Com contraste · Direito", nunca "· ·".
 */
export function descreverVariacao(exame: ExameCatalogo): string {
  const partes = [exame.contraste, exame.lado, exame.detalhe].filter(Boolean);
  return partes.join(" · ");
}

/** Nome completo da variação para o paciente: "RM Joelho · Com contraste". */
export function rotuloVariacao(exame: ExameCatalogo): string {
  const detalhe = descreverVariacao(exame);
  return detalhe ? `${exame.nomePaciente} · ${detalhe}` : exame.nomePaciente;
}

/**
 * O código que vai para o agendamento.
 *
 * Quando a linha tem mais de um, vai o primeiro. Não é escolha definitiva: são
 * 274 linhas em que a clínica ainda precisa dizer qual código cobrar, e é por
 * isso que a ficha do painel mostra a lista inteira em vez de esconder a
 * decisão atrás deste `[0]`.
 */
export function codigoDoAgendamento(exame: ExameCatalogo): string {
  return exame.codigos[0] ?? "";
}

// ── Escolha da variação, em duas etapas ───────────────────────────────────

/** O que diferencia uma variação da outra, na ordem em que se pergunta. */
export type CampoVariacao = "regiao" | "lado" | "contraste" | "detalhe" | "convenio";

export type OpcaoVariacao = { valor: string; rotulo: string };

export type SeletorVariacao = {
  campo: CampoVariacao;
  titulo: string;
  opcoes: OpcaoVariacao[];
};

/** Vai na URL onde o campo é vazio: "" não se distingue de "não escolhido". */
export const SEM_VALOR = "nao-informado";

const TITULOS: Record<CampoVariacao, string> = {
  regiao: "Qual região?",
  lado: "Qual lado?",
  contraste: "Com ou sem contraste?",
  detalhe: "Qual destas opções?",
  convenio: "Convênio",
};

/**
 * Como chamar a linha em que o campo está vazio.
 *
 * O "não sei" do contraste não é enfeite: boa parte dos pedidos médicos não
 * diz se é com ou sem, e o paciente não pode travar o agendamento por isso.
 */
const ROTULOS_VAZIO: Record<CampoVariacao, string> = {
  regiao: "Não informada no pedido",
  lado: "Não informado no pedido",
  contraste: "Não sei / não informado no pedido",
  detalhe: "Exame padrão",
  convenio: "Qualquer convênio",
};

/** Ordem natural de leitura; o que não estiver aqui sai em ordem alfabética. */
const ORDEM_FIXA: Partial<Record<CampoVariacao, string[]>> = {
  lado: ["Direito", "Esquerdo", "Bilateral", "Unilateral"],
  contraste: ["Com contraste", "Sem contraste"],
};

function valorDoCampo(exame: ExameCatalogo, campo: CampoVariacao): string | null {
  if (campo === "regiao") return exame.regiao;
  if (campo === "lado") return exame.lado;
  if (campo === "contraste") return exame.contraste;
  if (campo === "detalhe") return exame.detalhe;
  return exame.convenio;
}

function chaveNaUrl(bruto: string | null): string {
  return bruto ? slugDoGrupo(bruto) : SEM_VALOR;
}

/**
 * As opções de um campo entre as variações que sobraram.
 *
 * `null` quando o campo tem um valor só: aí ele não separa nada e não vira
 * pergunta. O Map por chave também garante o critério de aceite de não existir
 * duas entradas com o mesmo texto na tela.
 */
function montarSeletor(
  variacoes: ExameCatalogo[],
  campo: CampoVariacao,
): SeletorVariacao | null {
  const porChave = new Map<string, string>();
  for (const exame of variacoes) {
    const bruto = valorDoCampo(exame, campo);
    porChave.set(chaveNaUrl(bruto), bruto ?? ROTULOS_VAZIO[campo]);
  }

  if (porChave.size < 2) return null;

  const fixa = ORDEM_FIXA[campo] ?? [];
  const posicao = (rotulo: string) => {
    const indice = fixa.indexOf(rotulo);
    return indice === -1 ? fixa.length : indice;
  };

  const opcoes = [...porChave.entries()]
    .map(([valor, rotulo]) => ({ valor, rotulo }))
    .sort((a, b) => {
      // O "não sei" fecha a lista: é saída, não primeira escolha.
      if (a.valor === SEM_VALOR) return 1;
      if (b.valor === SEM_VALOR) return -1;
      return (
        posicao(a.rotulo) - posicao(b.rotulo) ||
        a.rotulo.localeCompare(b.rotulo, "pt-BR")
      );
    });

  return { campo, titulo: TITULOS[campo], opcoes };
}

export type RefinoGrupo = {
  /** Etapa 1. Só existe quando o grupo cobre mais de uma região. */
  regiao: SeletorVariacao | null;
  /** Etapa 2. Vazio quando não sobrou nada para perguntar. */
  seletores: SeletorVariacao[];
  /** A variação final, quando tudo que precisava ser respondido foi. */
  escolhido: ExameCatalogo | null;
};

const DEPOIS_DA_REGIAO: CampoVariacao[] = ["lado", "contraste", "detalhe", "convenio"];

/**
 * Reduz o grupo até uma variação só.
 *
 * A tela antiga despejava as 20 variações de "RM Dedo da Mão" de uma vez, com
 * texto repetido. Aqui só vira pergunta o campo que de fato separa as linhas
 * que sobraram: um campo com um valor só se resolve sozinho, sem ocupar a
 * tela, e por isso a maioria dos grupos cai direto no resultado.
 */
export function refinarGrupo(
  grupo: GrupoExame,
  escolhas: Partial<Record<CampoVariacao, string>>,
): RefinoGrupo {
  const regiao = montarSeletor(grupo.variacoes, "regiao");
  let restantes = grupo.variacoes;

  if (regiao) {
    const filtradas = restantes.filter(
      (exame) => chaveNaUrl(exame.regiao) === escolhas.regiao,
    );
    // Sem região escolhida a etapa 2 nem é montada: ela depende da região.
    if (filtradas.length === 0) return { regiao, seletores: [], escolhido: null };
    restantes = filtradas;
  }

  const seletores: SeletorVariacao[] = [];
  let falta = false;

  for (const campo of DEPOIS_DA_REGIAO) {
    const seletor = montarSeletor(restantes, campo);
    if (!seletor) continue;
    seletores.push(seletor);

    const escolhido = escolhas[campo];
    // Valor fora das opções acontece quando o paciente troca uma resposta
    // anterior e a lista muda: a pergunta volta, em vez de filtrar por nada.
    if (!escolhido || !seletor.opcoes.some((opcao) => opcao.valor === escolhido)) {
      falta = true;
      continue;
    }

    restantes = restantes.filter(
      (exame) => chaveNaUrl(valorDoCampo(exame, campo)) === escolhido,
    );
  }

  return {
    regiao,
    seletores,
    escolhido: !falta && restantes.length === 1 ? restantes[0] : null,
  };
}

// ── Ponte com as páginas de modalidade ────────────────────────────────────

/**
 * De qual página de exame cada modalidade do catálogo é filha.
 *
 * O catálogo diz o que a clínica realiza; as 8 páginas de `content/exames.ts`
 * é que trazem as orientações de comparecimento e o formulário. Sem esta ponte, quem
 * chegasse pela busca não teria como agendar.
 */
const PAGINA_POR_MODALIDADE: Record<string, string> = {
  RM: "ressonancia-magnetica",
  TC: "tomografia-computadorizada",
  ECO: "ultrassonografia",
  RX: "raios-x-digital",
  MAMOGRAFIA: "mamografia",
  DENSITOMETRIA: "densitometria-ossea",
  ODONTOLOGIA: "radiografia-odontologica",
  BIOPSIA: "biopsia-puncao",
};

/**
 * `null` quando não existe página para a modalidade: aí o grupo manda o
 * paciente para o WhatsApp, em vez de chutar uma página parecida.
 */
export function paginaDoExame(exame: {
  nomePaciente: string;
  modalidade: string;
}): string | null {
  // O ecocardiograma sai do sistema como ECO, mas é exame cardiológico: quem
  // procura por ele tem que cair na página do coração, não na de ultrassom.
  if (exame.nomePaciente.startsWith("Ecocardiograma")) return "exames-cardiologicos";
  return PAGINA_POR_MODALIDADE[exame.modalidade] ?? null;
}

export function paginaDoGrupo(grupo: GrupoExame): string | null {
  return paginaDoExame({ nomePaciente: grupo.nome, modalidade: grupo.modalidade });
}
