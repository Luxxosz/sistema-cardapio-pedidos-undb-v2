package com.tarrafa.service;

import com.tarrafa.dto.ItemRequest;
import com.tarrafa.dto.ItemResponse;
import com.tarrafa.dto.ObservacaoRequest;
import com.tarrafa.dto.PedidoRequest;
import com.tarrafa.dto.PedidoResponse;
import com.tarrafa.dto.QuantidadeRequest;
import com.tarrafa.dto.StatusRequest;
import com.tarrafa.entity.ItemPedido;
import com.tarrafa.entity.Pedido;
import com.tarrafa.entity.Produto;
import com.tarrafa.entity.StatusPedido;
import com.tarrafa.entity.Usuario;
import com.tarrafa.exception.RecursoNaoEncontradoException;
import com.tarrafa.exception.RegraNegocioException;
import com.tarrafa.repository.PedidoRepository;
import com.tarrafa.repository.ProdutoRepository;
import com.tarrafa.repository.UsuarioRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class PedidoService {

    private final PedidoRepository pedidoRepository;
    private final ProdutoRepository produtoRepository;
    private final UsuarioRepository usuarioRepository;
    private final NotificacaoService notificacaoService;
    private final FechamentoService fechamentoService;

    public PedidoService(PedidoRepository pedidoRepository,
                         ProdutoRepository produtoRepository,
                         UsuarioRepository usuarioRepository,
                         NotificacaoService notificacaoService,
                         FechamentoService fechamentoService) {
        this.pedidoRepository = pedidoRepository;
        this.produtoRepository = produtoRepository;
        this.usuarioRepository = usuarioRepository;
        this.notificacaoService = notificacaoService;
        this.fechamentoService = fechamentoService;
    }

    @Transactional
    public PedidoResponse criarPedido(String emailCliente, PedidoRequest dados) {
        fechamentoService.verificarDiaAberto(); // RN08

        Usuario usuario = usuarioRepository.findByEmail(emailCliente)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Usuário não encontrado"));

        Pedido pedido = new Pedido();
        pedido.setUsuario(usuario);
        pedido.setStatus(StatusPedido.PENDENTE);
        pedido.setObservacao(dados.observacao());
        pedido.setDataCriacao(LocalDateTime.now());

        for (ItemRequest itemDados : dados.itens()) {
            colocarItemNoPedido(pedido, itemDados);
        }

        calcularTotal(pedido);
        pedidoRepository.save(pedido);

        return paraResponse(pedido);
    }

    @Transactional(readOnly = true)
    public List<PedidoResponse> listarMeusPedidos(String emailCliente) {
        List<Pedido> pedidos = pedidoRepository.findByUsuarioEmailOrderByDataCriacaoDesc(emailCliente);

        List<PedidoResponse> resposta = new ArrayList<>();
        for (Pedido pedido : pedidos) {
            resposta.add(paraResponse(pedido));
        }
        return resposta;
    }

    @Transactional(readOnly = true)
    public PedidoResponse buscarMeuPedido(Long id, String emailCliente) {
        Pedido pedido = buscarPedidoDoCliente(id, emailCliente);
        return paraResponse(pedido);
    }

    @Transactional
    public PedidoResponse adicionarItem(Long pedidoId, String emailCliente, ItemRequest dados) {
        Pedido pedido = buscarPedidoDoCliente(pedidoId, emailCliente);
        verificarSePodeEditar(pedido);

        colocarItemNoPedido(pedido, dados);

        calcularTotal(pedido);
        pedidoRepository.save(pedido);
        return paraResponse(pedido);
    }

    @Transactional
    public PedidoResponse alterarQuantidade(Long pedidoId, Long itemId, String emailCliente, QuantidadeRequest dados) {
        Pedido pedido = buscarPedidoDoCliente(pedidoId, emailCliente);
        verificarSePodeEditar(pedido);

        ItemPedido itemEncontrado = null;
        for (ItemPedido item : pedido.getItens()) {
            if (item.getId().equals(itemId)) {
                itemEncontrado = item;
            }
        }

        if (itemEncontrado == null) {
            throw new RecursoNaoEncontradoException("Item não encontrado nesse pedido");
        }

        itemEncontrado.setQuantidade(dados.quantidade());

        calcularTotal(pedido);
        pedidoRepository.save(pedido);
        return paraResponse(pedido);
    }

    @Transactional
    public PedidoResponse removerItem(Long pedidoId, Long itemId, String emailCliente) {
        Pedido pedido = buscarPedidoDoCliente(pedidoId, emailCliente);
        verificarSePodeEditar(pedido);

        boolean removeu = pedido.getItens().removeIf(item -> item.getId().equals(itemId));
        if (!removeu) {
            throw new RecursoNaoEncontradoException("Item não encontrado nesse pedido");
        }

        calcularTotal(pedido);
        pedidoRepository.save(pedido);
        return paraResponse(pedido);
    }

    @Transactional
    public PedidoResponse atualizarObservacao(Long pedidoId, String emailCliente, ObservacaoRequest dados) {
        Pedido pedido = buscarPedidoDoCliente(pedidoId, emailCliente);
        verificarSePodeEditar(pedido);

        pedido.setObservacao(dados.observacao());
        pedidoRepository.save(pedido);
        return paraResponse(pedido);
    }

    // ---------- status do pedido ----------

    @Transactional
    public PedidoResponse confirmarPedido(Long id, String emailCliente) {
        Pedido pedido = buscarPedidoDoCliente(id, emailCliente);

        if (pedido.getItens().isEmpty()) {
            throw new RegraNegocioException("Adicione pelo menos um item antes de confirmar o pedido");
        }

        mudarStatus(pedido, StatusPedido.CONFIRMADO);
        return paraResponse(pedido);
    }

    @Transactional
    public PedidoResponse cancelarPedido(Long id, String emailCliente) {
        Pedido pedido = buscarPedidoDoCliente(id, emailCliente);
        mudarStatus(pedido, StatusPedido.CANCELADO);
        return paraResponse(pedido);
    }

    // ---------- parte do administrador ----------

    @Transactional(readOnly = true)
    public List<PedidoResponse> listarTodos(String statusFiltro) {
        List<Pedido> pedidos;

        if (statusFiltro == null || statusFiltro.isBlank()) {
            pedidos = pedidoRepository.findAllByOrderByDataCriacaoDesc();
        } else {
            pedidos = pedidoRepository.findByStatusOrderByDataCriacaoDesc(converterStatus(statusFiltro));
        }

        List<PedidoResponse> resposta = new ArrayList<>();
        for (Pedido pedido : pedidos) {
            resposta.add(paraResponse(pedido));
        }
        return resposta;
    }

    @Transactional(readOnly = true)
    public PedidoResponse buscarPorId(Long id) {
        Pedido pedido = pedidoRepository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Pedido não encontrado"));
        return paraResponse(pedido);
    }

    @Transactional
    public PedidoResponse alterarStatus(Long id, StatusRequest dados) {
        Pedido pedido = pedidoRepository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Pedido não encontrado"));

        StatusPedido novoStatus = converterStatus(dados.status());

        // quem confirma o pedido e o cliente
        if (novoStatus == StatusPedido.CONFIRMADO) {
            throw new RegraNegocioException("A confirmação do pedido é feita pelo cliente");
        }

        mudarStatus(pedido, novoStatus);
        return paraResponse(pedido);
    }

    // RN04: confere se a mudanca e permitida antes de trocar
    private void mudarStatus(Pedido pedido, StatusPedido novoStatus) {
        if (!pedido.getStatus().podeIrPara(novoStatus)) {
            throw new RegraNegocioException(
                    "Não é possível mudar o pedido de " + pedido.getStatus() + " para " + novoStatus);
        }

        pedido.setStatus(novoStatus);
        pedidoRepository.save(pedido);

        // avisa o cliente e o admin em tempo real
        notificacaoService.pedidoAtualizado(pedido.getUsuario().getEmail(), paraResponse(pedido));
    }

    private StatusPedido converterStatus(String texto) {
        try {
            return StatusPedido.valueOf(texto.trim().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new RegraNegocioException("Status inválido: " + texto);
        }
    }

    // soma quantidade x preco unitario de todos os itens
    public void calcularTotal(Pedido pedido) {
        BigDecimal total = BigDecimal.ZERO;
        for (ItemPedido item : pedido.getItens()) {
            total = total.add(item.getSubtotal());
        }
        pedido.setValorTotal(total);
    }

    public PedidoResponse paraResponse(Pedido pedido) {
        List<ItemResponse> itens = new ArrayList<>();
        for (ItemPedido item : pedido.getItens()) {
            itens.add(new ItemResponse(
                    item.getId(),
                    item.getProduto().getId(),
                    item.getProduto().getNome(),
                    item.getQuantidade(),
                    item.getPrecoUnitario(),
                    item.getSubtotal()
            ));
        }

        return new PedidoResponse(
                pedido.getId(),
                pedido.getStatus().name(),
                pedido.getObservacao(),
                pedido.getValorTotal(),
                pedido.getDataCriacao(),
                pedido.getUsuario().getNome(),
                itens
        );
    }

    // RN06: se o pedido nao e do cliente, responde como se nao existisse
    private Pedido buscarPedidoDoCliente(Long id, String emailCliente) {
        Pedido pedido = pedidoRepository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Pedido não encontrado"));

        if (!pedido.getUsuario().getEmail().equals(emailCliente)) {
            throw new RecursoNaoEncontradoException("Pedido não encontrado");
        }

        return pedido;
    }

    // RN03: so da pra editar enquanto o pedido esta pendente
    private void verificarSePodeEditar(Pedido pedido) {
        if (pedido.getStatus() != StatusPedido.PENDENTE) {
            throw new RegraNegocioException("Só é possível editar pedidos pendentes");
        }
    }

    private void colocarItemNoPedido(Pedido pedido, ItemRequest dados) {
        Produto produto = produtoRepository.findById(dados.produtoId())
                .orElseThrow(() -> new RecursoNaoEncontradoException("Produto não encontrado"));

        // RN01: produto desativado nao entra em pedido novo
        if (!produto.isAtivo()) {
            throw new RegraNegocioException("O produto " + produto.getNome() + " não está disponível");
        }

        // se o produto ja esta no pedido, so soma a quantidade
        for (ItemPedido item : pedido.getItens()) {
            if (item.getProduto().getId().equals(produto.getId())) {
                item.setQuantidade(item.getQuantidade() + dados.quantidade());
                return;
            }
        }

        ItemPedido novoItem = new ItemPedido();
        novoItem.setProduto(produto);
        novoItem.setQuantidade(dados.quantidade());
        novoItem.setPrecoUnitario(produto.getPreco()); // RN02
        pedido.adicionarItem(novoItem);
    }
}