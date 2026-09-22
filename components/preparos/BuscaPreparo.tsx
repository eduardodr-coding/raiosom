"use client";

import { useEffect, useMemo, useState } from "react";
import { Aviso } from "@/components/ui/Aviso";
import { Button } from "@/components/ui/Button";
import { CLINICA } from "@/content/clinica";
import {
  CAMINHO_DADOS,
  MIN_CARACTERES,
  buscarExames,
  estruturarPreparo,
  type ExamePreparo,
} from "@/lib/preparos";

/**
 * Teto de itens desenhados de uma vez. Termos curtos como "RM" casam com
 * centenas de exames; a lista inteira trava a rolagem no celular. Quando corta,
 * a tela diz quantos ficaram de fora e pede para refinar — nunca escolhe por
 * conta própria qual mostrar.
 */
const MAX_LISTA = 50;

export function BuscaPreparo({ termoInicial = "" }: { termoInicial?: string }) {
  const [dados, setDados] = useState<ExamePreparo[] | null>(null);
  const [erroCarga, setErroCarga] = useState(false);
  const [termo, setTermo] = useState(termoInicial);
  const [selecionado, setSelecionado] = useState<ExamePreparo | null>(null);

  useEffect(() => {
    let ativo = true;

    fetch(CAMINHO_DADOS)
      .then((resposta) => {
        if (!resposta.ok) throw new Error(`HTTP ${resposta.status}`);
        return resposta.json();
      })
      .then((json: ExamePreparo[]) => {
        if (ativo) setDados(json);
      })
      .catch(() => {
        if (ativo) setErroCarga(true);
      });

    return () => {
      ativo = false;
    };
  }, []);

  const resultados = useMemo(
    () => (dados ? buscarExames(dados, termo) : []),
    [dados, termo],
  );

  const termoCurto = termo.trim().length > 0 && termo.trim().length < MIN_CARACTERES;
  const buscou = dados !== null && !termoCurto && termo.trim().length >= MIN_CARACTERES;

  if (erroCarga) {
    return (
      <Aviso tipo="alerta" titulo="Não conseguimos carregar a lista de exames">
        Recarregue a página. Se o problema continuar, fale com a central pelo telefone{" "}
        {CLINICA.telefonePrincipal}, a recepção passa o preparo do seu exame.
      </Aviso>
    );
  }

  return (
    <div className="busca-preparo">
      <label className="busca-preparo__rotulo" htmlFor="busca-preparo">
        Nome do exame, como está no seu pedido médico
      </label>
      <input
        className="busca-preparo__campo"
        id="busca-preparo"
        type="search"
        autoComplete="off"
        placeholder="Ex.: ultrassom abdominal total, mamografia, ressonância de joelho"
        value={termo}
        disabled={dados === null}
        onChange={(evento) => {
          setTermo(evento.target.value);
          // Mexeu na busca, a escolha anterior deixa de valer: o preparo some
          // até o paciente selecionar um exame de novo.
          setSelecionado(null);
        }}
      />

      <p className="busca-preparo__estado" role="status" aria-live="polite">
        {dados === null
          ? "Carregando a lista de exames…"
          : selecionado
            ? `Mostrando o preparo de ${selecionado.exame}.`
            : termoCurto
              ? `Digite pelo menos ${MIN_CARACTERES} letras.`
              : buscou
                ? `${resultados.length} exame(s) encontrado(s). Selecione o seu para ver o preparo.`
                : ""}
      </p>

      {/* Lista de candidatos. Só aparece enquanto nada foi selecionado. */}
      {!selecionado && buscou && resultados.length > 0 && (
        <>
          <ul className="busca-preparo__lista">
            {resultados.slice(0, MAX_LISTA).map((item) => (
              <li key={item.chaveBusca}>
                <button
                  type="button"
                  className="busca-preparo__item"
                  onClick={() => setSelecionado(item)}
                >
                  {item.exame}
                </button>
              </li>
            ))}
          </ul>
          {resultados.length > MAX_LISTA && (
            <p className="busca-preparo__nota">
              Mostrando os {MAX_LISTA} primeiros de {resultados.length}. Escreva o nome mais
              completo para encontrar o seu exame.
            </p>
          )}
        </>
      )}

      {!selecionado && buscou && resultados.length === 0 && (
        <div className="busca-preparo__vazio">
          <p>
            Nenhum exame encontrado. Confira o nome no seu pedido médico ou fale com a recepção.
          </p>
          <div className="busca-preparo__vazio-acoes">
            <Button href={CLINICA.whatsapp.link} external variant="whatsapp" size="pequeno">
              Perguntar no WhatsApp
            </Button>
            <Button href={CLINICA.telefoneLink} variant="contorno" size="pequeno">
              Ligar: {CLINICA.telefonePrincipal}
            </Button>
          </div>
        </div>
      )}

      {selecionado && <ResultadoPreparo exame={selecionado} aoTrocar={() => setSelecionado(null)} />}
    </div>
  );
}

function ResultadoPreparo({
  exame,
  aoTrocar,
}: {
  exame: ExamePreparo;
  aoTrocar: () => void;
}) {
  return (
    <div className="preparo-resultado">
      <div className="preparo-resultado__topo">
        <h2 className="preparo-resultado__nome">{exame.exame}</h2>
        <button type="button" className="preparo-resultado__trocar" onClick={aoTrocar}>
          Buscar outro exame
        </button>
      </div>

      {exame.temPreparo ? (
        <div className="preparo-resultado__corpo">
          {estruturarPreparo(exame.preparo).map((bloco, indice) => {
            if (bloco.tipo === "titulo") {
              return (
                <h3 className="preparo-resultado__subtitulo" key={indice}>
                  {bloco.texto}
                </h3>
              );
            }
            if (bloco.tipo === "itens") {
              return (
                <ul className="preparo-resultado__itens" key={indice}>
                  {bloco.itens.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              );
            }
            return (
              <p className="preparo-resultado__texto" key={indice}>
                {bloco.texto}
              </p>
            );
          })}
        </div>
      ) : (
        <p className="preparo-resultado__sem-preparo">
          Este exame não exige preparo específico. Chegue no horário agendado com documento com
          foto e o pedido médico.
        </p>
      )}

      <Aviso tipo="info" titulo="Ficou com dúvida sobre o preparo?">
        Na dúvida, confirme com a central antes do dia do exame pelo WhatsApp{" "}
        {CLINICA.whatsapp.exibicao} ou pelo telefone {CLINICA.telefonePrincipal}.
      </Aviso>
    </div>
  );
}
