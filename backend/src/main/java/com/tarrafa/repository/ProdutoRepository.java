package com.tarrafa.repository;

import com.tarrafa.entity.Produto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ProdutoRepository extends JpaRepository<Produto, Long> {

    List<Produto> findByAtivoTrueOrderByIdAsc();

    boolean existsByCategoriaId(Long categoriaId);

    // RN07: confere se o produto ja aparece em algum pedido
    @Query(value = "SELECT COUNT(*) > 0 FROM item_pedido WHERE produto_id = :id", nativeQuery = true)
    boolean estaEmPedidos(@Param("id") Long id);
}