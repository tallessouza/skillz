---
name: rs-api-com-bun-seed-produtos-pedidos
description: "Generates database seed files using Drizzle ORM and Faker.js for pre-populating development databases. Use when user asks to 'create a seed', 'populate database', 'generate fake data', 'seed the database', or 'create test data'. Applies patterns: delete order respecting foreign keys, Drizzle returning() for references, Faker helpers for randomization, batch inserts outside loops, infer insert types. Make sure to use this skill whenever generating seed scripts with Drizzle. Not for production data migration, test fixtures in unit tests, or ORM schema definition."
---

# Seed de Banco de Dados com Drizzle + Faker

> Ao criar seeds, respeite a ordem de foreign keys nos deletes, use returning() para capturar IDs, acumule inserts fora do loop e use tipagem inferida do Drizzle.

## Rules

1. **Delete na ordem inversa das dependencias** — delete primeiro as tabelas filhas, depois as pais, porque o Postgres usa `restrict` por padrao e bloqueara deletes com referencias ativas
2. **Use `onDelete: 'cascade'` nos schemas** — quando fizer sentido, adicione cascade nas foreign keys para simplificar a limpeza do seed
3. **Use `returning()` para capturar IDs** — `await db.insert(users).values([...]).returning()` retorna os registros inseridos para usar como referencia em inserts subsequentes
4. **Acumule dados fora do loop, insira uma vez** — crie arrays `ordersToInsert` e `orderItemsToInsert`, popule no loop, faca um unico `db.insert()` depois
5. **Use `typeof table.$inferInsert` para tipagem** — `type OrderInsert = typeof orders.$inferInsert` da autocomplete exato dos campos da tabela
6. **Faker retorna string para prices** — `faker.commerce.price()` retorna string, envolva com `Number()` para converter
7. **Preco em centavos sem decimais** — passe `{ min: 190, max: 4900, dec: 0 }` no faker.commerce.price porque centavos sao inteiros

## Steps

### Step 1: Reset do banco (delete com ordem)

```typescript
import { db } from './connection'
import { users, restaurants, products, orders, orderItems, authLinks } from './schema'

await db.delete(orderItems)
await db.delete(orders)
await db.delete(products)
await db.delete(authLinks)
await db.delete(restaurants)
await db.delete(users)

console.log('✓ Database reset')
```

### Step 2: Inserir entidades base com returning()

```typescript
const [customer1, customer2] = await db
  .insert(users)
  .values([
    { name: 'Customer 1', email: 'customer1@example.com', role: 'customer' },
    { name: 'Customer 2', email: 'customer2@example.com', role: 'customer' },
  ])
  .returning()

const [manager] = await db
  .insert(users)
  .values([{ name: 'Manager', email: 'manager@example.com', role: 'manager' }])
  .returning()

const [restaurant] = await db
  .insert(restaurants)
  .values([{ name: 'Pizza Place', managerId: manager.id }])
  .returning()
```

### Step 3: Gerar produtos com funcao factory

```typescript
function generateProduct() {
  return {
    name: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    restaurantId: restaurant.id,
    priceInCents: Number(
      faker.commerce.price({ min: 190, max: 4900, dec: 0 })
    ),
  }
}

const availableProducts = await db
  .insert(products)
  .values([
    generateProduct(), generateProduct(), generateProduct(),
    generateProduct(), generateProduct(), generateProduct(),
  ])
  .returning()
```

### Step 4: Gerar pedidos com acumulacao em batch

```typescript
type OrderInsert = typeof orders.$inferInsert
type OrderItemInsert = typeof orderItems.$inferInsert

const ordersToInsert: OrderInsert[] = []
const orderItemsToInsert: OrderItemInsert[] = []

for (let i = 0; i < 200; i++) {
  const orderId = createId()

  // 1-3 produtos aleatorios por pedido
  const orderProducts = faker.helpers.arrayElements(availableProducts, {
    min: 1, max: 3,
  })

  let totalInCents = 0

  for (const orderProduct of orderProducts) {
    const quantity = faker.number.int({ min: 1, max: 3 })
    totalInCents += orderProduct.priceInCents * quantity

    orderItemsToInsert.push({
      orderId,
      productId: orderProduct.id,
      priceInCents: orderProduct.priceInCents,  // preco unitario, NAO multiplicado
      quantity,
    })
  }

  ordersToInsert.push({
    id: orderId,
    customerId: faker.helpers.arrayElement([customer1, customer2]).id,
    restaurantId: restaurant.id,
    totalInCents,
    status: faker.helpers.arrayElement([
      'pending', 'processing', 'delivering', 'delivered', 'cancelled',
    ]),
    createdAt: faker.date.recent({ days: 40 }),
  })
}

await db.insert(orders).values(ordersToInsert)
await db.insert(orderItems).values(orderItemsToInsert)

console.log('✓ Created 200 orders')
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Foreign key sem onDelete definido | Delete filhas antes das pais |
| Precisa do ID apos insert | Use `.returning()` e desestruture |
| Gerar multiplos registros similares | Crie funcao factory, nao copie objetos |
| Loop com muitos inserts | Acumule em array, insira uma vez apos o loop |
| Preco vem do faker | Envolva com `Number()`, use `dec: 0` para centavos |
| Precisa de N aleatorios de array | `faker.helpers.arrayElements(arr, { min, max })` |
| Precisa de 1 aleatorio de array | `faker.helpers.arrayElement(arr)` (singular) |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `await db.insert()` dentro de for (200x) | Acumule em array, um insert no final |
| `priceInCents: product.price * quantity` no order item | `priceInCents: product.priceInCents` (unitario) |
| `faker.commerce.price()` direto como number | `Number(faker.commerce.price({ dec: 0 }))` |
| Array de objetos identicos copiados | Funcao factory que gera novos valores |
| Delete users antes de orders | Delete na ordem inversa das dependencias |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/api-com/rs-api-com-bun-seed-de-produtos-e-pedidos/references/deep-explanation.md)
- [Code examples](../../../data/skills/api-com/rs-api-com-bun-seed-de-produtos-e-pedidos/references/code-examples.md)
