package com.tarrafa.controller;

import com.tarrafa.dto.PedidoResponse;
import com.tarrafa.dto.StatusRequest;
import com.tarrafa.service.PedidoService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/pedidos")
public class AdminPedidoController {

    private final PedidoService pedidoService;

    public AdminPedidoController(PedidoService pedidoService) {
        this.pedidoService = pedidoService;
    }

    // se vier ?status=PRONTO, filtra por esse status
    @GetMapping
    public List<PedidoResponse> listarTodos(@RequestParam(required = false) String status) {
        return pedidoService.listarTodos(status);
    }

    @GetMapping("/{id}")
    public PedidoResponse buscar(@PathVariable Long id) {
        return pedidoService.buscarPorId(id);
    }

    @PatchMapping("/{id}/status")
    public PedidoResponse alterarStatus(@PathVariable Long id, @Valid @RequestBody StatusRequest dados) {
        return pedidoService.alterarStatus(id, dados);
    }
}