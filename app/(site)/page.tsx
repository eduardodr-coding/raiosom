import Image from "next/image";
import Link from "next/link";
import { Revelar } from "@/components/Revelar";
import { BaixarApp } from "@/components/site/BaixarApp";
import { Button } from "@/components/ui/Button";
import { CLINICA, ENTREGA_EXAMES, UNIDADES } from "@/content/clinica";
import { CONVENIOS_LOGOS, CONVENIOS_NOMES, CONVENIOS_OUTROS } from "@/content/convenios";
import { EXAMES } from "@/content/exames";

import "@/styles/home.css";
import "@/styles/exames.css";

// Cada termo é um sinônimo de content/catalogo/sinonimos.json, então o
// atalho cai na mesma busca que o paciente faria digitando.
const BUSCAS_RAPIDAS = [
  { rotulo: "Ressonância", termo: "ressonancia" },
  { rotulo: "Tomografia", termo: "tomografia" },
  { rotulo: "Ultrassom", termo: "ultrassom" },
  { rotulo: "Mamografia", termo: "mamografia" },
  { rotulo: "Raio X", termo: "raio x" },
  { rotulo: "Biópsia", termo: "biopsia" },
  { rotulo: "Densitometria Óssea", termo: "densitometria" },
  { rotulo: "Radiologia Odontológica", termo: "odontologia" },
];

const PASSOS = [
  {
    titulo: "Busque seu exame",
    texto: "Digite o nome que está no pedido médico e veja na hora se realizamos o exame e em qual unidade.",
  },
  {
    titulo: "Veja os detalhes e o convênio",
    texto: "Veja o que levar no dia, se o exame usa contraste e se o seu plano cobre, antes de sair de casa.",
  },
  {
    titulo: "Faça o pré-agendamento",
    texto:
      "Preencha seus dados e anexe a foto do pedido médico. A central confirma o horário com você pelo WhatsApp.",
  },
];

export default function Home() {
  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="hero">
        <Image
          className="hero__foto"
          src="/unidades/recepcao-matriz.jpg"
          alt=""
          width={1600}
          height={1200}
          priority
          sizes="100vw"
        />
        <div className="hero__veu" aria-hidden="true" />
        <div className="container hero__grid">
          <div>
            <span className="hero__kicker">
              Diagnóstico por imagem · desde {CLINICA.desde}
            </span>
            <h1 className="hero__titulo">O exame de imagem certo, sem complicação.</h1>
            <p className="hero__sub">
              Descubra se realizamos o seu exame e faça o pré-agendamento em poucos
              passos, direto pelo site.
            </p>

            {/* Form GET puro: funciona sem JavaScript e deixa o resultado da
                busca em uma URL que dá para compartilhar. */}
            <form className="busca" action="/exames" method="get" role="search">
              <label className="sr-only" htmlFor="busca-hero">
                Buscar exame
              </label>
              <input
                className="busca__campo"
                id="busca-hero"
                name="q"
                type="search"
                placeholder="Ex.: ressonância de joelho"
                autoComplete="off"
              />
              <Button type="submit">Buscar</Button>
            </form>

            <div className="hero__chips">
              {BUSCAS_RAPIDAS.map((busca) => (
                <Link
                  key={busca.termo}
                  className="chip chip--sobre-escuro"
                  href={`/exames?q=${encodeURIComponent(busca.termo)}`}
                >
                  {busca.rotulo}
                </Link>
              ))}
            </div>

            <div className="hero__confianca">
              <span className="selo-padi">
                <Image
                  src="/marca/padi.png"
                  alt="Programa de Qualidade PADI, acreditação do Colégio Brasileiro de Radiologia"
                  width={1250}
                  height={1250}
                  sizes="68px"
                />
              </span>
              <span className="badge badge--sobre-escuro">{CLINICA.acreditacao.resumo}</span>
              <span>{CLINICA.anos} anos de tradição em Gravataí e Cachoeirinha</span>
            </div>
          </div>

          <Revelar className="hero-card">
            {/* Duas perguntas, duas saídas: quem vai fazer o exame começa o
                pré-agendamento; quem já fez vai atrás do laudo. */}
            <span className="badge badge--acao">Pré-agendamento</span>
            <h2 className="hero-card__titulo">Vai fazer um exame?</h2>
            <p className="hero-card__texto">
              Envie seus dados e a foto do pedido médico. A central confirma o horário com você.
            </p>
            <div className="hero-card__acoes">
              <Button href="/agendar" block>
                Fazer pré-agendamento
              </Button>
            </div>

            <div className="hero-card__divisor" aria-hidden="true" />

            <span className="badge badge--acao">Resultado online</span>
            <h2 className="hero-card__titulo">Já fez seu exame?</h2>
            <p className="hero-card__texto">
              Acesse laudos e imagens pelo portal ou pelo aplicativo, a qualquer hora.
            </p>
            <div className="hero-card__acoes">
              <Button href={CLINICA.links.portalResultados} external block>
                Acessar portal de resultados
              </Button>
              <BaixarApp />
            </div>
          </Revelar>
        </div>
      </section>

      {/* ── Como funciona ────────────────────────────────────────────────── */}
      <section className="secao secao--alt">
        <div className="container">
          <Revelar style={{ textAlign: "center" }}>
            <span className="kicker">Simples assim</span>
            <h2>Do pedido médico ao agendamento em 3 passos</h2>
          </Revelar>

          <div className="passos" style={{ marginTop: "var(--e-10)" }}>
            {PASSOS.map((passo, indice) => (
              <Revelar key={passo.titulo} delay={indice * 80}>
                <div className="card" style={{ height: "100%" }}>
                  <span className="passo__numero" aria-hidden="true">
                    {indice + 1}
                  </span>
                  <h3 className="passo__titulo">{passo.titulo}</h3>
                  <p className="passo__texto">{passo.texto}</p>
                </div>
              </Revelar>
            ))}
          </div>
        </div>
      </section>

      {/* ── Convênios ────────────────────────────────────────────────────── */}
      <section className="secao">
        <div className="container">
          <Revelar className="secao__cabecalho">
            <div>
              <span className="kicker">Convênios</span>
              <h2>Atendemos os principais planos</h2>
            </div>
            <Button href="/convenios" variant="contorno">
              Verificar meu convênio →
            </Button>
          </Revelar>

          {/* Os logos são a referência que o paciente reconhece na carteirinha.
              A lista em texto vem logo abaixo porque a grade de imagens não
              diz nada para leitor de tela nem para busca — e o pareamento
              logo↔nome ainda não foi confirmado pela clínica. */}
          <Revelar className="grade-logos">
            {CONVENIOS_LOGOS.map((logo) => (
              <div className="logo-convenio" key={logo}>
                <Image
                  src={logo}
                  alt="Convênio atendido pela Raio Som"
                  width={150}
                  height={150}
                  sizes="150px"
                  style={{ width: "100%", height: "auto" }}
                />
              </div>
            ))}
          </Revelar>

          <Revelar className="convenios-nomes">
            Atendemos {CONVENIOS_NOMES.join(", ")} e mais {CONVENIOS_OUTROS} convênios.{" "}
            <Link href="/convenios">Ver a lista completa</Link>.
          </Revelar>
        </div>
      </section>

      {/* ── Unidades ─────────────────────────────────────────────────────── */}
      <section className="secao secao--alt">
        <div className="container">
          <Revelar>
            <span className="kicker">Unidades</span>
            <h2>Onde estamos</h2>
          </Revelar>

          <div className="grade-unidades" style={{ marginTop: "var(--e-10)" }}>
            {UNIDADES.map((unidade, indice) => (
              <Revelar key={unidade.slug} delay={indice * 80}>
                <article className="unidade-card">
                  <div className="unidade-card__mapa">
                    {unidade.foto ? (
                      <Image
                        className="unidade-card__foto"
                        src={unidade.foto}
                        alt=""
                        width={626}
                        height={150}
                        sizes="(max-width: 900px) 100vw, 50vw"
                      />
                    ) : (
                      <div className="unidade-card__mapa--sem-foto" aria-hidden="true">
                        {unidade.etiqueta.split("·").pop()?.trim()}
                      </div>
                    )}
                  </div>

                  <div className="unidade-card__corpo">
                    <span className="badge">{unidade.etiqueta.toUpperCase()}</span>
                    <h3 className="unidade-card__nome">{unidade.nome}</h3>
                    <p className="unidade-card__endereco">
                      {unidade.endereco
                        ? `${unidade.endereco} · ${unidade.complemento}`
                        : `${unidade.cidade} · ${unidade.descricao}`}
                    </p>
                    <ul className="unidade-card__horarios">
                      {unidade.horarios.map((horario) => (
                        <li key={horario}>{horario}</li>
                      ))}
                    </ul>
                    <a className="unidade-card__telefone" href={CLINICA.telefoneLink}>
                      {unidade.telefone}
                    </a>
                    <div className="unidade-card__acoes">
                      {EXAMES.some((exame) => exame.unidades.includes(unidade.slug)) ? (
                        <Button href={`/exames?unidade=${unidade.slug}`}>
                          Agendar nesta unidade
                        </Button>
                      ) : (
                        <Button href={CLINICA.whatsapp.link} external variant="whatsapp">
                          Perguntar no WhatsApp
                        </Button>
                      )}
                      <Button href={unidade.mapa} external variant="contorno">
                        Como chegar
                      </Button>
                    </div>
                  </div>
                </article>
              </Revelar>
            ))}

            {/* O prédio administrativo fecha a grade: não realiza exame, mas é
                endereço que o paciente precisa conhecer para retirar o laudo. */}
            <Revelar delay={UNIDADES.length * 80}>
              <article className="unidade-card">
                <div className="unidade-card__mapa">
                  <Image
                    className="unidade-card__foto"
                    src={ENTREGA_EXAMES.foto}
                    alt=""
                    width={626}
                    height={150}
                    sizes="(max-width: 700px) 100vw, 33vw"
                  />
                </div>

                <div className="unidade-card__corpo">
                  <span className="badge">RETIRADA DE EXAMES</span>
                  <h3 className="unidade-card__nome">{ENTREGA_EXAMES.nome}</h3>
                  <p className="unidade-card__endereco">
                    {ENTREGA_EXAMES.endereco}
                    <br />
                    {ENTREGA_EXAMES.cidade}
                  </p>
                  <ul className="unidade-card__horarios">
                    {ENTREGA_EXAMES.horarios.map((horario) => (
                      <li key={horario}>{horario}</li>
                    ))}
                  </ul>
                  <a className="unidade-card__telefone" href={CLINICA.telefoneLink}>
                    {CLINICA.telefonePrincipal}
                  </a>
                  <p
                    style={{
                      marginTop: "var(--e-4)",
                      fontSize: "var(--txt-sm)",
                      color: "var(--texto-suave)",
                    }}
                  >
                    {ENTREGA_EXAMES.descricao}.
                  </p>
                  <div className="unidade-card__acoes">
                    <Button href={CLINICA.links.portalResultados} external>
                      Ver exame online
                    </Button>
                    <Button href={ENTREGA_EXAMES.mapa} external variant="contorno">
                      Como chegar
                    </Button>
                  </div>
                </div>
              </article>
            </Revelar>
          </div>
        </div>
      </section>
    </>
  );
}
