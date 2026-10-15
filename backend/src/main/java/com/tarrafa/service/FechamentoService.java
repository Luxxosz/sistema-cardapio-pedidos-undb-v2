package com.tarrafa.service;

import com.tarrafa.dto.DashboardResponse;
import com.tarrafa.dto.ProdutoVendidoResponse;
import com.tarrafa.entity.FechamentoDia;
import com.tarrafa.entity.ItemPedido;
import com.tarrafa.entity.Pedido;
import com.tarrafa.entity.StatusPedido;
import com.tarrafa.exception.RegraNegocioException;
import com.tarrafa.repository.FechamentoDiaRepository;
import com.tarrafa.repository.PedidoRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
public class FechamentoService {

    private final PedidoRepository pedidoRepository;
    private final FechamentoDiaRepository fechamentoRepository;

    public FechamentoService(PedidoRepository pedidoRepository, FechamentoDiaRepository fechamentoRepository) {
        this.pedidoRepository = pedidoRepository;
        this.fechamentoRepository = fechamentoRepository;
    }

    @Transactional(readOnly = true)
    public DashboardResponse montarDashboard(LocalDate data) {
        LocalDate dia = (data == null) ? LocalDate.now() : data;

        LocalDateTime inicio = dia.atStartOfDay();
        LocalDateTime fim = dia.plusDays(1).atStartOfDay();
        List<Pedido> pedidos = pedidoRepository.findByDataCriacaoGreaterThanEqualAndDataCriacaoLessThan(inicio, fim);

        // comeca com todos os status zerados pra aparecerem na tela mesmo sem pedidos
        Map<String, Long> porStatus = new LinkedHashMap<>();
        for (StatusPedido status : StatusPedido.values()) {
            porStatus.put(status.name(), 0L);
        }

        int emAberto = 0;
        int finalizados = 0;
        BigDecimal faturamento = BigDecimal.ZERO;
        Map<String, Integer> vendidos = new HashMap<>();

        for (Pedido pedido : pedidos) {
            String nomeStatus = pedido.getStatus().name();
            porStatus.put(nomeStatus, porStatus.get(nomeStatus) + 1);

            if (pedido.getStatus() == StatusPedido.FINALIZADO) {
                finalizados++;
                faturamento = faturamento.add(pedido.getValorTotal());

                for (ItemPedido item : pedido.getItens()) {
                    String nomeProduto = item.getProduto().getNome();
                    vendidos.put(nomeProduto, vendidos.getOrDefault(nomeProduto, 0) + item.getQuantidade());
                }
            } else if (pedido.getStatus() != StatusPedido.CANCELADO) {
                emAberto++;
            }
        }

        BigDecimal ticketMedio = BigDecimal.ZERO;
        if (finalizados > 0) {
            ticketMedio = faturamento.divide(BigDecimal.valueOf(finalizados), 2, RoundingMode.HALF_UP);
        }

        List<ProdutoVendidoResponse> maisVendidos = new ArrayList<>();
        for (Map.Entry<String, Integer> entrada : vendidos.entrySet()) {
            maisVendidos.add(new ProdutoVendidoResponse(entrada.getKey(), entrada.getValue()));
        }
        maisVendidos.sort((a, b) -> b.quantidade() - a.quantidade());

        // fica so com os 5 primeiros
        if (maisVendidos.size() > 5) {
            maisVendidos = new ArrayList<>(maisVendidos.subList(0, 5));
        }

        boolean encerrado = fechamentoRepository.existsByData(dia);

        return new DashboardResponse(dia, encerrado, pedidos.size(), emAberto, finalizados,
                faturamento, ticketMedio, porStatus, maisVendidos);
    }

    @Transactional
    public DashboardResponse encerrarDia() {
        LocalDate hoje = LocalDate.now();

        if (fechamentoRepository.existsByData(hoje)) {
            throw new RegraNegocioException("O dia de hoje já foi encerrado");
        }

        DashboardResponse dashboard = montarDashboard(hoje);

        // RN09: nao da pra encerrar com pedido ainda em andamento
        if (dashboard.pedidosEmAberto() > 0) {
            throw new RegraNegocioException("Ainda existem " + dashboard.pedidosEmAberto()
                    + " pedido(s) em aberto. Finalize ou cancele antes de encerrar o dia");
        }

        FechamentoDia fechamento = new FechamentoDia();
        fechamento.setData(hoje);
        fechamento.setTotalPedidos(dashboard.totalPedidos());
        fechamento.setFaturamento(dashboard.faturamento());
        fechamento.setEncerradoEm(LocalDateTime.now());
        fechamentoRepository.save(fechamento);

        return montarDashboard(hoje);
    }

    @Transactional
    public DashboardResponse reabrirDia() {
        LocalDate hoje = LocalDate.now();

        FechamentoDia fechamento = fechamentoRepository.findByData(hoje)
                .orElseThrow(() -> new RegraNegocioException("O dia de hoje não está encerrado"));

        fechamentoRepository.delete(fechamento);
        return montarDashboard(hoje);
    }

    // RN08: depois de encerrar o dia, nao entram pedidos novos
    public void verificarDiaAberto() {
        if (fechamentoRepository.existsByData(LocalDate.now())) {
            throw new RegraNegocioException("O restaurante já encerrou o dia e não está recebendo pedidos novos");
        }
    }
}