"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { RedesSociais } from "@/components/site/RedesSociais";
import { CLINICA } from "@/content/clinica";

const MENU = [
  { href: "/", rotulo: "Início" },
  { href: "/exames", rotulo: "Exames" },
  { href: "/convenios", rotulo: "Convênios" },
  { href: "/unidades", rotulo: "Unidades" },
  { href: "/sobre", rotulo: "A Clínica" },
];

export function Header() {
  const caminho = usePathname();
  const [rolado, setRolado] = useState(false);
  const [menuAberto, setMenuAberto] = useState(false);

  useEffect(() => {
    const aoRolar = () => setRolado(window.scrollY > 8);
    aoRolar();
    window.addEventListener("scroll", aoRolar, { passive: true });
    return () => window.removeEventListener("scroll", aoRolar);
  }, []);

  const ehAtual = (href: string) =>
    href === "/" ? caminho === "/" : caminho.startsWith(href);

  return (
    <>
      <div className="topbar">
        <div className="container topbar__conteudo">
          <div className="topbar__grupo">
            <a className="topbar__telefone" href={CLINICA.telefoneLink}>
              {CLINICA.telefonePrincipal}
            </a>
          </div>
          <div className="topbar__grupo topbar__grupo--links">
            <a
              className="topbar__destaque"
              href={CLINICA.links.portalResultados}
              target="_blank"
              rel="noopener noreferrer"
            >
              Portal de Resultados
            </a>
            <Link href="/trabalhe-conosco">Trabalhe Conosco</Link>
            <RedesSociais className="topbar__redes" />
          </div>
        </div>
      </div>

      <header className="cabecalho" data-rolado={rolado}>
        <div className="container cabecalho__conteudo">
          <Link className="marca" href="/" aria-label={`${CLINICA.nome} — página inicial`}>
            <span className="marca__logo">
              <Image
                src="/marca/logo.png"
                alt="Raio Som Diagnóstico por Imagem · 50 anos"
                width={755}
                height={142}
                priority
                sizes="400px"
              />
            </span>
          </Link>

          <nav className="nav" aria-label="Navegação principal">
            {MENU.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="nav__link"
                aria-current={ehAtual(item.href) ? "page" : undefined}
              >
                {item.rotulo}
              </Link>
            ))}
          </nav>

          <div className="cabecalho__acoes">
            <Button href={CLINICA.links.portalResultados} external variant="contorno">
              Meus resultados
            </Button>
            <Button href="/exames">Agendar exame</Button>
          </div>

          <button
            type="button"
            className="menu-botao"
            aria-expanded={menuAberto}
            aria-controls="menu-mobile"
            onClick={() => setMenuAberto((aberto) => !aberto)}
          >
            <span className="sr-only">{menuAberto ? "Fechar menu" : "Abrir menu"}</span>
            <span className="menu-botao__barra" aria-hidden="true" />
            <span className="menu-botao__barra" aria-hidden="true" />
            <span className="menu-botao__barra" aria-hidden="true" />
          </button>
        </div>

        <div
          className="menu-mobile"
          id="menu-mobile"
          data-aberto={menuAberto}
          /* Fecha ao navegar: sem isso o painel ficaria aberto na página nova. */
          onClick={() => setMenuAberto(false)}
        >
          <div className="container">
            <ul className="menu-mobile__lista">
              {MENU.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="menu-mobile__link"
                    aria-current={ehAtual(item.href) ? "page" : undefined}
                  >
                    {item.rotulo}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/trabalhe-conosco" className="menu-mobile__link">
                  Trabalhe Conosco
                </Link>
              </li>
            </ul>
            <div className="menu-mobile__acoes">
              <Button href={CLINICA.links.portalResultados} external variant="contorno" block>
                Meus resultados
              </Button>
              <Button href="/exames" block>
                Agendar exame
              </Button>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
