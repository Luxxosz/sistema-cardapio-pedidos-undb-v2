package com.tarrafa.service;

import com.tarrafa.dto.DashboardResponse;
import com.tarrafa.entity.FechamentoDia;
import com.tarrafa.entity.ItemPedido;
import com.tarrafa.entity.Pedido;
import com.tarrafa.entity.Produto;
import com.tarrafa.entity.StatusPedido;
import com.tarrafa.exception.RegraNegocioException;
import com.tarrafa.repository.FechamentoDiaRepository;
import com.tarrafa.repository.PedidoRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class FechamentoServiceTest {

    @Mock
    private PedidoRepository pedidoRepository;
    @Mock
    private FechamentoDiaRepository fechamentoRepository;

    @InjectMocks
    private FechamentoService fechamentoService;

    // ---------- metodos de apoio ----------

    private Produto criarProduto(String nome, String preco) {
        Produto produto = new Produto();
        produto.setNome(nome);
        produto.setPreco(new BigDecimal(preco));
        produto.setAtivo(true);
        return produto;
    }

    private ItemPedido criarItem(Produto produto, int quantidade) {
        ItemPedido item = new ItemPedido();
        item.setProduto(produto);
        item.setQuantidade(quantidade);
        item.setPrecoUnitario(produto.getPreco());
        return item;
    }

    // monta o pedido ja com o total somado dos itens
    private Pedido criarPedido(StatusPedido status, ItemPedido... itens) {
        Pedido pedido = new Pedido();
        pedido.setStatus(status);

        BigDecimal total = BigDecimal.ZERO;
        for (ItemPedido item : itens) {
            pedido.adicionarItem(item);
            total = total.add(item.getSubtotal());
        }
        pedido.setValorTotal(total);
        return pedido;
    }

    private void pedidosDoDia(Pedido... pedidos) {
        when(pedidoRepository.findByDataCriacaoGreaterThanEqualAndDataCriacaoLessThan(
                any(LocalDateTime.class), any(LocalDateTime.class))).thenReturn(List.of(pedidos));
    }

    private void assertValor(String esperado, BigDecimal atual) {
        assertEquals(0, new BigDecimal(esperado).compareTo(atual));
    }

    // ---------- RN08 ----------

    @Test
    void verificarDiaAberto_diaEncerrado_lancaExcecao() {
        when(fechamentoRepository.existsByData(any(LocalDate.class))).thenReturn(true);

        assertThrows(RegraNegocioException.class, () -> fechamentoService.verificarDiaAberto());
    }

    @Test
    void verificarDiaAberto_diaAberto_naoLanca() {
        when(fechamentoRepository.existsByData(any(LocalDate.class))).thenReturn(false);

        assertDoesNotThrow(() -> fechamentoService.verificarDiaAberto());
    }

    // ---------- dashboard ----------

    @Test
    void montarDashboard_faturamentoContaSoFinalizados() {
        Produto pao = criarProduto("Pão da casa", "18.00");
        Produto pudim = criarProduto("Pudim de leite", "22.00");
        Produto caro = criarProduto("Prato caro", "100.00");

        pedidosDoDia(
                criarPedido(StatusPedido.FINALIZADO, criarItem(pao, 1), criarItem(pudim, 1)), // 40.00
                criarPedido(StatusPedido.FINALIZADO, criarItem(pao, 2)),                       // 36.00
                criarPedido(StatusPedido.CANCELADO, criarItem(caro, 1)),
                criarPedido(StatusPedido.PENDENTE, criarItem(pao, 1))
        );

        DashboardResponse dashboard = fechamentoService.montarDashboard(LocalDate.now());

        assertEquals(4, dashboard.totalPedidos());
        assertEquals(2, dashboard.pedidosFinalizados());
        assertEquals(1, dashboard.pedidosEmAberto());
        assertValor("76.00", dashboard.faturamento());
        assertValor("38.00", dashboard.ticketMedio());
        assertEquals(1L, dashboard.pedidosPorStatus().get("CANCELADO"));
        assertEquals(2L, dashboard.pedidosPorStatus().get("FINALIZADO"));

        // o mais vendido so conta pedidos finalizados: 1 + 2 paes
        assertEquals("Pão da casa", dashboard.maisVendidos().get(0).produto());
        assertEquals(3, dashboard.maisVendidos().get(0).quantidade());
    }

    @Test
    void montarDashboard_semPedidos_naoDaErroNaDivisao() {
        pedidosDoDia();

        DashboardResponse dashboard = fechamentoService.montarDashboard(LocalDate.now());

        assertEquals(0, dashboard.totalPedidos());
        assertValor("0", dashboard.faturamento());
        assertValor("0", dashboard.ticketMedio());
        assertTrue(dashboard.maisVendidos().isEmpty());
    }

    // ---------- encerrar o dia (RN09) ----------

    @Test
    void encerrarDia_comPedidoEmAberto_lancaExcecao() {
        Produto pao = criarProduto("Pão da casa", "18.00");
        pedidosDoDia(criarPedido(StatusPedido.PENDENTE, criarItem(pao, 1)));

        assertThrows(RegraNegocioException.class, () -> fechamentoService.encerrarDia());
        verify(fechamentoRepository, never()).save(any(FechamentoDia.class));
    }

    @Test
    void encerrarDia_tudoFinalizado_gravaOFechamento() {
        Produto pao = criarProduto("Pão da casa", "18.00");
        pedidosDoDia(criarPedido(StatusPedido.FINALIZADO, criarItem(pao, 2))); // 36.00

        // 1a chamada: confere se ja foi encerrado. 2a: dashboard antes de gravar. 3a: dashboard depois de gravar
        when(fechamentoRepository.existsByData(any(LocalDate.class))).thenReturn(false, false, true);

        DashboardResponse dashboard = fechamentoService.encerrarDia();

        assertTrue(dashboard.diaEncerrado());

        ArgumentCaptor<FechamentoDia> captor = ArgumentCaptor.forClass(FechamentoDia.class);
        verify(fechamentoRepository).save(captor.capture());
        assertEquals(1, captor.getValue().getTotalPedidos());
        assertValor("36.00", captor.getValue().getFaturamento());
    }

    @Test
    void encerrarDia_diaJaEncerrado_lancaExcecao() {
        when(fechamentoRepository.existsByData(any(LocalDate.class))).thenReturn(true);

        assertThrows(RegraNegocioException.class, () -> fechamentoService.encerrarDia());
        verifyNoInteractions(pedidoRepository);
    }

    @Test
    void reabrirDia_semFechamento_lancaExcecao() {
        when(fechamentoRepository.findByData(any(LocalDate.class))).thenReturn(Optional.empty());

        assertThrows(RegraNegocioException.class, () -> fechamentoService.reabrirDia());
    }
}