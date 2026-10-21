package com.churrasqueiro.cardapio.dto;

import com.churrasqueiro.cardapio.model.CategoriaProduto;
import com.churrasqueiro.cardapio.model.Produto;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProdutoResponseDTO {

    private Long id;
    private String nome;
    private CategoriaProduto categoria;
    private BigDecimal preco;
    private String descricao;
    private String imagem;
    private Boolean disponivel;
    private Boolean destaque;
    private Integer tempoPreparoMinutos;
    private LocalDateTime criadoEm;
    private LocalDateTime atualizadoEm;

    public static ProdutoResponseDTO fromEntity(Produto p) {
        if (p == null) return null;
        return ProdutoResponseDTO.builder()
                .id(p.getId())
                .nome(p.getNome())
                .categoria(p.getCategoria())
                .preco(p.getPreco())
                .descricao(p.getDescricao())
                .imagem(p.getImagem())
                .disponivel(p.getDisponivel())
                .destaque(p.getDestaque())
                .tempoPreparoMinutos(p.getTempoPreparoMinutos())
                .criadoEm(p.getCriadoEm())
                .atualizadoEm(p.getAtualizadoEm())
                .build();
    }
}
