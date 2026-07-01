-- ============================================================
-- PIZZARIA - MODELO FÍSICO
-- V2__create_tables.sql
-- Criação de todas as tabelas com constraints e índices
-- ============================================================

USE pizzaria_db;
GO

-- ============================================================
-- TABELA: USUARIO
-- Armazena todos os usuários do sistema independente do perfil.
-- Perfis: ADMIN, ATENDENTE, ENTREGADOR, CLIENTE
-- Decisão: tabela única com discriminador de perfil (Single Table)
-- evita JOINs desnecessários para autenticação.
-- ============================================================
CREATE TABLE usuario (
    id         BIGINT        IDENTITY(1,1)  NOT NULL,
    nome       VARCHAR(100)                 NOT NULL,
    email      VARCHAR(150)                 NOT NULL,
    senha      VARCHAR(255)                 NOT NULL,  -- BCrypt hash
    telefone   VARCHAR(20)                  NULL,
    perfil     VARCHAR(20)                  NOT NULL,  -- ADMIN | ATENDENTE | ENTREGADOR | CLIENTE
    ativo      BIT                          NOT NULL   DEFAULT 1,
    criado_em  DATETIME2                    NOT NULL   DEFAULT SYSDATETIME(),

    CONSTRAINT PK_usuario         PRIMARY KEY (id),
    CONSTRAINT UQ_usuario_email   UNIQUE      (email),
    CONSTRAINT CK_usuario_perfil  CHECK       (perfil IN ('ADMIN', 'ATENDENTE', 'ENTREGADOR', 'CLIENTE'))
);
GO

-- ============================================================
-- TABELA: ENDERECO
-- Cada cliente pode ter múltiplos endereços.
-- Campo "principal" indica o endereço padrão de entrega.
-- Decisão: endereço separado do usuário (2FN) e do pedido,
-- garantindo histórico mesmo se o endereço for alterado.
-- ============================================================
CREATE TABLE endereco (
    id           BIGINT        IDENTITY(1,1)  NOT NULL,
    usuario_id   BIGINT                       NOT NULL,
    logradouro   VARCHAR(200)                 NOT NULL,
    numero       VARCHAR(10)                  NOT NULL,
    complemento  VARCHAR(100)                 NULL,
    bairro       VARCHAR(100)                 NOT NULL,
    cidade       VARCHAR(100)                 NOT NULL,
    uf           CHAR(2)                      NOT NULL,
    cep          VARCHAR(10)                  NOT NULL,
    principal    BIT                          NOT NULL  DEFAULT 0,

    CONSTRAINT PK_endereco       PRIMARY KEY (id),
    CONSTRAINT FK_endereco_usuario FOREIGN KEY (usuario_id)
        REFERENCES usuario(id)
        ON DELETE CASCADE,
    CONSTRAINT CK_endereco_uf    CHECK (LEN(LTRIM(RTRIM(uf))) = 2)
);
GO

-- ============================================================
-- TABELA: CATEGORIA
-- Agrupa os produtos do cardápio.
-- Ex: Pizzas Salgadas, Pizzas Doces, Bebidas, Sobremesas
-- ============================================================
CREATE TABLE categoria (
    id    BIGINT        IDENTITY(1,1)  NOT NULL,
    nome  VARCHAR(80)                  NOT NULL,
    ativo BIT                          NOT NULL  DEFAULT 1,

    CONSTRAINT PK_categoria      PRIMARY KEY (id),
    CONSTRAINT UQ_categoria_nome UNIQUE      (nome)
);
GO

-- ============================================================
-- TABELA: PRODUTO
-- Representa um item do cardápio (pizza, bebida, sobremesa).
-- Não armazena preço aqui — preço fica em PRODUTO_TAMANHO.
-- Decisão: separar preço por tamanho evita colunas nulas
-- e respeita a 1FN (sem grupos repetitivos).
-- ============================================================
CREATE TABLE produto (
    id           BIGINT        IDENTITY(1,1)  NOT NULL,
    categoria_id BIGINT                       NOT NULL,
    nome         VARCHAR(100)                 NOT NULL,
    descricao    VARCHAR(500)                 NULL,
    imagem_url   VARCHAR(500)                 NULL,
    ativo        BIT                          NOT NULL  DEFAULT 1,

    CONSTRAINT PK_produto          PRIMARY KEY (id),
    CONSTRAINT FK_produto_categoria FOREIGN KEY (categoria_id)
        REFERENCES categoria(id)
);
GO

-- ============================================================
-- TABELA: PRODUTO_TAMANHO
-- Cada produto pode ter múltiplos tamanhos com preços distintos.
-- Tamanhos: PEQUENA, MEDIA, GRANDE, FAMILIA
-- Decisão: tabela separada respeita 1FN e permite
-- adicionar novos tamanhos sem alterar a estrutura.
-- ============================================================
CREATE TABLE produto_tamanho (
    id         BIGINT         IDENTITY(1,1)  NOT NULL,
    produto_id BIGINT                        NOT NULL,
    tamanho    VARCHAR(10)                   NOT NULL,  -- PEQUENA | MEDIA | GRANDE | FAMILIA
    preco      DECIMAL(10,2)                 NOT NULL,

    CONSTRAINT PK_produto_tamanho         PRIMARY KEY (id),
    CONSTRAINT FK_produto_tamanho_produto  FOREIGN KEY (produto_id)
        REFERENCES produto(id)
        ON DELETE CASCADE,
    CONSTRAINT UQ_produto_tamanho         UNIQUE (produto_id, tamanho),
    CONSTRAINT CK_produto_tamanho_tamanho CHECK  (tamanho IN ('PEQUENA', 'MEDIA', 'GRANDE', 'FAMILIA')),
    CONSTRAINT CK_produto_tamanho_preco   CHECK  (preco > 0)
);
GO

-- ============================================================
-- TABELA: PEDIDO
-- Representa um pedido realizado por um cliente.
-- entregador_id é nullable — preenchido ao atribuir entregador.
-- total é calculado pela aplicação e armazenado para histórico.
-- Decisão: armazenar total evita recalcular com preços atuais
-- que podem ter mudado após o pedido.
-- ============================================================
CREATE TABLE pedido (
    id             BIGINT         IDENTITY(1,1)  NOT NULL,
    cliente_id     BIGINT                        NOT NULL,
    entregador_id  BIGINT                        NULL,
    endereco_id    BIGINT                        NOT NULL,
    status         VARCHAR(15)                   NOT NULL  DEFAULT 'RECEBIDO',
    total          DECIMAL(10,2)                 NOT NULL,
    observacao     VARCHAR(500)                  NULL,
    criado_em      DATETIME2                     NOT NULL  DEFAULT SYSDATETIME(),
    atualizado_em  DATETIME2                     NOT NULL  DEFAULT SYSDATETIME(),

    CONSTRAINT PK_pedido              PRIMARY KEY (id),
    CONSTRAINT FK_pedido_cliente      FOREIGN KEY (cliente_id)
        REFERENCES usuario(id),
    CONSTRAINT FK_pedido_entregador   FOREIGN KEY (entregador_id)
        REFERENCES usuario(id),
    CONSTRAINT FK_pedido_endereco     FOREIGN KEY (endereco_id)
        REFERENCES endereco(id),
    CONSTRAINT CK_pedido_status       CHECK (status IN (
        'RECEBIDO', 'EM_PREPARO', 'SAIU_ENTREGA', 'ENTREGUE', 'CANCELADO'
    )),
    CONSTRAINT CK_pedido_total        CHECK (total > 0)
);
GO

-- ============================================================
-- TABELA: ITEM_PEDIDO
-- Cada linha representa um produto dentro de um pedido.
-- sabor2_id é nullable — usado apenas para meio a meio.
-- preco_unitario armazena o preço no momento do pedido.
-- Decisão: armazenar preco_unitario garante integridade
-- histórica mesmo se o preço do produto mudar no futuro.
-- ============================================================
CREATE TABLE item_pedido (
    id              BIGINT         IDENTITY(1,1)  NOT NULL,
    pedido_id       BIGINT                        NOT NULL,
    produto_id      BIGINT                        NOT NULL,
    sabor2_id       BIGINT                        NULL,      -- meio a meio
    tamanho         VARCHAR(10)                   NOT NULL,
    quantidade      INT                           NOT NULL,
    preco_unitario  DECIMAL(10,2)                 NOT NULL,
    subtotal        DECIMAL(10,2)                 NOT NULL,

    CONSTRAINT PK_item_pedido           PRIMARY KEY (id),
    CONSTRAINT FK_item_pedido_pedido    FOREIGN KEY (pedido_id)
        REFERENCES pedido(id)
        ON DELETE CASCADE,
    CONSTRAINT FK_item_pedido_produto   FOREIGN KEY (produto_id)
        REFERENCES produto(id),
    CONSTRAINT FK_item_pedido_sabor2    FOREIGN KEY (sabor2_id)
        REFERENCES produto(id),
    CONSTRAINT CK_item_pedido_tamanho   CHECK (tamanho IN ('PEQUENA', 'MEDIA', 'GRANDE', 'FAMILIA')),
    CONSTRAINT CK_item_pedido_qtd       CHECK (quantidade > 0),
    CONSTRAINT CK_item_pedido_preco     CHECK (preco_unitario > 0),
    CONSTRAINT CK_item_pedido_subtotal  CHECK (subtotal > 0),
    CONSTRAINT CK_item_sabor2_diferente CHECK (sabor2_id IS NULL OR sabor2_id <> produto_id)
);
GO
