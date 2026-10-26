package com.churrasqueiro.pedidos.service;

import com.churrasqueiro.pedidos.dto.ItemPedidoRequestDTO;
import com.churrasqueiro.pedidos.dto.PedidoRequestDTO;
import com.churrasqueiro.pedidos.dto.PedidoResponseDTO;
import com.churrasqueiro.pedidos.model.ItemPedido;
import com.churrasqueiro.pedidos.model.Pedido;
import com.churrasqueiro.pedidos.model.StatusPedido;
import com.churrasqueiro.pedidos.repository.PedidoRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class PedidoService {

    private final PedidoRepository repository;

    public PedidoService(PedidoRepository repository) {
        this.repository = repository;
    }

    @Transactional(readOnly = true)
    public List<PedidoResponseDTO> listarTodos(StatusPedido status) {
        List<Pedido> pedidos;
        if (status != null) {
            pedidos = repository.findByStatusOrderByDataCriacaoAsc(status);
        } else {
            pedidos = repository.findAllByOrderByDataCriacaoDesc();
        }
        return pedidos.stream().map(PedidoResponseDTO::fromEntity).toList();
    }

    @Transactional(readOnly = true)
    public PedidoResponseDTO buscarPorId(Long id) {
        Pedido pedido = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pedido não encontrado com id: " + id));
        return PedidoResponseDTO.fromEntity(pedido);
    }

    @Transactional
    public PedidoResponseDTO criarPedido(PedidoRequestDTO dto) {
        Pedido pedido = new Pedido();
        pedido.setMesa(dto.getMesa() != null && !dto.getMesa().isBlank() ? dto.getMesa().trim() : "Mesa 01");
        pedido.setObservacoes(dto.getObservacoes() != null ? dto.getObservacoes().trim() : "");
        pedido.setStatus(StatusPedido.RECEBIDO);
        pedido.setDataCriacao(LocalDateTime.now());

        BigDecimal totalCalculado = BigDecimal.ZERO;

        if (dto.getItens() != null && !dto.getItens().isEmpty()) {
            for (ItemPedidoRequestDTO itemDto : dto.getItens()) {
                String nome = itemDto.getNome() != null ? itemDto.getNome().trim() : "Item";
                int qtd = itemDto.getQuantidade() != null && itemDto.getQuantidade() > 0 ? itemDto.getQuantidade() : 1;
                BigDecimal preco = itemDto.getPreco() != null ? itemDto.getPreco() : BigDecimal.ZERO;

                ItemPedido item = new ItemPedido(nome, qtd, preco);
                pedido.adicionarItem(item);

                totalCalculado = totalCalculado.add(preco.multiply(BigDecimal.valueOf(qtd)));
            }
        }

        if (dto.getTotal() != null && dto.getTotal().compareTo(BigDecimal.ZERO) > 0) {
            pedido.setTotal(dto.getTotal());
        } else {
            pedido.setTotal(totalCalculado);
        }

        Pedido salvo = repository.save(pedido);
        return PedidoResponseDTO.fromEntity(salvo);
    }

    @Transactional
    public PedidoResponseDTO atualizarStatus(Long id, StatusPedido novoStatus) {
        Pedido pedido = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pedido não encontrado com id: " + id));

        pedido.setStatus(novoStatus);
        Pedido atualizado = repository.save(pedido);
        return PedidoResponseDTO.fromEntity(atualizado);
    }

    @Transactional
    public void deletar(Long id) {
        if (!repository.existsById(id)) {
            throw new RuntimeException("Pedido não encontrado com id: " + id);
        }
        repository.deleteById(id);
    }
}
