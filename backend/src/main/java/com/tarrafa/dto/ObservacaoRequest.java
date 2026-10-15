package com.tarrafa.dto;

import jakarta.validation.constraints.Size;

public record ObservacaoRequest(
        @Size(max = 300, message = "A observação pode ter no máximo 300 caracteres") String observacao
) {
}