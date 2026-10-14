package com.tarrafa.controller;

import com.tarrafa.dto.DashboardResponse;
import com.tarrafa.service.FechamentoService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/admin/dashboard")
public class AdminDashboardController {

    private final FechamentoService fechamentoService;

    public AdminDashboardController(FechamentoService fechamentoService) {
        this.fechamentoService = fechamentoService;
    }

    // sem parametro mostra hoje. Com ?data=2026-10-08 mostra outro dia
    @GetMapping
    public DashboardResponse ver(@RequestParam(required = false)
                                 @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate data) {
        return fechamentoService.montarDashboard(data);
    }

    @PostMapping("/encerrar-dia")
    public DashboardResponse encerrarDia() {
        return fechamentoService.encerrarDia();
    }

    @PostMapping("/reabrir-dia")
    public DashboardResponse reabrirDia() {
        return fechamentoService.reabrirDia();
    }
}