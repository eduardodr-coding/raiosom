import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { IconeRede } from "@/components/ui/icones";
import { cx } from "@/lib/cx";

export type ButtonVariant =
  | "primario"
  | "contorno"
  | "contorno-claro"
  | "whatsapp"
  | "fantasma"
  | "claro";

export type ButtonSize = "pequeno" | "normal" | "grande";

type Comum = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Ocupa toda a largura disponível. */
  block?: boolean;
  children: ReactNode;
  className?: string;
};

type ComoBotao = Comum &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className"> & {
    href?: undefined;
    /** Troca o conteúdo por um spinner e desabilita o clique. */
    loading?: boolean;
  };

type ComoLink = Comum &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "className" | "href"> & {
    href: string;
    /** Abre em nova aba já com rel de segurança. */
    external?: boolean;
  };

function montarClasses(
  { variant = "primario", size = "normal", block, className }: Comum,
): string {
  return cx(
    "btn",
    `btn--${variant}`,
    size !== "normal" && `btn--${size}`,
    block && "btn--bloco",
    className,
  );
}

/**
 * O símbolo do WhatsApp entra pelo próprio botão, e não em cada chamada.
 *
 * São vários CTAs espalhados pelo site; deixar o ícone a cargo de quem usa o
 * componente é garantir que uns tenham e outros não. Em branco, como o texto,
 * sobre o verde oficial da marca.
 */
function Conteudo({ variant, children }: { variant?: ButtonVariant; children: ReactNode }) {
  if (variant !== "whatsapp") return <>{children}</>;

  return (
    <>
      <IconeRede rede="whatsapp" tamanho={24} />
      {children}
    </>
  );
}

/**
 * Botão do design system. Renderiza `<button>`, `<Link>` (rota interna) ou
 * `<a>` (link externo) conforme as props — para que um CTA que navega seja
 * mesmo um link, e não um botão com onClick, que quebra abrir em nova aba e
 * a navegação por teclado.
 */
export function Button(props: ComoBotao | ComoLink) {
  if ("href" in props && props.href !== undefined) {
    const { href, external, children, variant, size, block, className, ...resto } = props;
    const classes = montarClasses({ variant, size, block, className, children });

    if (external || /^(https?:|mailto:|tel:)/.test(href)) {
      return (
        <a
          href={href}
          className={classes}
          {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          {...resto}
        >
          <Conteudo variant={variant}>{children}</Conteudo>
        </a>
      );
    }

    return (
      <Link href={href} className={classes} {...resto}>
        <Conteudo variant={variant}>{children}</Conteudo>
      </Link>
    );
  }

  const {
    children,
    variant,
    size,
    block,
    className,
    loading,
    disabled,
    type = "button",
    ...resto
  } = props;

  return (
    <button
      type={type}
      className={montarClasses({ variant, size, block, className, children })}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...resto}
    >
      {loading && <span className="btn__spinner" aria-hidden="true" />}
      <Conteudo variant={variant}>{children}</Conteudo>
    </button>
  );
}
