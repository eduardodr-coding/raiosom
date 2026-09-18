import "server-only";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "@/lib/generated/prisma/client";
import { databaseUrl } from "@/lib/env";

/**
 * Cliente Prisma único por processo.
 *
 * Em desenvolvimento o Next recarrega os módulos a cada alteração; sem o
 * cache no globalThis cada reload abriria um novo pool de conexões MySQL.
 */
const globalPrisma = globalThis as unknown as { prisma?: PrismaClient };

/** Limita o pool sem exigir que quem configura o .env lembre do parâmetro. */
function urlComPool(): string {
  const url = new URL(databaseUrl());
  if (!url.searchParams.has("connectionLimit")) {
    url.searchParams.set("connectionLimit", "5");
  }
  return url.toString();
}

function criarCliente(): PrismaClient {
  return new PrismaClient({
    adapter: new PrismaMariaDb(urlComPool()),
    // `warn`/`error` apenas: query log imprimiria CPF e demais dados do
    // paciente no log da aplicação, o que a LGPD não permite aqui.
    log: ["warn", "error"],
  });
}

export const prisma = globalPrisma.prisma ?? criarCliente();

if (process.env.NODE_ENV !== "production") {
  globalPrisma.prisma = prisma;
}
