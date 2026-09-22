import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { RedesSociais } from "@/components/site/RedesSociais";
import { CLINICA, UNIDADES } from "@/content/clinica";
import { EXAMES } from "@/content/exames";

const INSTITUCIONAL = [
  { href: "/sobre", rotulo: "A Clínica" },
  { href: "/sobre#historia", rotulo: `${CLINICA.anos} anos` },
  { href: "/sobre#padi", rotulo: "Acreditação PADI" },
  { href: "/convenios", rotulo: "Convênios" },
  { href: "/trabalhe-conosco", rotulo: "Trabalhe Conosco" },
];

export function Footer() {
  const matriz = UNIDADES[0];

  return (
    <footer className="rodape">
      <div className="container">
        <div className="rodape__colunas">
          <div>
            <span className="rodape__marca">
              <Image
                src="/marca/logo.png"
                alt="Raio Som Diagnóstico por Imagem · Qualidade PADI acreditada pelo CBR"
                width={755}
                height={142}
                sizes="260px"
              />
            </span>
            <p className="rodape__resumo">
              {CLINICA.anos} anos de diagnóstico por imagem com a acreditação PADI do Colégio
              Brasileiro de Radiologia.
            </p>
            <div className="rodape__selos">
              <span className="rodape__selo">
                <Image
                  src="/marca/padicbr.png"
                  alt="Programa de Acreditação em Diagnóstico por Imagem, PADI"
                  width={758}
                  height={283}
                  sizes="150px"
                  style={{ width: 150 }}
                />
              </span>
              <span className="rodape__selo">
                <Image
                  src="/marca/notivisa.png"
                  alt="Notivisa, Sistema Nacional de Notificações para a Vigilância Sanitária"
                  width={214}
                  height={68}
                  sizes="90px"
                  style={{ width: 90 }}
                />
              </span>
            </div>
            <RedesSociais className="rodape__redes" />
          </div>

          <div>
            <h2 className="rodape__titulo">Exames</h2>
            <ul className="rodape__lista">
              {EXAMES.slice(0, 6).map((exame) => (
                <li key={exame.slug}>
                  <Link href={`/exames/${exame.slug}`}>{exame.nome}</Link>
                </li>
              ))}
              <li>
                <Link href="/exames">Ver todos</Link>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="rodape__titulo">Institucional</h2>
            <ul className="rodape__lista">
              {INSTITUCIONAL.map((item) => (
                <li key={item.rotulo}>
                  <Link href={item.href}>{item.rotulo}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="rodape__titulo">Fale Conosco</h2>
            <ul className="rodape__lista">
              <li>
                {/* Mesmo número usado no fim do fluxo de agendamento
                    (lib/whatsapp.ts) — canal de contato precisa ser único e
                    consistente em todo o site por exigência da acreditação PADI. */}
                <Button href={CLINICA.whatsapp.link} external variant="whatsapp" size="pequeno">
                  Fale no WhatsApp
                </Button>
              </li>
              <li>
                <a className="rodape__contato-forte" href={CLINICA.telefoneLink}>
                  {CLINICA.telefones[0]}
                </a>
              </li>
              <li>
                <a href={`mailto:${CLINICA.emails.agendamento}`}>{CLINICA.emails.agendamento}</a>
              </li>
              <li>
                {matriz.endereco} · {matriz.cidade}
              </li>
            </ul>
          </div>
        </div>

        <div className="rodape__base">
          <p>
            © {new Date().getFullYear()} {CLINICA.nomeCompleto}. Todos os direitos reservados.
          </p>
          <p>
            <Link href="/politica-de-privacidade">Política de Privacidade e Cookies · LGPD</Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
