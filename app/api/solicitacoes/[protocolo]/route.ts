import { NextResponse } from "next/server";
import { rotuloTurno, rotuloUnidade } from "@/content/clinica";
import { cpfFormatado, telefoneFormatado } from "@/lib/mascaras";
import { prisma } from "@/lib/prisma";
import { normalizarProtocolo } from "@/lib/protocolo";
import { lerSessao } from "@/lib/sessao";
import { formatarDataBR } from "@/lib/validacao";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * GET /api/solicitacoes/[protocolo]
 *
 * Consulta interna usada pelo atendente (e por integrações futuras do time).
 * Exige sessão do painel: o protocolo é sequencial e, sozinho, não pode
 * liberar dados de paciente. Devolve o CPF completo — é justamente o que o
 * atendente precisa e o que a mensagem do WhatsApp não carrega.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ protocolo: string }> },
) {
  const sessao = await lerSessao();
  if (!sessao) {
    return NextResponse.json({ erro: "Não autorizado." }, { status: 401 });
  }

  const { protocolo } = await params;
  const solicitacao = await prisma.solicitacao.findUnique({
    where: { protocolo: normalizarProtocolo(decodeURIComponent(protocolo)) },
  });

  if (!solicitacao) {
    return NextResponse.json({ erro: "Solicitação não encontrada." }, { status: 404 });
  }

  return NextResponse.json(
    {
      protocolo: solicitacao.protocolo,
      status: solicitacao.status,
      criadoEm: solicitacao.criadoEm,
      exame: {
        slug: solicitacao.exameSlug,
        nome: solicitacao.exameNome,
        variacao: solicitacao.catalogoVariacao,
        codigo: solicitacao.catalogoCodigo,
        // Só vem preenchido quando a clínica ainda precisa decidir qual código
        // usar para esta opção.
        codigosPossiveis: solicitacao.catalogoCodigos?.split(" | ") ?? null,
      },
      paciente: {
        nome: solicitacao.pacienteNome,
        cpf: cpfFormatado(solicitacao.cpf),
        dataNascimento: formatarDataBR(solicitacao.dataNascimento),
        // Nulos quando o paciente marcou "Não possuo" no formulário.
        whatsapp: solicitacao.whatsapp ? telefoneFormatado(solicitacao.whatsapp) : null,
        email: solicitacao.email,
      },
      atendimento: {
        unidade: rotuloUnidade(solicitacao.unidade),
        turno: rotuloTurno(solicitacao.turno),
        cobertura: solicitacao.tipoCobertura,
        convenio: solicitacao.convenioNome,
        carteirinha: solicitacao.carteirinha,
      },
      pedidoMedico: {
        // Nunca anexado e já expurgado dão no mesmo aqui: não há o que abrir.
        anexado: solicitacao.arquivoChave !== null,
        disponivel: solicitacao.arquivoChave !== null && !solicitacao.arquivoExpurgoEm,
        // Nunca a chave do storage: só a rota autenticada que serve o arquivo.
        url:
          solicitacao.arquivoChave && !solicitacao.arquivoExpurgoEm
            ? `/painel/${solicitacao.protocolo}/arquivo`
            : null,
        tamanho: solicitacao.arquivoTamanho,
        tipo: solicitacao.arquivoMime,
      },
      consentimento: {
        em: solicitacao.consentimentoEm,
        texto: solicitacao.consentimentoTexto,
      },
    },
    { headers: { "Cache-Control": "private, no-store" } },
  );
}
