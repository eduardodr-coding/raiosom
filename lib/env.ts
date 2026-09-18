import "server-only";

/**
 * Leitura centralizada das variáveis de ambiente do servidor.
 *
 * Nada aqui pode vazar para o client: o módulo é marcado com `server-only`,
 * então um import acidental em componente de client quebra o build em vez de
 * embutir segredo no bundle.
 */

function obrigatoria(nome: string): string {
  const valor = process.env[nome];
  if (!valor || valor.trim() === "") {
    throw new Error(
      `Variável de ambiente ${nome} não definida. Copie .env.example para .env e preencha.`,
    );
  }
  return valor;
}

export function databaseUrl(): string {
  return obrigatoria("DATABASE_URL");
}

export function uploadsDir(): string {
  return obrigatoria("UPLOADS_DIR");
}

export function sessionSecret(): Uint8Array {
  const segredo = obrigatoria("SESSION_SECRET");
  if (segredo.length < 32) {
    throw new Error("SESSION_SECRET precisa ter ao menos 32 caracteres.");
  }
  return new TextEncoder().encode(segredo);
}

/** Dias de retenção do arquivo do pedido médico. Ver lib/storage.ts. */
export function retencaoPedidoDias(): number {
  const bruto = process.env.RETENCAO_PEDIDO_DIAS;
  const dias = bruto ? Number.parseInt(bruto, 10) : 90;
  return Number.isFinite(dias) && dias > 0 ? dias : 90;
}
