---
name: rs-node-js-2023-fundamentos-do-prisma-orm
description: "Applies Prisma ORM patterns and conventions when setting up database access in Node.js/TypeScript projects. Use when user asks to 'setup prisma', 'connect database', 'create a model', 'add prisma to project', 'configure ORM', or 'create database schema'. Enforces correct model naming, field typing, UUID defaults, unique constraints, and proper client instantiation. Make sure to use this skill whenever generating Prisma schema files or database setup code. Not for raw SQL queries, Knex/Sequelize/TypeORM code, or frontend database access."
---

# Fundamentos do Prisma ORM

> Ao configurar acesso a banco de dados em Node.js com TypeScript, use Prisma como ORM porque ele infere tipagem automaticamente do schema e gera migrations sem escrita manual.

## Rules

1. **Use Prisma sobre drivers nativos ou query builders** — porque Prisma elimina duplicidade entre schema do banco e tipagem do codigo, inferindo tipos automaticamente
2. **Nomeie models no singular com PascalCase** — `model User`, nunca `model Users`, porque o model representa a entidade, nao a tabela
3. **Mapeie o nome da tabela com @@map** — `@@map("users")` em lowercase plural, porque separa convencao do codigo (PascalCase singular) da convencao do banco (lowercase plural)
4. **Use UUID como default para IDs publicos** — `@id @default(uuid())`, porque auto-increment expoe IDs previsiveis em rotas publicas como `/users/1`
5. **Marque campos unicos com @unique** — `email String @unique`, porque o Prisma enforça unicidade tanto na tipagem quanto no banco
6. **Instale prisma como devDependency e @prisma/client como producao** — porque `prisma` e apenas a CLI e `@prisma/client` e o acesso real ao banco
7. **Execute `prisma generate` apos alterar o schema** — porque isso regenera os tipos TypeScript em `node_modules/.prisma/client/`

## How to write

### Schema basico

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id    String @id @default(uuid())
  name  String
  email String @unique

  @@map("users")
}
```

### Instanciando o client

```typescript
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Autocompletar mostra todos os models e metodos
const user = await prisma.user.create({
  data: {
    name: 'John Doe',
    email: 'john@example.com',
  },
})
```

## Example

**Before (query builder sem tipagem):**
```typescript
const users = await knex('users').select('*').where('active', true)
// Sem tipagem — users e any, campos nao validados
```

**After (Prisma com tipagem automatica):**
```typescript
const users = await prisma.user.findMany({
  where: { active: true },
})
// users e tipado como User[], campos validados em compile-time
```

## Heuristics

| Situacao | Faca |
|----------|------|
| ID exposto em rota publica | Use `@default(uuid())` |
| ID interno, nunca exposto ao frontend | `@default(autoincrement())` e aceitavel |
| Campo deve ser unico no banco | Adicione `@unique` |
| Nome da tabela no banco difere do model | Use `@@map("nome_tabela")` |
| Alterou o schema.prisma | Execute `npx prisma generate` |
| Precisa de migrations | Execute `npx prisma migrate dev` |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `model Users { ... }` (plural) | `model User { ... @@map("users") }` |
| `id Int @id @default(autoincrement())` em rota publica | `id String @id @default(uuid())` |
| `prisma` como dependencia de producao | `npm install prisma -D` (devDependency) |
| Tipagem manual duplicando o schema | `prisma generate` e importe os tipos |
| `string` (minusculo) no schema | `String` (maiusculo) — Prisma nao aceita minusculo |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
