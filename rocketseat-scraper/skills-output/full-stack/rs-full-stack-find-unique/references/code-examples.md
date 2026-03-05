# Code Examples: Prisma findUnique

## Exemplo base da aula — Show endpoint

```typescript
// Controller method
async show(request: FastifyRequest) {
  const { id } = request.params

  const user = await prisma.user.findUnique({
    where: { id },
  })

  return user
}
```

## Rota correspondente

```typescript
app.get("/users/:id", userController.show)
```

## Comparacao: index vs show

```typescript
// INDEX — findMany retorna array
async index() {
  const users = await prisma.user.findMany()
  return users  // [{ id: "1", name: "Rodrigo" }, { id: "2", name: "Ana" }]
}

// SHOW — findUnique retorna objeto
async show(request) {
  const { id } = request.params
  const user = await prisma.user.findUnique({
    where: { id },
  })
  return user  // { id: "1", name: "Rodrigo" }
}
```

## Variacoes do findUnique

### Com select (retornar campos especificos)

```typescript
const user = await prisma.user.findUnique({
  where: { id },
  select: {
    id: true,
    name: true,
    email: true,
  },
})
```

### Com include (trazer relacoes)

```typescript
const user = await prisma.user.findUnique({
  where: { id },
  include: {
    posts: true,
    profile: true,
  },
})
```

### Por outro campo unico (email)

```typescript
const { email } = request.body

const user = await prisma.user.findUnique({
  where: { email },
})
```

### Com unique composto

```typescript
const user = await prisma.user.findUnique({
  where: {
    firstName_lastName: {
      firstName: "Rodrigo",
      lastName: "Silva",
    },
  },
})
```

## Tratando caso de usuario nao encontrado

```typescript
async show(request, reply) {
  const { id } = request.params

  const user = await prisma.user.findUnique({
    where: { id },
  })

  if (!user) {
    return reply.status(404).send({ error: "User not found" })
  }

  return user
}
```

## Diferenca entre findUnique e findFirst

```typescript
// findUnique — APENAS campos marcados como @unique ou @id no schema
const user = await prisma.user.findUnique({
  where: { id },  // id e @id, entao funciona
})

// findFirst — qualquer campo, retorna o primeiro match
const user = await prisma.user.findFirst({
  where: { name: "Rodrigo" },  // name nao e unique, entao usa findFirst
})
```