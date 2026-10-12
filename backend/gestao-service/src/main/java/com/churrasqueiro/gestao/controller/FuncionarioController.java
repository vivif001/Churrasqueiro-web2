package com.churrasqueiro.gestao.controller;

import com.churrasqueiro.gestao.dto.FuncionarioRequestDTO;
import com.churrasqueiro.gestao.dto.FuncionarioResponseDTO;
import com.churrasqueiro.gestao.service.FuncionarioService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/funcionarios")
public class FuncionarioController {

    private final FuncionarioService service;

    public FuncionarioController(FuncionarioService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<FuncionarioResponseDTO>> listarTodos() {
        return ResponseEntity.ok(service.listarTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<FuncionarioResponseDTO> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(service.buscarPorId(id));
    }

    @PostMapping
    public ResponseEntity<FuncionarioResponseDTO> salvar(@Valid @RequestBody FuncionarioRequestDTO dto) {
        FuncionarioResponseDTO criado = service.salvar(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(criado);
    }

    @PutMapping("/{id}")
    public ResponseEntity<FuncionarioResponseDTO> atualizar(@PathVariable Long id, @Valid @RequestBody FuncionarioRequestDTO dto) {
        return ResponseEntity.ok(service.atualizar(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        service.deletar(id);
        return ResponseEntity.noContent().build();
    }
}
