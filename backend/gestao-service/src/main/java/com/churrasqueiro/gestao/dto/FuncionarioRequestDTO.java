package com.churrasqueiro.gestao.dto;

import com.churrasqueiro.gestao.model.Cargo;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FuncionarioRequestDTO {

    @NotBlank(message = "O nome do funcionário é obrigatório")
    private String nome;

    @NotBlank(message = "O e-mail é obrigatório")
    @Email(message = "Formato de e-mail inválido")
    private String email;

    @NotBlank(message = "A senha é obrigatória")
    @Size(min = 4, message = "A senha deve ter no mínimo 4 caracteres")
    private String senha;

    @NotNull(message = "O cargo é obrigatório (ADMIN, GARCOM, COZINHEIRO)")
    private Cargo cargo;
}
