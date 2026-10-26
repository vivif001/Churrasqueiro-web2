package com.churrasqueiro.pedidos.dto;

import java.math.BigDecimal;
import java.util.List;

public class PedidoRequestDTO {
    private String mesa;
    private String observacoes;
    private BigDecimal total;
    private List<ItemPedidoRequestDTO> itens;

    public PedidoRequestDTO() {}

    public String getMesa() { return mesa; }
    public void setMesa(String mesa) { this.mesa = mesa; }

    public String getObservacoes() { return observacoes; }
    public void setObservacoes(String observacoes) { this.observacoes = observacoes; }

    public BigDecimal getTotal() { return total; }
    public void setTotal(BigDecimal total) { this.total = total; }

    public List<ItemPedidoRequestDTO> getItens() { return itens; }
    public void setItens(List<ItemPedidoRequestDTO> itens) { this.itens = itens; }
}
