package com.tarrafa.service;

import com.tarrafa.dto.CategoriaRequest;
import org.springframework.data.domain.Sort;
import com.tarrafa.entity.Categoria;
import com.tarrafa.exception.RecursoNaoEncontradoException;
import com.tarrafa.exception.RegraNegocioException;
import com.tarrafa.repository.CategoriaRepository;
import com.tarrafa.repository.ProdutoRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoriaService {

    private final CategoriaRepository categoriaRepository;
    private final ProdutoRepository produtoRepository;

    public CategoriaService(CategoriaRepository categoriaRepository, ProdutoRepository produtoRepository) {
        this.categoriaRepository = categoriaRepository;
        this.produtoRepository = produtoRepository;
    }

    public List<Categoria> listar() {
        return categoriaRepository.findAll(Sort.by("id"));
    }

    public Categoria criar(CategoriaRequest dados) {
        if (categoriaRepository.existsByNome(dados.nome())) {
            throw new RegraNegocioException("Já existe uma categoria com esse nome");
        }

        Categoria categoria = new Categoria();
        categoria.setNome(dados.nome());
        return categoriaRepository.save(categoria);
    }

    public Categoria atualizar(Long id, CategoriaRequest dados) {
        Categoria categoria = buscarPorId(id);

        boolean mudouNome = !categoria.getNome().equals(dados.nome());
        if (mudouNome && categoriaRepository.existsByNome(dados.nome())) {
            throw new RegraNegocioException("Já existe uma categoria com esse nome");
        }

        categoria.setNome(dados.nome());
        return categoriaRepository.save(categoria);
    }

    public void excluir(Long id) {
        Categoria categoria = buscarPorId(id);

        if (produtoRepository.existsByCategoriaId(id)) {
            throw new RegraNegocioException("Essa categoria ainda tem produtos, mova ou remova eles antes");
        }

        categoriaRepository.delete(categoria);
    }

    private Categoria buscarPorId(Long id) {
        return categoriaRepository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Categoria não encontrada"));
    }
}