package com.churrasqueiro.cardapio.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CardapioEstatisticasDTO {

    private long total;
    private long burgers;
    private long disponiveis;
    private long esgotados;
}
