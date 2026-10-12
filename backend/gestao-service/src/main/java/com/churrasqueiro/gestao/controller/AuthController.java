package com.churrasqueiro.gestao.controller;

import com.churrasqueiro.gestao.dto.LoginRequestDTO;
import com.churrasqueiro.gestao.dto.LoginResponseDTO;
import com.churrasqueiro.gestao.service.FuncionarioService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final FuncionarioService funcionarioService;

    public AuthController(FuncionarioService funcionarioService) {
        this.funcionarioService = funcionarioService;
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> login(@Valid @RequestBody LoginRequestDTO dto) {
        LoginResponseDTO resposta = funcionarioService.autenticar(dto);
        return ResponseEntity.ok(resposta);
    }
}
