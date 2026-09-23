import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { rotuloTurno, rotuloUnidade } from "@/content/clinica";
import { cpfFormatado, telefoneFormatado } from "@/lib/mascaras";
import { prisma } from "@/lib/prisma";
import { normalizarProtocolo } from "@/lib/protocolo";
import { lerSessao } from "@/lib/sessao";
import { formatarDataHora } from "@/lib/status";
import { formatarDataBR } from "@/lib/validacao";
import { formatarTamanho } from "@/lib/upload-limites";
import { BarraPainel } from "../BarraPainel";
import { SelectStatus } from "../SelectStatus";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ protocolo: string }> };

function Campo({ rotulo, valor, destaque }: { rotulo: string; valor: string; destaque?: boolean }) {
  return (
    <div>
      <p className="ficha__rotulo">{rotulo}</p>
      <p className={`ficha__valor${destaque ? " ficha__valor--destaque" : ""}`}>{valor}</p>
    </div>
  );
}

export default async function PaginaSolicitacao({ params }: Props) {
  const sessao = await lerSessao();
  if (!sessao) redirect("/painel/login");

  const { protocolo } = await params;
  const solicitacao = await prisma.solicitacao.findUnique({
    where: { protocolo: normalizarProtocolo(decodeURIComponent(protocolo)) },
    include: {
      acessosArquivo: {
        orderBy: { em: "desc" },
        take: 5,
        include: { usuario: { select: { nome: true } } },
      },
    },
  });

  if (!solicitacao) notFound();

  // Sem chave = o paciente não anexou nada, que é diferente de ter anexado e o
  // expurgo ter levado o arquivo. A ficha precisa distinguir os dois.
  const semAnexo = !solicitacao.arquivoChave;
  const arquivoDisponivel = !semAnexo && !solicitacao.arquivoExpurgoEm;

  return (
    <>
      <BarraPainel nome={sessao.nome} />

      <div className="container painel-corpo">
        <p style={{ marginBottom: "var(--e-4)" }}>
          <Link href="/painel">← Voltar para a lista</Link>
        </p>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "var(--e-4)",
            marginBottom: "var(--e-6)",
          }}
        >
          <div>
            <h1 style={{ fontSize: "var(--txt-2xl)" }}>{solicitacao.protocolo}</h1>
            <p style={{ color: "var(--texto-suave)", fontSize: "var(--txt-sm)" }}>
              Recebida em {formatarDataHora(solicitacao.criadoEm)}
            </p>
          </div>
          <SelectStatus protocolo={solicitacao.protocolo} status={solicitacao.status} />
        </div>

        <div className="ficha">
          <div className="card">
            <h2 style={{ fontSize: "var(--txt-lg)", marginBottom: "var(--e-5)" }}>
              Dados do paciente
            </h2>
            <div className="ficha__lista">
              <Campo rotulo="Paciente" valor={solicitacao.pacienteNome} destaque />
              <Campo rotulo="CPF" valor={cpfFormatado(solicitacao.cpf)} destaque />
              <Campo
                rotulo="Data de nascimento"
                valor={formatarDataBR(solicitacao.dataNascimento)}
              />
              {/* Os dois contatos são opcionais no formulário: aparece "não
                  informado" em vez de sumir, para o atendente saber que o
                  paciente não deixou por onde ser chamado. */}
              <Campo
                rotulo="WhatsApp"
                valor={
                  solicitacao.whatsapp
                    ? telefoneFormatado(solicitacao.whatsapp)
                    : "Não possui"
                }
              />
              <Campo rotulo="E-mail" valor={solicitacao.email ?? "Não possui"} />
              <Campo rotulo="Exame" valor={solicitacao.exameNome} destaque />
              {solicitacao.catalogoVariacao && (
                <Campo rotulo="Exame solicitado" valor={solicitacao.catalogoVariacao} destaque />
              )}
              {solicitacao.catalogoCodigo && (
                <Campo rotulo="Código no sistema" valor={solicitacao.catalogoCodigo} />
              )}
              {/* Esta linha do catálogo tem mais de um código e a clínica
                  ainda não disse qual vale. O site usou o primeiro; quem
                  confirma é quem está atendendo. */}
              {solicitacao.catalogoCodigos && (
                <Campo
                  rotulo="Códigos possíveis — confirmar qual usar"
                  valor={solicitacao.catalogoCodigos}
                />
              )}
              <Campo rotulo="Unidade" valor={rotuloUnidade(solicitacao.unidade)} />
              <Campo rotulo="Turno de preferência" valor={rotuloTurno(solicitacao.turno)} />
              <Campo
                rotulo="Cobertura"
                valor={
                  solicitacao.tipoCobertura === "particular"
                    ? "Particular"
                    : `${solicitacao.convenioNome ?? "Convênio"}${
                        solicitacao.carteirinha ? ` · carteirinha ${solicitacao.carteirinha}` : ""
                      }`
                }
              />
            </div>

            <div style={{ marginTop: "var(--e-6)" }}>
              {solicitacao.whatsapp ? (
                <Button
                  href={`https://wa.me/55${solicitacao.whatsapp}`}
                  external
                  variant="whatsapp"
                >
                  Falar com o paciente no WhatsApp
                </Button>
              ) : solicitacao.email ? (
                <Button href={`mailto:${solicitacao.email}`} variant="contorno">
                  Escrever para o paciente
                </Button>
              ) : (
                <p style={{ fontSize: "var(--txt-sm)", color: "var(--texto-suave)" }}>
                  Este paciente não deixou WhatsApp nem e-mail. Ele foi orientado a
                  ligar para a central com o protocolo.
                </p>
              )}
            </div>
          </div>

          <aside className="card">
            <h2 style={{ fontSize: "var(--txt-lg)" }}>Pedido médico</h2>

            {arquivoDisponivel ? (
              <>
                <p style={{ marginTop: "var(--e-3)", fontSize: "var(--txt-sm)", color: "var(--texto-suave)" }}>
                  {solicitacao.arquivoNomeOrigem} ·{" "}
                  {formatarTamanho(solicitacao.arquivoTamanho ?? 0)}
                </p>
                <div style={{ display: "grid", gap: "var(--e-3)", marginTop: "var(--e-4)" }}>
                  <Button href={`/painel/${solicitacao.protocolo}/arquivo`} block>
                    Abrir pedido médico
                  </Button>
                  <Button
                    href={`/painel/${solicitacao.protocolo}/arquivo?download=1`}
                    variant="contorno"
                    block
                  >
                    Baixar
                  </Button>
                </div>
                <p style={{ marginTop: "var(--e-4)", fontSize: "var(--txt-xs)", color: "var(--texto-tenue)" }}>
                  Cada abertura fica registrada com seu usuário e horário.
                </p>
              </>
            ) : semAnexo ? (
              <p style={{ marginTop: "var(--e-3)", fontSize: "var(--txt-sm)", color: "var(--texto-suave)" }}>
                O paciente não anexou o pedido médico. Ele foi orientado a levar o
                papel no dia do exame.
              </p>
            ) : (
              <p style={{ marginTop: "var(--e-3)", fontSize: "var(--txt-sm)", color: "var(--texto-suave)" }}>
                Arquivo removido em {formatarDataHora(solicitacao.arquivoExpurgoEm!)} pela política
                de retenção.
              </p>
            )}

            <div style={{ height: 1, background: "var(--borda)", margin: "var(--e-6) 0" }} />

            <h3 style={{ fontSize: "var(--txt-base)" }}>Consentimento LGPD</h3>
            <p style={{ marginTop: "var(--e-2)", fontSize: "var(--txt-sm)", color: "var(--texto-suave)" }}>
              Aceito em {formatarDataHora(solicitacao.consentimentoEm)}.
            </p>
            <p style={{ marginTop: "var(--e-2)", fontSize: "var(--txt-xs)", color: "var(--texto-tenue)" }}>
              “{solicitacao.consentimentoTexto}”
            </p>

            {solicitacao.acessosArquivo.length > 0 && (
              <>
                <div style={{ height: 1, background: "var(--borda)", margin: "var(--e-6) 0" }} />
                <h3 style={{ fontSize: "var(--txt-base)" }}>Últimos acessos ao documento</h3>
                <ul
                  style={{
                    marginTop: "var(--e-3)",
                    paddingLeft: 0,
                    listStyle: "none",
                    fontSize: "var(--txt-xs)",
                    color: "var(--texto-suave)",
                    display: "grid",
                    gap: "var(--e-2)",
                  }}
                >
                  {solicitacao.acessosArquivo.map((acesso) => (
                    <li key={acesso.id}>
                      {formatarDataHora(acesso.em)}, {acesso.usuario.nome}
                    </li>
                  ))}
                </ul>
              </>
            )}
          </aside>
        </div>
      </div>
    </>
  );
}
