package com.churrasqueiro.cardapio.dto;

import com.churrasqueiro.cardapio.model.CategoriaProduto;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProdutoRequestDTO {

    @NotBlank(message = "O nome do produto é obrigatório")
    private String nome;

    @NotNull(message = "A categoria do produto é obrigatória")
    private CategoriaProduto categoria;

    @NotNull(message = "O preço é obrigatório")
    @DecimalMin(value = "0.01", message = "O preço deve ser maior que zero")
    private BigDecimal preco;

    @NotBlank(message = "A descrição do produto é obrigatória")
    private String descricao;

    private String imagem;

    private Boolean disponivel;

    private Boolean destaque;

    private Integer tempoPreparoMinutos;
}
