package com.tarrafa.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;

import java.util.List;

public record PedidoRequest(
        @Size(max = 300, message = "A observação pode ter no máximo 300 caracteres") String observacao,
        @NotEmpty(message = "O pedido precisa ter pelo menos um item") @Valid List<ItemRequest> itens
) {
}