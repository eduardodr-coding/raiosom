import Image from "next/image";
import Link from "next/link";
import { CLINICA } from "@/content/clinica";

import "@/styles/agendamento.css";

/**
 * Casca do fluxo de agendamento.
 *
 * Sem menu e sem rodapé de navegação: a única saída aqui é concluir a
 * solicitação ou ligar para a central. O telefone fica visível porque parte
 * dos pacientes prefere resolver por voz — e desistir do formulário para ligar
 * é um resultado bom, melhor do que abandonar sem contato nenhum.
 */
export default function FluxoLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a className="pular-conteudo" href="#conteudo">
        Pular para o conteúdo
      </a>

      <header className="cabecalho" data-rolado="false">
        <div className="container fluxo-topo">
          <Link className="marca" href="/" aria-label={`${CLINICA.nome} — página inicial`}>
            <span className="marca__logo">
              <Image
                src="/marca/logo.png"
                alt="Raio Som Diagnóstico por Imagem"
                width={755}
                height={142}
                priority
                sizes="400px"
              />
            </span>
            <span className="marca__sub">Solicitação de agendamento</span>
          </Link>

          <p className="fluxo-topo__ajuda">
            <span>Prefere falar agora?</span>
            <a className="fluxo-topo__telefone" href={CLINICA.telefoneLink}>
              {CLINICA.telefonePrincipal}
            </a>
          </p>
        </div>
      </header>

      <main id="conteudo">{children}</main>

      <footer className="rodape" style={{ paddingTop: "var(--e-10)" }}>
        <div className="container">
          <div className="rodape__base" style={{ marginTop: 0, borderTop: 0 }}>
            <p>
              © {new Date().getFullYear()} {CLINICA.nomeCompleto}
            </p>
            <p>
              <Link href="/politica-de-privacidade">Política de Privacidade · LGPD</Link>
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
