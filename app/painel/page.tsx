import Link from "next/link";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { rotuloTurno, rotuloUnidade } from "@/content/clinica";
import { prisma } from "@/lib/prisma";
import { telefoneFormatado } from "@/lib/mascaras";
import { lerSessao } from "@/lib/sessao";
import { formatarDataHora } from "@/lib/status";
import { somenteDigitos } from "@/lib/validacao";
import { BarraPainel } from "./BarraPainel";
import { SelectStatus } from "./SelectStatus";

export const dynamic = "force-dynamic";

type Props = { searchParams: Promise<{ q?: string }> };

export default async function PaginaPainel({ searchParams }: Props) {
  const sessao = await lerSessao();
  if (!sessao) redirect("/painel/login");

  const { q = "" } = await searchParams;
  const termo = q.trim();
  const digitos = somenteDigitos(termo);

  const solicitacoes = await prisma.solicitacao.findMany({
    where: termo
      ? {
          OR: [
            { protocolo: { contains: termo.toUpperCase() } },
            { pacienteNome: { contains: termo } },
            ...(digitos.length >= 3 ? [{ cpf: { contains: digitos } }] : []),
          ],
        }
      : undefined,
    orderBy: { criadoEm: "desc" },
    take: 200,
    select: {
      protocolo: true,
      pacienteNome: true,
      exameNome: true,
      catalogoVariacao: true,
      unidade: true,
      turno: true,
      whatsapp: true,
      status: true,
      criadoEm: true,
    },
  });

  return (
    <>
      <BarraPainel nome={sessao.nome} />

      <div className="container painel-corpo">
        <h1 style={{ fontSize: "var(--txt-xl)" }}>Solicitações de agendamento</h1>

        <form className="painel-busca" action="/painel" method="get">
          <label className="sr-only" htmlFor="painel-q">
            Buscar por protocolo, nome ou CPF
          </label>
          <input
            className="campo__controle"
            id="painel-q"
            name="q"
            type="search"
            defaultValue={termo}
            placeholder="Protocolo, nome do paciente ou CPF"
          />
          <Button type="submit">Buscar</Button>
          {termo && (
            <Button href="/painel" variant="contorno">
              Limpar
            </Button>
          )}
        </form>

        <div className="painel-tabela-caixa">
          {solicitacoes.length === 0 ? (
            <p className="painel-vazio">
              {termo
                ? `Nenhuma solicitação encontrada para “${termo}”.`
                : "Nenhuma solicitação registrada ainda."}
            </p>
          ) : (
            <table className="tabela">
              <thead>
                <tr>
                  <th>Protocolo</th>
                  <th>Recebida em</th>
                  <th>Paciente</th>
                  <th>Exame</th>
                  <th>Unidade</th>
                  <th>Turno</th>
                  <th>WhatsApp</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {solicitacoes.map((item) => (
                  <tr key={item.protocolo}>
                    <td>
                      <Link className="painel-protocolo" href={`/painel/${item.protocolo}`}>
                        {item.protocolo}
                      </Link>
                    </td>
                    <td style={{ whiteSpace: "nowrap" }}>{formatarDataHora(item.criadoEm)}</td>
                    <td>{item.pacienteNome}</td>
                    <td>
                      {item.exameNome}
                      {item.catalogoVariacao && (
                        <span
                          style={{
                            display: "block",
                            fontSize: "var(--txt-sm)",
                            color: "var(--texto-suave)",
                          }}
                        >
                          {item.catalogoVariacao}
                        </span>
                      )}
                    </td>
                    <td>{rotuloUnidade(item.unidade)}</td>
                    <td>{rotuloTurno(item.turno)}</td>
                    <td style={{ whiteSpace: "nowrap" }}>
                      <a
                        href={`https://wa.me/55${item.whatsapp}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {telefoneFormatado(item.whatsapp)}
                      </a>
                    </td>
                    <td>
                      <SelectStatus protocolo={item.protocolo} status={item.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <p style={{ marginTop: "var(--e-4)", fontSize: "var(--txt-sm)", color: "var(--texto-suave)" }}>
          Mostrando as {solicitacoes.length} solicitações mais recentes. Use a busca para
          encontrar uma solicitação antiga.
        </p>
      </div>
    </>
  );
}
