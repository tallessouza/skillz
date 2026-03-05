---
name: rs-api-com-bun-schema-produtos-pedidos
description: "Enforces best practices for designing database schemas with Drizzle ORM, especially for e-commerce/delivery domains. Use when user asks to 'create a schema', 'define tables', 'model products and orders', 'setup drizzle schema', or 'design database relations'. Applies rules: prices always in cents as integer, cache computed totals in parent tables, use semantic column names over foreign key names, choose cascade strategy based on business logic not convenience. Make sure to use this skill whenever designing schemas with monetary values or many-to-many relationships. Not for query building, API routes, or authentication schemas."
---

# Schema de Produtos e Pedidos

> Ao modelar schemas de banco de dados, escolha estrategias de cascata e tipos de coluna baseado na logica de negocio, nunca por conveniencia tecnica.

## Rules

1. **Valores monetarios sempre em centavos como integer** — `priceInCents` nao `price`, porque evita problemas de floating point e simplifica calculos entre back e front
2. **Nomeie colunas pelo contexto semantico** — `customerId` nao `userId` dentro de orders, porque o user no contexto de pedido e um cliente
3. **Cache totais computados na tabela pai** — salve `totalInCents` em orders ao inves de calcular via JOIN toda vez, porque JOINs em 250k+ registros sao proibitivos
4. **Escolha onDelete baseado em impacto de negocio** — nem tudo e CASCADE; perder historico de faturamento ao deletar um cliente e um bug de negocio
5. **Tabela pivot para N:N** — products e orders se conectam via orderItems, cada item guarda priceInCents do momento da compra
6. **Preco do item e snapshot, nao referencia** — orderItems.priceInCents e o preco no momento da compra, porque o preco do produto muda com o tempo
7. **Remova campos desnecessarios** — se o registro nunca sera editado apos criacao, nao inclua `updatedAt`

## How to write

### Schema de produto com Drizzle

```typescript
export const products = pgTable('products', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  name: text('name').notNull(),
  description: text('description'), // nullable intencional
  priceInCents: integer('price_in_cents').notNull(),
  restaurantId: text('restaurant_id')
    .notNull()
    .references(() => restaurants.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})
```

### Schema de pedido com cascata inteligente

```typescript
export const orders = pgTable('orders', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  customerId: text('customer_id')
    .references(() => users.id, { onDelete: 'set null' }), // nullable: preserva historico
  restaurantId: text('restaurant_id')
    .notNull()
    .references(() => restaurants.id, { onDelete: 'cascade' }),
  status: orderStatusEnum('status').default('pending').notNull(),
  totalInCents: integer('total_in_cents').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
})
```

### Tabela pivot com snapshot de preco

```typescript
export const orderItems = pgTable('order_items', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  orderId: text('order_id')
    .notNull()
    .references(() => orders.id, { onDelete: 'cascade' }),
  productId: text('product_id')
    .references(() => products.id, { onDelete: 'set null' }), // preserva historico
  priceInCents: integer('price_in_cents').notNull(),
  quantity: integer('quantity').notNull(),
})
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Deletar entidade pai remove sentido dos filhos | `onDelete: 'cascade'` (restaurante → produtos) |
| Deletar entidade pai perde historico financeiro | `onDelete: 'set null'` + campo nullable (cliente → pedidos) |
| Valor monetario em qualquer tabela | Integer em centavos, nome com sufixo `InCents` |
| Relacao N:N | Tabela pivot com campos proprios (preco, quantidade) |
| Registro nunca editado apos criacao | Omita `updatedAt` |
| Coluna FK em contexto diferente do original | Nomeie pelo contexto (`customerId` nao `userId`) |
| Total precisa ser consultado frequentemente | Cache na tabela pai, nao calcule via JOIN |

## Anti-patterns

| Nunca faca | Faca ao inves |
|------------|---------------|
| `price: decimal('price')` | `priceInCents: integer('price_in_cents')` |
| `onDelete: 'cascade'` em tudo | Analise impacto no historico de cada relacao |
| Calcular total via JOIN em toda query | Salve `totalInCents` no pedido na criacao |
| `userId` em tabela de pedidos | `customerId` — nome semantico ao contexto |
| Referenciar preco atual do produto no item | Snapshot do preco no momento da compra |
| `updatedAt` em registros imutaveis | Omita campos que nunca serao usados |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/api-com/rs-api-com-bun-schema-de-produtos-e-pedidos/references/deep-explanation.md)
- [Code examples](../../../data/skills/api-com/rs-api-com-bun-schema-de-produtos-e-pedidos/references/code-examples.md)
