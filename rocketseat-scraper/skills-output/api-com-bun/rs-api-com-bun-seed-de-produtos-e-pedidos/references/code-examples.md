# Code Examples: Seed de Produtos e Pedidos

## Exemplo completo do seed

```typescript
import { faker } from '@faker-js/faker'
import { createId } from '@paralleldrive/cuid2'
import { db } from './connection'
import {
  users,
  restaurants,
  products,
  orders,
  orderItems,
  authLinks,
} from './schema'

// --- RESET ---
await db.delete(orderItems)
await db.delete(orders)
await db.delete(products)
await db.delete(authLinks)
await db.delete(restaurants)
await db.delete(users)

console.log('✓ Database reset')

// --- CUSTOMERS ---
const [customer1, customer2] = await db
  .insert(users)
  .values([
    {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      role: 'customer',
    },
    {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      role: 'customer',
    },
  ])
  .returning()

console.log('✓ Created customers')

// --- MANAGER + RESTAURANT ---
const [manager] = await db
  .insert(users)
  .values([
    {
      name: faker.person.fullName(),
      email: 'admin@admin.com',
      role: 'manager',
    },
  ])
  .returning()

const [restaurant] = await db
  .insert(restaurants)
  .values([
    {
      name: faker.company.name(),
      managerId: manager.id,
      description: faker.lorem.paragraph(),
    },
  ])
  .returning()

console.log('✓ Created manager and restaurant')

// --- PRODUCTS ---
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
    generateProduct(),
    generateProduct(),
    generateProduct(),
    generateProduct(),
    generateProduct(),
    generateProduct(),
  ])
  .returning()

console.log('✓ Created products')

// --- ORDERS ---
type OrderInsert = typeof orders.$inferInsert
type OrderItemInsert = typeof orderItems.$inferInsert

const ordersToInsert: OrderInsert[] = []
const orderItemsToInsert: OrderItemInsert[] = []

for (let i = 0; i < 200; i++) {
  const orderId = createId()

  const orderProducts = faker.helpers.arrayElements(availableProducts, {
    min: 1,
    max: 3,
  })

  let totalInCents = 0

  for (const orderProduct of orderProducts) {
    const quantity = faker.number.int({ min: 1, max: 3 })

    totalInCents += orderProduct.priceInCents * quantity

    orderItemsToInsert.push({
      orderId,
      productId: orderProduct.id,
      priceInCents: orderProduct.priceInCents,
      quantity,
    })
  }

  ordersToInsert.push({
    id: orderId,
    customerId: faker.helpers.arrayElement([customer1, customer2]).id,
    restaurantId: restaurant.id,
    totalInCents,
    status: faker.helpers.arrayElement([
      'pending',
      'processing',
      'delivering',
      'delivered',
      'cancelled',
    ]),
    createdAt: faker.date.recent({ days: 40 }),
  })
}

await db.insert(orders).values(ordersToInsert)
await db.insert(orderItems).values(orderItemsToInsert)

console.log('✓ Created 200 orders')
```

## Pattern: Funcao factory vs objeto copiado

```typescript
// ERRADO: todos os produtos terao o mesmo nome/descricao
const product = {
  name: faker.commerce.productName(),
  restaurantId: restaurant.id,
  priceInCents: Number(faker.commerce.price({ min: 190, max: 4900, dec: 0 })),
}
// Se voce colocar [product, product, product], sao 3 referencias ao MESMO objeto

// CERTO: funcao gera valores novos a cada chamada
function generateProduct() {
  return {
    name: faker.commerce.productName(),
    restaurantId: restaurant.id,
    priceInCents: Number(
      faker.commerce.price({ min: 190, max: 4900, dec: 0 })
    ),
  }
}
// [generateProduct(), generateProduct(), generateProduct()] — 3 objetos diferentes
```

## Pattern: Tipagem inferida do Drizzle para arrays externos

```typescript
import { orders, orderItems } from './schema'

// Extrai o tipo de insert da tabela
type OrderInsert = typeof orders.$inferInsert
type OrderItemInsert = typeof orderItems.$inferInsert

// Agora o TypeScript sabe exatamente quais campos sao obrigatorios/opcionais
const ordersToInsert: OrderInsert[] = []

ordersToInsert.push({
  // Ctrl+Space aqui mostra todos os campos validos
  id: 'abc123',
  customerId: 'user1',
  restaurantId: 'rest1',
  totalInCents: 5000,
  status: 'pending',
})
```

## Pattern: Faker helpers para aleatoriedade

```typescript
// Pegar 1-3 elementos aleatorios de um array
const randomProducts = faker.helpers.arrayElements(availableProducts, {
  min: 1,
  max: 3,
})

// Pegar exatamente 1 elemento aleatorio
const randomCustomer = faker.helpers.arrayElement([customer1, customer2])

// Numero inteiro aleatorio
const quantity = faker.number.int({ min: 1, max: 3 })

// Preco em centavos (sem decimais, como string convertida)
const priceInCents = Number(
  faker.commerce.price({ min: 190, max: 4900, dec: 0 })
)

// Data recente (ultimos N dias)
const recentDate = faker.date.recent({ days: 40 })
```

## Pattern: onDelete cascade no schema Drizzle

```typescript
// Sem cascade (padrao = restrict): delete do pai BLOQUEIA se tem filhos
export const authLinks = pgTable('auth_links', {
  userId: text('user_id').references(() => users.id),  // restrict por padrao
})

// Com cascade: delete do pai REMOVE filhos automaticamente
export const authLinks = pgTable('auth_links', {
  userId: text('user_id').references(() => users.id, {
    onDelete: 'cascade',
  }),
})
```