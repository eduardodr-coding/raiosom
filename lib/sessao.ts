import "server-only";
import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import { sessionSecret } from "./env";

/**
 * Sessão do painel interno.
 *
 * Cookie httpOnly assinado (JWT HS256). httpOnly porque nenhum JavaScript da
 * página tem motivo para ler esta sessão — e, se um script de terceiro entrar
 * no site um dia, ele não leva junto o acesso aos dados dos pacientes.
 */

const COOKIE = "raiosom_painel";
const DURACAO_HORAS = 8;

export type Sessao = {
  usuarioId: number;
  usuario: string;
  nome: string;
};

export async function criarSessao(sessao: Sessao): Promise<void> {
  const token = await new SignJWT({ ...sessao })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${DURACAO_HORAS}h`)
    .sign(sessionSecret());

  const store = await cookies();
  store.set(COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    // Em produção o painel simplesmente não loga sem HTTPS — é de propósito.
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: DURACAO_HORAS * 60 * 60,
  });
}

export async function encerrarSessao(): Promise<void> {
  const store = await cookies();
  store.delete(COOKIE);
}

/** Sessão atual, ou `null` se não houver cookie válido. */
export async function lerSessao(): Promise<Sessao | null> {
  const store = await cookies();
  const token = store.get(COOKIE)?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, sessionSecret());
    if (typeof payload.usuarioId !== "number") return null;
    return {
      usuarioId: payload.usuarioId,
      usuario: String(payload.usuario ?? ""),
      nome: String(payload.nome ?? ""),
    };
  } catch {
    // Token expirado, adulterado ou assinado com outro segredo.
    return null;
  }
}
