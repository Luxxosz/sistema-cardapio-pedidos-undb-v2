import { useEffect, useRef, useState } from "react";
import { useAuth } from "./useAuth";
import { conectarTempoReal } from "../services/tempoReal";
import type { Pedido } from "../types";

// escuta os pedidos que mudam de status e chama "aoReceber".
// Devolve true quando a conexao em tempo real esta ativa.
export function useTempoReal(aoReceber: (pedido: Pedido) => void): boolean {
  const { sessao } = useAuth();
  const [conectado, setConectado] = useState(false);
  const aoReceberRef = useRef(aoReceber);

  // guarda sempre a versao mais nova da funcao, sem reconectar a cada render
  useEffect(() => {
    aoReceberRef.current = aoReceber;
  });

  const token = sessao?.token;
  const papel = sessao?.papel;

  useEffect(() => {
    if (!token || !papel) {
      return;
    }

    return conectarTempoReal({
      token,
      papel,
      aoReceber: (pedido) => aoReceberRef.current(pedido),
      aoMudarEstado: setConectado,
    });
  }, [token, papel]);

  return Boolean(token) && conectado;
}
