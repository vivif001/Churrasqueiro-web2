package com.churrasqueiro.pedidos.dto;

import com.churrasqueiro.pedidos.model.Pedido;
import com.churrasqueiro.pedidos.model.StatusPedido;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;

public class PedidoResponseDTO {
    private Long id;
    private String mesa;
    private StatusPedido status;
    private String observacoes;
    private BigDecimal total;
    private LocalDateTime dataCriacao;
    private LocalDateTime criadoEm;
    private List<ItemPedidoResponseDTO> itens;

    public PedidoResponseDTO() {}

    public static PedidoResponseDTO fromEntity(Pedido entity) {
        if (entity == null) return null;
        PedidoResponseDTO dto = new PedidoResponseDTO();
        dto.setId(entity.getId());
        dto.setMesa(entity.getMesa());
        dto.setStatus(entity.getStatus());
        dto.setObservacoes(entity.getObservacoes());
        dto.setTotal(entity.getTotal());
        dto.setDataCriacao(entity.getDataCriacao());
        dto.setCriadoEm(entity.getDataCriacao());
        if (entity.getItens() != null) {
            dto.setItens(entity.getItens().stream().map(ItemPedidoResponseDTO::fromEntity).toList());
        } else {
            dto.setItens(Collections.emptyList());
        }
        return dto;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getMesa() { return mesa; }
    public void setMesa(String mesa) { this.mesa = mesa; }

    public StatusPedido getStatus() { return status; }
    public void setStatus(StatusPedido status) { this.status = status; }

    public String getObservacoes() { return observacoes; }
    public void setObservacoes(String observacoes) { this.observacoes = observacoes; }

    public BigDecimal getTotal() { return total; }
    public void setTotal(BigDecimal total) { this.total = total; }

    public LocalDateTime getDataCriacao() { return dataCriacao; }
    public void setDataCriacao(LocalDateTime dataCriacao) { this.dataCriacao = dataCriacao; }

    public LocalDateTime getCriadoEm() { return criadoEm; }
    public void setCriadoEm(LocalDateTime criadoEm) { this.criadoEm = criadoEm; }

    public List<ItemPedidoResponseDTO> getItens() { return itens; }
    public void setItens(List<ItemPedidoResponseDTO> itens) { this.itens = itens; }
}
