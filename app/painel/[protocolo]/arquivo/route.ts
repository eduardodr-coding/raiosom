import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { normalizarProtocolo } from "@/lib/protocolo";
import { lerSessao } from "@/lib/sessao";
import { lerPedidoMedico } from "@/lib/storage";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * GET /painel/[protocolo]/arquivo
 *
 * Única porta de saída do pedido médico. O arquivo mora fora do webroot e só
 * sai por aqui: com sessão válida do painel, e deixando registro de quem
 * abriu o documento de qual paciente (exigência prática de LGPD).
 *
 * `?download=1` força o download em vez de abrir no navegador.
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ protocolo: string }> },
) {
  const sessao = await lerSessao();
  if (!sessao) {
    return NextResponse.json({ erro: "Não autorizado." }, { status: 401 });
  }

  const { protocolo } = await params;
  const solicitacao = await prisma.solicitacao.findUnique({
    where: { protocolo: normalizarProtocolo(decodeURIComponent(protocolo)) },
    select: {
      id: true,
      protocolo: true,
      arquivoChave: true,
      arquivoMime: true,
      arquivoExpurgoEm: true,
    },
  });

  if (!solicitacao || solicitacao.arquivoExpurgoEm) {
    return NextResponse.json({ erro: "Arquivo não disponível." }, { status: 404 });
  }

  let conteudo: Buffer;
  try {
    conteudo = await lerPedidoMedico(solicitacao.arquivoChave);
  } catch {
    // Some do disco sem ter passado pelo expurgo: vale investigar, mas sem
    // escrever a chave do arquivo no log.
    console.error("[painel] pedido médico ausente no storage", {
      protocolo: solicitacao.protocolo,
    });
    return NextResponse.json({ erro: "Arquivo não encontrado no armazenamento." }, { status: 404 });
  }

  await prisma.logAcessoArquivo.create({
    data: { solicitacaoId: solicitacao.id, usuarioId: sessao.usuarioId },
  });

  const baixar = new URL(request.url).searchParams.get("download") === "1";
  const extensao = solicitacao.arquivoMime === "application/pdf" ? "pdf" : "jpg";

  return new NextResponse(new Uint8Array(conteudo), {
    headers: {
      "Content-Type": solicitacao.arquivoMime,
      "Content-Length": String(conteudo.byteLength),
      "Content-Disposition": `${baixar ? "attachment" : "inline"}; filename="pedido-${solicitacao.protocolo}.${extensao}"`,
      // Documento de saúde não fica em cache de proxy nem do navegador.
      "Cache-Control": "private, no-store, max-age=0",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
