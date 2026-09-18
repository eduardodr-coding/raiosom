import Image from "next/image";
import Link from "next/link";
import { Revelar } from "@/components/Revelar";
import { Button } from "@/components/ui/Button";
import { CLINICA, UNIDADES } from "@/content/clinica";
import { CONVENIOS_LOGOS, CONVENIOS_NOMES, CONVENIOS_OUTROS } from "@/content/convenios";
import { EXAMES } from "@/content/exames";

import "@/styles/home.css";
import "@/styles/exames.css";

const BUSCAS_RAPIDAS = [
  { rotulo: "Ressonância", termo: "ressonancia" },
  { rotulo: "Tomografia", termo: "tomografia" },
  { rotulo: "Ultrassom", termo: "ultrassom" },
  { rotulo: "Mamografia", termo: "mamografia" },
  { rotulo: "Raio X", termo: "raio x" },
];

const PASSOS = [
  {
    titulo: "Busque seu exame",
    texto: "Digite o nome ou a modalidade e veja na hora se realizamos, em qual unidade.",
  },
  {
    titulo: "Veja preparo e convênio",
    texto: "Instruções de jejum e contraste e se o seu plano cobre, antes de sair de casa.",
  },
  {
    titulo: "Agende com o pedido",
    texto:
      "Anexe a foto do pedido médico e seus dados. A central fecha o horário com você no WhatsApp.",
  },
];

export default function Home() {
  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="hero">
        <Image
          className="hero__foto"
          src="/unidades/recep-matriz.jpg"
          alt=""
          width={1350}
          height={716}
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
              Descubra se fazemos o seu exame, veja o preparo e agende em poucos passos. Anexe
              seu pedido médico e pronto.
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
                placeholder="Digite seu exame (ex: ressonância de joelho)"
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
                  alt="Selo de Qualidade PADI acreditada pelo Colégio Brasileiro de Radiologia"
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
            <span className="badge badge--acao">Resultado online</span>
            <h2 className="hero-card__titulo">Já fez seu exame?</h2>
            <p className="hero-card__texto">
              Acesse laudos e imagens pelo portal ou pelo aplicativo, a qualquer hora.
            </p>
            <div className="hero-card__acoes">
              <Button href={CLINICA.links.portalResultados} external block>
                Acessar portal de resultados
              </Button>
              {/* <details> em vez de um menu com JavaScript: o navegador já dá
                  o abrir/fechar e a semântica de acessibilidade de graça, e a
                  escolha da loja continua funcionando sem JS. */}
              <details className="baixar-app">
                <summary className="btn btn--contorno btn--bloco baixar-app__gatilho">
                  Baixar APP
                </summary>
                <div className="baixar-app__opcoes">
                  <Button href={CLINICA.links.appPlayStore} external variant="contorno" block>
                    Android · Google Play
                  </Button>
                  <Button href={CLINICA.links.appAppStore} external variant="contorno" block>
                    iPhone · App Store
                  </Button>
                </div>
              </details>
            </div>
          </Revelar>
        </div>
      </section>

      {/* ── Nossos exames ────────────────────────────────────────────────── */}
      <section className="secao">
        <div className="container">
          <Revelar className="secao__cabecalho">
            <div>
              <span className="kicker">Nossos exames</span>
              <h2>Tudo em diagnóstico por imagem</h2>
            </div>
            <Link className="link-seta" href="/exames">
              Ver todos os exames
            </Link>
          </Revelar>

          <div className="grade-exames">
            {EXAMES.map((exame, indice) => (
              <Revelar key={exame.slug} delay={indice * 40}>
                <Link
                  className="card card--interativo card-exame"
                  href={`/exames/${exame.slug}`}
                  style={{ height: "100%" }}
                >
                  <h3 className="card-exame__titulo">{exame.nome}</h3>
                  <span className="card-exame__acao">Ver preparo e agendar →</span>
                </Link>
              </Revelar>
            ))}
          </div>
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
          </div>
        </div>
      </section>
    </>
  );
}
