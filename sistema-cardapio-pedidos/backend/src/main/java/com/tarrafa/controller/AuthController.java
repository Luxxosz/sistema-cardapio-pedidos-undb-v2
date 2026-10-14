package com.tarrafa.controller;

import com.tarrafa.dto.AuthResponse;
import com.tarrafa.dto.CadastroRequest;
import com.tarrafa.dto.LoginRequest;
import com.tarrafa.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/cadastro")
    public AuthResponse cadastrar(@Valid @RequestBody CadastroRequest dados) {
        return authService.cadastrar(dados);
    }

    @PostMapping("/login")
    public AuthResponse login(@Valid @RequestBody LoginRequest dados) {
        return authService.login(dados);
    }
}
