package com.churrasqueiro.gestao.dto;

import com.churrasqueiro.gestao.model.Cargo;
import com.churrasqueiro.gestao.model.Funcionario;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FuncionarioResponseDTO {

    private Long id;
    private String nome;
    private String email;
    private Cargo cargo;
    private Boolean ativo;
    private LocalDateTime criadoEm;

    public static FuncionarioResponseDTO fromEntity(Funcionario f) {
        return FuncionarioResponseDTO.builder()
                .id(f.getId())
                .nome(f.getNome())
                .email(f.getEmail())
                .cargo(f.getCargo())
                .ativo(f.getAtivo())
                .criadoEm(f.getCriadoEm())
                .build();
    }
}
