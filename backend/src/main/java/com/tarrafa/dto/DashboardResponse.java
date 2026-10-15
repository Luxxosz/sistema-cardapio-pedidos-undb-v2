package com.tarrafa.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

public record DashboardResponse(
        LocalDate data,
        boolean diaEncerrado,
        int totalPedidos,
        int pedidosEmAberto,
        int pedidosFinalizados,
        BigDecimal faturamento,
        BigDecimal ticketMedio,
        Map<String, Long> pedidosPorStatus,
        List<ProdutoVendidoResponse> maisVendidos
) {
}