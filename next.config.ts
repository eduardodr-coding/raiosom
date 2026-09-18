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

const nextConfig: NextConfig = {
  async headers() {
    return [{ source: "/:path*", headers: cabecalhosSeguranca }];
  },
};

export default nextConfig;
