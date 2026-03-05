---
name: rs-full-stack-migration-de-pedidos
description: "Enforces correct order table migration patterns when designing database schemas for e-commerce or restaurant systems. Use when user asks to 'create orders table', 'migration for orders', 'design order schema', 'store order history', or 'track purchases'. Applies rules: separate price column for historical preservation, foreign keys to sessions/products, decimal for prices, integer for quantities, no computed total columns. Make sure to use this skill whenever creating order/purchase tables or migrations involving price history. Not for product catalog tables, authentication, or frontend components."
---

# Migration de Pedidos

> Ao criar tabelas de pedidos, preserve o preco no momento da compra separado da tabela de produtos, porque precos mudam e o historico precisa ser fiel.

## Rules

1. **Sempre duplique o preco na tabela de pedidos** — nunca dependa apenas da FK para o produto, porque quando o preco do produto muda, todos os pedidos antigos perdem o valor historico correto
2. **Use decimal para precos, integer para quantidades** — `decimal` suporta centavos (70.50), `integer` basta para quantidades inteiras
3. **Nunca armazene colunas calculadas** — total = quantidade * preco pode ser calculado dinamicamente, nao precisa de coluna propria
4. **Foreign keys sempre com notNullable** — um pedido sem sessao ou sem produto e um dado orfao e inconsistente
5. **Use references() para chaves estrangeiras** — conecta FK com PK da tabela referenciada, garantindo integridade referencial
6. **Inclua timestamps com default automatico** — `created_at` e `updated_at` com `defaultTo(knex.fn.now())`

## How to write

### Migration de tabela de pedidos (Knex)

```typescript
export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("orders", (table) => {
    table.increments("id").primary()
    table.integer("table_session_id").notNullable().references("id").inTable("table_sessions")
    table.integer("product_id").notNullable().references("id").inTable("products")
    table.integer("quantity").notNullable()
    table.decimal("price").notNullable()
    table.timestamp("created_at").defaultTo(knex.fn.now())
    table.timestamp("updated_at").defaultTo(knex.fn.now())
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("orders")
}
```

## Example

**Before (erro comum — preco apenas via FK):**
```typescript
await knex.schema.createTable("orders", (table) => {
  table.increments("id").primary()
  table.integer("table_session_id").references("id").inTable("table_sessions")
  table.integer("product_id").references("id").inTable("products")
  table.integer("quantity")
  // SEM coluna de preco — depende do preco atual do produto
  // SEM notNullable — permite dados orfaos
})
```

**After (com esta skill aplicada):**
```typescript
await knex.schema.createTable("orders", (table) => {
  table.increments("id").primary()
  table.integer("table_session_id").notNullable().references("id").inTable("table_sessions")
  table.integer("product_id").notNullable().references("id").inTable("products")
  table.integer("quantity").notNullable()
  table.decimal("price").notNullable() // Preco no momento do pedido
  table.timestamp("created_at").defaultTo(knex.fn.now())
  table.timestamp("updated_at").defaultTo(knex.fn.now())
})
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Preco pode mudar no futuro | Duplique na tabela de pedidos |
| Valor pode ser calculado de outras colunas | Calcule dinamicamente, nao armazene |
| FK aponta para outra tabela | Sempre `notNullable()` + `references().inTable()` |
| Nomes de FK no singular | `product_id`, `table_session_id` (um pedido pertence a UMA sessao) |
| Migration precisa de rollback | Sempre implemente `down()` com `dropTable` |

## Anti-patterns

| Nunca faca | Faca ao inves |
|------------|---------------|
| Depender do preco via JOIN com produtos | Armazenar `price` diretamente na tabela de pedidos |
| Coluna `total` = qty * price no banco | Calcular dinamicamente na aplicacao |
| FK sem `notNullable()` | Sempre `notNullable()` em FKs obrigatorias |
| `table.integer("price")` | `table.decimal("price")` para suportar centavos |
| Esquecer `down()` na migration | Sempre implementar rollback com `dropTable` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre preservacao de historico de precos e design de tabelas de pedidos
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-migration-de-pedidos/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-migration-de-pedidos/references/code-examples.md)
