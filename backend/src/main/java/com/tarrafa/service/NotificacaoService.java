package com.tarrafa.service;

import com.tarrafa.dto.PedidoResponse;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
public class NotificacaoService {

    private final SimpMessagingTemplate mensagens;

    public NotificacaoService(SimpMessagingTemplate mensagens) {
        this.mensagens = mensagens;
    }

    public void pedidoAtualizado(String emailCliente, PedidoResponse pedido) {
        // so o dono do pedido recebe nesse canal (RN06)
        mensagens.convertAndSendToUser(emailCliente, "/queue/pedidos", pedido);

        // o admin acompanha os pedidos de todos
        mensagens.convertAndSend("/topic/admin/pedidos", pedido);
    }
}