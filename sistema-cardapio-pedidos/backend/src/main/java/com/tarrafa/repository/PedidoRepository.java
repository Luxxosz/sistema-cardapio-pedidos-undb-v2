package com.tarrafa.repository;

import com.tarrafa.entity.Pedido;
import com.tarrafa.entity.StatusPedido;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface PedidoRepository extends JpaRepository<Pedido, Long> {

    List<Pedido> findByUsuarioEmailOrderByDataCriacaoDesc(String email);

    List<Pedido> findAllByOrderByDataCriacaoDesc();

    List<Pedido> findByStatusOrderByDataCriacaoDesc(StatusPedido status);

    // pedidos de um dia: de 00:00 (inclusive) ate 00:00 do dia seguinte (exclusive)
    List<Pedido> findByDataCriacaoGreaterThanEqualAndDataCriacaoLessThan(LocalDateTime inicio, LocalDateTime fim);
}