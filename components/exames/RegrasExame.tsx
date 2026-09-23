import { Revelar } from "@/components/Revelar";
import { Button } from "@/components/ui/Button";
import type { Exame } from "@/content/exames";
import { linkWhatsApp } from "@/lib/whatsapp";

/**
 * Regras de comparecimento da página do exame.
 *
 * Um componente só para todas as modalidades: o que muda de uma para outra sai
 * do mapa abaixo, não de cópias do bloco página por página, senão a primeira
 * correção de regra passa a valer em umas páginas e não em outras.
 *
 * O preparo em si não mora mais no site. Quem precisa dele é mandado para o
 * WhatsApp da central, que é onde a clínica passa a orientação atualizada.
 */

/** Antecedência de todo mundo. Só a ressonância foge dela. */
const ANTECEDENCIA_PADRAO = 15;

/**
 * Itens que valem para uma modalidade só.
 *
 * O aviso de metal da RM é triagem de segurança do campo magnético, não
 * preparo: sem ele o exame é cancelado na recepção (ou, pior, não é).
 */
const EXTRAS_POR_EXAME: Record<string, string[]> = {
  "ressonancia-magnetica": [
    "Avisar a equipe se usa marca-passo, prótese, implante ou qualquer objeto metálico no corpo.",
  ],
};

export function RegrasExame({ exame }: { exame: Exame }) {
  // `chegarAntesMin` fica em content/exames.ts porque os selos da listagem e do
  // agendamento leem o mesmo valor. Aqui só entra o padrão de quem não tem.
  const minutos = exame.chegarAntesMin ?? ANTECEDENCIA_PADRAO;

  const itens = [
    `Chegar com ${minutos} minutos de antecedência.`,
    "Trazer documento com foto (RG, CNH ou CTPS). Obrigatório. Para crianças de 0 a 12 anos, trazer certidão de nascimento.",
    "Trazer exames anteriores.",
    "Trazer cartão do convênio.",
    "Trazer pedido médico.",
    ...(EXTRAS_POR_EXAME[exame.slug] ?? []),
  ];

  const link = linkWhatsApp(
    `Olá! Tenho uma dúvida sobre o preparo do exame de ${exame.nome}.`,
  );

  return (
    <Revelar className="bloco regras-exame">
      <h2 className="bloco__titulo">Regras para o seu exame</h2>

      <ul className="lista-itens">
        {itens.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>

      <p className="regras-exame__duvida">
        Dúvidas sobre o preparo do seu exame? Fale com a gente pelo WhatsApp.
      </p>

      <div className="regras-exame__acao">
        <Button href={link} external variant="whatsapp">
          Tirar dúvidas no WhatsApp
        </Button>
      </div>
    </Revelar>
  );
}
