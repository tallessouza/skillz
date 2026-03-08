---
name: rs-api-com-bun-schema-produtos-pedidos
description: "Enforces database schema design best practices for e-commerce/delivery domains with Drizzle ORM. Use when user asks to 'model products and orders', 'design order schema', 'create pivot table', 'store prices in database', or 'choose cascade strategy'. Applies prices in cents as integer, cached totals, semantic column names, cascade by business impact, and pivot tables with price snapshots. Make sure to use this skill whenever designing schemas with monetary values or many-to-many relationships. Not for query building (see rota-listagem-de-pedidos), API routes, or auth schemas (see schema-de-links-de-autenticacao)."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: api-com-bun
  module: drizzle-orm
  tags: [drizzle, schema, products, orders, pivot-table, cents, cascade, e-commerce]
---

# Schema de Produtos e Pedidos

> Escolha estrategias de cascata e tipos de coluna baseado na logica de negocio, nunca por conveniencia tecnica.

## Rules

1. **Valores monetarios em centavos como integer** — `priceInCents` nao `price`, porque evita floating point
2. **Nomeie colunas pelo contexto semantico** — `customerId` nao `userId` em orders, porque o user e um cliente nesse contexto
3. **Cache totais computados na tabela pai** — `totalInCents` em orders, porque JOINs em 250k+ registros sao proibitivos
4. **onDelete baseado em impacto de negocio** — perder historico de faturamento ao deletar cliente e bug de negocio
5. **Tabela pivot para N:N** — orderItems conecta products e orders, cada item guarda preco do momento
6. **Preco do item e snapshot** — orderItems.priceInCents e o preco na compra, porque o preco muda
7. **Remova campos desnecessarios** — sem `updatedAt` se registro nunca e editado

## How to write

### Produto

```typescript
export const products = pgTable('products', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  name: text('name').notNull(),
  priceInCents: integer('price_in_cents').notNull(),
  restaurantId: text('restaurant_id').notNull()
    .references(() => restaurants.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow(),
})
```

### Pedido com cascata inteligente

```typescript
export const orders = pgTable('orders', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  customerId: text('customer_id')
    .references(() => users.id, { onDelete: 'set null' }), // preserva historico
  restaurantId: text('restaurant_id').notNull()
    .references(() => restaurants.id, { onDelete: 'cascade' }),
  status: orderStatusEnum('status').default('pending').notNull(),
  totalInCents: integer('total_in_cents').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
})
```

### Pivot com snapshot

```typescript
export const orderItems = pgTable('order_items', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  orderId: text('order_id').notNull().references(() => orders.id, { onDelete: 'cascade' }),
  productId: text('product_id').references(() => products.id, { onDelete: 'set null' }),
  priceInCents: integer('price_in_cents').notNull(), // snapshot
  quantity: integer('quantity').notNull(),
})
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Deletar pai remove sentido dos filhos | `onDelete: 'cascade'` |
| Deletar pai perde historico financeiro | `onDelete: 'set null'` + nullable |
| Valor monetario | Integer em centavos, sufixo `InCents` |
| Relacao N:N | Pivot com campos proprios |
| Registro imutavel | Omita `updatedAt` |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| `price: decimal('price')` | `priceInCents: integer('price_in_cents')` |
| `onDelete: 'cascade'` em tudo | Analise impacto no historico |
| Calcular total via JOIN | Salve `totalInCents` no pedido |
| `userId` em pedidos | `customerId` — nome semantico |
| Referenciar preco atual do produto | Snapshot no momento da compra |

## Troubleshooting

### Preco inconsistente entre pedido e produto
**Symptom:** Valor do pedido muda quando o preco do produto e atualizado
**Cause:** orderItems referencia preco atual ao inves de armazenar snapshot
**Fix:** Salve `priceInCents` no orderItem no momento da criacao do pedido, nao como referencia ao produto.

### Historico de pedidos perdido ao deletar cliente
**Symptom:** Pedidos desaparecem quando um usuario e deletado
**Cause:** `onDelete: 'cascade'` no `customerId`
**Fix:** Use `onDelete: 'set null'` com campo nullable para preservar historico.

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes
