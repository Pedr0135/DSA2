-- ============================================================
-- PIZZARIA - SCRIPT COMPLETO (EXECUÇÃO ÚNICA)
-- full_schema.sql
-- Use este arquivo para criar tudo do zero em um único passo.
-- Em produção, use os arquivos V1__ a V5__ via Flyway.
-- ============================================================

USE master;
GO

IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = 'pizzaria_db')
BEGIN
    CREATE DATABASE pizzaria_db COLLATE Latin1_General_CI_AI;
END
GO

USE pizzaria_db;
GO

-- ============================================================
-- DROP (ordem inversa das dependências)
-- ============================================================
IF OBJECT_ID('vw_produtos_mais_vendidos', 'V') IS NOT NULL DROP VIEW vw_produtos_mais_vendidos;
IF OBJECT_ID('vw_relatorio_vendas',       'V') IS NOT NULL DROP VIEW vw_relatorio_vendas;
IF OBJECT_ID('vw_itens_pedido',           'V') IS NOT NULL DROP VIEW vw_itens_pedido;
IF OBJECT_ID('vw_pedidos_completos',      'V') IS NOT NULL DROP VIEW vw_pedidos_completos;
IF OBJECT_ID('vw_cardapio',               'V') IS NOT NULL DROP VIEW vw_cardapio;
IF OBJECT_ID('item_pedido',               'U') IS NOT NULL DROP TABLE item_pedido;
IF OBJECT_ID('pedido',                    'U') IS NOT NULL DROP TABLE pedido;
IF OBJECT_ID('produto_tamanho',           'U') IS NOT NULL DROP TABLE produto_tamanho;
IF OBJECT_ID('produto',                   'U') IS NOT NULL DROP TABLE produto;
IF OBJECT_ID('categoria',                 'U') IS NOT NULL DROP TABLE categoria;
IF OBJECT_ID('endereco',                  'U') IS NOT NULL DROP TABLE endereco;
IF OBJECT_ID('usuario',                   'U') IS NOT NULL DROP TABLE usuario;
GO

-- ============================================================
-- TABELAS
-- ============================================================
CREATE TABLE usuario (
    id         BIGINT        IDENTITY(1,1)  NOT NULL,
    nome       VARCHAR(100)                 NOT NULL,
    email      VARCHAR(150)                 NOT NULL,
    senha      VARCHAR(255)                 NOT NULL,
    telefone   VARCHAR(20)                  NULL,
    perfil     VARCHAR(20)                  NOT NULL,
    ativo      BIT                          NOT NULL  DEFAULT 1,
    criado_em  DATETIME2                    NOT NULL  DEFAULT SYSDATETIME(),
    CONSTRAINT PK_usuario         PRIMARY KEY (id),
    CONSTRAINT UQ_usuario_email   UNIQUE      (email),
    CONSTRAINT CK_usuario_perfil  CHECK       (perfil IN ('ADMIN','ATENDENTE','ENTREGADOR','CLIENTE'))
);

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
    CONSTRAINT PK_endereco          PRIMARY KEY (id),
    CONSTRAINT FK_endereco_usuario  FOREIGN KEY (usuario_id) REFERENCES usuario(id) ON DELETE CASCADE,
    CONSTRAINT CK_endereco_uf       CHECK (LEN(LTRIM(RTRIM(uf))) = 2)
);

CREATE TABLE categoria (
    id    BIGINT        IDENTITY(1,1)  NOT NULL,
    nome  VARCHAR(80)                  NOT NULL,
    ativo BIT                          NOT NULL  DEFAULT 1,
    CONSTRAINT PK_categoria      PRIMARY KEY (id),
    CONSTRAINT UQ_categoria_nome UNIQUE      (nome)
);

CREATE TABLE produto (
    id           BIGINT        IDENTITY(1,1)  NOT NULL,
    categoria_id BIGINT                       NOT NULL,
    nome         VARCHAR(100)                 NOT NULL,
    descricao    VARCHAR(500)                 NULL,
    imagem_url   VARCHAR(500)                 NULL,
    ativo        BIT                          NOT NULL  DEFAULT 1,
    CONSTRAINT PK_produto           PRIMARY KEY (id),
    CONSTRAINT FK_produto_categoria FOREIGN KEY (categoria_id) REFERENCES categoria(id)
);

CREATE TABLE produto_tamanho (
    id         BIGINT         IDENTITY(1,1)  NOT NULL,
    produto_id BIGINT                        NOT NULL,
    tamanho    VARCHAR(10)                   NOT NULL,
    preco      DECIMAL(10,2)                 NOT NULL,
    CONSTRAINT PK_produto_tamanho         PRIMARY KEY (id),
    CONSTRAINT FK_produto_tamanho_produto  FOREIGN KEY (produto_id) REFERENCES produto(id) ON DELETE CASCADE,
    CONSTRAINT UQ_produto_tamanho         UNIQUE (produto_id, tamanho),
    CONSTRAINT CK_produto_tamanho_tamanho CHECK  (tamanho IN ('PEQUENA','MEDIA','GRANDE','FAMILIA')),
    CONSTRAINT CK_produto_tamanho_preco   CHECK  (preco > 0)
);

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
    CONSTRAINT PK_pedido            PRIMARY KEY (id),
    CONSTRAINT FK_pedido_cliente    FOREIGN KEY (cliente_id)    REFERENCES usuario(id),
    CONSTRAINT FK_pedido_entregador FOREIGN KEY (entregador_id) REFERENCES usuario(id),
    CONSTRAINT FK_pedido_endereco   FOREIGN KEY (endereco_id)   REFERENCES endereco(id),
    CONSTRAINT CK_pedido_status     CHECK (status IN ('RECEBIDO','EM_PREPARO','SAIU_ENTREGA','ENTREGUE','CANCELADO')),
    CONSTRAINT CK_pedido_total      CHECK (total > 0)
);

CREATE TABLE item_pedido (
    id              BIGINT         IDENTITY(1,1)  NOT NULL,
    pedido_id       BIGINT                        NOT NULL,
    produto_id      BIGINT                        NOT NULL,
    sabor2_id       BIGINT                        NULL,
    tamanho         VARCHAR(10)                   NOT NULL,
    quantidade      INT                           NOT NULL,
    preco_unitario  DECIMAL(10,2)                 NOT NULL,
    subtotal        DECIMAL(10,2)                 NOT NULL,
    CONSTRAINT PK_item_pedido           PRIMARY KEY (id),
    CONSTRAINT FK_item_pedido_pedido    FOREIGN KEY (pedido_id)  REFERENCES pedido(id)  ON DELETE CASCADE,
    CONSTRAINT FK_item_pedido_produto   FOREIGN KEY (produto_id) REFERENCES produto(id),
    CONSTRAINT FK_item_pedido_sabor2    FOREIGN KEY (sabor2_id)  REFERENCES produto(id),
    CONSTRAINT CK_item_pedido_tamanho   CHECK (tamanho IN ('PEQUENA','MEDIA','GRANDE','FAMILIA')),
    CONSTRAINT CK_item_pedido_qtd       CHECK (quantidade > 0),
    CONSTRAINT CK_item_pedido_preco     CHECK (preco_unitario > 0),
    CONSTRAINT CK_item_pedido_subtotal  CHECK (subtotal > 0),
    CONSTRAINT CK_item_sabor2_diferente CHECK (sabor2_id IS NULL OR sabor2_id <> produto_id)
);
GO

-- ============================================================
-- ÍNDICES
-- ============================================================
CREATE INDEX IX_usuario_email         ON usuario(email);
CREATE INDEX IX_usuario_perfil        ON usuario(perfil);
CREATE INDEX IX_endereco_usuario_id   ON endereco(usuario_id);
CREATE INDEX IX_produto_categoria_id  ON produto(categoria_id);
CREATE INDEX IX_produto_ativo         ON produto(ativo);
CREATE INDEX IX_pedido_cliente_id     ON pedido(cliente_id);
CREATE INDEX IX_pedido_entregador_id  ON pedido(entregador_id);
CREATE INDEX IX_pedido_status         ON pedido(status);
CREATE INDEX IX_pedido_criado_em      ON pedido(criado_em);
CREATE INDEX IX_pedido_status_data    ON pedido(status, criado_em);
CREATE INDEX IX_item_pedido_pedido_id ON item_pedido(pedido_id);
CREATE INDEX IX_item_pedido_produto_id ON item_pedido(produto_id);
GO

-- ============================================================
-- VIEWS
-- ============================================================
CREATE VIEW vw_cardapio AS
SELECT p.id AS produto_id, p.nome AS produto_nome, p.descricao, p.imagem_url, p.ativo,
       c.id AS categoria_id, c.nome AS categoria_nome,
       pt.id AS tamanho_id, pt.tamanho, pt.preco
FROM produto p
INNER JOIN categoria c        ON c.id  = p.categoria_id
INNER JOIN produto_tamanho pt ON pt.produto_id = p.id
WHERE p.ativo = 1 AND c.ativo = 1;
GO

CREATE VIEW vw_pedidos_completos AS
SELECT p.id AS pedido_id, p.status, p.total, p.observacao, p.criado_em, p.atualizado_em,
       c.id AS cliente_id, c.nome AS cliente_nome, c.telefone AS cliente_telefone,
       e.id AS entregador_id, e.nome AS entregador_nome,
       end_.logradouro, end_.numero, end_.complemento, end_.bairro, end_.cidade, end_.uf, end_.cep
FROM pedido p
INNER JOIN usuario c     ON c.id    = p.cliente_id
LEFT  JOIN usuario e     ON e.id    = p.entregador_id
INNER JOIN endereco end_ ON end_.id = p.endereco_id;
GO

CREATE VIEW vw_itens_pedido AS
SELECT ip.id, ip.pedido_id, ip.tamanho, ip.quantidade, ip.preco_unitario, ip.subtotal,
       p1.id AS produto_id, p1.nome AS produto_nome,
       p2.id AS sabor2_id,  p2.nome AS sabor2_nome
FROM item_pedido ip
INNER JOIN produto p1 ON p1.id = ip.produto_id
LEFT  JOIN produto p2 ON p2.id = ip.sabor2_id;
GO

CREATE VIEW vw_relatorio_vendas AS
SELECT CAST(p.criado_em AS DATE) AS data_pedido,
       COUNT(p.id)               AS total_pedidos,
       SUM(p.total)              AS faturamento
FROM pedido p
WHERE p.status = 'ENTREGUE'
GROUP BY CAST(p.criado_em AS DATE);
GO

CREATE VIEW vw_produtos_mais_vendidos AS
SELECT pr.id AS produto_id, pr.nome AS produto_nome, c.nome AS categoria_nome,
       SUM(ip.quantidade) AS total_vendido,
       SUM(ip.subtotal)   AS total_faturado
FROM item_pedido ip
INNER JOIN pedido    p  ON p.id  = ip.pedido_id
INNER JOIN produto   pr ON pr.id = ip.produto_id
INNER JOIN categoria c  ON c.id  = pr.categoria_id
WHERE p.status = 'ENTREGUE'
GROUP BY pr.id, pr.nome, c.nome;
GO

-- ============================================================
-- DADOS INICIAIS
-- ============================================================
INSERT INTO usuario (nome, email, senha, telefone, perfil) VALUES
('Administrador',   'admin@pizzaria.com',      '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', '(11) 99999-0000', 'ADMIN'),
('Atendente Teste', 'atendente@pizzaria.com',  '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', '(11) 99999-0001', 'ATENDENTE'),
('Entregador Teste','entregador@pizzaria.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', '(11) 99999-0002', 'ENTREGADOR'),
('Cliente Teste',   'cliente@pizzaria.com',    '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', '(11) 99999-0003', 'CLIENTE');

INSERT INTO endereco (usuario_id, logradouro, numero, complemento, bairro, cidade, uf, cep, principal)
VALUES (4, 'Rua das Pizzas', '123', 'Apto 45', 'Centro', 'São Paulo', 'SP', '01310-100', 1);

INSERT INTO categoria (nome) VALUES ('Pizzas Salgadas'), ('Pizzas Doces'), ('Bebidas'), ('Sobremesas');

INSERT INTO produto (categoria_id, nome, descricao) VALUES
(1, 'Margherita',          'Molho de tomate, mussarela, tomate fresco e manjericão'),
(1, 'Calabresa',           'Molho de tomate, mussarela e calabresa fatiada com cebola'),
(1, 'Frango com Catupiry', 'Molho de tomate, mussarela, frango desfiado e catupiry'),
(1, 'Portuguesa',          'Molho de tomate, mussarela, presunto, ovos, cebola e azeitona'),
(1, 'Quatro Queijos',      'Molho de tomate, mussarela, provolone, parmesão e gorgonzola'),
(2, 'Chocolate',           'Chocolate ao leite, granulado e leite condensado'),
(2, 'Romeu e Julieta',     'Mussarela e goiabada cremosa'),
(3, 'Coca-Cola',           'Refrigerante gelado'),
(3, 'Suco de Laranja',     'Suco natural de laranja'),
(3, 'Água Mineral',        'Água mineral sem gás 500ml');

INSERT INTO produto_tamanho (produto_id, tamanho, preco) VALUES
(1,'PEQUENA',29.90),(1,'MEDIA',39.90),(1,'GRANDE',49.90),(1,'FAMILIA',59.90),
(2,'PEQUENA',31.90),(2,'MEDIA',41.90),(2,'GRANDE',51.90),(2,'FAMILIA',61.90),
(3,'PEQUENA',33.90),(3,'MEDIA',43.90),(3,'GRANDE',53.90),(3,'FAMILIA',63.90),
(4,'PEQUENA',34.90),(4,'MEDIA',44.90),(4,'GRANDE',54.90),(4,'FAMILIA',64.90),
(5,'PEQUENA',35.90),(5,'MEDIA',45.90),(5,'GRANDE',55.90),(5,'FAMILIA',65.90),
(6,'MEDIA',37.90),(6,'GRANDE',47.90),(6,'FAMILIA',57.90),
(7,'MEDIA',35.90),(7,'GRANDE',45.90),(7,'FAMILIA',55.90),
(8,'PEQUENA',6.00),(9,'PEQUENA',8.00),(10,'PEQUENA',4.00);
GO

PRINT 'Banco pizzaria_db criado e populado com sucesso!';
GO
