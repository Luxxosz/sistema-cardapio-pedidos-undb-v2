package com.tarrafa.security;

import io.jsonwebtoken.Claims;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.MessagingException;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class WebSocketAuthInterceptor implements ChannelInterceptor {

    private final JwtService jwtService;

    public WebSocketAuthInterceptor(JwtService jwtService) {
        this.jwtService = jwtService;
    }

    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {
        StompHeaderAccessor accessor = MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);

        if (accessor == null) {
            return message;
        }

        // na hora de conectar, le o token que o frontend mandou
        if (StompCommand.CONNECT.equals(accessor.getCommand())) {
            String cabecalho = accessor.getFirstNativeHeader("Authorization");

            if (cabecalho == null || !cabecalho.startsWith("Bearer ")) {
                throw new MessagingException("Token não informado");
            }

            try {
                Claims dados = jwtService.lerToken(cabecalho.substring(7));
                String email = dados.getSubject();
                String papel = dados.get("papel", String.class);

                UsernamePasswordAuthenticationToken autenticacao = new UsernamePasswordAuthenticationToken(
                        email, null, List.of(new SimpleGrantedAuthority("ROLE_" + papel)));
                accessor.setUser(autenticacao);
            } catch (Exception e) {
                throw new MessagingException("Token inválido");
            }
        }

        // so o admin pode assinar o canal dos pedidos de todo mundo
        if (StompCommand.SUBSCRIBE.equals(accessor.getCommand())) {
            String destino = accessor.getDestination();

            if (destino != null && destino.startsWith("/topic/admin")) {
                boolean ehAdmin = false;

                if (accessor.getUser() instanceof Authentication usuario) {
                    ehAdmin = usuario.getAuthorities().stream()
                            .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
                }

                if (!ehAdmin) {
                    throw new MessagingException("Sem permissão para esse canal");
                }
            }
        }

        return message;
    }
}