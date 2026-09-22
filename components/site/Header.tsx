"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { RedesSociais } from "@/components/site/RedesSociais";
import { CLINICA, UNIDADES } from "@/content/clinica";
import { ITENS_TRANSPARENCIA } from "@/content/transparencia";

const MENU = [
  { href: "/", rotulo: "Início" },
  { href: "/exames", rotulo: "Exames" },
  { href: "/preparos", rotulo: "Preparos" },
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
              <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor" aria-hidden="true">
                <path d="M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.02-.24c1.12.37 2.33.57 3.57.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.24.2 2.45.57 3.57a1 1 0 0 1-.25 1.02l-2.2 2.2Z" />
              </svg>
              {CLINICA.telefonePrincipal}
            </a>
            <span className="topbar__separador" aria-hidden="true" />
            {/* Horários da matriz, direto da fonte única, não repetir à mão aqui. */}
            <span className="topbar__horario">{UNIDADES[0].horarios.join(" · ")}</span>
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
            <span className="topbar__separador" aria-hidden="true" />
            <RedesSociais className="topbar__redes" />
          </div>
        </div>
      </div>

      <header className="cabecalho" data-rolado={rolado}>
        <div className="container cabecalho__conteudo">
          <Link className="marca" href="/" aria-label={`${CLINICA.nome}, página inicial`}>
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

            {/* Submenu só com CSS (:hover + :focus-within): abre no mouse e
                também quando o teclado entra no grupo, sem depender de JS. O
                próprio "Transparência" é link, então quem navega por teclado
                ou toque chega ao índice sem precisar abrir o menu. */}
            <div className="nav__grupo">
              <Link
                href="/transparencia"
                className="nav__link nav__link--menu"
                aria-current={ehAtual("/transparencia") ? "page" : undefined}
              >
                Transparência
                <span className="nav__seta" aria-hidden="true">
                  ▾
                </span>
              </Link>
              <div className="nav__submenu">
                {ITENS_TRANSPARENCIA.map((item) => (
                  <Link key={item.slug} href={item.href} className="nav__submenu-link">
                    {item.titulo}
                  </Link>
                ))}
              </div>
            </div>
          </nav>

          <div className="cabecalho__acoes">
            <Button href={CLINICA.links.portalResultados} external variant="contorno">
              Meus resultados
            </Button>
            <Button href="/agendar">Agendar exame</Button>
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
              {/* No celular não existe hover: o submenu vira uma lista aberta. */}
              <li>
                <Link
                  href="/transparencia"
                  className="menu-mobile__link"
                  aria-current={ehAtual("/transparencia") ? "page" : undefined}
                >
                  Transparência
                </Link>
              </li>
              {ITENS_TRANSPARENCIA.map((item) => (
                <li key={item.slug}>
                  <Link href={item.href} className="menu-mobile__link menu-mobile__link--sub">
                    {item.titulo}
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
              <Button href="/agendar" block>
                Agendar exame
              </Button>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
