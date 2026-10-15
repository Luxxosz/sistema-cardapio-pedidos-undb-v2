package com.tarrafa.dto;

import jakarta.validation.constraints.NotBlank;

public record CategoriaRequest(
        @NotBlank(message = "Informe o nome da categoria") String nome
) {
}