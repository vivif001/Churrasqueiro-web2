package com.churrasqueiro.cardapio.dto;

import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProdutoStatusDTO {

    @NotNull(message = "O status de disponibilidade é obrigatório")
    private Boolean disponivel;
}
