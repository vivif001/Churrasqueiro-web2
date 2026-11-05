package com.churrasqueiro.pedidos.config;

import com.churrasqueiro.pedidos.model.ItemPedido;
import com.churrasqueiro.pedidos.model.Pedido;
import com.churrasqueiro.pedidos.model.StatusPedido;
import com.churrasqueiro.pedidos.repository.PedidoRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Configuration
public class DataInitializer {

    @Bean
    public CommandLineRunner seedPedidos(PedidoRepository repository) {
        return args -> {
            if (repository.count() == 0) {

                Pedido p1 = new Pedido();
                p1.setMesa("Mesa 04");
                p1.setStatus(StatusPedido.RECEBIDO);
                p1.setObservacoes("Sem picles no burger, por favor.");
                p1.setTotal(new BigDecimal("69.80"));
                p1.setDataCriacao(LocalDateTime.now().minusMinutes(5));
                p1.adicionarItem(new ItemPedido("Costela Defumada Burger", 1, new BigDecimal("44.90")));
                p1.adicionarItem(new ItemPedido("Batatas Rústicas com Alecrim", 1, new BigDecimal("24.90")));

                Pedido p2 = new Pedido();
                p2.setMesa("Mesa 02");
                p2.setStatus(StatusPedido.EM_PREPARO);
                p2.setObservacoes("Ponto da carne ao ponto para mal.");
                p2.setTotal(new BigDecimal("57.90"));
                p2.setDataCriacao(LocalDateTime.now().minusMinutes(12));
                p2.adicionarItem(new ItemPedido("Bacon & Cheddar Volcano", 1, new BigDecimal("39.90")));
                p2.adicionarItem(new ItemPedido("Chopp Artesanal IPA 500ml", 1, new BigDecimal("18.00")));

                Pedido p3 = new Pedido();
                p3.setMesa("Mesa 07");
                p3.setStatus(StatusPedido.PRONTO);
                p3.setObservacoes("Caprichar no molho da casa.");
                p3.setTotal(new BigDecimal("49.40"));
                p3.setDataCriacao(LocalDateTime.now().minusMinutes(20));
                p3.adicionarItem(new ItemPedido("Double Smash Churrasqueiro", 1, new BigDecimal("34.90")));
                p3.adicionarItem(new ItemPedido("Pink Lemonade da Casa", 1, new BigDecimal("14.50")));

                repository.save(p1);
                repository.save(p2);
                repository.save(p3);
            }
        };
    }
}
