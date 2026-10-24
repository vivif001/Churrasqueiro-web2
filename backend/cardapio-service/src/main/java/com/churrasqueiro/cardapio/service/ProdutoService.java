package com.churrasqueiro.cardapio.service;

import com.churrasqueiro.cardapio.dto.CardapioEstatisticasDTO;
import com.churrasqueiro.cardapio.dto.ProdutoRequestDTO;
import com.churrasqueiro.cardapio.dto.ProdutoResponseDTO;
import com.churrasqueiro.cardapio.model.CategoriaProduto;
import com.churrasqueiro.cardapio.model.Produto;
import com.churrasqueiro.cardapio.repository.ProdutoRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ProdutoService {

    private final ProdutoRepository repository;

    public ProdutoService(ProdutoRepository repository) {
        this.repository = repository;
    }

    @Transactional(readOnly = true)
    public List<ProdutoResponseDTO> listarTodos(CategoriaProduto categoria, Boolean disponivel, String busca) {
        String termo = (busca != null && !busca.trim().isEmpty()) ? busca.trim() : null;
        List<Produto> produtos = repository.buscarComFiltros(categoria, disponivel, termo);
        return produtos.stream().map(ProdutoResponseDTO::fromEntity).toList();
    }

    @Transactional(readOnly = true)
    public ProdutoResponseDTO buscarPorId(Long id) {
        Produto produto = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Produto não encontrado com id: " + id));
        return ProdutoResponseDTO.fromEntity(produto);
    }

    @Transactional
    public ProdutoResponseDTO salvar(ProdutoRequestDTO dto) {
        Produto produto = Produto.builder()
                .nome(dto.getNome().trim())
                .categoria(dto.getCategoria())
                .preco(dto.getPreco())
                .descricao(dto.getDescricao().trim())
                .imagem(dto.getImagem())
                .disponivel(dto.getDisponivel() != null ? dto.getDisponivel() : true)
                .destaque(dto.getDestaque() != null ? dto.getDestaque() : false)
                .tempoPreparoMinutos(dto.getTempoPreparoMinutos() != null ? dto.getTempoPreparoMinutos() : 12)
                .build();

        Produto salvo = repository.save(produto);
        return ProdutoResponseDTO.fromEntity(salvo);
    }

    @Transactional
    public ProdutoResponseDTO atualizar(Long id, ProdutoRequestDTO dto) {
        Produto produto = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Produto não encontrado com id: " + id));

        produto.setNome(dto.getNome().trim());
        produto.setCategoria(dto.getCategoria());
        produto.setPreco(dto.getPreco());
        produto.setDescricao(dto.getDescricao().trim());
        produto.setImagem(dto.getImagem());
        if (dto.getDisponivel() != null) produto.setDisponivel(dto.getDisponivel());
        if (dto.getDestaque() != null) produto.setDestaque(dto.getDestaque());
        if (dto.getTempoPreparoMinutos() != null) produto.setTempoPreparoMinutos(dto.getTempoPreparoMinutos());

        Produto atualizado = repository.save(produto);
        return ProdutoResponseDTO.fromEntity(atualizado);
    }

    @Transactional
    public ProdutoResponseDTO atualizarStatus(Long id, Boolean disponivel) {
        Produto produto = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Produto não encontrado com id: " + id));

        produto.setDisponivel(disponivel);
        Produto atualizado = repository.save(produto);
        return ProdutoResponseDTO.fromEntity(atualizado);
    }

    @Transactional
    public ProdutoResponseDTO alternarStatus(Long id) {
        Produto produto = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Produto não encontrado com id: " + id));

        produto.setDisponivel(!produto.getDisponivel());
        Produto atualizado = repository.save(produto);
        return ProdutoResponseDTO.fromEntity(atualizado);
    }

    @Transactional
    public void deletar(Long id) {
        if (!repository.existsById(id)) {
            throw new RuntimeException("Produto não encontrado com id: " + id);
        }
        repository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public CardapioEstatisticasDTO obterEstatisticas() {
        long total = repository.count();
        long burgers = repository.countByCategoriaIn(List.of(CategoriaProduto.BURGERS, CategoriaProduto.SMASHES));
        long disponiveis = repository.countByDisponivel(true);
        long esgotados = repository.countByDisponivel(false);

        return CardapioEstatisticasDTO.builder()
                .total(total)
                .burgers(burgers)
                .disponiveis(disponiveis)
                .esgotados(esgotados)
                .build();
    }
}
