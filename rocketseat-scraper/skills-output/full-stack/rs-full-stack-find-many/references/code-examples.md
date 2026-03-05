# Code Examples: Prisma findMany

## Exemplo 1: Listagem basica (exato da aula)

```typescript
// Rota index para listar todos os usuarios
app.get('/users', async (request, reply) => {
  const users = await prisma.user.findMany()

  return reply.send({ users })
})
```

**Resultado no Insomnia (GET http://localhost:3333/users):**
```json
{
  "users": [
    {
      "id": "uuid-1",
      "name": "John Doe",
      "email": "john@example.com"
    },
    {
      "id": "uuid-2",
      "name": "Jane Doe",
      "email": "jane@example.com"
    }
  ]
}
```

## Exemplo 2: Aplicando o mesmo padrao para outros models

```typescript
// Products
app.get('/products', async (request, reply) => {
  const products = await prisma.product.findMany()
  return reply.send({ products })
})

// Orders
app.get('/orders', async (request, reply) => {
  const orders = await prisma.order.findMany()
  return reply.send({ orders })
})

// Categories
app.get('/categories', async (request, reply) => {
  const categories = await prisma.category.findMany()
  return reply.send({ categories })
})
```

## Exemplo 3: findMany com select (extensao do padrao)

```typescript
// Selecionar apenas campos especificos
app.get('/users', async (request, reply) => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      // password: false (omitido por seguranca)
    },
  })

  return reply.send({ users })
})
```

## Exemplo 4: findMany com orderBy

```typescript
app.get('/users', async (request, reply) => {
  const users = await prisma.user.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  })

  return reply.send({ users })
})
```

## Exemplo 5: findMany com where (filtro basico)

```typescript
app.get('/users/active', async (request, reply) => {
  const activeUsers = await prisma.user.findMany({
    where: {
      isActive: true,
    },
  })

  return reply.send({ users: activeUsers })
})
```

## Comparacao: SQL vs Prisma

```sql
-- SQL puro
SELECT * FROM "User";
SELECT id, name, email FROM "User";
SELECT * FROM "User" WHERE "isActive" = true ORDER BY "createdAt" DESC;
```

```typescript
// Prisma equivalente
await prisma.user.findMany()
await prisma.user.findMany({ select: { id: true, name: true, email: true } })
await prisma.user.findMany({ where: { isActive: true }, orderBy: { createdAt: 'desc' } })
```