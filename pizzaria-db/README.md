# Pizzaria DB — Documentação do Banco de Dados

## Arquivos

| Arquivo | Descrição |
|---------|-----------|
| `V1__create_database.sql` | Criação do banco de dados |
| `V2__create_tables.sql` | Criação de todas as tabelas com constraints |
| `V3__create_indexes.sql` | Índices para otimização de consultas |
| `V4__insert_seed_data.sql` | Dados iniciais para desenvolvimento |
| `V5__create_views.sql` | Views para consultas frequentes |
| `full_schema.sql` | Script completo em um único arquivo |

## Como executar

### Opção 1 — Script único (desenvolvimento)
```sql
-- Execute no SQL Server Management Studio (SSMS)
-- ou via sqlcmd:
sqlcmd -S localhost -E -i full_schema.sql
```

### Opção 2 — Via Flyway (recomendado para produção)
Os arquivos V1__ a V5__ são executados automaticamente
pelo Flyway ao iniciar a aplicação Spring Boot.

## Usuários de teste

| Perfil | E-mail | Senha |
|--------|--------|-------|
| Admin | admin@pizzaria.com | admin123 |
| Atendente | atendente@pizzaria.com | atendente123 |
| Entregador | entregador@pizzaria.com | entregador123 |
| Cliente | cliente@pizzaria.com | cliente123 |

> ⚠️ Altere as senhas antes de ir para produção.

## Diagrama de Relacionamentos

```
usuario (1) ──────────── (N) endereco
usuario (1) ──────────── (N) pedido [como cliente]
usuario (1) ──────────── (N) pedido [como entregador]
endereco (1) ─────────── (N) pedido
pedido (1) ───────────── (N) item_pedido
produto (1) ──────────── (N) item_pedido [sabor principal]
produto (1) ──────────── (N) item_pedido [sabor2 - meio a meio]
produto (1) ──────────── (N) produto_tamanho
categoria (1) ────────── (N) produto
```

## Normalização

- **1FN**: Todos os atributos são atômicos. Tamanhos/preços em tabela separada.
- **2FN**: Sem dependências parciais. Cada coluna depende da PK completa.
- **3FN**: Sem dependências transitivas. Dados de categoria não estão em produto.
