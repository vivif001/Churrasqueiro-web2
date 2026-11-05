# Churrasqueiro-web2
<div align="center">

#  O Churrasqueiro — Sistema em Arquitetura de Microsserviços

![Java](https://img.shields.io/badge/Java-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Apache Kafka](https://img.shields.io/badge/Apache_Kafka-231F20?style=for-the-badge&logo=apache-kafka&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)

<p align="center">
  <b>Plataforma completa de atendimento, gestão de cardápio digital e acompanhamento de comandas em tempo real (KDS).</b>
</p>

---

</div>

##  Sobre o Sistema

O **O Churrasqueiro** é um sistema completo desenvolvido sob uma arquitetura de microsserviços desacoplados. A plataforma divide-se em um frontend web dinâmico (HTML5, CSS3, JS Puro com serviços modulares) e três microsserviços Spring Boot integrados via PostgreSQL e Apache Kafka.

---

##  Arquitetura do Sistema e Portas

```text
                               ┌──────────────────────────┐
                               │   Frontend Web (Client)  │
                               └────────────┬─────────────┘
                                            │
        ┌───────────────────────────────────┼──────────────────────────────────┐
        │ HTTP (8081)                       │ HTTP (8082)                      │ HTTP (8083)
        ▼                                   ▼                                  ▼
┌──────────────┐                   ┌──────────────┐                   ┌──────────────┐
│gestao-service│                   │cardapio-serv.│                   │pedidos-serv. │
│ (Autenticação)                  │  (Cardápio)  │                   │ (Comandas)   │
└───────┬──────┘                   └───────┬──────┘                   └───────┬──────┘
        │                                  │                                  │
        └──────────────────────────────────┼──────────────────────────────────┘
                                           │ (Eventos Kafka / JPA)
                                           ▼
                            ┌──────────────────────────────┐
                            │ PostgreSQL (5432)            │
                            │ Apache Kafka (9092)          │
                            └──────────────────────────────┘
```

| Módulo / Serviço | Porta | Tecnologia Base | Descrição & Responsabilidades |
| :--- | :---: | :--- | :--- |
| **`gestao-service`** | `8081` | Spring Boot / JPA | Autenticação, controle de acessos e perfil de colaboradores. |
| **`cardapio-service`** | `8082` | Spring Boot / JPA | Cadastro, precificação e disponibilidade dos produtos do restaurante. |
| **`pedidos-service`** | `8083` | Spring Boot / Kafka / JPA | Gestão das comandas, cálculo de totais e fila da cozinha em tempo real. |
| **Frontend Web** | N/A | HTML5, CSS3, ES6+ JS | Telas do Cliente, Cardápio, Login e Painel KDS da Cozinha. |

---

## 📁 Estrutura de Pastas do Monorepo

```text
Churrasqueiro-web2/
├── docker-compose.yml           # Subida do PostgreSQL, Kafka e Kafka-UI
├── README.md                    # Documentação geral do repositório
├── backend/
│   ├── gestao-service/          # Microsserviço de Gestão & Auth (Porta 8081)
│   ├── cardapio-service/        # Microsserviço de Cardápio (Porta 8082)
│   └── pedidos-service/         # Microsserviço de Pedidos (Porta 8083)
└── frontend/
    ├── shared/                  # Estilos globais e autenticação compartilhada
    ├── login/                   # Interface de login (login.html, login.service.js)
    ├── cardapio/                # Cardápio interativo e sacola de compras
    └── pedidos/                 # Telas de acompanhamento do cliente e Painel KDS da Cozinha
```

---

##  API Endpoints Mapeados

###  1. Gestão e Autenticação (`gestao-service` — `http://localhost:8081`)
* `POST /api/auth/login`: Autentica o usuário e devolve o perfil e a sessão.

###  2. Cardápio Digital (`cardapio-service` — `http://localhost:8082`)
* `GET /api/produtos`: Lista todos os itens cadastrados no cardápio.
* `POST /api/produtos`: Cadastra um novo produto (modo funcionário).
* `PUT /api/produtos/{id}`: Atualiza os dados de um item existente.
* `PATCH /api/produtos/{id}/status`: Altera a disponibilidade (pausar/ativar venda).
* `DELETE /api/produtos/{id}`: Remove um produto do catálogo.

###  3. Pedidos & Cozinha (`pedidos-service` — `http://localhost:8083`)
* `POST /api/pedidos`: Envia um novo pedido gerado no frontend.
* `GET /api/pedidos/cozinha`: Retorna a fila de pedidos pendentes para o painel KDS.
* `GET /api/pedidos/{id}`: Detalha um pedido específico por ID.
* `PATCH /api/pedidos/{id}/status`: Avança o status (`RECEBIDO` $\rightarrow$ `EM_PREPARO` $\rightarrow$ `PRONTO` $\rightarrow$ `ENTREGUE`).

---

## 💻 Padrão de Consumo no Frontend (`Service Pattern`)

O frontend isola as chamadas `fetch` em arquivos de serviço dedicados, contendo fallback automático para `localStorage` caso algum microsserviço backend esteja offline:

* **`login.service.js`**: Consome `http://localhost:8081/api/auth/login`.
* **`cardapio.service.js`**: Consome `http://localhost:8082/api/produtos`.
* **`pedidos-cozinha.js` / `pedidos-cliente.js`**: Consome `http://localhost:8083/api/pedidos`.

---

##  Como Executar o Sistema Completo

### 1. Subir os Contêineres de Infraestrutura (PostgreSQL e Kafka)
Na raiz do projeto, execute:
```bash
docker-compose up -d
```
* **PostgreSQL:** `localhost:5432` (database: `churrasqueiro_db`)
* **Kafka:** `localhost:9092`
* **Kafka UI:** `http://localhost:8085`

### 2. Iniciar os Microsserviços Java

Abra 3 terminais (ou execute via IDE):

* **Gestão Service:**
  ```bash
  cd backend/gestao-service
  ./mvnw spring-boot:run
  ```
* **Cardápio Service:**
  ```bash
  cd backend/cardapio-service
  ./mvnw spring-boot:run
  ```
* **Pedidos Service:**
  ```bash
  cd backend/pedidos-service
  ./mvnw spring-boot:run
  ```

### 3. Executar o Frontend
Abra o arquivo `frontend/index.html` ou utilize uma extensão como Live Server no VS Code / servidor HTTP estático.

---

<div align="center">
  <sub>Projeto Desenvolvido para a Disciplina de Microsserviços / Projeto Integrador</sub>
</div>