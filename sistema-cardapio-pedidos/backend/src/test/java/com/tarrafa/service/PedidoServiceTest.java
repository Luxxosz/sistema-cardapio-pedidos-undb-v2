package com.tarrafa.service;

import com.tarrafa.dto.ItemRequest;
import com.tarrafa.dto.PedidoRequest;
import com.tarrafa.dto.PedidoResponse;
import com.tarrafa.dto.QuantidadeRequest;
import com.tarrafa.dto.StatusRequest;
import com.tarrafa.entity.Cliente;
import com.tarrafa.entity.ItemPedido;
import com.tarrafa.entity.Pedido;
import com.tarrafa.entity.Produto;
import com.tarrafa.entity.StatusPedido;
import com.tarrafa.exception.RecursoNaoEncontradoException;
import com.tarrafa.exception.RegraNegocioException;
import com.tarrafa.repository.PedidoRepository;
import com.tarrafa.repository.ProdutoRepository;
import com.tarrafa.repository.UsuarioRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class PedidoServiceTest {

    private static final String EMAIL = "maria@email.com";

    @Mock
    private PedidoRepository pedidoRepository;
    @Mock
    private ProdutoRepository produtoRepository;
    @Mock
    private UsuarioRepository usuarioRepository;
    @Mock
    private NotificacaoService notificacaoService;
    @Mock
    private FechamentoService fechamentoService;

    @InjectMocks
    private PedidoService pedidoService;

    private Cliente cliente;

    @BeforeEach
    void preparar() {
        cliente = new Cliente();
        cliente.setId(1L);
        cliente.setNome("Maria");
        cliente.setEmail(EMAIL);
    }

    // ---------- metodos de apoio ----------

    private Produto criarProduto(Long id, String nome, String preco, boolean ativo) {
        Produto produto = new Produto();
        produto.setId(id);
        produto.setNome(nome);
        produto.setPreco(new BigDecimal(preco));
        produto.setAtivo(ativo);
        return produto;
    }

    private ItemPedido criarItem(Long id, Produto produto, int quantidade) {
        ItemPedido item = new ItemPedido();
        item.setId(id);
        item.setProduto(produto);
        item.setQuantidade(quantidade);
        item.setPrecoUnitario(produto.getPreco());
        return item;
    }

    private Pedido criarPedido(Long id, StatusPedido status, ItemPedido... itens) {
        Pedido pedido = new Pedido();
        pedido.setId(id);
        pedido.setUsuario(cliente);
        pedido.setStatus(status);
        for (ItemPedido item : itens) {
            pedido.adicionarItem(item);
        }
        pedidoService.calcularTotal(pedido);
        return pedido;
    }

    // compara BigDecimal pelo valor, sem se importar com 214 ou 214.00
    private void assertValor(String esperado, BigDecimal atual) {
        assertEquals(0, new BigDecimal(esperado).compareTo(atual));
    }

    // ---------- criar pedido ----------

    @Test
    void criarPedido_calculaTotalEFicaPendente() {
        Produto moqueca = criarProduto(1L, "Moqueca de peixe", "98.00", true);
        Produto pao = criarProduto(2L, "Pão da casa", "18.00", true);
        when(usuarioRepository.findByEmail(EMAIL)).thenReturn(Optional.of(cliente));
        when(produtoRepository.findById(1L)).thenReturn(Optional.of(moqueca));
        when(produtoRepository.findById(2L)).thenReturn(Optional.of(pao));

        PedidoRequest dados = new PedidoRequest("sem cebola",
                List.of(new ItemRequest(1L, 2), new ItemRequest(2L, 1)));

        PedidoResponse resposta = pedidoService.criarPedido(EMAIL, dados);

        assertEquals("PENDENTE", resposta.status());
        assertValor("214.00", resposta.valorTotal());
        assertEquals(2, resposta.itens().size());
        verify(pedidoRepository).save(any(Pedido.class));
    }

    @Test
    void criarPedido_somaQuantidadeQuandoProdutoRepete() {
        Produto pao = criarProduto(2L, "Pão da casa", "18.00", true);
        when(usuarioRepository.findByEmail(EMAIL)).thenReturn(Optional.of(cliente));
        when(produtoRepository.findById(2L)).thenReturn(Optional.of(pao));

        PedidoRequest dados = new PedidoRequest(null,
                List.of(new ItemRequest(2L, 1), new ItemRequest(2L, 2)));

        PedidoResponse resposta = pedidoService.criarPedido(EMAIL, dados);

        assertEquals(1, resposta.itens().size());
        assertEquals(3, resposta.itens().get(0).quantidade());
        assertValor("54.00", resposta.valorTotal());
    }

    // RN01
    @Test
    void criarPedido_produtoDesativado_naoEntra() {
        Produto desativado = criarProduto(3L, "Pudim de leite", "22.00", false);
        when(usuarioRepository.findByEmail(EMAIL)).thenReturn(Optional.of(cliente));
        when(produtoRepository.findById(3L)).thenReturn(Optional.of(desativado));

        PedidoRequest dados = new PedidoRequest(null, List.of(new ItemRequest(3L, 1)));

        assertThrows(RegraNegocioException.class, () -> pedidoService.criarPedido(EMAIL, dados));
        verify(pedidoRepository, never()).save(any(Pedido.class));
    }

    // RN02
    @Test
    void criarPedido_guardaPrecoDaHoraDaCompra() {
        Produto prato = criarProduto(1L, "Prato teste", "10.00", true);
        when(usuarioRepository.findByEmail(EMAIL)).thenReturn(Optional.of(cliente));
        when(produtoRepository.findById(1L)).thenReturn(Optional.of(prato));

        pedidoService.criarPedido(EMAIL, new PedidoRequest(null, List.of(new ItemRequest(1L, 1))));

        ArgumentCaptor<Pedido> captor = ArgumentCaptor.forClass(Pedido.class);
        verify(pedidoRepository).save(captor.capture());

        // o restaurante muda o preco depois da compra
        prato.setPreco(new BigDecimal("20.00"));

        ItemPedido item = captor.getValue().getItens().get(0);
        assertValor("10.00", item.getPrecoUnitario());
    }

    // RN08
    @Test
    void criarPedido_diaEncerrado_naoAceitaPedido() {
        doThrow(new RegraNegocioException("dia encerrado")).when(fechamentoService).verificarDiaAberto();

        PedidoRequest dados = new PedidoRequest(null, List.of(new ItemRequest(1L, 1)));

        assertThrows(RegraNegocioException.class, () -> pedidoService.criarPedido(EMAIL, dados));
        verify(pedidoRepository, never()).save(any(Pedido.class));
    }

    // ---------- editar pedido ----------

    // RN03
    @Test
    void adicionarItem_pedidoConfirmado_naoPodeEditar() {
        Pedido pedido = criarPedido(10L, StatusPedido.CONFIRMADO);
        when(pedidoRepository.findById(10L)).thenReturn(Optional.of(pedido));

        assertThrows(RegraNegocioException.class,
                () -> pedidoService.adicionarItem(10L, EMAIL, new ItemRequest(1L, 1)));
    }

    @Test
    void alterarQuantidade_recalculaOTotal() {
        Produto pao = criarProduto(2L, "Pão da casa", "18.00", true);
        Pedido pedido = criarPedido(10L, StatusPedido.PENDENTE, criarItem(5L, pao, 1));
        when(pedidoRepository.findById(10L)).thenReturn(Optional.of(pedido));

        PedidoResponse resposta = pedidoService.alterarQuantidade(10L, 5L, EMAIL, new QuantidadeRequest(3));

        assertValor("54.00", resposta.valorTotal());
    }

    @Test
    void alterarQuantidade_itemInexistente_naoEncontra() {
        Produto pao = criarProduto(2L, "Pão da casa", "18.00", true);
        Pedido pedido = criarPedido(10L, StatusPedido.PENDENTE, criarItem(5L, pao, 1));
        when(pedidoRepository.findById(10L)).thenReturn(Optional.of(pedido));

        assertThrows(RecursoNaoEncontradoException.class,
                () -> pedidoService.alterarQuantidade(10L, 99L, EMAIL, new QuantidadeRequest(3)));
    }

    @Test
    void removerItem_recalculaOTotal() {
        Produto pao = criarProduto(2L, "Pão da casa", "18.00", true);
        Produto pudim = criarProduto(3L, "Pudim de leite", "22.00", true);
        Pedido pedido = criarPedido(10L, StatusPedido.PENDENTE, criarItem(5L, pao, 1), criarItem(6L, pudim, 1));
        when(pedidoRepository.findById(10L)).thenReturn(Optional.of(pedido));

        PedidoResponse resposta = pedidoService.removerItem(10L, 5L, EMAIL);

        assertEquals(1, resposta.itens().size());
        assertValor("22.00", resposta.valorTotal());
    }

    // RN06
    @Test
    void buscarMeuPedido_deOutroCliente_naoEncontra() {
        Pedido pedido = criarPedido(10L, StatusPedido.PENDENTE);
        when(pedidoRepository.findById(10L)).thenReturn(Optional.of(pedido));

        assertThrows(RecursoNaoEncontradoException.class,
                () -> pedidoService.buscarMeuPedido(10L, "outro@email.com"));
    }

    // ---------- confirmar e cancelar ----------

    @Test
    void confirmarPedido_semItens_lancaExcecao() {
        Pedido pedido = criarPedido(10L, StatusPedido.PENDENTE);
        when(pedidoRepository.findById(10L)).thenReturn(Optional.of(pedido));

        assertThrows(RegraNegocioException.class, () -> pedidoService.confirmarPedido(10L, EMAIL));
        verify(notificacaoService, never()).pedidoAtualizado(any(String.class), any(PedidoResponse.class));
    }

    @Test
    void confirmarPedido_pendenteViraConfirmadoENotifica() {
        Produto pao = criarProduto(2L, "Pão da casa", "18.00", true);
        Pedido pedido = criarPedido(10L, StatusPedido.PENDENTE, criarItem(5L, pao, 1));
        when(pedidoRepository.findById(10L)).thenReturn(Optional.of(pedido));

        PedidoResponse resposta = pedidoService.confirmarPedido(10L, EMAIL);

        assertEquals("CONFIRMADO", resposta.status());
        verify(notificacaoService).pedidoAtualizado(eq(EMAIL), any(PedidoResponse.class));
    }

    @Test
    void cancelarPedido_pendente_funciona() {
        Pedido pedido = criarPedido(10L, StatusPedido.PENDENTE);
        when(pedidoRepository.findById(10L)).thenReturn(Optional.of(pedido));

        PedidoResponse resposta = pedidoService.cancelarPedido(10L, EMAIL);

        assertEquals("CANCELADO", resposta.status());
    }

    // RN04
    @Test
    void cancelarPedido_emPreparacao_naoPode() {
        Pedido pedido = criarPedido(10L, StatusPedido.EM_PREPARACAO);
        when(pedidoRepository.findById(10L)).thenReturn(Optional.of(pedido));

        assertThrows(RegraNegocioException.class, () -> pedidoService.cancelarPedido(10L, EMAIL));
    }

    // ---------- status pelo administrador ----------

    @Test
    void alterarStatus_avancaNoFluxo() {
        Pedido pedido = criarPedido(10L, StatusPedido.CONFIRMADO);
        when(pedidoRepository.findById(10L)).thenReturn(Optional.of(pedido));

        PedidoResponse resposta = pedidoService.alterarStatus(10L, new StatusRequest("EM_PREPARACAO"));

        assertEquals("EM_PREPARACAO", resposta.status());
    }

    // RN04
    @Test
    void alterarStatus_transicaoInvalida_lancaExcecao() {
        Pedido pedido = criarPedido(10L, StatusPedido.FINALIZADO);
        when(pedidoRepository.findById(10L)).thenReturn(Optional.of(pedido));

        assertThrows(RegraNegocioException.class,
                () -> pedidoService.alterarStatus(10L, new StatusRequest("PRONTO")));
        verify(notificacaoService, never()).pedidoAtualizado(any(String.class), any(PedidoResponse.class));
    }

    @Test
    void alterarStatus_adminNaoConfirmaPedido() {
        Pedido pedido = criarPedido(10L, StatusPedido.PENDENTE);
        when(pedidoRepository.findById(10L)).thenReturn(Optional.of(pedido));

        assertThrows(RegraNegocioException.class,
                () -> pedidoService.alterarStatus(10L, new StatusRequest("CONFIRMADO")));
    }

    @Test
    void alterarStatus_statusInexistente_lancaExcecao() {
        Pedido pedido = criarPedido(10L, StatusPedido.CONFIRMADO);
        when(pedidoRepository.findById(10L)).thenReturn(Optional.of(pedido));

        assertThrows(RegraNegocioException.class,
                () -> pedidoService.alterarStatus(10L, new StatusRequest("VOANDO")));
    }
}