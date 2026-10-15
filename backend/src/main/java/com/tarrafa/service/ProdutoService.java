
package com.tarrafa.service;

import org.springframework.data.domain.Sort;
import com.tarrafa.dto.ProdutoRequest;
import com.tarrafa.entity.Categoria;
import com.tarrafa.entity.Produto;
import com.tarrafa.exception.RecursoNaoEncontradoException;
import com.tarrafa.exception.RegraNegocioException;
import com.tarrafa.repository.CategoriaRepository;
import com.tarrafa.repository.ProdutoRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProdutoService {

    private final ProdutoRepository produtoRepository;
    private final CategoriaRepository categoriaRepository;

    public ProdutoService(
            ProdutoRepository produtoRepository,
            CategoriaRepository categoriaRepository) {
        this.produtoRepository = produtoRepository;
        this.categoriaRepository = categoriaRepository;
    }

    // Cliente só vê os produtos ativos (RN01)
    public List<Produto> listarAtivos() {
        return produtoRepository.findByAtivoTrueOrderByIdAsc();
    }

    // O administrador vê todos os produtos
    public List<Produto> listarTodos() {
        return produtoRepository.findAll(Sort.by("id"));
    }

    // Cadastra um novo produto
    public Produto criar(ProdutoRequest dados) {
        Categoria categoria = buscarCategoria(dados.categoriaId());

        Produto produto = new Produto();
        produto.setNome(dados.nome());
        produto.setDescricao(dados.descricao());
        produto.setImagemUrl(dados.imagemUrl());
        produto.setPreco(dados.preco());
        produto.setCategoria(categoria);
        produto.setAtivo(true);

        return produtoRepository.save(produto);
    }

    // Atualiza um produto existente
    // Alterar o preço não modifica pedidos antigos (RN02)
    public Produto atualizar(Long id, ProdutoRequest dados) {
        Produto produto = buscarPorId(id);
        Categoria categoria = buscarCategoria(dados.categoriaId());

        produto.setNome(dados.nome());
        produto.setDescricao(dados.descricao());
        produto.setImagemUrl(dados.imagemUrl());
        produto.setPreco(dados.preco());
        produto.setCategoria(categoria);

        return produtoRepository.save(produto);
    }

    // Ativa ou desativa um produto
    public Produto alternarAtivo(Long id) {
        Produto produto = buscarPorId(id);
        produto.setAtivo(!produto.isAtivo());

        return produtoRepository.save(produto);
    }

    // RN07: produto que já está em pedidos só pode ser desativado
    public void excluir(Long id) {
        Produto produto = buscarPorId(id);

        if (produtoRepository.estaEmPedidos(id)) {
            throw new RegraNegocioException(
                    "Esse produto já aparece em pedidos, então só pode ser desativado"
            );
        }

        produtoRepository.delete(produto);
    }

    // Busca um produto pelo ID
    public Produto buscarPorId(Long id) {
        return produtoRepository.findById(id)
                .orElseThrow(() ->
                        new RecursoNaoEncontradoException(
                                "Produto não encontrado"
                        )
                );
    }

    // Busca a categoria do produto
    private Categoria buscarCategoria(Long id) {
        return categoriaRepository.findById(id)
                .orElseThrow(() ->
                        new RecursoNaoEncontradoException(
                                "Categoria não encontrada"
                        )
                );
    }
}
