import { createHmac } from "node:crypto";
import { NextResponse } from "next/server";
import { CLINICA } from "@/content/clinica";
import { examePorSlug } from "@/content/exames";
import {
  codigoDoAgendamento,
  exameDoCatalogo,
  paginaDoExame,
  rotuloVariacao,
} from "@/lib/catalogo";
import { sessionSecret } from "@/lib/env";
import { formatarProtocolo } from "@/lib/protocolo";
import { prisma } from "@/lib/prisma";
import { ipDaRequisicao, verificarLimite } from "@/lib/rate-limit";
import {
  detectarTipo,
  pareceHeic,
  removerPedidoMedico,
  salvarPedidoMedico,
} from "@/lib/storage";
import { TAMANHO_MAX_BYTES, TAMANHO_MAX_ROTULO } from "@/lib/upload-limites";
import {
  TEXTO_CONSENTIMENTO,
  esquemaSolicitacao,
  formatarDataBR,
  lerDataNascimento,
  naoPossui,
  somenteDigitos,
  validarContato,
} from "@/lib/validacao";
import { linkWhatsApp, montarMensagem } from "@/lib/whatsapp";

export const runtime = "nodejs";
/** Recebe upload: nunca pode ser servida de cache. */
export const dynamic = "force-dynamic";

/** 5 solicitações por IP a cada 10 minutos. */
const LIMITE = { maximo: 5, duracaoMs: 10 * 60 * 1000 };

/** Margem sobre o limite do arquivo para caber os campos de texto do form. */
const CORPO_MAX_BYTES = TAMANHO_MAX_BYTES + 1024 * 1024;

function erro(mensagem: string, status: number, campos?: Record<string, string>) {
  return NextResponse.json({ erro: mensagem, campos }, { status });
}

/**
 * POST /api/solicitacoes
 *
 * Registra a solicitação de agendamento: valida tudo de novo no servidor,
 * grava o pedido médico fora do webroot, gera o protocolo e devolve a
 * mensagem pronta para o WhatsApp.
 *
 * LGPD: nada de CPF, nome ou nome de arquivo em log. Em caso de falha, o
 * log recebe só a etapa que quebrou.
 */
export async function POST(request: Request) {
  const ip = ipDaRequisicao(request.headers);
  const limite = verificarLimite(`solicitacao:${ip}`, LIMITE);

  if (!limite.permitido) {
    return erro(
      `Recebemos muitas solicitações deste dispositivo. Tente de novo em ${Math.ceil(
        limite.esperarSegundos / 60,
      )} minutos ou fale com a central pelo telefone ${CLINICA.telefonePrincipal}.`,
      429,
    );
  }

  const tamanhoDeclarado = Number(request.headers.get("content-length") ?? 0);
  if (tamanhoDeclarado > CORPO_MAX_BYTES) {
    return erro(`O arquivo do pedido médico precisa ter até ${TAMANHO_MAX_ROTULO}.`, 413);
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return erro("Não conseguimos ler o formulário enviado. Tente novamente.", 400);
  }

  // ── Campos de texto ──────────────────────────────────────────────────────
  const bruto = {
    exameSlug: String(form.get("exameSlug") ?? ""),
    catalogoId: String(form.get("catalogoId") ?? ""),
    pacienteNome: String(form.get("pacienteNome") ?? ""),
    cpf: String(form.get("cpf") ?? ""),
    dataNascimento: String(form.get("dataNascimento") ?? ""),
    whatsapp: String(form.get("whatsapp") ?? ""),
    semWhatsapp: String(form.get("semWhatsapp") ?? ""),
    email: String(form.get("email") ?? ""),
    semEmail: String(form.get("semEmail") ?? ""),
    convenio: String(form.get("convenio") ?? ""),
    unidade: String(form.get("unidade") ?? ""),
    turno: String(form.get("turno") ?? ""),
    consentimento: String(form.get("consentimento") ?? ""),
  };

  const analise = esquemaSolicitacao.safeParse(bruto);
  if (!analise.success) {
    const campos: Record<string, string> = {};
    for (const problema of analise.error.issues) {
      const campo = String(problema.path[0] ?? "");
      if (campo && !campos[campo]) campos[campo] = problema.message;
    }
    return erro("Confira os campos destacados.", 422, campos);
  }

  const dados = analise.data;

  const errosCampos = validarContato(dados);
  if (Object.keys(errosCampos).length > 0) {
    return erro("Confira os campos destacados.", 422, errosCampos);
  }

  const exame = examePorSlug(dados.exameSlug);
  if (!exame) {
    return erro("Exame não encontrado.", 422, { exameSlug: "Escolha um exame da lista." });
  }

  // A variação sai do catálogo pelo id, nunca de um nome vindo do cliente, e
  // precisa ser deste mesmo exame: quem posta direto na API manda o id que
  // quiser, e um id de outra modalidade gravaria o exame errado na ficha que
  // a central vai atender.
  const variacao = dados.catalogoId ? exameDoCatalogo(Number(dados.catalogoId)) : null;
  if (dados.catalogoId && (!variacao || paginaDoExame(variacao) !== exame.slug)) {
    return erro("Exame não encontrado.", 422, { exameSlug: "Escolha um exame da lista." });
  }

  // A unidade precisa realizar este exame. O formulário já só oferece as
  // certas, mas quem posta direto na API manda o que quiser — e uma
  // solicitação de raios X para uma unidade sem aparelho vira viagem perdida.
  if (!exame.unidades.includes(dados.unidade)) {
    return erro("Confira os campos destacados.", 422, {
      unidade: "Esta unidade não realiza este exame.",
    });
  }

  // A filial de Cachoeirinha não aceita o convênio Unimed. O formulário já
  // desabilita essa combinação, mas quem posta direto na API pode tentar
  // mandar mesmo assim.
  if (dados.unidade === "cachoeirinha" && dados.convenio === "Unimed") {
    return erro("Confira os campos destacados.", 422, {
      unidade: "A unidade Cachoeirinha não atende pelo convênio Unimed. Escolha outra unidade.",
    });
  }

  const nascimento = lerDataNascimento(dados.dataNascimento);
  if (!nascimento) {
    return erro("Confira os campos destacados.", 422, {
      dataNascimento: "Informe uma data no formato dd/mm/aaaa.",
    });
  }

  // ── Arquivo do pedido médico ─────────────────────────────────────────────
  // É o único campo opcional do formulário: a clínica prefere receber a
  // solicitação sem a foto a perder o paciente que não tem o pedido
  // digitalizado na hora. Quem não anexa leva o papel no dia — sem ele a
  // recepção não libera o exame de qualquer jeito.
  const bruto_ = form.get("pedidoMedico");
  const enviado = bruto_ instanceof File && bruto_.size > 0 ? bruto_ : null;
  let bytes: Uint8Array | null = null;

  if (enviado) {
    if (enviado.size > TAMANHO_MAX_BYTES) {
      return erro(`O arquivo precisa ter até ${TAMANHO_MAX_ROTULO}.`, 413, {
        pedidoMedico: `O arquivo precisa ter até ${TAMANHO_MAX_ROTULO}.`,
      });
    }

    bytes = new Uint8Array(await enviado.arrayBuffer());

    if (!detectarTipo(bytes)) {
      const mensagem = pareceHeic(bytes)
        ? "Este formato de foto do iPhone (HEIC) não é aceito. Envie como JPG."
        : "Aceitamos foto em JPG ou PNG, ou o pedido em PDF.";
      return erro(mensagem, 415, { pedidoMedico: mensagem });
    }
  }

  // ── Persistência ─────────────────────────────────────────────────────────
  const arquivo = bytes ? await salvarPedidoMedico(bytes) : null;
  const ehParticular = dados.convenio === "particular";
  const whatsappPaciente = naoPossui(dados.semWhatsapp) ? null : somenteDigitos(dados.whatsapp);
  const emailPaciente = naoPossui(dados.semEmail) ? null : dados.email;

  const mensagemPara = (protocolo: string | null) =>
    montarMensagem({
      protocolo,
      // A variação, quando existe, é mais específica que a modalidade e é o
      // que a central precisa ler. O nome interno fica de fora de propósito:
      // esta string vira `wa.me/?text=` e passa pela tela do paciente.
      exameNome: variacao ? rotuloVariacao(variacao) : exame.nome,
      pacienteNome: dados.pacienteNome,
      cpf: dados.cpf,
      dataNascimento: formatarDataBR(nascimento),
      whatsapp: whatsappPaciente,
      email: emailPaciente,
      unidade: dados.unidade,
      convenio: ehParticular ? "Particular" : dados.convenio,
      turno: dados.turno,
      comTurno: exame.agendamento !== "ordem-de-chegada",
    });

  try {
    const ano = new Date().getFullYear();

    const protocolo = await prisma.$transaction(async (tx) => {
      const contador = await tx.contadorProtocolo.upsert({
        where: { ano },
        create: { ano, ultimo: 1 },
        update: { ultimo: { increment: 1 } },
      });

      const numero = formatarProtocolo(ano, contador.ultimo);

      await tx.solicitacao.create({
        data: {
          protocolo: numero,
          exameSlug: exame.slug,
          exameNome: exame.nome,
          catalogoId: variacao?.id ?? null,
          catalogoVariacao: variacao ? rotuloVariacao(variacao) : null,
          catalogoCodigo: variacao ? codigoDoAgendamento(variacao) : null,
          // Quando a linha tem mais de um código, a lista inteira vai junto:
          // o site não tem como saber qual a clínica cobra em cada convênio.
          catalogoCodigos:
            variacao && variacao.codigos.length > 1
              ? variacao.codigos.join(" | ")
              : null,
          pacienteNome: dados.pacienteNome,
          cpf: dados.cpf,
          dataNascimento: nascimento,
          whatsapp: whatsappPaciente,
          email: emailPaciente,
          tipoCobertura: ehParticular ? "particular" : "convenio",
          convenioNome: ehParticular ? null : dados.convenio,
          // O site não pede mais a carteirinha: a central confere a cobertura
          // com o paciente no WhatsApp. A coluna segue no banco para os
          // registros antigos.
          carteirinha: null,
          unidade: dados.unidade,
          turno: dados.turno,
          arquivoChave: arquivo?.chave ?? null,
          arquivoMime: arquivo?.mime ?? null,
          arquivoTamanho: arquivo?.tamanho ?? null,
          arquivoNomeOrigem: enviado?.name.slice(0, 255) ?? null,
          consentimentoEm: new Date(),
          consentimentoTexto: TEXTO_CONSENTIMENTO,
          // Hash com chave: prova que o consentimento veio daquele IP sem
          // guardar o IP, que por si só é dado pessoal.
          consentimentoIpHash: createHmac("sha256", sessionSecret()).update(ip).digest("hex"),
        },
      });

      return numero;
    });

    const mensagem = mensagemPara(protocolo);

    return NextResponse.json({
      protocolo,
      mensagem,
      whatsapp: linkWhatsApp(mensagem),
      // A tela de confirmação muda com os dois: sem WhatsApp o CTA de abrir o
      // WhatsApp não leva a lugar nenhum, e sem anexo não dá para prometer
      // que o pedido médico já está guardado.
      semWhatsapp: naoPossui(dados.semWhatsapp),
      comPedido: arquivo !== null,
    });
  } catch (causa) {
    // O arquivo já estava no disco quando o banco falhou: sem isso, ele
    // ficaria órfão, sem nenhuma linha apontando para ele.
    if (arquivo) await removerPedidoMedico(arquivo.chave).catch(() => {});
    console.error("[solicitacoes] falha ao gravar a solicitação", {
      etapa: "persistencia",
      // Só a mensagem do erro — nada do paciente.
      causa: causa instanceof Error ? causa.message : "desconhecida",
    });

    // Banco fora do ar não pode travar o paciente: o objetivo do site é
    // entregá-lo à central com os dados prontos, e a mensagem do WhatsApp
    // leva tudo o que o atendente precisa. Ele segue sem protocolo, e o
    // pedido médico, que não teve onde ser guardado, vai pela conversa.
    const mensagem = mensagemPara(null);
    return NextResponse.json({
      protocolo: null,
      semRegistro: true,
      mensagem,
      whatsapp: linkWhatsApp(mensagem),
      semWhatsapp: naoPossui(dados.semWhatsapp),
      comPedido: false,
    });
  }
}
