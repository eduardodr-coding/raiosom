"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Checkbox";
import { FileUpload } from "@/components/ui/FileUpload";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { useToast } from "@/components/ui/Toast";
import { TURNOS, UNIDADES } from "@/content/clinica";
import { OPCOES_COBERTURA } from "@/content/convenios";
import type { Exame } from "@/content/exames";
import { mascaraCPF, mascaraData, mascaraTelefone } from "@/lib/mascaras";
import { TEXTO_CONSENTIMENTO, emailValido } from "@/lib/validacao";

export type FormularioAgendamentoProps = {
  exame: Exame;
  /** Unidade pré-selecionada quando o paciente veio do card de uma unidade. */
  unidadeInicial?: string;
  /**
   * Id da variação escolhida na busca do catálogo. Vai junto no envio para a
   * central receber exatamente o exame que o paciente apontou, e não só a
   * modalidade. Indefinido quando ele entrou direto pela página do exame.
   */
  catalogoId?: number;
};

type Erros = Record<string, string>;

/** Guarda a prévia da mensagem para a tela de confirmação ler. */
export const CHAVE_SESSAO = "raiosom:solicitacao";

export function FormularioAgendamento({
  exame,
  unidadeInicial,
  catalogoId,
}: FormularioAgendamentoProps) {
  const router = useRouter();
  const toast = useToast();

  const porOrdemDeChegada = exame.agendamento === "ordem-de-chegada";

  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [nascimento, setNascimento] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [semWhatsapp, setSemWhatsapp] = useState(false);
  const [email, setEmail] = useState("");
  const [semEmail, setSemEmail] = useState(false);
  const [convenio, setConvenio] = useState("");
  const [unidade, setUnidade] = useState(
    unidadeInicial && exame.unidades.includes(unidadeInicial as never)
      ? unidadeInicial
      : exame.unidades[0],
  );
  const [turno, setTurno] = useState(porOrdemDeChegada ? "tanto_faz" : "");
  const [arquivo, setArquivo] = useState<File | null>(null);
  const [consentimento, setConsentimento] = useState(false);

  const [erros, setErros] = useState<Erros>({});
  const [enviando, setEnviando] = useState(false);

  // Só as unidades que realizam este exame. Os pontos de atendimento (Solaris,
  // IOG) não entram em nenhum `exame.unidades`: lá o paciente só marca, o
  // exame acontece em outro lugar. Oferecê-los aqui era prometer um
  // atendimento que não existe no endereço. Pelo mesmo motivo a Millenarium
  // só aparece na ultrassonografia, o único exame que ela realiza.
  const unidadesDoExame = UNIDADES.filter((item) => exame.unidades.includes(item.slug));

  // A filial de Cachoeirinha não aceita Unimed. O card continua na lista,
  // mas desabilitado, para o paciente entender o motivo em vez de a unidade
  // simplesmente sumir da tela.
  const cachoeirinhaBloqueada = convenio === "Unimed";

  function selecionarConvenio(valor: string) {
    setConvenio(valor);
    limparErro("convenio");
    if (valor === "Unimed" && unidade === "cachoeirinha") {
      const alternativa = unidadesDoExame.find((item) => item.slug !== "cachoeirinha");
      if (alternativa) {
        setUnidade(alternativa.slug);
        toast.mostrar(
          "A unidade Cachoeirinha não atende pelo convênio Unimed. Selecionamos outra unidade.",
          "info",
        );
      }
    }
  }

  function limparErro(campo: string) {
    setErros((atuais) => {
      if (!atuais[campo]) return atuais;
      const novos = { ...atuais };
      delete novos[campo];
      return novos;
    });
  }

  /** Espelha as regras do servidor, só para o paciente não esperar a ida e volta. */
  function validarNoCliente(): Erros {
    const novos: Erros = {};
    if (nome.trim().split(/\s+/).length < 2) novos.pacienteNome = "Informe nome e sobrenome.";
    if (cpf.replace(/\D/g, "").length !== 11) novos.cpf = "O CPF precisa ter 11 dígitos.";
    if (nascimento.length < 10) novos.dataNascimento = "Informe a data no formato dd/mm/aaaa.";
    if (!semWhatsapp && whatsapp.replace(/\D/g, "").length < 10)
      novos.whatsapp = "Informe o WhatsApp com DDD.";
    if (!semEmail && !emailValido(email))
      novos.email = "Informe um e-mail válido, ex.: nome@email.com.";
    if (!convenio) novos.convenio = "Escolha o convênio ou particular.";
    if (!turno) novos.turno = "Escolha o turno de preferência.";
    // O pedido médico é o único campo opcional: quem não tem a foto na hora
    // leva o papel no dia.
    if (!consentimento) novos.consentimento = "É preciso autorizar o tratamento dos dados.";
    return novos;
  }

  async function enviar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    if (enviando) return;

    const problemas = validarNoCliente();
    if (Object.keys(problemas).length > 0) {
      setErros(problemas);
      toast.mostrar("Confira os campos destacados antes de enviar.", "erro");
      document.querySelector<HTMLElement>("[aria-invalid='true']")?.focus();
      return;
    }

    setEnviando(true);
    setErros({});

    const dados = new FormData();
    dados.set("exameSlug", exame.slug);
    if (catalogoId) dados.set("catalogoId", String(catalogoId));
    dados.set("pacienteNome", nome.trim());
    dados.set("cpf", cpf);
    dados.set("dataNascimento", nascimento);
    dados.set("whatsapp", semWhatsapp ? "" : whatsapp);
    dados.set("semWhatsapp", String(semWhatsapp));
    dados.set("email", semEmail ? "" : email.trim());
    dados.set("semEmail", String(semEmail));
    dados.set("convenio", convenio);
    dados.set("unidade", unidade);
    dados.set("turno", turno);
    dados.set("consentimento", String(consentimento));
    if (arquivo) dados.set("pedidoMedico", arquivo);

    try {
      const resposta = await fetch("/api/solicitacoes", { method: "POST", body: dados });
      const corpo = await resposta.json().catch(() => null);

      if (!resposta.ok) {
        if (corpo?.campos) setErros(corpo.campos);
        toast.mostrar(corpo?.erro ?? "Não conseguimos enviar sua solicitação.", "erro");
        setEnviando(false);
        return;
      }

      // A confirmação não busca nada no banco pelo protocolo: assim ninguém
      // recupera dados de paciente só adivinhando um número de protocolo.
      try {
        sessionStorage.setItem(
          CHAVE_SESSAO,
          JSON.stringify({
            protocolo: corpo.protocolo,
            mensagem: corpo.mensagem,
            whatsapp: corpo.whatsapp,
            semWhatsapp: corpo.semWhatsapp,
            comPedido: corpo.comPedido,
            semRegistro: corpo.semRegistro === true,
            exameSlug: exame.slug,
          }),
        );
      } catch {
        // Navegador com armazenamento bloqueado: a confirmação cai no texto
        // genérico, que ainda leva o paciente ao WhatsApp com o protocolo.
        // Sem protocolo não há texto genérico que sirva: vai direto.
        if (!corpo.protocolo && !corpo.semWhatsapp) {
          window.location.href = corpo.whatsapp;
          return;
        }
      }

      router.push(
        corpo.protocolo
          ? `/agendar/${exame.slug}/confirmacao?protocolo=${encodeURIComponent(corpo.protocolo)}`
          : `/agendar/${exame.slug}/confirmacao`,
      );
    } catch {
      toast.mostrar(
        "Sua conexão caiu no meio do envio. Verifique a internet e tente de novo.",
        "erro",
      );
      setEnviando(false);
    }
  }

  return (
    <form className="form-card" onSubmit={enviar} noValidate>
      <h1 className="form-card__titulo">Seus dados e o pedido médico</h1>
      <p className="form-card__sub">
        Preencha uma vez aqui para a central não precisar pedir tudo de novo no WhatsApp.
      </p>

      <div className="form-secao">
        <Input
          label="Nome completo do paciente"
          name="pacienteNome"
          value={nome}
          onChange={(e) => {
            setNome(e.target.value);
            limparErro("pacienteNome");
          }}
          placeholder="Exatamente como está no documento"
          autoComplete="name"
          error={erros.pacienteNome}
          required
        />
      </div>

      <div className="form-linha form-linha--duas form-secao">
        <Input
          label="CPF do paciente"
          name="cpf"
          value={cpf}
          onChange={(e) => {
            setCpf(mascaraCPF(e.target.value));
            limparErro("cpf");
          }}
          placeholder="000.000.000-00"
          inputMode="numeric"
          error={erros.cpf}
          required
        />
        <Input
          label="Data de nascimento"
          name="dataNascimento"
          value={nascimento}
          onChange={(e) => {
            setNascimento(mascaraData(e.target.value));
            limparErro("dataNascimento");
          }}
          placeholder="dd/mm/aaaa"
          inputMode="numeric"
          error={erros.dataNascimento}
          required
        />
      </div>

      {/* Contato. Cada um tem a saída "Não possuo" ao lado, e os dois podem
          ficar em branco: a clínica prefere receber a solicitação assim a
          perder o pedido. Sem nenhum contato, a tela final manda ligar. */}
      <div className="form-secao campo-contato">
        <Input
          label="WhatsApp para contato"
          name="whatsapp"
          type="tel"
          value={whatsapp}
          onChange={(e) => {
            setWhatsapp(mascaraTelefone(e.target.value));
            limparErro("whatsapp");
          }}
          placeholder="(51) 90000-0000"
          inputMode="tel"
          autoComplete="tel"
          hint="É por aqui que a central confirma o horário."
          error={erros.whatsapp}
          disabled={semWhatsapp}
          required={!semWhatsapp}
        />
        <Checkbox
          className="campo-contato__opcao"
          name="semWhatsapp"
          checked={semWhatsapp}
          onChange={(e) => {
            setSemWhatsapp(e.target.checked);
            if (e.target.checked) setWhatsapp("");
            limparErro("whatsapp");
          }}
        >
          Não possuo
        </Checkbox>
      </div>

      <div className="form-secao campo-contato">
        <Input
          label="E-mail"
          name="email"
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            limparErro("email");
          }}
          placeholder="nome@email.com"
          inputMode="email"
          autoComplete="email"
          error={erros.email}
          disabled={semEmail}
          required={!semEmail}
        />
        <Checkbox
          className="campo-contato__opcao"
          name="semEmail"
          checked={semEmail}
          onChange={(e) => {
            setSemEmail(e.target.checked);
            if (e.target.checked) setEmail("");
            limparErro("email");
          }}
        >
          Não possuo
        </Checkbox>
      </div>

      <div className="form-secao">
        <Select
          label="Convênio ou particular"
          name="convenio"
          value={convenio}
          onChange={(e) => selecionarConvenio(e.target.value)}
          placeholder="Selecione"
          error={erros.convenio}
          required
        >
          {OPCOES_COBERTURA.map((opcao) => (
            <option key={opcao.valor} value={opcao.valor}>
              {opcao.rotulo}
            </option>
          ))}
        </Select>
      </div>

      <fieldset className="form-secao">
        <legend className="form-secao__titulo">Em qual unidade você prefere?</legend>
        <div className="opcoes-unidade">
          {unidadesDoExame.map((item) => {
            const desabilitada = cachoeirinhaBloqueada && item.slug === "cachoeirinha";
            return (
              <label
                className="opcao-cartao"
                key={item.slug}
                data-desabilitado={desabilitada || undefined}
              >
                <input
                  className="opcao-cartao__entrada"
                  type="radio"
                  name="unidade"
                  value={item.slug}
                  checked={unidade === item.slug}
                  disabled={desabilitada}
                  onChange={() => setUnidade(item.slug)}
                />
                <span className="opcao-cartao__titulo">{item.etiqueta}</span>
                <span className="opcao-cartao__texto">
                  {item.endereco ?? item.descricao}
                  <br />
                  {item.horarios.join(" · ")}
                </span>
                {desabilitada && (
                  <span className="opcao-cartao__aviso">Não atende convênio Unimed.</span>
                )}
              </label>
            );
          })}
        </div>
      </fieldset>

      {!porOrdemDeChegada && (
        <fieldset className="form-secao">
          <legend className="form-secao__titulo">Qual turno fica melhor pra você?</legend>
          <div className="opcoes-turno">
            {TURNOS.map((opcao) => (
              <label className="opcao-turno" key={opcao.valor}>
                <input
                  type="radio"
                  name="turno"
                  value={opcao.valor}
                  checked={turno === opcao.valor}
                  onChange={() => {
                    setTurno(opcao.valor);
                    limparErro("turno");
                  }}
                />
                <span>{opcao.rotulo}</span>
              </label>
            ))}
          </div>
          {erros.turno && (
            <p className="campo__erro" role="alert" style={{ marginTop: "var(--e-3)" }}>
              <span aria-hidden="true">⚠</span>
              {erros.turno}
            </p>
          )}
          <p className="form-secao__ajuda">
            A central confirma o horário exato com você no WhatsApp, conforme a agenda do
            equipamento.
          </p>
        </fieldset>
      )}

      <div className="form-secao">
        <h2 className="form-secao__titulo" id="rotulo-upload">
          Anexe a foto do pedido médico <span className="campo__opcional">(opcional)</span>
        </h2>
        <p className="form-secao__ajuda" style={{ marginTop: 0, marginBottom: "var(--e-4)" }}>
          Anexando aqui, a central já confere a cobertura antes de você vir. Se
          preferir, é só levar o pedido no dia — sem ele o exame não é realizado.
        </p>
        <FileUpload
          id="pedido-medico"
          arquivo={arquivo}
          onChange={(novo) => {
            setArquivo(novo);
            limparErro("pedidoMedico");
          }}
          onRejeitado={(motivo) => toast.mostrar(motivo, "erro")}
          error={erros.pedidoMedico}
        />
      </div>

      <div className="form-envio">
        <Checkbox
          name="consentimento"
          checked={consentimento}
          onChange={(e) => {
            setConsentimento(e.target.checked);
            limparErro("consentimento");
          }}
          error={erros.consentimento}
        >
          {TEXTO_CONSENTIMENTO.replace(" conforme a Política de Privacidade e a LGPD.", "")}{" "}
          conforme a{" "}
          {/* Nova aba de propósito: o paciente não perde o formulário já preenchido. */}
          <a href="/politica-de-privacidade" target="_blank" rel="noopener noreferrer">
            Política de Privacidade
          </a>{" "}
          e a LGPD.
        </Checkbox>

        <div style={{ marginTop: "var(--e-6)" }}>
          <Button type="submit" size="grande" block loading={enviando}>
            {enviando
              ? "Enviando…"
              : semWhatsapp
                ? "Enviar pré-agendamento"
                : "Continuar no WhatsApp"}
          </Button>
        </div>
      </div>
    </form>
  );
}
