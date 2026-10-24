package com.churrasqueiro.cardapio.controller;

import com.churrasqueiro.cardapio.dto.CardapioEstatisticasDTO;
import com.churrasqueiro.cardapio.dto.ProdutoRequestDTO;
import com.churrasqueiro.cardapio.dto.ProdutoResponseDTO;
import com.churrasqueiro.cardapio.dto.ProdutoStatusDTO;
import com.churrasqueiro.cardapio.model.CategoriaProduto;
import com.churrasqueiro.cardapio.service.ProdutoService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/produtos")
public class ProdutoController {

    private final ProdutoService service;

    public ProdutoController(ProdutoService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<ProdutoResponseDTO>> listarTodos(
            @RequestParam(required = false) CategoriaProduto categoria,
            @RequestParam(required = false) Boolean disponivel,
            @RequestParam(required = false) String busca) {
        return ResponseEntity.ok(service.listarTodos(categoria, disponivel, busca));
    }

    @GetMapping("/estatisticas")
    public ResponseEntity<CardapioEstatisticasDTO> obterEstatisticas() {
        return ResponseEntity.ok(service.obterEstatisticas());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProdutoResponseDTO> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(service.buscarPorId(id));
    }

    @PostMapping
    public ResponseEntity<ProdutoResponseDTO> salvar(@Valid @RequestBody ProdutoRequestDTO dto) {
        ProdutoResponseDTO criado = service.salvar(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(criado);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProdutoResponseDTO> atualizar(
            @PathVariable Long id,
            @Valid @RequestBody ProdutoRequestDTO dto) {
        return ResponseEntity.ok(service.atualizar(id, dto));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ProdutoResponseDTO> atualizarStatus(
            @PathVariable Long id,
            @RequestBody(required = false) ProdutoStatusDTO dto) {
        if (dto != null && dto.getDisponivel() != null) {
            return ResponseEntity.ok(service.atualizarStatus(id, dto.getDisponivel()));
        }
        return ResponseEntity.ok(service.alternarStatus(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        service.deletar(id);
        return ResponseEntity.noContent().build();
    }
}
