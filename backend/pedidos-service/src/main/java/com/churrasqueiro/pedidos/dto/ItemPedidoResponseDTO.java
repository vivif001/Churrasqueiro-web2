package com.churrasqueiro.pedidos.dto;

import com.churrasqueiro.pedidos.model.ItemPedido;
import java.math.BigDecimal;

public class ItemPedidoResponseDTO {
    private Long id;
    private String nome;
    private Integer quantidade;
    private BigDecimal preco;

    public ItemPedidoResponseDTO() {}

    public ItemPedidoResponseDTO(Long id, String nome, Integer quantidade, BigDecimal preco) {
        this.id = id;
        this.nome = nome;
        this.quantidade = quantidade;
        this.preco = preco;
    }

    public static ItemPedidoResponseDTO fromEntity(ItemPedido entity) {
        if (entity == null) return null;
        return new ItemPedidoResponseDTO(
            entity.getId(),
            entity.getNome(),
            entity.getQuantidade(),
            entity.getPreco()
        );
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public Integer getQuantidade() { return quantidade; }
    public void setQuantidade(Integer quantidade) { this.quantidade = quantidade; }

    public BigDecimal getPreco() { return preco; }
    public void setPreco(BigDecimal preco) { this.preco = preco; }
}
