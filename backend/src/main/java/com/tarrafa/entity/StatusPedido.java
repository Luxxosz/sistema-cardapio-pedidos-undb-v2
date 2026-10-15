package com.tarrafa.entity;

public enum StatusPedido {
    PENDENTE,
    CONFIRMADO,
    EM_PREPARACAO,
    PRONTO,
    FINALIZADO,
    CANCELADO;

    // RN04: so essas mudancas de status sao aceitas
    public boolean podeIrPara(StatusPedido novoStatus) {
        switch (this) {
            case PENDENTE:
                return novoStatus == CONFIRMADO || novoStatus == CANCELADO;
            case CONFIRMADO:
                return novoStatus == EM_PREPARACAO || novoStatus == CANCELADO;
            case EM_PREPARACAO:
                return novoStatus == PRONTO;
            case PRONTO:
                return novoStatus == FINALIZADO;
            default:
                // FINALIZADO e CANCELADO nao mudam mais
                return false;
        }
    }
}