package com.tarrafa.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Service
public class JwtService {

    private final SecretKey chave;
    private final long expiracao;

    public JwtService(@Value("${jwt.secret}") String segredo,
                      @Value("${jwt.expiracao}") long expiracao) {
        this.chave = Keys.hmacShaKeyFor(segredo.getBytes(StandardCharsets.UTF_8));
        this.expiracao = expiracao;
    }

    public String gerarToken(String email, String papel) {
        Date agora = new Date();
        Date validade = new Date(agora.getTime() + expiracao);

        return Jwts.builder()
                .subject(email)
                .claim("papel", papel)
                .issuedAt(agora)
                .expiration(validade)
                .signWith(chave)
                .compact();
    }

    // le o token e devolve o que tem dentro. Se for invalido ou vencido, da excecao
    public Claims lerToken(String token) {
        return Jwts.parser()
                .verifyWith(chave)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}
