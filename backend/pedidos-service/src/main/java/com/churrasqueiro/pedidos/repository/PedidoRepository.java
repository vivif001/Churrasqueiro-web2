package com.churrasqueiro.pedidos.repository;

import com.churrasqueiro.pedidos.model.Pedido;
import com.churrasqueiro.pedidos.model.StatusPedido;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PedidoRepository extends JpaRepository<Pedido, Long> {

    List<Pedido> findByStatusNotOrderByDataCriacaoAsc(StatusPedido status);

    List<Pedido> findByMesaOrderByDataCriacaoDesc(String mesa);
}