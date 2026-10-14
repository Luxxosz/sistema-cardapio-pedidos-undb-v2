package com.tarrafa.dto;

import jakarta.validation.constraints.NotBlank;

public record StatusRequest(
        @NotBlank(message = "Informe o status") String status
) {
}