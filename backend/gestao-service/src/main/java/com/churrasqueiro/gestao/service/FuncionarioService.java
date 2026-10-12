package com.churrasqueiro.gestao.service;

import com.churrasqueiro.gestao.dto.FuncionarioRequestDTO;
import com.churrasqueiro.gestao.dto.FuncionarioResponseDTO;
import com.churrasqueiro.gestao.dto.LoginRequestDTO;
import com.churrasqueiro.gestao.dto.LoginResponseDTO;
import com.churrasqueiro.gestao.model.Funcionario;
import com.churrasqueiro.gestao.repository.FuncionarioRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class FuncionarioService {

    private final FuncionarioRepository repository;

    public FuncionarioService(FuncionarioRepository repository) {
        this.repository = repository;
    }

    @Transactional(readOnly = true)
    public List<FuncionarioResponseDTO> listarTodos() {
        return repository.findAll().stream()
                .map(FuncionarioResponseDTO::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public FuncionarioResponseDTO buscarPorId(Long id) {
        Funcionario funcionario = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Funcionário não encontrado com o ID: " + id));
        return FuncionarioResponseDTO.fromEntity(funcionario);
    }

    @Transactional
    public FuncionarioResponseDTO salvar(FuncionarioRequestDTO dto) {
        if (repository.existsByEmail(dto.getEmail())) {
            throw new RuntimeException("Já existe um funcionário cadastrado com o e-mail: " + dto.getEmail());
        }

        Funcionario funcionario = Funcionario.builder()
                .nome(dto.getNome())
                .email(dto.getEmail())
                .senha(dto.getSenha())
                .cargo(dto.getCargo())
                .ativo(true)
                .build();

        Funcionario salvo = repository.save(funcionario);
        return FuncionarioResponseDTO.fromEntity(salvo);
    }

    @Transactional
    public FuncionarioResponseDTO atualizar(Long id, FuncionarioRequestDTO dto) {
        Funcionario funcionario = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Funcionário não encontrado com o ID: " + id));

        if (!funcionario.getEmail().equalsIgnoreCase(dto.getEmail()) && repository.existsByEmail(dto.getEmail())) {
            throw new RuntimeException("Já existe outro funcionário cadastrado com o e-mail: " + dto.getEmail());
        }

        funcionario.setNome(dto.getNome());
        funcionario.setEmail(dto.getEmail());
        funcionario.setCargo(dto.getCargo());
        if (dto.getSenha() != null && !dto.getSenha().isBlank()) {
            funcionario.setSenha(dto.getSenha());
        }

        Funcionario atualizado = repository.save(funcionario);
        return FuncionarioResponseDTO.fromEntity(atualizado);
    }

    @Transactional
    public void deletar(Long id) {
        if (!repository.existsById(id)) {
            throw new RuntimeException("Funcionário não encontrado com o ID: " + id);
        }
        repository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public LoginResponseDTO autenticar(LoginRequestDTO dto) {
        Funcionario funcionario = repository.findByEmail(dto.getEmail())
                .orElseThrow(() -> new RuntimeException("Credenciais inválidas: e-mail não encontrado."));

        if (!funcionario.getSenha().equals(dto.getSenha())) {
            throw new RuntimeException("Credenciais inválidas: senha incorreta.");
        }

        if (Boolean.FALSE.equals(funcionario.getAtivo())) {
            throw new RuntimeException("Este funcionário está inativo no sistema.");
        }

        return LoginResponseDTO.builder()
                .id(funcionario.getId())
                .nome(funcionario.getNome())
                .email(funcionario.getEmail())
                .cargo(funcionario.getCargo())
                .mensagem("Login realizado com sucesso!")
                .build();
    }
}
