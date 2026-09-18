import { redirect } from "next/navigation";
import { lerSessao } from "@/lib/sessao";
import { FormularioLogin } from "./FormularioLogin";

export default async function PaginaLogin() {
  if (await lerSessao()) redirect("/painel");

  return (
    <div className="container">
      <div className="painel-login">
        <h1 style={{ fontSize: "var(--txt-xl)" }}>Painel da central</h1>
        <p style={{ marginTop: "var(--e-2)", color: "var(--texto-suave)", fontSize: "var(--txt-sm)" }}>
          Acesso restrito à equipe da Raio Som.
        </p>
        <FormularioLogin />
      </div>
    </div>
  );
}
