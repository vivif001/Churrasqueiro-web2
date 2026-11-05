package com.churrasqueiro.pedidos.dto;

import java.math.BigDecimal;

public class ItemPedidoRequestDTO {
    private String nome;
    private Integer quantidade;
    private BigDecimal preco;

    public ItemPedidoRequestDTO() {}

    public ItemPedidoRequestDTO(String nome, Integer quantidade, BigDecimal preco) {
        this.nome = nome;
        this.quantidade = quantidade;
        this.preco = preco;
    }

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public Integer getQuantidade() { return quantidade; }
    public void setQuantidade(Integer quantidade) { this.quantidade = quantidade; }

    public BigDecimal getPreco() { return preco; }
    public void setPreco(BigDecimal preco) { this.preco = preco; }
}
