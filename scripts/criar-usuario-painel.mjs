/**
 * Cria (ou atualiza) um usuário do painel da central.
 *
 *   node scripts/criar-usuario-painel.mjs <usuario> "<Nome Completo>" <senha>
 *
 * A senha vai como argumento por simplicidade — rode no servidor, e lembre
 * que o histórico do shell guarda o comando. Trocar a senha depois é só rodar
 * de novo com o mesmo usuário.
 */
import "dotenv/config";
import { hash } from "bcryptjs";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "../lib/generated/prisma/client.js";

const [usuario, nome, senha] = process.argv.slice(2);

if (!usuario || !nome || !senha) {
  console.error(
    'Uso: node scripts/criar-usuario-painel.mjs <usuario> "<Nome Completo>" <senha>',
  );
  process.exit(1);
}

if (senha.length < 8) {
  console.error("A senha precisa ter ao menos 8 caracteres.");
  process.exit(1);
}

const prisma = new PrismaClient({
  adapter: new PrismaMariaDb(process.env.DATABASE_URL),
});

const senhaHash = await hash(senha, 12);

const registro = await prisma.usuarioPainel.upsert({
  where: { usuario },
  create: { usuario, nome, senhaHash },
  update: { nome, senhaHash, ativo: true },
});

console.log(`Usuário "${registro.usuario}" (${registro.nome}) pronto para acessar /painel.`);

await prisma.$disconnect();
