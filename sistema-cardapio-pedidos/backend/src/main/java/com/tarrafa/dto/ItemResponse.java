package com.tarrafa.dto;

import java.math.BigDecimal;

public record ItemResponse(
        Long id,
        Long produtoId,
        String produtoNome,
        int quantidade,
        BigDecimal precoUnitario,
        BigDecimal subtotal
) {
}