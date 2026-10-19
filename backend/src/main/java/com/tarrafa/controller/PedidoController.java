package com.tarrafa.controller;

import com.tarrafa.dto.ItemRequest;
import com.tarrafa.dto.ObservacaoRequest;
import com.tarrafa.dto.PedidoRequest;
import com.tarrafa.dto.PedidoResponse;
import com.tarrafa.dto.QuantidadeRequest;
import com.tarrafa.service.PedidoService;
import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pedidos")
public class PedidoController {

    private final PedidoService pedidoService;

    public PedidoController(PedidoService pedidoService) {
        this.pedidoService = pedidoService;
    }

    // authentication.getName() devolve o e-mail que veio dentro do token
    @PostMapping
    public PedidoResponse criar(Authentication authentication, @Valid @RequestBody PedidoRequest dados) {
        return pedidoService.criarPedido(authentication.getName(), dados);
    }

    @GetMapping
    public List<PedidoResponse> listarMeus(Authentication authentication) {
        return pedidoService.listarMeusPedidos(authentication.getName());
    }

    @GetMapping("/{id}")
    public PedidoResponse buscar(Authentication authentication, @PathVariable Long id) {
        return pedidoService.buscarMeuPedido(id, authentication.getName());
    }

    @PostMapping("/{id}/itens")
    public PedidoResponse adicionarItem(Authentication authentication, @PathVariable Long id,
                                        @Valid @RequestBody ItemRequest dados) {
        return pedidoService.adicionarItem(id, authentication.getName(), dados);
    }

    @PutMapping("/{id}/itens/{itemId}")
    public PedidoResponse alterarQuantidade(Authentication authentication, @PathVariable Long id,
                                            @PathVariable Long itemId, @Valid @RequestBody QuantidadeRequest dados) {
        return pedidoService.alterarQuantidade(id, itemId, authentication.getName(), dados);
    }

    @DeleteMapping("/{id}/itens/{itemId}")
    public PedidoResponse removerItem(Authentication authentication, @PathVariable Long id,
                                      @PathVariable Long itemId) {
        return pedidoService.removerItem(id, itemId, authentication.getName());
    }

    @PutMapping("/{id}/observacao")
    public PedidoResponse atualizarObservacao(Authentication authentication, @PathVariable Long id,
                                              @Valid @RequestBody ObservacaoRequest dados) {
        return pedidoService.atualizarObservacao(id, authentication.getName(), dados);
    }

    @PatchMapping("/{id}/confirmar")
    public PedidoResponse confirmar(Authentication authentication, @PathVariable Long id) {
        return pedidoService.confirmarPedido(id, authentication.getName());
    }

    @PatchMapping("/{id}/cancelar")
    public PedidoResponse cancelar(Authentication authentication, @PathVariable Long id) {
        return pedidoService.cancelarPedido(id, authentication.getName());
    }
}