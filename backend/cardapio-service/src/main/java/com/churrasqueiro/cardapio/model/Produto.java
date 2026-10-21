package com.churrasqueiro.cardapio.model;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "produtos")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Produto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 150)
    private String nome;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private CategoriaProduto categoria;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal preco;

    @Column(columnDefinition = "TEXT")
    private String descricao;

    @Column(length = 500)
    private String imagem;

    @Column(nullable = false)
    @Builder.Default
    private Boolean disponivel = true;

    @Column(nullable = false)
    @Builder.Default
    private Boolean destaque = false;

    @Column(name = "tempo_preparo_minutos")
    @Builder.Default
    private Integer tempoPreparoMinutos = 12;

    @Column(name = "criado_em", updatable = false)
    private LocalDateTime criadoEm;

    @Column(name = "atualizado_em")
    private LocalDateTime atualizadoEm;

    @PrePersist
    public void prePersist() {
        this.criadoEm = LocalDateTime.now();
        this.atualizadoEm = LocalDateTime.now();
        if (this.disponivel == null) this.disponivel = true;
        if (this.destaque == null) this.destaque = false;
        if (this.tempoPreparoMinutos == null) this.tempoPreparoMinutos = 12;
    }

    @PreUpdate
    public void preUpdate() {
        this.atualizadoEm = LocalDateTime.now();
    }
}
