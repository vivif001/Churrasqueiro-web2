package com.churrasqueiro.cardapio.repository;

import com.churrasqueiro.cardapio.model.CategoriaProduto;
import com.churrasqueiro.cardapio.model.Produto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProdutoRepository extends JpaRepository<Produto, Long> {

    List<Produto> findByCategoria(CategoriaProduto categoria);

    List<Produto> findByDisponivel(Boolean disponivel);

    List<Produto> findByCategoriaAndDisponivel(CategoriaProduto categoria, Boolean disponivel);

    @Query("SELECT p FROM Produto p WHERE " +
           "(:categoria IS NULL OR p.categoria = :categoria) AND " +
           "(:disponivel IS NULL OR p.disponivel = :disponivel) AND " +
           "(:termo IS NULL OR LOWER(p.nome) LIKE LOWER(CONCAT('%', :termo, '%')) OR LOWER(p.descricao) LIKE LOWER(CONCAT('%', :termo, '%')))")
    List<Produto> buscarComFiltros(
            @Param("categoria") CategoriaProduto categoria,
            @Param("disponivel") Boolean disponivel,
            @Param("termo") String termo);

    long countByCategoriaIn(List<CategoriaProduto> categorias);

    long countByDisponivel(Boolean disponivel);
}
