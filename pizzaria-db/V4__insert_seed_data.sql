-- ============================================================
-- PIZZARIA - DADOS INICIAIS
-- V4__insert_seed_data.sql
-- Dados essenciais para o sistema funcionar
-- ============================================================

USE pizzaria_db;
GO

-- ============================================================
-- USUARIO ADMIN
-- Senha: admin123 (hash BCrypt gerado com strength 10)
-- Este usuário é criado para acesso inicial ao sistema.
-- A senha DEVE ser alterada após o primeiro acesso.
-- ============================================================
INSERT INTO usuario (nome, email, senha, telefone, perfil, ativo)
VALUES (
    'Administrador',
    'admin@pizzaria.com',
    '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.',
    '(11) 99999-0000',
    'ADMIN',
    1
);
GO

-- ============================================================
-- USUARIO ATENDENTE DE TESTE
-- Senha: atendente123
-- ============================================================
INSERT INTO usuario (nome, email, senha, telefone, perfil, ativo)
VALUES (
    'Atendente Teste',
    'atendente@pizzaria.com',
    '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.',
    '(11) 99999-0001',
    'ATENDENTE',
    1
);
GO

-- ============================================================
-- USUARIO ENTREGADOR DE TESTE
-- Senha: entregador123
-- ============================================================
INSERT INTO usuario (nome, email, senha, telefone, perfil, ativo)
VALUES (
    'Entregador Teste',
    'entregador@pizzaria.com',
    '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.',
    '(11) 99999-0002',
    'ENTREGADOR',
    1
);
GO

-- ============================================================
-- USUARIO CLIENTE DE TESTE
-- Senha: cliente123
-- ============================================================
INSERT INTO usuario (nome, email, senha, telefone, perfil, ativo)
VALUES (
    'Cliente Teste',
    'cliente@pizzaria.com',
    '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.',
    '(11) 99999-0003',
    'CLIENTE',
    1
);
GO

-- ============================================================
-- ENDERECO DO CLIENTE DE TESTE
-- ============================================================
INSERT INTO endereco (usuario_id, logradouro, numero, complemento, bairro, cidade, uf, cep, principal)
VALUES (
    4,
    'Rua das Pizzas',
    '123',
    'Apto 45',
    'Centro',
    'São Paulo',
    'SP',
    '01310-100',
    1
);
GO

-- ============================================================
-- CATEGORIAS
-- ============================================================
INSERT INTO categoria (nome, ativo) VALUES ('Pizzas Salgadas', 1);
INSERT INTO categoria (nome, ativo) VALUES ('Pizzas Doces',    1);
INSERT INTO categoria (nome, ativo) VALUES ('Bebidas',         1);
INSERT INTO categoria (nome, ativo) VALUES ('Sobremesas',      1);
GO

-- ============================================================
-- PRODUTOS — PIZZAS SALGADAS (categoria_id = 1)
-- ============================================================
INSERT INTO produto (categoria_id, nome, descricao, ativo)
VALUES (1, 'Margherita',
    'Molho de tomate, mussarela, tomate fresco e manjericão', 1);

INSERT INTO produto (categoria_id, nome, descricao, ativo)
VALUES (1, 'Calabresa',
    'Molho de tomate, mussarela e calabresa fatiada com cebola', 1);

INSERT INTO produto (categoria_id, nome, descricao, ativo)
VALUES (1, 'Frango com Catupiry',
    'Molho de tomate, mussarela, frango desfiado e catupiry', 1);

INSERT INTO produto (categoria_id, nome, descricao, ativo)
VALUES (1, 'Portuguesa',
    'Molho de tomate, mussarela, presunto, ovos, cebola e azeitona', 1);

INSERT INTO produto (categoria_id, nome, descricao, ativo)
VALUES (1, 'Quatro Queijos',
    'Molho de tomate, mussarela, provolone, parmesão e gorgonzola', 1);
GO

-- ============================================================
-- PRODUTOS — PIZZAS DOCES (categoria_id = 2)
-- ============================================================
INSERT INTO produto (categoria_id, nome, descricao, ativo)
VALUES (2, 'Chocolate',
    'Chocolate ao leite, granulado e leite condensado', 1);

INSERT INTO produto (categoria_id, nome, descricao, ativo)
VALUES (2, 'Romeu e Julieta',
    'Mussarela e goiabada cremosa', 1);
GO

-- ============================================================
-- PRODUTOS — BEBIDAS (categoria_id = 3)
-- ============================================================
INSERT INTO produto (categoria_id, nome, descricao, ativo)
VALUES (3, 'Coca-Cola', 'Refrigerante gelado', 1);

INSERT INTO produto (categoria_id, nome, descricao, ativo)
VALUES (3, 'Suco de Laranja', 'Suco natural de laranja', 1);

INSERT INTO produto (categoria_id, nome, descricao, ativo)
VALUES (3, 'Água Mineral', 'Água mineral sem gás 500ml', 1);
GO

-- ============================================================
-- TAMANHOS E PREÇOS — PIZZAS SALGADAS (produtos 1 a 5)
-- ============================================================
-- Margherita
INSERT INTO produto_tamanho (produto_id, tamanho, preco) VALUES (1, 'PEQUENA', 29.90);
INSERT INTO produto_tamanho (produto_id, tamanho, preco) VALUES (1, 'MEDIA',   39.90);
INSERT INTO produto_tamanho (produto_id, tamanho, preco) VALUES (1, 'GRANDE',  49.90);
INSERT INTO produto_tamanho (produto_id, tamanho, preco) VALUES (1, 'FAMILIA', 59.90);

-- Calabresa
INSERT INTO produto_tamanho (produto_id, tamanho, preco) VALUES (2, 'PEQUENA', 31.90);
INSERT INTO produto_tamanho (produto_id, tamanho, preco) VALUES (2, 'MEDIA',   41.90);
INSERT INTO produto_tamanho (produto_id, tamanho, preco) VALUES (2, 'GRANDE',  51.90);
INSERT INTO produto_tamanho (produto_id, tamanho, preco) VALUES (2, 'FAMILIA', 61.90);

-- Frango com Catupiry
INSERT INTO produto_tamanho (produto_id, tamanho, preco) VALUES (3, 'PEQUENA', 33.90);
INSERT INTO produto_tamanho (produto_id, tamanho, preco) VALUES (3, 'MEDIA',   43.90);
INSERT INTO produto_tamanho (produto_id, tamanho, preco) VALUES (3, 'GRANDE',  53.90);
INSERT INTO produto_tamanho (produto_id, tamanho, preco) VALUES (3, 'FAMILIA', 63.90);

-- Portuguesa
INSERT INTO produto_tamanho (produto_id, tamanho, preco) VALUES (4, 'PEQUENA', 34.90);
INSERT INTO produto_tamanho (produto_id, tamanho, preco) VALUES (4, 'MEDIA',   44.90);
INSERT INTO produto_tamanho (produto_id, tamanho, preco) VALUES (4, 'GRANDE',  54.90);
INSERT INTO produto_tamanho (produto_id, tamanho, preco) VALUES (4, 'FAMILIA', 64.90);

-- Quatro Queijos
INSERT INTO produto_tamanho (produto_id, tamanho, preco) VALUES (5, 'PEQUENA', 35.90);
INSERT INTO produto_tamanho (produto_id, tamanho, preco) VALUES (5, 'MEDIA',   45.90);
INSERT INTO produto_tamanho (produto_id, tamanho, preco) VALUES (5, 'GRANDE',  55.90);
INSERT INTO produto_tamanho (produto_id, tamanho, preco) VALUES (5, 'FAMILIA', 65.90);
GO

-- ============================================================
-- TAMANHOS E PREÇOS — PIZZAS DOCES (produtos 6 e 7)
-- ============================================================
-- Chocolate
INSERT INTO produto_tamanho (produto_id, tamanho, preco) VALUES (6, 'MEDIA',   37.90);
INSERT INTO produto_tamanho (produto_id, tamanho, preco) VALUES (6, 'GRANDE',  47.90);
INSERT INTO produto_tamanho (produto_id, tamanho, preco) VALUES (6, 'FAMILIA', 57.90);

-- Romeu e Julieta
INSERT INTO produto_tamanho (produto_id, tamanho, preco) VALUES (7, 'MEDIA',   35.90);
INSERT INTO produto_tamanho (produto_id, tamanho, preco) VALUES (7, 'GRANDE',  45.90);
INSERT INTO produto_tamanho (produto_id, tamanho, preco) VALUES (7, 'FAMILIA', 55.90);
GO

-- ============================================================
-- TAMANHOS E PREÇOS — BEBIDAS (produtos 8, 9 e 10)
-- Bebidas usam tamanho PEQUENA como padrão unitário
-- ============================================================
INSERT INTO produto_tamanho (produto_id, tamanho, preco) VALUES (8,  'PEQUENA', 6.00);
INSERT INTO produto_tamanho (produto_id, tamanho, preco) VALUES (9,  'PEQUENA', 8.00);
INSERT INTO produto_tamanho (produto_id, tamanho, preco) VALUES (10, 'PEQUENA', 4.00);
GO
