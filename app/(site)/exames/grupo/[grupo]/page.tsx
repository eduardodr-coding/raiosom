import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { CLINICA } from "@/content/clinica";
import { examePorSlug } from "@/content/exames";
import {
  type CampoVariacao,
  grupoPorSlug,
  paginaDoGrupo,
  refinarGrupo,
  rotuloVariacao,
} from "@/lib/catalogo";

import "@/styles/exames.css";

type Props = {
  params: Promise<{ grupo: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

const CAMPOS: CampoVariacao[] = ["regiao", "lado", "contraste", "detalhe", "convenio"];

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { grupo: slug } = await params;
  const grupo = grupoPorSlug(slug);
  if (!grupo) return {};

  return {
    title: grupo.nome,
    description: `${grupo.nome} na Raio Som: escolha a opção que está no seu pedido médico e faça o pré-agendamento.`,
  };
}

export default async function PaginaGrupo({ params, searchParams }: Props) {
  const { grupo: slug } = await params;
  const grupo = grupoPorSlug(slug);
  if (!grupo) notFound();

  // Só o que o refino conhece entra: o resto da query string é ignorado.
  const query = await searchParams;
  const escolhas: Partial<Record<CampoVariacao, string>> = {};
  for (const campo of CAMPOS) {
    const valor = query[campo];
    if (typeof valor === "string" && valor) escolhas[campo] = valor;
  }

  const { regiao, seletores, escolhido } = refinarGrupo(grupo, escolhas);
  const exame = paginaDoGrupo(grupo);
  const modalidade = exame ? examePorSlug(exame) : undefined;

  const escolhendoRegiao = regiao !== null && seletores.length === 0 && !escolhido;

  return (
    <>
      <div className="pagina-topo">
        <div className="container">
          <ol className="trilha">
            <li>
              <Link href="/">Início</Link>
            </li>
            <li>
              <Link href="/exames">Exames</Link>
            </li>
            <li>{grupo.nome}</li>
          </ol>
          <h1>{grupo.nome}</h1>
          <p className="pagina-topo__texto">
            {escolhendoRegiao
              ? "Comece pela região que está no seu pedido médico."
              : seletores.length > 0
                ? "Marque abaixo o que está escrito no seu pedido médico. Na dúvida, escolha “não sei” e a central confirma com você."
                : "Realizamos este exame."}
          </p>
        </div>
      </div>

      <section className="secao">
        <div className="container">
          {/* Etapa 1. Vale para um grupo só do catálogo hoje, mas é o primeiro
              corte quando existe: sem a região, perguntar lado ou contraste
              não faz sentido. */}
          {escolhendoRegiao && regiao && (
            <>
              <h2 className="bloco__titulo">{regiao.titulo}</h2>
              <ul className="lista-variacoes" style={{ marginTop: "var(--e-5)" }}>
                {regiao.opcoes.map((opcao) => (
                  <li key={opcao.valor}>
                    <Link
                      className="variacao variacao--acao"
                      href={`/exames/grupo/${grupo.slug}?regiao=${opcao.valor}`}
                    >
                      <span className="variacao__nome">{opcao.rotulo}</span>
                      <span className="variacao__seta" aria-hidden="true">
                        →
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          )}

          {/* Etapa 2. Um GET só, com todas as perguntas que ainda separam as
              variações: o paciente responde de uma vez, a URL fica
              compartilhável e a tela funciona sem JavaScript. */}
          {seletores.length > 0 && (
            <form className="form-variacao" method="get">
              {escolhas.regiao && (
                <input type="hidden" name="regiao" value={escolhas.regiao} />
              )}

              {seletores.map((seletor) => (
                <fieldset className="escolha" key={seletor.campo}>
                  <legend className="escolha__titulo">{seletor.titulo}</legend>
                  <div className="opcoes-escolha">
                    {seletor.opcoes.map((opcao) => (
                      <label className="opcao-escolha" key={opcao.valor}>
                        <input
                          type="radio"
                          name={seletor.campo}
                          value={opcao.valor}
                          defaultChecked={escolhas[seletor.campo] === opcao.valor}
                          required
                        />
                        <span>{opcao.rotulo}</span>
                      </label>
                    ))}
                  </div>
                </fieldset>
              ))}

              <Button type="submit">
                {escolhido ? "Atualizar opção" : "Ver opção do exame"}
              </Button>
            </form>
          )}

          {escolhido && (
            <div className="grupo-acoes">
              <p className="grupo-acoes__rotulo">Exame selecionado</p>
              <p className="grupo-acoes__exame">
                {rotuloVariacao(escolhido)}
                {escolhido.convenio && (
                  <span className="badge badge--neutro">
                    Específico {escolhido.convenio}
                  </span>
                )}
              </p>

              {modalidade ? (
                <>
                  <p className="grupo-acoes__texto">
                    Este exame é feito na {modalidade.nome}. Envie a foto do pedido
                    médico e a central confirma o horário com você.
                  </p>
                  <div className="grupo-acoes__botoes">
                    {/* O que viaja é o id da linha do catálogo, nunca o código
                        interno: a URL fica à vista do paciente. */}
                    <Button href={`/agendar/${modalidade.slug}?exame=${escolhido.id}`}>
                      Fazer pré-agendamento
                    </Button>
                    <Button href={`/exames/${modalidade.slug}`} variant="contorno">
                      Orientações e detalhes
                    </Button>
                  </div>
                </>
              ) : (
                // Procedimentos (paracentese, nefrostomia, marcação
                // pré-cirúrgica) não têm página própria e dependem de avaliação
                // da equipe, então vão para a central em vez de cair num
                // formulário genérico.
                <>
                  <p className="grupo-acoes__texto">
                    Este procedimento é agendado pela central, que confere o pedido
                    médico com você.
                  </p>
                  <div className="grupo-acoes__botoes">
                    <Button href={CLINICA.whatsapp.link} external variant="whatsapp">
                      Falar no WhatsApp
                    </Button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
