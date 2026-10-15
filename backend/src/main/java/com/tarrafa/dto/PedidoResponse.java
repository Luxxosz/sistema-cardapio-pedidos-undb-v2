package com.tarrafa.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public record PedidoResponse(
        Long id,
        String status,
        String observacao,
        BigDecimal valorTotal,
        LocalDateTime dataCriacao,
        String cliente,
        List<ItemResponse> itens
) {
}