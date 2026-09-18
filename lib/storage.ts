import "server-only";
import { randomUUID } from "node:crypto";
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { retencaoPedidoDias, uploadsDir } from "@/lib/env";
import { TAMANHO_MAX_BYTES } from "@/lib/upload-limites";

/**
 * Armazenamento do pedido médico.
 *
 * ── Por que este arquivo existe ──────────────────────────────────────────────
 * Todo acesso ao arquivo do pedido médico passa por aqui. No MVP a gravação é
 * em disco local, em um diretório FORA do webroot (`UPLOADS_DIR`), servido
 * apenas pela rota autenticada do painel. Para trocar por S3/Object Storage
 * basta reimplementar as quatro funções exportadas (`salvarPedidoMedico`,
 * `lerPedidoMedico`, `removerPedidoMedico`, `caminhoAbsoluto`) — nenhum outro
 * módulo toca em disco.
 *
 * ── LGPD: retenção ──────────────────────────────────────────────────────────
 * O pedido médico é dado pessoal sensível (saúde) e não deve ser guardado
 * indefinidamente. Política adotada: manter o arquivo por
 * `RETENCAO_PEDIDO_DIAS` (padrão 90) dias contados a partir do momento em que
 * a solicitação passa para `confirmado` ou `cancelado`; depois disso o arquivo
 * é apagado e a solicitação guarda apenas `arquivoExpurgoEm` como registro de
 * que existiu. Os dados cadastrais da solicitação (protocolo, exame, status)
 * permanecem para histórico de atendimento.
 *
 * O expurgo ainda NÃO roda sozinho: quem faz o trabalho é
 * `node scripts/expurgo-pedidos.mjs`, que precisa ser agendado no servidor
 * (cron no Linux, Agendador de Tarefas no Windows). Ver README.
 */

export type TipoArquivo = {
  mime: "image/jpeg" | "image/png" | "application/pdf";
  extensao: "jpg" | "png" | "pdf";
};

export type ArquivoSalvo = TipoArquivo & {
  /** Chave opaca no storage, ex.: `2026/09/9f6b…-… .jpg`. */
  chave: string;
  tamanho: number;
};

/** Chaves aceitas: AAAA/MM/<uuid>.<ext>. Barra a montagem de caminho pelo usuário. */
const CHAVE_VALIDA = /^\d{4}\/\d{2}\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.(jpg|png|pdf)$/;

function comecaCom(bytes: Uint8Array, assinatura: number[], deslocamento = 0): boolean {
  return assinatura.every((b, i) => bytes[deslocamento + i] === b);
}

/**
 * Descobre o tipo real pelo conteúdo (magic number), nunca pela extensão ou
 * pelo Content-Type que o navegador mandou — os dois são controlados por quem
 * envia. Retorna `null` quando o formato não é aceito.
 */
export function detectarTipo(bytes: Uint8Array): TipoArquivo | null {
  if (comecaCom(bytes, [0xff, 0xd8, 0xff])) {
    return { mime: "image/jpeg", extensao: "jpg" };
  }
  if (comecaCom(bytes, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) {
    return { mime: "image/png", extensao: "png" };
  }
  if (comecaCom(bytes, [0x25, 0x50, 0x44, 0x46, 0x2d])) {
    return { mime: "application/pdf", extensao: "pdf" };
  }
  return null;
}

/** HEIC/HEIF do iPhone: detectado só para dar uma mensagem de erro útil. */
export function pareceHeic(bytes: Uint8Array): boolean {
  if (!comecaCom(bytes, [0x66, 0x74, 0x79, 0x70], 4)) return false; // "ftyp" em 4..7
  const marca = new TextDecoder("latin1").decode(bytes.slice(8, 12));
  return ["heic", "heix", "hevc", "heim", "heis", "mif1", "msf1"].includes(marca);
}

function raiz(): string {
  return path.resolve(uploadsDir());
}

/** Caminho absoluto de uma chave, já validado contra path traversal. */
export function caminhoAbsoluto(chave: string): string {
  if (!CHAVE_VALIDA.test(chave)) {
    throw new Error("Chave de arquivo inválida.");
  }
  const destino = path.resolve(raiz(), chave);
  if (!destino.startsWith(raiz() + path.sep)) {
    throw new Error("Chave de arquivo fora do diretório de uploads.");
  }
  return destino;
}

/**
 * Grava o pedido médico com nome aleatório e devolve a chave do storage.
 * O nome enviado pelo usuário nunca é usado no disco.
 */
export async function salvarPedidoMedico(bytes: Uint8Array): Promise<ArquivoSalvo> {
  const tipo = detectarTipo(bytes);
  if (!tipo) {
    throw new Error("Formato de arquivo não aceito.");
  }
  if (bytes.byteLength > TAMANHO_MAX_BYTES) {
    throw new Error("Arquivo acima do tamanho máximo.");
  }

  const agora = new Date();
  const pasta = `${agora.getFullYear()}/${String(agora.getMonth() + 1).padStart(2, "0")}`;
  const chave = `${pasta}/${randomUUID()}.${tipo.extensao}`;

  const destino = caminhoAbsoluto(chave);
  await mkdir(path.dirname(destino), { recursive: true });
  await writeFile(destino, bytes, { mode: 0o600 });

  return { chave, tamanho: bytes.byteLength, ...tipo };
}

/** Lê o arquivo. Só deve ser chamado por rota autenticada do painel. */
export async function lerPedidoMedico(chave: string): Promise<Buffer> {
  return readFile(caminhoAbsoluto(chave));
}

/** Apaga o arquivo. Usado pelo expurgo de retenção (LGPD). */
export async function removerPedidoMedico(chave: string): Promise<void> {
  await rm(caminhoAbsoluto(chave), { force: true });
}

/** Data-corte do expurgo: solicitações finalizadas antes dela perdem o arquivo. */
export function dataCorteRetencao(referencia = new Date()): Date {
  const corte = new Date(referencia);
  corte.setDate(corte.getDate() - retencaoPedidoDias());
  return corte;
}
