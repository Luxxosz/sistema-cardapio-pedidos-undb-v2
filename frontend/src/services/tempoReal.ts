import { Client } from "@stomp/stompjs";
import type { IMessage } from "@stomp/stompjs";
import { URL_BASE } from "./api";
import type { Papel, Pedido } from "../types";

interface Opcoes {
  token: string;
  papel: Papel;
  aoReceber: (pedido: Pedido) => void;
  aoMudarEstado: (conectado: boolean) => void;
}

// abre a conexao WebSocket (STOMP) com o backend e devolve uma funcao pra fechar
export function conectarTempoReal({ token, papel, aoReceber, aoMudarEstado }: Opcoes): () => void {
  const cliente = new Client({
    brokerURL: URL_BASE.replace(/^http/, "ws") + "/ws",
    connectHeaders: { Authorization: "Bearer " + token },
    reconnectDelay: 5000,

    onConnect: () => {
      aoMudarEstado(true);

      const receber = (mensagem: IMessage) => {
        aoReceber(JSON.parse(mensagem.body) as Pedido);
      };

      // cada cliente recebe so os proprios pedidos (RN06)
      cliente.subscribe("/user/queue/pedidos", receber);

      // o admin recebe os pedidos de todo mundo
      if (papel === "ADMIN") {
        cliente.subscribe("/topic/admin/pedidos", receber);
      }
    },

    onWebSocketClose: () => aoMudarEstado(false),
  });

  cliente.activate();

  return () => {
    cliente.deactivate();
  };
}
