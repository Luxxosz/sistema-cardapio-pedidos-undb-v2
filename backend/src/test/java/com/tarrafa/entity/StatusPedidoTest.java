package com.tarrafa.entity;

import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

class StatusPedidoTest {

    // RN04: essas mudancas de status sao permitidas
    @ParameterizedTest
    @CsvSource({
            "PENDENTE, CONFIRMADO",
            "PENDENTE, CANCELADO",
            "CONFIRMADO, EM_PREPARACAO",
            "CONFIRMADO, CANCELADO",
            "EM_PREPARACAO, PRONTO",
            "PRONTO, FINALIZADO"
    })
    void transicoesValidas(StatusPedido de, StatusPedido para) {
        assertTrue(de.podeIrPara(para));
    }

    // RN04: todo o resto e recusado
    @ParameterizedTest
    @CsvSource({
            "PENDENTE, PRONTO",
            "PENDENTE, FINALIZADO",
            "CONFIRMADO, PRONTO",
            "EM_PREPARACAO, CANCELADO",
            "EM_PREPARACAO, CONFIRMADO",
            "PRONTO, CANCELADO",
            "PRONTO, EM_PREPARACAO",
            "FINALIZADO, PRONTO",
            "FINALIZADO, CANCELADO",
            "CANCELADO, CONFIRMADO",
            "CANCELADO, PENDENTE"
    })
    void transicoesInvalidas(StatusPedido de, StatusPedido para) {
        assertFalse(de.podeIrPara(para));
    }
}