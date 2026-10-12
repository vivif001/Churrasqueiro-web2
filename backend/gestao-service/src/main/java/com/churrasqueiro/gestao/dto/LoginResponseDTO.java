package com.churrasqueiro.gestao.dto;

import com.churrasqueiro.gestao.model.Cargo;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoginResponseDTO {

    private Long id;
    private String nome;
    private String email;
    private Cargo cargo;
    private String mensagem;
}
