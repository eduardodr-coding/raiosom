/**
 * Expurgo do pedido médico (LGPD).
 *
 *   node scripts/expurgo-pedidos.mjs [--simular]
 *
 * Apaga do disco o arquivo das solicitações já finalizadas (`confirmado` ou
 * `cancelado`) que foram atualizadas antes da data-corte — `RETENCAO_PEDIDO_DIAS`
 * dias atrás, 90 por padrão. A solicitação continua no banco para histórico
 * de atendimento; só o documento de saúde some, e a data do expurgo fica
 * registrada em `arquivoExpurgoEm`.
 *
 * O agendamento é responsabilidade do servidor (cron no Linux, Agendador de
 * Tarefas no Windows) — este script é só o trabalho em si. Rode com
 * `--simular` primeiro para ver quantos arquivos seriam apagados.
 */
import "dotenv/config";
import { rm } from "node:fs/promises";
import path from "node:path";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "../lib/generated/prisma/client.js";

const simular = process.argv.includes("--simular");

const dias = Number.parseInt(process.env.RETENCAO_PEDIDO_DIAS ?? "90", 10) || 90;
const raizUploads = path.resolve(process.env.UPLOADS_DIR ?? "./.uploads-dev");

const corte = new Date();
corte.setDate(corte.getDate() - dias);

const prisma = new PrismaClient({
  adapter: new PrismaMariaDb(process.env.DATABASE_URL),
});

const alvos = await prisma.solicitacao.findMany({
  where: {
    status: { in: ["confirmado", "cancelado"] },
    atualizadoEm: { lt: corte },
    arquivoExpurgoEm: null,
  },
  select: { id: true, protocolo: true, arquivoChave: true },
});

console.log(
  `Retenção de ${dias} dias · data-corte ${corte.toLocaleDateString("pt-BR")} · ${alvos.length} arquivo(s) a expurgar.`,
);

if (simular) {
  for (const alvo of alvos) console.log(`  [simulação] ${alvo.protocolo}`);
  await prisma.$disconnect();
  process.exit(0);
}

let removidos = 0;

for (const alvo of alvos) {
  const destino = path.resolve(raizUploads, alvo.arquivoChave);

  // Defesa contra chave adulterada no banco: nunca apagar fora da pasta.
  if (!destino.startsWith(raizUploads + path.sep)) {
    console.error(`  ${alvo.protocolo}: chave fora do diretório de uploads, ignorada.`);
    continue;
  }

  await rm(destino, { force: true });
  await prisma.solicitacao.update({
    where: { id: alvo.id },
    data: { arquivoExpurgoEm: new Date() },
  });
  removidos += 1;
}

console.log(`${removidos} arquivo(s) removido(s).`);

await prisma.$disconnect();
