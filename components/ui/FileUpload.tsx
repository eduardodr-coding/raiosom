"use client";

import { useEffect, useRef, useState, type DragEvent } from "react";
import {
  ACCEPT_ATTR,
  TAMANHO_MAX_ROTULO,
  formatarTamanho,
  validarArquivo,
} from "@/lib/upload-limites";

export type FileUploadProps = {
  arquivo: File | null;
  onChange: (arquivo: File | null) => void;
  /** Chamado quando o arquivo é recusado (tamanho/formato), vira toast. */
  onRejeitado?: (motivo: string) => void;
  error?: string;
  id?: string;
};

/**
 * Upload do pedido médico: arrastar-e-soltar no desktop, galeria ou câmera no
 * celular.
 *
 * Por que dois botões no celular: o `capture="environment"` força a câmera e,
 * em boa parte dos navegadores, esconde a galeria. Como muita gente já
 * fotografou o pedido antes de entrar no site, o campo principal fica sem
 * `capture` (o celular oferece câmera *ou* galeria) e a câmera direta vira um
 * botão separado, para quem está com o papel na mão.
 */
export function FileUpload({ arquivo, onChange, onRejeitado, error, id }: FileUploadProps) {
  const [arrastando, setArrastando] = useState(false);
  const entradaRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);
  const previaRef = useRef<HTMLImageElement>(null);

  const ehImagem = arquivo?.type.startsWith("image/") ?? false;

  // Miniatura da foto: o `src` é escrito direto no elemento porque o object
  // URL é um recurso do navegador, não estado da aplicação — e precisa ser
  // revogado, ou o blob fica preso na memória da aba até o refresh.
  useEffect(() => {
    const img = previaRef.current;
    if (!img || !arquivo || !ehImagem) return;

    const url = URL.createObjectURL(arquivo);
    img.src = url;
    return () => URL.revokeObjectURL(url);
  }, [arquivo, ehImagem]);

  function receber(lista: FileList | null) {
    const escolhido = lista?.[0];
    if (!escolhido) return;

    const problema = validarArquivo(escolhido);
    if (problema) {
      onRejeitado?.(problema);
      limparEntradas();
      return;
    }
    onChange(escolhido);
  }

  function limparEntradas() {
    if (entradaRef.current) entradaRef.current.value = "";
    if (cameraRef.current) cameraRef.current.value = "";
  }

  function aoSoltar(evento: DragEvent<HTMLDivElement>) {
    evento.preventDefault();
    setArrastando(false);
    receber(evento.dataTransfer.files);
  }

  if (arquivo) {
    return (
      <div>
        <div className="arquivo-enviado">
          <span className="arquivo-enviado__info">
            {ehImagem ? (
              // eslint-disable-next-line @next/next/no-img-element -- blob local, next/image não serve
              <img ref={previaRef} alt="" className="arquivo-enviado__previa" />
            ) : (
              <span aria-hidden="true">📄</span>
            )}
            <span className="arquivo-enviado__nome">
              {arquivo.name} · {formatarTamanho(arquivo.size)}
            </span>
          </span>
          <button
            type="button"
            className="btn btn--fantasma btn--pequeno"
            onClick={() => {
              onChange(null);
              limparEntradas();
            }}
          >
            Trocar arquivo
          </button>
        </div>
        {error && (
          <p className="campo__erro" role="alert" style={{ marginTop: "var(--e-2)" }}>
            <span aria-hidden="true">⚠</span>
            {error}
          </p>
        )}
      </div>
    );
  }

  return (
    <div>
      <div
        className={`upload${arrastando ? " upload--arrastando" : ""}`}
        data-invalido={error ? "true" : undefined}
        onDragOver={(evento) => {
          evento.preventDefault();
          setArrastando(true);
        }}
        onDragLeave={() => setArrastando(false)}
        onDrop={aoSoltar}
      >
        <input
          ref={entradaRef}
          id={id}
          type="file"
          className="upload__entrada"
          accept={ACCEPT_ATTR}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-erro` : undefined}
          onChange={(evento) => receber(evento.target.files)}
        />
        <span className="upload__titulo">Toque para enviar ou arraste o arquivo aqui</span>
        <span className="upload__ajuda">
          Foto em JPG ou PNG, ou o pedido em PDF, até {TAMANHO_MAX_ROTULO}. Sem o pedido médico
          o exame não pode ser realizado.
        </span>
      </div>

      <input
        ref={cameraRef}
        type="file"
        className="sr-only"
        accept="image/*"
        capture="environment"
        tabIndex={-1}
        aria-hidden="true"
        onChange={(evento) => receber(evento.target.files)}
      />
      <button
        type="button"
        className="btn btn--contorno btn--pequeno"
        style={{ marginTop: "var(--e-3)" }}
        onClick={() => cameraRef.current?.click()}
      >
        <svg viewBox="0 0 24 24" width="17" height="17" fill="currentColor" aria-hidden="true">
          <path d="M9.4 4a1 1 0 0 0-.8.4L7.5 6H4.5A2.5 2.5 0 0 0 2 8.5v9A2.5 2.5 0 0 0 4.5 20h15a2.5 2.5 0 0 0 2.5-2.5v-9A2.5 2.5 0 0 0 19.5 6h-3l-1.1-1.6a1 1 0 0 0-.8-.4H9.4Zm2.6 4.75a4.25 4.25 0 1 1 0 8.5 4.25 4.25 0 0 1 0-8.5Zm0 2a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5Z" />
        </svg>
        Tirar foto agora
      </button>

      {error && (
        <p className="campo__erro" id={`${id}-erro`} role="alert" style={{ marginTop: "var(--e-2)" }}>
          <span aria-hidden="true">⚠</span>
          {error}
        </p>
      )}
    </div>
  );
}
