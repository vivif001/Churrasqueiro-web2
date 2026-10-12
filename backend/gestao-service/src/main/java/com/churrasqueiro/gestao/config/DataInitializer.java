package com.churrasqueiro.gestao.config;

import com.churrasqueiro.gestao.model.Cargo;
import com.churrasqueiro.gestao.model.Funcionario;
import com.churrasqueiro.gestao.repository.FuncionarioRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataInitializer {

    @Bean
    public CommandLineRunner seedDatabase(FuncionarioRepository repository) {
        return args -> {
            if (repository.count() == 0) {
                repository.save(Funcionario.builder()
                        .nome("Administrador Chefe")
                        .email("admin@hamburgueria.com")
                        .senha("admin123")
                        .cargo(Cargo.ADMIN)
                        .ativo(true)
                        .build());

                repository.save(Funcionario.builder()
                        .nome("Garçom Silva")
                        .email("garcom@hamburgueria.com")
                        .senha("garcom123")
                        .cargo(Cargo.GARCOM)
                        .ativo(true)
                        .build());

                repository.save(Funcionario.builder()
                        .nome("Chapeiro Carlos")
                        .email("cozinheiro@hamburgueria.com")
                        .senha("chapa123")
                        .cargo(Cargo.COZINHEIRO)
                        .ativo(true)
                        .build());

                System.out.println(">>> [SEED] Funcionários padrão criados com sucesso!");
                System.out.println(">>> [SEED] Admin: admin@hamburgueria.com | admin123");
                System.out.println(">>> [SEED] Garçom: garcom@hamburgueria.com | garcom123");
                System.out.println(">>> [SEED] Cozinheiro: cozinheiro@hamburgueria.com | chapa123");
            }
        };
    }
}
