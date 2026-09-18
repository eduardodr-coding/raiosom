"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { compare } from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { ipDaRequisicao, verificarLimite } from "@/lib/rate-limit";
import { criarSessao, encerrarSessao, lerSessao } from "@/lib/sessao";
import { headers } from "next/headers";

/** Server actions do painel: login, logout e mudança de status. */

const STATUS_VALIDOS = ["pendente", "em_atendimento", "confirmado", "cancelado"] as const;
type Status = (typeof STATUS_VALIDOS)[number];

export type EstadoLogin = { erro?: string };

export async function entrar(_anterior: EstadoLogin, form: FormData): Promise<EstadoLogin> {
  const usuario = String(form.get("usuario") ?? "").trim();
  const senha = String(form.get("senha") ?? "");

  if (!usuario || !senha) {
    return { erro: "Informe usuário e senha." };
  }

  // Trava tentativa de adivinhação de senha por força bruta.
  const ip = ipDaRequisicao(await headers());
  const limite = verificarLimite(`login:${ip}`, { maximo: 10, duracaoMs: 15 * 60 * 1000 });
  if (!limite.permitido) {
    return { erro: "Muitas tentativas. Aguarde alguns minutos e tente de novo." };
  }

  const registro = await prisma.usuarioPainel.findUnique({ where: { usuario } });

  // Mesma mensagem para usuário inexistente e senha errada: não entregamos
  // para quem tenta adivinhar quais usuários existem.
  const generico = { erro: "Usuário ou senha incorretos." };
  if (!registro || !registro.ativo) return generico;

  const confere = await compare(senha, registro.senhaHash);
  if (!confere) return generico;

  await prisma.usuarioPainel.update({
    where: { id: registro.id },
    data: { ultimoLoginEm: new Date() },
  });

  await criarSessao({
    usuarioId: registro.id,
    usuario: registro.usuario,
    nome: registro.nome,
  });

  redirect("/painel");
}

export async function sair(): Promise<void> {
  await encerrarSessao();
  redirect("/painel/login");
}

export async function mudarStatus(form: FormData): Promise<void> {
  const sessao = await lerSessao();
  if (!sessao) redirect("/painel/login");

  const protocolo = String(form.get("protocolo") ?? "");
  const status = String(form.get("status") ?? "");

  if (!STATUS_VALIDOS.includes(status as Status)) return;

  await prisma.solicitacao.update({
    where: { protocolo },
    data: { status: status as Status },
  });

  revalidatePath("/painel");
  revalidatePath(`/painel/${protocolo}`);
}
