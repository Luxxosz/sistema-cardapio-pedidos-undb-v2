package com.tarrafa.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

public record ProdutoRequest(
        @NotBlank(message = "Informe o nome do produto") String nome,
        String descricao,
        @NotNull(message = "Informe o preço") @DecimalMin(value = "0.01", message = "O preço precisa ser maior que zero") BigDecimal preco,
        @NotNull(message = "Informe a categoria") Long categoriaId,
        @Size(max = 500, message = "O endereço da imagem pode ter no máximo 500 caracteres") String imagemUrl
) {
}