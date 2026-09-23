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
        nomeInterno: solicitacao.catalogoNomeInterno,
      },
      paciente: {
        nome: solicitacao.pacienteNome,
        cpf: cpfFormatado(solicitacao.cpf),
        dataNascimento: formatarDataBR(solicitacao.dataNascimento),
        whatsapp: telefoneFormatado(solicitacao.whatsapp),
      },
      atendimento: {
        unidade: rotuloUnidade(solicitacao.unidade),
        turno: rotuloTurno(solicitacao.turno),
        cobertura: solicitacao.tipoCobertura,
        convenio: solicitacao.convenioNome,
        carteirinha: solicitacao.carteirinha,
      },
      pedidoMedico: {
        disponivel: !solicitacao.arquivoExpurgoEm,
        // Nunca a chave do storage: só a rota autenticada que serve o arquivo.
        url: solicitacao.arquivoExpurgoEm
          ? null
          : `/painel/${solicitacao.protocolo}/arquivo`,
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
