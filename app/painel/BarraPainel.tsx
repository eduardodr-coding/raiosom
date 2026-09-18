import Link from "next/link";
import { sair } from "./acoes";

export function BarraPainel({ nome }: { nome: string }) {
  return (
    <div className="painel-barra">
      <div className="container painel-barra__conteudo">
        <Link className="painel-barra__marca" href="/painel">
          Raio Som · Painel da central
        </Link>
        <div className="painel-barra__usuario">
          <span>{nome}</span>
          <form action={sair}>
            <button type="submit" className="btn btn--contorno-claro btn--pequeno">
              Sair
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
