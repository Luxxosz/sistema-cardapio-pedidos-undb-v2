package com.tarrafa.controller;

import com.tarrafa.dto.ProdutoRequest;
import com.tarrafa.entity.Produto;
import com.tarrafa.service.ProdutoService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/produtos")
public class AdminProdutoController {

    private final ProdutoService produtoService;

    public AdminProdutoController(ProdutoService produtoService) {
        this.produtoService = produtoService;
    }

    // o admin ve todos, inclusive os desativados
    @GetMapping
    public List<Produto> listarTodos() {
        return produtoService.listarTodos();
    }

    @PostMapping
    public Produto criar(@Valid @RequestBody ProdutoRequest dados) {
        return produtoService.criar(dados);
    }

    @PutMapping("/{id}")
    public Produto atualizar(@PathVariable Long id, @Valid @RequestBody ProdutoRequest dados) {
        return produtoService.atualizar(id, dados);
    }

    // liga e desliga o produto
    @PatchMapping("/{id}/ativo")
    public Produto alternarAtivo(@PathVariable Long id) {
        return produtoService.alternarAtivo(id);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void excluir(@PathVariable Long id) {
        produtoService.excluir(id);
    }
}