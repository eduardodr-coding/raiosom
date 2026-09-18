"use client";

import { useEffect, useRef, type CSSProperties, type ElementType, type ReactNode } from "react";
import { cx } from "@/lib/cx";

export type RevelarProps = {
  children: ReactNode;
  /** Atraso em ms, para escalonar itens de uma mesma grade. */
  delay?: number;
  as?: ElementType;
  className?: string;
  style?: CSSProperties;
};

/**
 * Faz a seção aparecer (fade + 10px) quando entra na tela.
 *
 * IntersectionObserver em vez de uma biblioteca de animação: são 20 linhas e
 * não custa um bundle novo. O estado inicial invisível está no CSS
 * (`.revelar`), e quem prefere menos movimento já cai no `prefers-reduced-
 * motion` de base.css, que mostra tudo direto.
 *
 * O componente escreve o atributo direto no DOM em vez de guardar um estado
 * React: visibilidade aqui é efeito visual, não dado da aplicação — e assim
 * revelar uma seção não dispara uma nova renderização da árvore.
 */
export function Revelar({
  children,
  delay = 0,
  as: Tag = "div",
  className,
  style,
}: RevelarProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const elemento = ref.current;
    if (!elemento) return;

    const mostrar = () => elemento.setAttribute("data-visivel", "true");

    // Sem suporte ao observer: mostra sem animar, nunca esconde.
    if (typeof IntersectionObserver === "undefined") {
      mostrar();
      return;
    }

    // O que já está na tela na montagem é revelado no quadro seguinte, sem
    // depender do observer. Além de animar na entrada, isso garante que
    // conteúdo visível nunca dependa de um callback que pode não vir (aba em
    // segundo plano, impressão, captura de tela, leitor que não rola).
    if (elemento.getBoundingClientRect().top < window.innerHeight) {
      const quadro = requestAnimationFrame(mostrar);
      return () => cancelAnimationFrame(quadro);
    }

    const observador = new IntersectionObserver(
      ([entrada]) => {
        if (entrada.isIntersecting) {
          mostrar();
          observador.disconnect();
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.05 },
    );

    observador.observe(elemento);
    return () => observador.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      className={cx("revelar", className)}
      data-visivel="false"
      style={delay ? { ...style, transitionDelay: `${delay}ms` } : style}
    >
      {children}
    </Tag>
  );
}
