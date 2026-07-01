-- ============================================================
-- PIZZARIA - VIEWS ÚTEIS
-- V5__create_views.sql
-- Views para consultas frequentes e relatórios
-- ============================================================

USE pizzaria_db;
GO

-- ============================================================
-- VIEW: VW_CARDAPIO
-- Cardápio completo com categoria, produto e todos os tamanhos.
-- Usada pela API para retornar o cardápio público.
-- ============================================================
CREATE VIEW vw_cardapio AS
SELECT
    p.id              AS produto_id,
    p.nome            AS produto_nome,
    p.descricao,
    p.imagem_url,
    p.ativo,
    c.id              AS categoria_id,
    c.nome            AS categoria_nome,
    pt.id             AS tamanho_id,
    pt.tamanho,
    pt.preco
FROM produto p
INNER JOIN categoria c       ON c.id = p.categoria_id
INNER JOIN produto_tamanho pt ON pt.produto_id = p.id
WHERE p.ativo = 1
  AND c.ativo = 1;
GO

-- ============================================================
-- VIEW: VW_PEDIDOS_COMPLETOS
-- Pedidos com dados do cliente e endereço de entrega.
-- Usada pela API para listar pedidos no painel do atendente.
-- ============================================================
CREATE VIEW vw_pedidos_completos AS
SELECT
    p.id              AS pedido_id,
    p.status,
    p.total,
    p.observacao,
    p.criado_em,
    p.atualizado_em,
    c.id              AS cliente_id,
    c.nome            AS cliente_nome,
    c.telefone        AS cliente_telefone,
    e.id              AS entregador_id,
    e.nome            AS entregador_nome,
    end_.logradouro,
    end_.numero,
    end_.complemento,
    end_.bairro,
    end_.cidade,
    end_.uf,
    end_.cep
FROM pedido p
INNER JOIN usuario c         ON c.id   = p.cliente_id
LEFT  JOIN usuario e         ON e.id   = p.entregador_id
INNER JOIN endereco end_     ON end_.id = p.endereco_id;
GO

-- ============================================================
-- VIEW: VW_ITENS_PEDIDO
-- Itens de pedido com nome do produto.
-- Usada para detalhar um pedido específico.
-- ============================================================
CREATE VIEW vw_itens_pedido AS
SELECT
    ip.id,
    ip.pedido_id,
    ip.tamanho,
    ip.quantidade,
    ip.preco_unitario,
    ip.subtotal,
    p1.id    AS produto_id,
    p1.nome  AS produto_nome,
    p2.id    AS sabor2_id,
    p2.nome  AS sabor2_nome
FROM item_pedido ip
INNER JOIN produto p1 ON p1.id = ip.produto_id
LEFT  JOIN produto p2 ON p2.id = ip.sabor2_id;
GO

-- ============================================================
-- VIEW: VW_RELATORIO_VENDAS
-- Base para relatórios de vendas por período.
-- ============================================================
CREATE VIEW vw_relatorio_vendas AS
SELECT
    CAST(p.criado_em AS DATE) AS data_pedido,
    COUNT(p.id)               AS total_pedidos,
    SUM(p.total)              AS faturamento
FROM pedido p
WHERE p.status = 'ENTREGUE'
GROUP BY CAST(p.criado_em AS DATE);
GO

-- ============================================================
-- VIEW: VW_PRODUTOS_MAIS_VENDIDOS
-- Ranking de produtos por quantidade vendida.
-- ============================================================
CREATE VIEW vw_produtos_mais_vendidos AS
SELECT
    pr.id                    AS produto_id,
    pr.nome                  AS produto_nome,
    c.nome                   AS categoria_nome,
    SUM(ip.quantidade)       AS total_vendido,
    SUM(ip.subtotal)         AS total_faturado
FROM item_pedido ip
INNER JOIN pedido  p  ON p.id  = ip.pedido_id
INNER JOIN produto pr ON pr.id = ip.produto_id
INNER JOIN categoria c ON c.id = pr.categoria_id
WHERE p.status = 'ENTREGUE'
GROUP BY pr.id, pr.nome, c.nome;
GO
