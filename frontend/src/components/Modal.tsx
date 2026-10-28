import { useEffect } from "react";
import type { ReactNode } from "react";
import { X } from "lucide-react";

interface Props {
  titulo: string;
  aoFechar: () => void;
  children: ReactNode;
}

export default function Modal({ titulo, aoFechar, children }: Props) {
  // Esc fecha a janela
  useEffect(() => {
    function aoApertar(evento: KeyboardEvent) {
      if (evento.key === "Escape") {
        aoFechar();
      }
    }

    document.addEventListener("keydown", aoApertar);
    return () => document.removeEventListener("keydown", aoApertar);
  }, [aoFechar]);

  return (
    <div className="modal-fundo" onClick={aoFechar}>
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-label={titulo}
        onClick={(evento) => evento.stopPropagation()}
      >
        <header className="modal-topo">
          <h2>{titulo}</h2>
          <button className="botao-icone" onClick={aoFechar} aria-label="Fechar">
            <X size={22} />
          </button>
        </header>

        {children}
      </div>
    </div>
  );
}
