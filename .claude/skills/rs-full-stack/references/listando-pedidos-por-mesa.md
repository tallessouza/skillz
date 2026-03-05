---
name: rs-full-stack-listando-pedidos-por-mesa
description: "Enforces patterns for querying related database tables with joins and column disambiguation in Node.js APIs. Use when user asks to 'list orders', 'query with joins', 'select from multiple tables', 'connect tables', or 'avoid ambiguous columns'. Applies rules: always prefix columns with table name in joins, use join before where, return order-time price not current price. Make sure to use this skill whenever writing SELECT queries that involve multiple tables. Not for single-table queries, migrations, or schema design."
---

# Listando Pedidos com Joins e Desambiguação de Colunas

> Ao consultar múltiplas tabelas, sempre qualifique colunas com o nome da tabela e traga dados do momento do registro, não o valor atual.

## Rules

1. **Qualifique toda coluna com nome da tabela** — `orders.id` não `id`, porque tabelas conectadas podem ter colunas com mesmo nome e o banco retorna erro de ambiguidade
2. **Use nomes específicos nos parâmetros de rota** — `table_session_id` não `id`, porque parâmetros genéricos confundem quando a rota cresce
3. **Join antes do where** — coloque `.join()` antes de `.where()` na query, porque o filtro precisa da tabela já conectada
4. **Traga o preço do pedido, não do produto** — `orders.price` não `products.price`, porque o preço do produto pode ter sido atualizado depois do pedido
5. **Retorno vazio é válido** — se a sessão não existe, retornar array vazio é suficiente; não precisa validar existência antes da consulta

## How to write

### Query com join e desambiguação

```typescript
const order = await knex("orders")
  .select(
    "orders.id",
    "orders.table_session_id",
    "orders.product_id",
    "orders.price",
    "orders.quantity",
    "products.name"
  )
  .join("products", "products.id", "orders.product_id")
  .where("orders.table_session_id", table_session_id)
```

### Parâmetro de rota específico

```typescript
// Nomeie o parâmetro pela entidade real
app.get("/orders/:table_session_id", async (request, reply) => {
  const { table_session_id } = request.params
  // ...
})
```

## Example

**Before (ambíguo e com preço errado):**
```typescript
const order = await knex("orders")
  .select("id", "price", "quantity")
  .join("products", "products.id", "orders.product_id")
  .where("id", id)
// "id" é ambíguo — qual tabela?
// "price" pode vir de products em vez de orders
```

**After (com this skill applied):**
```typescript
const order = await knex("orders")
  .select(
    "orders.id",
    "orders.table_session_id",
    "orders.product_id",
    "orders.price",      // preço do momento do pedido
    "orders.quantity",
    "products.name"
  )
  .join("products", "products.id", "orders.product_id")
  .where("orders.table_session_id", table_session_id)
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Query toca só 1 tabela | Não precisa qualificar colunas |
| Query com join | Qualifique TODAS as colunas com `tabela.coluna` |
| Preço/valor monetário em pedido | Sempre use o valor da tabela de pedidos |
| Parâmetro de rota genérico `id` | Renomeie para o identificador real (`table_session_id`) |
| Sessão/entidade não encontrada | Retornar vazio é aceitável, sem necessidade de validação extra |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `.select("id", "price")` em join | `.select("orders.id", "orders.price")` |
| `request.params.id` (genérico) | `request.params.table_session_id` |
| `products.price` no pedido | `orders.price` (preço registrado no pedido) |
| `.where(...)` antes de `.join(...)` | `.join(...)` antes de `.where(...)` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre ambiguidade de colunas e preço temporal
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-listando-pedidos-por-mesa/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-listando-pedidos-por-mesa/references/code-examples.md)
