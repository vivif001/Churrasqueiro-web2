package com.churrasqueiro.pedidos.controller;

import com.churrasqueiro.pedidos.dto.PedidoRequestDTO;
import com.churrasqueiro.pedidos.dto.PedidoResponseDTO;
import com.churrasqueiro.pedidos.dto.StatusPedidoDTO;
import com.churrasqueiro.pedidos.model.StatusPedido;
import com.churrasqueiro.pedidos.service.PedidoService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pedidos")
public class PedidoController {

    private final PedidoService service;

    public PedidoController(PedidoService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<PedidoResponseDTO>> listarTodos(
            @RequestParam(required = false) StatusPedido status) {
        return ResponseEntity.ok(service.listarTodos(status));
    }

    @GetMapping("/{id}")
    public ResponseEntity<PedidoResponseDTO> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(service.buscarPorId(id));
    }

    @PostMapping
    public ResponseEntity<PedidoResponseDTO> criar(@RequestBody PedidoRequestDTO dto) {
        PedidoResponseDTO criado = service.criarPedido(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(criado);
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<PedidoResponseDTO> atualizarStatus(
            @PathVariable Long id,
            @RequestBody(required = false) StatusPedidoDTO dto,
            @RequestParam(required = false) StatusPedido novoStatus) {
        StatusPedido statusAlvo = (dto != null && dto.getStatus() != null) ? dto.getStatus() : novoStatus;
        if (statusAlvo == null) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(service.atualizarStatus(id, statusAlvo));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        service.deletar(id);
        return ResponseEntity.noContent().build();
    }
}
