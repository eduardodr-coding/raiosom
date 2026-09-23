import { cx } from "@/lib/cx";
import { CLINICA } from "@/content/clinica";
import { IconeRede, type Rede } from "@/components/ui/icones";

const REDES: { rede: Rede; rotulo: string; href: string }[] = [
  { rede: "whatsapp", rotulo: `WhatsApp: ${CLINICA.whatsapp.exibicao}`, href: CLINICA.whatsapp.link },
  { rede: "instagram", rotulo: "Instagram da Raio Som", href: CLINICA.links.instagram },
  { rede: "facebook", rotulo: "Facebook da Raio Som", href: CLINICA.links.facebook },
];

export function RedesSociais({ className }: { className?: string }) {
  return (
    <div className={cx("redes-sociais", className)}>
      {REDES.map(
        (item) =>
          item.href && (
            <a
              key={item.rede}
              className="redes-sociais__link"
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={item.rotulo}
              title={item.rotulo}
            >
              <IconeRede rede={item.rede} />
            </a>
          ),
      )}
    </div>
  );
}
