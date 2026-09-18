import "server-only";

/**
 * Rate limiting simples, em memória.
 *
 * Suficiente para o MVP, que roda em um processo Node só: segura envio
 * repetido e robô de formulário sem depender de Redis. Duas limitações
 * conhecidas, e assumidas: o contador zera quando a aplicação reinicia, e não
 * é compartilhado entre instâncias. Se um dia o site rodar em mais de um
 * processo, troque o Map por uma tabela ou por um Redis mantendo esta mesma
 * assinatura.
 */

type Janela = { inicio: number; contagem: number };

const janelas = new Map<string, Janela>();

/** Evita que o Map cresça para sempre com IPs que nunca voltam. */
function limpar(agora: number, duracaoMs: number) {
  for (const [chave, janela] of janelas) {
    if (agora - janela.inicio > duracaoMs) janelas.delete(chave);
  }
}

export type ResultadoLimite = {
  permitido: boolean;
  /** Segundos até poder tentar de novo. */
  esperarSegundos: number;
};

export function verificarLimite(
  chave: string,
  { maximo, duracaoMs }: { maximo: number; duracaoMs: number },
): ResultadoLimite {
  const agora = Date.now();

  if (janelas.size > 500) limpar(agora, duracaoMs);

  const janela = janelas.get(chave);

  if (!janela || agora - janela.inicio > duracaoMs) {
    janelas.set(chave, { inicio: agora, contagem: 1 });
    return { permitido: true, esperarSegundos: 0 };
  }

  janela.contagem += 1;

  if (janela.contagem > maximo) {
    return {
      permitido: false,
      esperarSegundos: Math.ceil((duracaoMs - (agora - janela.inicio)) / 1000),
    };
  }

  return { permitido: true, esperarSegundos: 0 };
}

/**
 * IP de quem chamou, atrás do proxy reverso.
 *
 * Só confie nestes cabeçalhos com um proxy na frente que os reescreva
 * (Nginx/Apache/Cloudflare) — é o cenário de produção documentado no README.
 */
export function ipDaRequisicao(headers: Headers): string {
  const encaminhado = headers.get("x-forwarded-for");
  if (encaminhado) return encaminhado.split(",")[0].trim();
  return headers.get("x-real-ip") ?? "desconhecido";
}
