# Code Examples: Ordenacao com Drizzle ORM

## 1. Error handler com Not Found

```typescript
// No server, adicionar case para not found
app.onError((error, c) => {
  if (error instanceof ValidationError) {
    return c.json({ message: error.message }, 400)
  }

  if (error.name === 'NotFoundError') {
    return c.json({}, 404)
  }

  console.error(error)
  return c.json({ message: 'Internal server error' }, 500)
})
```

## 2. Select com campos explicitos (sem getTableColumns)

```typescript
// Substituindo getTableColumns por campos explicitos
// Permite controle total sobre o que e retornado
const result = await db
  .select({
    orderId: orders.id,
    createdAt: orders.createdAt,
    status: orders.status,
    total: orders.totalInCents,
    customerName: users.name, // Campo do join
  })
  .from(orders)
  .innerJoin(users, eq(orders.userId, users.id))
```

## 3. OrderBy simples (NAO funciona com subquery)

```typescript
// Isso funciona quando se usa a tabela diretamente
db.select().from(orders).orderBy(desc(orders.createdAt))

// Isso NAO funciona quando orders vem de uma subquery
const baseQuery = db.select({...}).from(orders).as('baseQuery')
db.select().from(baseQuery).orderBy(desc(orders.createdAt)) // ERRO: orders nao existe aqui
```

## 4. OrderBy com callback (funciona com subquery)

```typescript
const baseQuery = db
  .select({
    orderId: orders.id,
    createdAt: orders.createdAt,
    status: orders.status,
    customerName: users.name,
  })
  .from(orders)
  .innerJoin(users, eq(orders.userId, users.id))
  .as('baseQuery')

// Callback recebe os campos disponiveis da subquery
db.select()
  .from(baseQuery)
  .orderBy((fields) => [
    desc(fields.createdAt)
  ])
```

## 5. Multiplos campos no orderBy

```typescript
// Array permite ordenar por multiplos criterios
// Primeiro criterio tem prioridade
orderBy: (fields) => [
  desc(fields.createdAt),
  desc(fields.customerName),
]
```

## 6. SQL CASE completo para ordenacao por status

```typescript
import { sql, desc } from 'drizzle-orm'

// Query completa com ordenacao por prioridade de status
const result = await db
  .select()
  .from(baseQuery)
  .orderBy((fields) => [
    sql`
      CASE
        WHEN ${fields.status} = 'pending' THEN 1
        WHEN ${fields.status} = 'processing' THEN 2
        WHEN ${fields.status} = 'delivering' THEN 3
        WHEN ${fields.status} = 'delivered' THEN 4
        WHEN ${fields.status} = 'cancelled' THEN 99
      END
    `,
    desc(fields.createdAt),
  ])
  .limit(10)
  .offset(pageIndex * 10)
```

## 7. Verificacao: resultado paginado

```
// Pagina 0: apenas pedidos "pending" (prioridade 1)
// Pagina 18: apenas pedidos "cancelled" (prioridade 99)
// Dentro do mesmo status, ordenados por createdAt DESC
```