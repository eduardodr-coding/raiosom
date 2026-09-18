"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { cx } from "@/lib/cx";

type ToastTipo = "erro" | "ok" | "info";

type Toast = {
  id: number;
  texto: string;
  tipo: ToastTipo;
};

type ToastAPI = {
  /** Mostra um aviso flutuante. Some sozinho em 6 segundos. */
  mostrar: (texto: string, tipo?: ToastTipo) => void;
};

const ToastContext = createContext<ToastAPI | null>(null);

const DURACAO_MS = 6000;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const proximoId = useRef(0);

  const remover = useCallback((id: number) => {
    setToasts((atuais) => atuais.filter((t) => t.id !== id));
  }, []);

  const mostrar = useCallback(
    (texto: string, tipo: ToastTipo = "erro") => {
      const id = proximoId.current++;
      setToasts((atuais) => [...atuais, { id, texto, tipo }]);
      setTimeout(() => remover(id), DURACAO_MS);
    },
    [remover],
  );

  const api = useMemo(() => ({ mostrar }), [mostrar]);

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div className="toasts">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={cx("toast", toast.tipo !== "info" && `toast--${toast.tipo}`)}
            role={toast.tipo === "erro" ? "alert" : "status"}
          >
            <span>{toast.texto}</span>
            <button
              type="button"
              className="toast__fechar"
              onClick={() => remover(toast.id)}
              aria-label="Fechar aviso"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastAPI {
  const contexto = useContext(ToastContext);
  if (!contexto) {
    throw new Error("useToast precisa estar dentro de <ToastProvider>.");
  }
  return contexto;
}
