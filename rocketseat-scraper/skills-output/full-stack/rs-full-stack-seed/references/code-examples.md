# Code Examples: Prisma Database Seed

## Exemplo basico (da aula)

```typescript
import { prisma } from '../src/lib/prisma'

async function seed() {
  await prisma.user.createMany({
    data: [
      { name: 'Mike Brito', email: 'mike@email.com' },
      { name: 'Diego Fernandes', email: 'diego@email.com' },
    ],
  })
}

seed()
  .then(() => {
    console.log('Database seeded')
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
```

## Com skipDuplicates (seed idempotente)

```typescript
async function seed() {
  await prisma.user.createMany({
    data: [
      { name: 'Mike Brito', email: 'mike@email.com' },
      { name: 'Diego Fernandes', email: 'diego@email.com' },
    ],
    skipDuplicates: true, // ignora se email ja existe (unique constraint)
  })
}
```

## Seed com multiplas tabelas (ordem de dependencias)

```typescript
async function seed() {
  // 1. Tabelas sem foreign keys primeiro
  const roles = await prisma.role.createMany({
    data: [
      { name: 'admin' },
      { name: 'member' },
    ],
    skipDuplicates: true,
  })

  // 2. Tabelas com foreign keys depois
  await prisma.user.createMany({
    data: [
      { name: 'Admin User', email: 'admin@app.com', roleId: 1 },
      { name: 'Regular User', email: 'user@app.com', roleId: 2 },
    ],
    skipDuplicates: true,
  })

  console.log('Database seeded')
}
```

## Seed com relacoes aninhadas (usando create)

```typescript
async function seed() {
  // createMany NAO suporta nested, use create para relacoes
  await prisma.user.create({
    data: {
      name: 'Mike Brito',
      email: 'mike@email.com',
      posts: {
        create: [
          { title: 'Primeiro post', content: 'Conteudo do post' },
          { title: 'Segundo post', content: 'Mais conteudo' },
        ],
      },
    },
  })
}
```

## Seed com dados dinamicos (faker)

```typescript
import { faker } from '@faker-js/faker'
import { prisma } from '../src/lib/prisma'

async function seed() {
  const users = Array.from({ length: 50 }, () => ({
    name: faker.person.fullName(),
    email: faker.internet.email(),
  }))

  await prisma.user.createMany({
    data: users,
    skipDuplicates: true,
  })
}
```

## Configuracao package.json

```json
{
  "name": "meu-projeto",
  "scripts": {
    "dev": "tsx watch src/server.ts"
  },
  "prisma": {
    "seed": "tsx prisma/seed.ts"
  }
}
```

## Alternativa com ts-node

```json
{
  "prisma": {
    "seed": "ts-node --compiler-options {\"module\":\"CommonJS\"} prisma/seed.ts"
  }
}
```

## Seed com limpeza previa (reset antes de popular)

```typescript
async function seed() {
  // Limpa tabelas na ordem inversa de dependencias
  await prisma.post.deleteMany()
  await prisma.user.deleteMany()

  // Popula
  await prisma.user.createMany({
    data: [
      { name: 'Mike Brito', email: 'mike@email.com' },
      { name: 'Diego Fernandes', email: 'diego@email.com' },
    ],
  })
}
```