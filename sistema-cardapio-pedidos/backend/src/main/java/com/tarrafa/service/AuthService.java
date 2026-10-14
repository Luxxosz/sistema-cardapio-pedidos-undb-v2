package com.tarrafa.service;

import com.tarrafa.dto.AuthResponse;
import com.tarrafa.dto.CadastroRequest;
import com.tarrafa.dto.LoginRequest;
import com.tarrafa.entity.Cliente;
import com.tarrafa.entity.Usuario;
import com.tarrafa.repository.UsuarioRepository;
import com.tarrafa.security.JwtService;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(UsuarioRepository usuarioRepository,
                       PasswordEncoder passwordEncoder,
                       JwtService jwtService) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    // RN05: o cadastro publico sempre cria um cliente
    public AuthResponse cadastrar(CadastroRequest dados) {
        if (usuarioRepository.existsByEmail(dados.email())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Já existe uma conta com esse e-mail");
        }

        Cliente cliente = new Cliente();
        cliente.setNome(dados.nome());
        cliente.setEmail(dados.email());
        cliente.setSenha(passwordEncoder.encode(dados.senha()));
        usuarioRepository.save(cliente);

        String token = jwtService.gerarToken(cliente.getEmail(), cliente.getPapel());
        return new AuthResponse(token, cliente.getNome(), cliente.getPapel());
    }

    public AuthResponse login(LoginRequest dados) {
        Usuario usuario = usuarioRepository.findByEmail(dados.email())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "E-mail ou senha incorretos"));

        if (!passwordEncoder.matches(dados.senha(), usuario.getSenha())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "E-mail ou senha incorretos");
        }

        String token = jwtService.gerarToken(usuario.getEmail(), usuario.getPapel());
        return new AuthResponse(token, usuario.getNome(), usuario.getPapel());
    }
}
