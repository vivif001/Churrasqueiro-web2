package com.churrasqueiro.cardapio.config;

import com.churrasqueiro.cardapio.model.CategoriaProduto;
import com.churrasqueiro.cardapio.model.Produto;
import com.churrasqueiro.cardapio.repository.ProdutoRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.math.BigDecimal;
import java.util.List;

@Configuration
public class DataInitializer {

    @Bean
    public CommandLineRunner seedDatabase(ProdutoRepository repository) {
        return args -> {
            if (repository.count() == 0) {
                List<Produto> produtos = List.of(
                    Produto.builder()
                        .nome("Costela Defumada Burger")
                        .categoria(CategoriaProduto.BURGERS)
                        .preco(new BigDecimal("44.90"))
                        .descricao("Pão brioche selado na manteiga de garrafa, blend bovino de 200g grelhado na brasa, costela desfiada com barbecue artesanal, queijo monterey jack derretido e cebola crispy.")
                        .imagem("https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&auto=format&fit=crop&q=80")
                        .disponivel(true)
                        .destaque(true)
                        .tempoPreparoMinutos(15)
                        .build(),

                    Produto.builder()
                        .nome("Bacon & Cheddar Volcano")
                        .categoria(CategoriaProduto.BURGERS)
                        .preco(new BigDecimal("39.90"))
                        .descricao("Blend 180g de fraldinha e bacon, dobro de queijo cheddar inglês fundido, fatias generosas de bacon artesanal caramelizado e maionese defumada.")
                        .imagem("https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=800&auto=format&fit=crop&q=80")
                        .disponivel(true)
                        .destaque(true)
                        .tempoPreparoMinutos(12)
                        .build(),

                    Produto.builder()
                        .nome("Double Smash Churrasqueiro")
                        .categoria(CategoriaProduto.SMASHES)
                        .preco(new BigDecimal("34.90"))
                        .descricao("Dois ultrassmash burgers prensados de 90g com crostinha perfeita, queijo prato duplo derretido, picles artesanal agridoce e molho especial da casa.")
                        .imagem("https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=800&auto=format&fit=crop&q=80")
                        .disponivel(true)
                        .destaque(false)
                        .tempoPreparoMinutos(8)
                        .build(),

                    Produto.builder()
                        .nome("Smash Trufado")
                        .categoria(CategoriaProduto.SMASHES)
                        .preco(new BigDecimal("36.90"))
                        .descricao("Dois smash de 90g, queijo gouda cremoso, cogumelos salteados no azeite trufado e maionese de alho negro no pão de batata fofinho.")
                        .imagem("https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800&auto=format&fit=crop&q=80")
                        .disponivel(false)
                        .destaque(false)
                        .tempoPreparoMinutos(10)
                        .build(),

                    Produto.builder()
                        .nome("Batatas Rústicas com Alecrim")
                        .categoria(CategoriaProduto.ACOMPANHAMENTOS)
                        .preco(new BigDecimal("24.90"))
                        .descricao("Batatas com casca cortadas à mão, douradas e crocantes, temperadas com sal grosso triturado, alecrim fresco da horta e aioli de alho assado.")
                        .imagem("https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=800&auto=format&fit=crop&q=80")
                        .disponivel(true)
                        .destaque(false)
                        .tempoPreparoMinutos(10)
                        .build(),

                    Produto.builder()
                        .nome("Onion Rings Crocantes")
                        .categoria(CategoriaProduto.ACOMPANHAMENTOS)
                        .preco(new BigDecimal("26.90"))
                        .descricao("Anéis de cebola doce envoltos em massa temperada com cerveja artesanal e farinha panko japonesa, ultra crocantes. Acompanha molho barbecue com whisky.")
                        .imagem("https://images.unsplash.com/photo-1639024471287-035216734182?w=800&auto=format&fit=crop&q=80")
                        .disponivel(true)
                        .destaque(false)
                        .tempoPreparoMinutos(8)
                        .build(),

                    Produto.builder()
                        .nome("Chopp Artesanal IPA 500ml")
                        .categoria(CategoriaProduto.BEBIDAS)
                        .preco(new BigDecimal("18.00"))
                        .descricao("Chopp artesanal fresco, notas cítricas e amargor equilibrado. Servido em caldereta ultracongelada.")
                        .imagem("https://images.unsplash.com/photo-1608270199147-3860bb4f72eb?w=800&auto=format&fit=crop&q=80")
                        .disponivel(true)
                        .destaque(false)
                        .tempoPreparoMinutos(3)
                        .build(),

                    Produto.builder()
                        .nome("Pink Lemonade da Casa")
                        .categoria(CategoriaProduto.BEBIDAS)
                        .preco(new BigDecimal("14.50"))
                        .descricao("Limonada siciliana fresca com infusão de frutas vermelhas silvestres, xarope de hibisco artesanal e hortelã fresca.")
                        .imagem("https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=800&auto=format&fit=crop&q=80")
                        .disponivel(true)
                        .destaque(false)
                        .tempoPreparoMinutos(4)
                        .build(),

                    Produto.builder()
                        .nome("Brownie na Brasa com Sorvete")
                        .categoria(CategoriaProduto.SOBREMESAS)
                        .preco(new BigDecimal("28.00"))
                        .descricao("Fatia alta de brownie de chocolate 70% selada na grelha, servida com bola de sorvete de baunilha de Madagascar, nozes caramelizadas e calda de chocolate quente.")
                        .imagem("https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=800&auto=format&fit=crop&q=80")
                        .disponivel(true)
                        .destaque(true)
                        .tempoPreparoMinutos(7)
                        .build(),

                    Produto.builder()
                        .nome("Shake Doce de Leite com Farofa de Bacon")
                        .categoria(CategoriaProduto.SOBREMESAS)
                        .preco(new BigDecimal("26.50"))
                        .descricao("Milkshake ultra cremoso de doce de leite artesanal argentino, finalizado com chantilly de baunilha e crumble crocante de bacon caramelizado.")
                        .imagem("https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=800&auto=format&fit=crop&q=80")
                        .disponivel(true)
                        .destaque(false)
                        .tempoPreparoMinutos(6)
                        .build()
                );

                repository.saveAll(produtos);
            }
        };
    }
}
