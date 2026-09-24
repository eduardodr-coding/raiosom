"use client";

import { useSearchParams } from "next/navigation";
import { useMemo, useSyncExternalStore } from "react";
import { Button } from "@/components/ui/Button";
import { CLINICA } from "@/content/clinica";
import { normalizarProtocolo, protocoloValido } from "@/lib/protocolo";
import { CHAVE_SESSAO } from "./FormularioAgendamento";

type Guardado = {
  protocolo: string;
  mensagem: string;
  whatsapp: string;
  /** O paciente marcou "Não possuo" no WhatsApp: mandá-lo para lá não resolve. */
  semWhatsapp?: boolean;
  /** Anexou o pedido médico. Opcional no formulário. */
  comPedido?: boolean;
  exameSlug: string;
};

export type ConfirmacaoProps = {
  exameNome: string;
  porOrdemDeChegada: boolean;
};

/** Leitura do sessionStorage compatível com renderização no servidor. */
const armazenamento = {
  /** Nada muda depois da carga: não há a que se inscrever. */
  inscrever: () => () => {},
  lerNoCliente: () => {
    try {
      return sessionStorage.getItem(CHAVE_SESSAO);
    } catch {
      // Armazenamento bloqueado (aba anônima, cookies negados).
      return null;
    }
  },
  lerNoServidor: () => null,
};

export function Confirmacao({ exameNome, porOrdemDeChegada }: ConfirmacaoProps) {
  const parametros = useSearchParams();
  const protocoloUrl = normalizarProtocolo(parametros.get("protocolo") ?? "");

  /**
   * A prévia da mensagem vem do sessionStorage, gravado no envio — e não de
   * uma consulta ao banco pelo protocolo.
   *
   * O protocolo é sequencial e, portanto, adivinhável: se esta página
   * buscasse os dados do paciente a partir dele, qualquer pessoa poderia
   * trocar o número na URL e ler o nome de quem agendou. O preço é que, se o
   * paciente abrir este link em outro aparelho, ele vê a versão curta abaixo.
   */
  const bruto = useSyncExternalStore(
    armazenamento.inscrever,
    armazenamento.lerNoCliente,
    armazenamento.lerNoServidor,
  );

  const dados = useMemo<Guardado | null>(() => {
    if (!bruto) return null;
    try {
      const guardado = JSON.parse(bruto) as Guardado;
      return guardado.protocolo === protocoloUrl ? guardado : null;
    } catch {
      return null;
    }
  }, [bruto, protocoloUrl]);

  if (!protocoloValido(protocoloUrl)) {
    return (
      <div className="confirmacao">
        <h1 className="confirmacao__titulo">Não encontramos esta solicitação</h1>
        <p className="confirmacao__texto">
          O endereço não tem um número de protocolo válido. Se você já enviou seus dados, procure
          o protocolo no formato <strong>RS-{new Date().getFullYear()}-00000</strong> ou fale com a
          central.
        </p>
        <div className="confirmacao__acoes">
          <Button href={CLINICA.whatsapp.link} external variant="whatsapp" size="grande">
            Falar no WhatsApp
          </Button>
          <Button href="/exames" variant="contorno">
            Voltar para os exames
          </Button>
        </div>
      </div>
    );
  }

  const mensagemGenerica = `Olá! Quero falar sobre a solicitação ${protocoloUrl} de ${exameNome} na Raio Som.`;
  const linkGenerico = `${CLINICA.whatsapp.link}?text=${encodeURIComponent(mensagemGenerica)}`;

  // Quem marcou "Não possuo" no WhatsApp não tem para onde ir nesse botão: o
  // telefone assume o lugar de ação principal.
  const semWhatsapp = dados?.semWhatsapp === true;

  return (
    <div className="confirmacao">
      <span className="confirmacao__icone" aria-hidden="true">
        ✓
      </span>

      <h1 className="confirmacao__titulo">Solicitação registrada</h1>
      <p className="confirmacao__texto">
        {semWhatsapp
          ? "Falta só um passo: ligar para a central com o protocolo em mãos. Um atendente vai conferir seu pedido"
          : "Falta só um passo: enviar a mensagem para a central. Um atendente vai conferir seu pedido"}
        {porOrdemDeChegada
          ? " e orientar o melhor horário para você vir."
          : " e fechar o horário com você."}
      </p>

      <div className="protocolo">
        <p className="protocolo__rotulo">Seu protocolo</p>
        <p className="protocolo__numero">{protocoloUrl}</p>
        <p className="protocolo__nota">
          {dados?.comPedido === false
            ? "Guarde este número e leve o pedido médico impresso no dia do exame."
            : "Seu pedido médico já está salvo com segurança neste protocolo. Guarde este número."}
        </p>
      </div>

      {dados && !semWhatsapp && (
        <div className="previa">
          <p className="previa__rotulo">A mensagem que vai ser enviada</p>
          <div className="balao">{dados.mensagem}</div>
        </div>
      )}

      {!dados && (
        <p
          className="confirmacao__texto"
          style={{ marginTop: "var(--e-6)", fontSize: "var(--txt-sm)" }}
        >
          Esta página foi aberta em outro aparelho ou navegador, então não mostramos a prévia da
          mensagem com seus dados. Seu protocolo continua válido, é só enviá-lo para a central.
        </p>
      )}

      <div className="confirmacao__acoes">
        {semWhatsapp ? (
          <Button href={CLINICA.telefoneLink} size="grande" block>
            Ligar para a central: {CLINICA.telefonePrincipal}
          </Button>
        ) : (
          <>
            <Button
              href={dados?.whatsapp ?? linkGenerico}
              external
              variant="whatsapp"
              size="grande"
              block
            >
              Abrir o WhatsApp da Raio Som
            </Button>
            <Button href={CLINICA.telefoneLink} variant="contorno" block>
              Prefiro ligar: {CLINICA.telefonePrincipal}
            </Button>
          </>
        )}
      </div>

      <div className="aviso" style={{ marginTop: "var(--e-8)", textAlign: "left" }}>
        <span aria-hidden="true">!</span>
        <div>
          <p className="aviso__titulo">Seu horário ainda não está marcado</p>
          <p>
            {porOrdemDeChegada
              ? "Este exame é por ordem de chegada: não existe reserva de turno. A central confirma o pedido médico e a cobertura do convênio e orienta o horário de atendimento."
              : "O agendamento só é confirmado depois que a central validar o pedido médico e a cobertura do convênio."}{" "}
            Atendimento de segunda a sexta, das 7h às 23h, e aos sábados, das 8h às 17h.
          </p>
        </div>
      </div>
    </div>
  );
}
