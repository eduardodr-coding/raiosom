"use client";

import { useRef } from "react";
import { IconeRede } from "@/components/ui/icones";
import { CLINICA } from "@/content/clinica";

/**
 * Botão "Baixar APP" que abre as duas lojas num modal no centro da tela.
 *
 * `<dialog>` com `showModal()` em vez de um modal feito à mão: o navegador já
 * prende o foco lá dentro, fecha no Esc, devolve o foco ao botão e deixa o
 * resto da página inerte — tudo o que um modal precisa para teclado e leitor
 * de tela. O desfoque do fundo é o `::backdrop`, no CSS.
 */
export function BaixarApp() {
  const dialogo = useRef<HTMLDialogElement>(null);

  return (
    <>
      <button
        type="button"
        className="btn btn--primario btn--bloco"
        onClick={() => dialogo.current?.showModal()}
      >
        Baixar APP
      </button>

      {/* Sem JavaScript o botão acima não abre nada; aí as lojas aparecem
          direto como links, para ninguém ficar sem o caminho. */}
      <noscript>
        <a className="btn btn--primario btn--bloco" href={CLINICA.links.appAppStore}>
          App Store
        </a>
        <a className="btn btn--primario btn--bloco" href={CLINICA.links.appPlayStore}>
          Google Play
        </a>
      </noscript>

      <dialog
        ref={dialogo}
        className="modal-app"
        aria-labelledby="modal-app-titulo"
        // Clique no fundo desfocado fecha, como o paciente espera: o alvo só é
        // o próprio <dialog> quando o clique cai fora da caixa.
        onClick={(evento) => {
          if (evento.target === dialogo.current) dialogo.current.close();
        }}
      >
        <div className="modal-app__caixa">
          <button
            type="button"
            className="modal-app__fechar"
            aria-label="Fechar"
            onClick={() => dialogo.current?.close()}
          >
            ×
          </button>

          <h2 id="modal-app-titulo" className="modal-app__titulo">
            Baixe o app da Raio Som
          </h2>
          <p className="modal-app__texto">
            Laudos e imagens dos seus exames no celular, a qualquer hora.
          </p>

          <div className="modal-app__lojas">
            <a
              className="loja"
              href={CLINICA.links.appAppStore}
              target="_blank"
              rel="noopener noreferrer"
            >
              <IconeRede rede="apple" tamanho={44} />
              <span className="loja__texto">
                <span className="loja__pre">Baixar na</span>
                <span className="loja__nome">App Store</span>
              </span>
            </a>
            <a
              className="loja"
              href={CLINICA.links.appPlayStore}
              target="_blank"
              rel="noopener noreferrer"
            >
              <IconeRede rede="googleplay" tamanho={40} />
              <span className="loja__texto">
                <span className="loja__pre">Disponível no</span>
                <span className="loja__nome">Google Play</span>
              </span>
            </a>
          </div>
        </div>
      </dialog>
    </>
  );
}
