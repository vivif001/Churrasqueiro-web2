package com.churrasqueiro.pedidos.dto;

import com.churrasqueiro.pedidos.model.StatusPedido;

public class StatusPedidoDTO {
    private StatusPedido status;

    public StatusPedidoDTO() {}

    public StatusPedidoDTO(StatusPedido status) {
        this.status = status;
    }

    public StatusPedido getStatus() { return status; }
    public void setStatus(StatusPedido status) { this.status = status; }
}
