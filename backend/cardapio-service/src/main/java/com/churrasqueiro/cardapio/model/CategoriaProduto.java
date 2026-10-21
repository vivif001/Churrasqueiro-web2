package com.churrasqueiro.cardapio.model;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum CategoriaProduto {
    BURGERS("burgers"),
    SMASHES("smashes"),
    ACOMPANHAMENTOS("acompanhamentos"),
    BEBIDAS("bebidas"),
    SOBREMESAS("sobremesas");

    private final String codigo;

    CategoriaProduto(String codigo) {
        this.codigo = codigo;
    }

    @JsonValue
    public String getCodigo() {
        return codigo;
    }

    @JsonCreator
    public static CategoriaProduto fromString(String valor) {
        if (valor == null) return null;
        for (CategoriaProduto cat : CategoriaProduto.values()) {
            if (cat.name().equalsIgnoreCase(valor) || cat.codigo.equalsIgnoreCase(valor)) {
                return cat;
            }
        }
        throw new IllegalArgumentException("Categoria inválida: " + valor);
    }
}
