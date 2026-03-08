---
name: rs-api-com-bun-seed-produtos-pedidos
description: "Generates complex database seed files with batch inserts, factory functions, and Faker.js for populating development databases. Use when user asks to 'seed orders and products', 'generate realistic test data', 'batch insert with drizzle', 'create seed with faker', or 'populate orders with items'. Applies FK-ordered deletes, returning() for references, batch accumulation outside loops, and $inferInsert typing. Make sure to use this skill whenever generating seed scripts with related entities. Not for simple seeds (see criando-seed-com-drizzle), production migrations, or unit test fixtures."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: api-com-bun
  module: drizzle-orm
  tags: [drizzle, seed, faker, batch-insert, factory, orders, products, bun]
---

# Seed de Produtos e Pedidos com Drizzle + Faker

> Respeite a ordem de FK nos deletes, use returning() para IDs, acumule inserts fora do loop e use tipagem inferida.

## Rules

1. **Delete na ordem inversa das dependencias** — filhas antes das pais
2. **Use `returning()` para capturar IDs** — retorna registros inseridos para referencia
3. **Acumule dados fora do loop** — arrays `ordersToInsert[]` e `orderItemsToInsert[]`, um insert apos o loop
4. **Use `$inferInsert` para tipagem** — `typeof orders.$inferInsert` da autocomplete exato
5. **Faker prices retornam string** — envolva com `Number()` e use `{ dec: 0 }` para centavos
6. **Preco no item e unitario** — `priceInCents: product.priceInCents`, nao multiplicado pela quantidade

## How to write

### Batch com acumulacao

```typescript
type OrderInsert = typeof orders.$inferInsert
type OrderItemInsert = typeof orderItems.$inferInsert

const ordersToInsert: OrderInsert[] = []
const orderItemsToInsert: OrderItemInsert[] = []

for (let i = 0; i < 200; i++) {
  const orderId = createId()
  const orderProducts = faker.helpers.arrayElements(availableProducts, { min: 1, max: 3 })
  let totalInCents = 0

  for (const product of orderProducts) {
    const quantity = faker.number.int({ min: 1, max: 3 })
    totalInCents += product.priceInCents * quantity
    orderItemsToInsert.push({
      orderId, productId: product.id,
      priceInCents: product.priceInCents, quantity,
    })
  }

  ordersToInsert.push({
    id: orderId, customerId: faker.helpers.arrayElement([c1, c2]).id,
    restaurantId: restaurant.id, totalInCents,
    status: faker.helpers.arrayElement(['pending', 'processing', 'delivering', 'delivered', 'cancelled']),
    createdAt: faker.date.recent({ days: 40 }),
  })
}

await db.insert(orders).values(ordersToInsert)
await db.insert(orderItems).values(orderItemsToInsert)
```

## Example

**Before (insert dentro do loop):**
```typescript
for (let i = 0; i < 200; i++) {
  await db.insert(orders).values({ ... }) // 200 queries!
}
```

**After (batch unico):**
```typescript
const ordersToInsert = []
for (let i = 0; i < 200; i++) { ordersToInsert.push({ ... }) }
await db.insert(orders).values(ordersToInsert) // 1 query
```

## Heuristics

| Situacao | Faca |
|----------|------|
| FK sem onDelete | Delete filhas antes das pais |
| Precisa do ID | `.returning()` |
| Multiplos registros similares | Funcao factory |
| Loop com inserts | Acumule, insira uma vez |
| Preco do faker | `Number(faker.commerce.price({ dec: 0 }))` |
| N aleatorios de array | `faker.helpers.arrayElements(arr, { min, max })` |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `await db.insert()` dentro de for | Acumule, um insert no final |
| `priceInCents: product.price * quantity` | `priceInCents: product.priceInCents` (unitario) |
| `faker.commerce.price()` como number | `Number(faker.commerce.price({ dec: 0 }))` |
| Delete users antes de orders | Ordem inversa das dependencias |

## Troubleshooting

### Insert batch muito lento
**Symptom:** Seed de 200 pedidos leva mais de 10 segundos
**Cause:** Insert individual dentro do loop ao inves de batch
**Fix:** Acumule em array e faca um unico `db.insert(orders).values(ordersArray)`.

### priceInCents como NaN
**Symptom:** Valores monetarios aparecem como NaN no banco
**Cause:** `faker.commerce.price()` retorna string e nao foi convertida
**Fix:** Envolva com `Number()`: `Number(faker.commerce.price({ min: 190, max: 4900, dec: 0 }))`.

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes
