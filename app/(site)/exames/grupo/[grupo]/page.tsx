import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { CLINICA } from "@/content/clinica";
import { examePorSlug } from "@/content/exames";
import { descreverVariacao, grupoPorSlug, paginaDoGrupo } from "@/lib/catalogo";

import "@/styles/exames.css";

type Props = { params: Promise<{ grupo: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { grupo: slug } = await params;
  const grupo = grupoPorSlug(slug);
  if (!grupo) return {};

  return {
    title: grupo.nome,
    description: `${grupo.nome} na Raio Som: veja as variações do exame e envie o pedido médico para agendar.`,
  };
}

export default async function PaginaGrupo({ params }: Props) {
  const { grupo: slug } = await params;
  const grupo = grupoPorSlug(slug);
  if (!grupo) notFound();

  const exame = paginaDoGrupo(grupo);
  const modalidade = exame ? examePorSlug(exame) : undefined;

  // Uma variação só não é escolha: o paciente já está no exame que procurava.
  const escolher = grupo.variacoes.length > 1;

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
            {escolher
              ? "Confira no seu pedido médico qual destas opções o médico solicitou e clique nela. Na dúvida, a central confirma com você."
              : "Realizamos este exame."}
          </p>
        </div>
      </div>

      <section className="secao">
        <div className="container">
          {escolher && (
            <h2 className="bloco__titulo" style={{ marginBottom: "var(--e-5)" }}>
              Opções deste exame
            </h2>
          )}

          <ul className="lista-variacoes">
            {grupo.variacoes.map((variacao) => {
              const descricao = descreverVariacao(variacao);
              const etiqueta = (
                <>
                  <span className="variacao__nome">{grupo.nome}</span>
                  {descricao && <span className="variacao__detalhe">{descricao}</span>}
                  {variacao.convenio && (
                    <span className="badge badge--neutro">
                      Específico {variacao.convenio}
                    </span>
                  )}
                </>
              );

              // Cada variação leva a própria escolha para o formulário pelo id
              // do catálogo. É o id que viaja, e não o nome interno, porque a
              // URL fica à vista do paciente. Quem resolve o id de volta é o
              // servidor, no agendamento e de novo na API.
              return modalidade ? (
                <li key={variacao.id}>
                  <Link
                    className="variacao variacao--acao"
                    href={`/agendar/${modalidade.slug}?exame=${variacao.id}`}
                  >
                    {etiqueta}
                    <span className="variacao__seta" aria-hidden="true">
                      →
                    </span>
                  </Link>
                </li>
              ) : (
                <li className="variacao" key={variacao.id}>
                  {etiqueta}
                </li>
              );
            })}
          </ul>

          <div className="grupo-acoes">
            {modalidade ? (
              <>
                <p className="grupo-acoes__texto">
                  Escolha acima a opção que está no seu pedido médico. Este exame
                  é feito na {modalidade.nome}.
                </p>
                <div className="grupo-acoes__botoes">
                  <Button href={`/exames/${modalidade.slug}`} variant="contorno">
                    Regras e detalhes
                  </Button>
                </div>
              </>
            ) : (
              // Procedimentos (paracentese, nefrostomia, marcação pré-cirúrgica)
              // não têm página própria e dependem de avaliação da equipe, então
              // vão para a central em vez de cair num formulário genérico.
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
        </div>
      </section>
    </>
  );
}
