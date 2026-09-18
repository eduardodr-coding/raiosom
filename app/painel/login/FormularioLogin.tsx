"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { entrar, type EstadoLogin } from "../acoes";

export function FormularioLogin() {
  const [estado, acao, pendente] = useActionState<EstadoLogin, FormData>(entrar, {});

  return (
    <form action={acao}>
      <div className="painel-login__campos">
        <Input label="Usuário" name="usuario" autoComplete="username" required />
        <Input
          label="Senha"
          name="senha"
          type="password"
          autoComplete="current-password"
          required
        />
        {estado.erro && (
          <p className="campo__erro" role="alert">
            <span aria-hidden="true">⚠</span>
            {estado.erro}
          </p>
        )}
        <Button type="submit" block loading={pendente}>
          Entrar
        </Button>
      </div>
    </form>
  );
}
