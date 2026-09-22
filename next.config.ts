import type { NextConfig } from "next";

const producao = process.env.NODE_ENV === "production";

/**
 * Cabeçalhos de segurança.
 *
 * O site coleta CPF, data de nascimento e o pedido médico (dado de saúde), o
 * que exige cuidado com clickjacking e com vazamento de URL para terceiros.
 *
 * HSTS fica só em produção porque em desenvolvimento o site roda em
 * http://localhost — navegadores ignoram o cabeçalho fora de HTTPS, mas manter
 * o escopo explícito evita surpresa se alguém subir um proxy local com TLS.
 *
 * CSP não entra aqui de propósito: o Next injeta scripts e estilos inline, e
 * uma política sem `nonce` configurado quebraria a hidratação. Ver README.
 */
const cabecalhosSeguranca = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  ...(producao
    ? [
        {
          key: "Strict-Transport-Security",
          value: "max-age=63072000; includeSubDomains; preload",
        },
      ]
    : []),
];

/**
 * Origens liberadas no servidor de desenvolvimento.
 *
 * Só vale para `next dev`. Sem isso, abrir o site pelo IP da máquina
 * (http://192.168.x.x:3000, para testar no celular ou em outro computador da
 * rede) devolve 403 nos arquivos de `/_next/` — o HTML aparece, mas o
 * JavaScript não carrega, e como as seções começam invisíveis (`.revelar`,
 * que só aparece via IntersectionObserver) a página fica praticamente vazia.
 *
 * As faixas abaixo são as de rede privada (RFC 1918), em curinga de propósito:
 * IP de rede local muda de lugar para lugar, e fixar um aqui só adiaria o
 * mesmo problema para a próxima rede. `DEV_ORIGENS_EXTRA` cobre o caso de um
 * host diferente (ex.: um túnel), separado por vírgula.
 */
const origensDev = [
  "192.168.*.*",
  "10.*.*.*",
  "172.16.*.*",
  "172.17.*.*",
  "172.18.*.*",
  "172.19.*.*",
  "172.20.*.*",
  "172.21.*.*",
  "172.22.*.*",
  "172.23.*.*",
  "172.24.*.*",
  "172.25.*.*",
  "172.26.*.*",
  "172.27.*.*",
  "172.28.*.*",
  "172.29.*.*",
  "172.30.*.*",
  "172.31.*.*",
  ...(process.env.DEV_ORIGENS_EXTRA?.split(",").map((o) => o.trim()).filter(Boolean) ?? []),
];

const nextConfig: NextConfig = {
  allowedDevOrigins: origensDev,

  async headers() {
    return [
      { source: "/:path*", headers: cabecalhosSeguranca },
      {
        // O relatório de transparência é exibido num <iframe> na própria
        // página (/transparencia/igualdade-salarial) — precisa poder ser
        // enquadrado pelo nosso próprio site. SAMEORIGIN mantém a defesa
        // contra clickjacking (nenhum outro domínio pode enquadrar), só afrouxa
        // a regra DENY global para o nosso próprio domínio.
        source: "/transparencia/:file*.pdf",
        headers: [{ key: "X-Frame-Options", value: "SAMEORIGIN" }],
      },
    ];
  },
};

export default nextConfig;
