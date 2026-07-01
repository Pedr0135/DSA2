-- ============================================================
-- PIZZARIA - ÍNDICES
-- V3__create_indexes.sql
-- Índices para otimização de consultas frequentes
-- ============================================================

USE pizzaria_db;
GO

-- ============================================================
-- ÍNDICES: USUARIO
-- Busca por email é feita em toda autenticação (alta frequência)
-- Busca por perfil é usada para listar entregadores disponíveis
-- ============================================================
CREATE INDEX IX_usuario_email  ON usuario(email);
CREATE INDEX IX_usuario_perfil ON usuario(perfil);
GO

-- ============================================================
-- ÍNDICES: ENDERECO
-- Busca por usuario_id é feita ao listar endereços do cliente
-- ============================================================
CREATE INDEX IX_endereco_usuario_id ON endereco(usuario_id);
GO

-- ============================================================
-- ÍNDICES: PRODUTO
-- Busca por categoria é feita ao filtrar o cardápio
-- Busca por ativo filtra produtos disponíveis no cardápio
-- ============================================================
CREATE INDEX IX_produto_categoria_id ON produto(categoria_id);
CREATE INDEX IX_produto_ativo        ON produto(ativo);
GO

-- ============================================================
-- ÍNDICES: PEDIDO
-- Busca por cliente_id: histórico de pedidos do cliente
-- Busca por entregador_id: pedidos do entregador logado
-- Busca por status: fila de pedidos do atendente (alta frequência)
-- Busca por criado_em: relatórios por período
-- Índice composto status + criado_em: consulta mais comum do dashboard
-- ============================================================
CREATE INDEX IX_pedido_cliente_id    ON pedido(cliente_id);
CREATE INDEX IX_pedido_entregador_id ON pedido(entregador_id);
CREATE INDEX IX_pedido_status        ON pedido(status);
CREATE INDEX IX_pedido_criado_em     ON pedido(criado_em);
CREATE INDEX IX_pedido_status_data   ON pedido(status, criado_em);
GO

-- ============================================================
-- ÍNDICES: ITEM_PEDIDO
-- Busca por pedido_id: detalhar itens de um pedido
-- Busca por produto_id: relatório de produtos mais vendidos
-- ============================================================
CREATE INDEX IX_item_pedido_pedido_id  ON item_pedido(pedido_id);
CREATE INDEX IX_item_pedido_produto_id ON item_pedido(produto_id);
GO
