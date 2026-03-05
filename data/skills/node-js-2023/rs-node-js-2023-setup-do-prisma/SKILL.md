---
name: rs-node-js-2023-setup-do-prisma
description: "Applies Prisma ORM setup conventions when configuring Prisma in a NestJS or Node.js project. Use when user asks to 'setup prisma', 'configure database', 'create prisma schema', 'add prisma to nest', or 'initialize ORM'. Enforces naming conventions: lowercase plural table names with @@map, snake_case column mapping for camelCase fields, proper relationship setup, and correct migration workflow. Make sure to use this skill whenever setting up Prisma from scratch or creating new models. Not for query optimization, advanced Prisma features, or non-Prisma ORMs."
---

# Setup do Prisma

> Ao configurar o Prisma, siga convencoes de naming consistentes: tabelas em plural snake_case, campos camelCase mapeados para snake_case, e relacionamentos explicitos com IDs renomeados semanticamente.

## Rules

1. **Instale CLI como devDependency e client como dependency** — `prisma` e `@prisma/client` sao pacotes separados, porque a CLI so roda em dev (migrations, studio) enquanto o client roda em producao
2. **Adicione `.env` ao `.gitignore` imediatamente** — o Prisma init cria um `.env` com `DATABASE_URL` contendo credenciais, que nunca devem ir pro repositorio
3. **Use `@@map` em todo model para plural snake_case** — `model User` mapeia para `@@map("users")`, porque o banco deve seguir convencao SQL padrao (lowercase, plural, underscore)
4. **Use `@map` em campos camelCase** — `createdAt DateTime` precisa de `@map("created_at")`, porque colunas no banco devem ser snake_case
5. **Renomeie foreign keys semanticamente** — troque `userId` por `authorId` quando o relacionamento tem significado semantico, porque `authorId` comunica a relacao melhor que `userId` generico
6. **Use `@updatedAt` do Prisma para atualizacao automatica** — o campo `updatedAt` com `@updatedAt` e preenchido automaticamente pelo Prisma, eliminando logica manual

## How to write

### Schema com convencoes corretas

```prisma
model User {
  id       String     @id @default(uuid())
  name     String
  email    String     @unique
  password String
  questions Question[]

  @@map("users")
}

model Question {
  id        String    @id @default(uuid())
  title     String
  slug      String    @unique
  content   String
  createdAt DateTime  @default(now()) @map("created_at")
  updatedAt DateTime? @updatedAt @map("updated_at")
  authorId  String    @map("author_id")
  author    User      @relation(fields: [authorId], references: [id])

  @@map("questions")
}
```

### Workflow de instalacao

```bash
# 1. Instalar dependencias
pnpm install prisma -D
pnpm install @prisma/client

# 2. Inicializar
pnpm prisma init

# 3. Configurar .env com DATABASE_URL
# 4. Criar models no schema.prisma
# 5. Rodar migration
pnpm prisma migrate dev --name create-users-and-questions

# 6. Visualizar dados
pnpm prisma studio
```

## Example

**Before (sem convencoes):**
```prisma
model User {
  id       String @id @default(uuid())
  email    String @unique
  password String
}

model Question {
  id        String   @id @default(uuid())
  title     String
  createdAt DateTime @default(now())
  userId    String
  user      User     @relation(fields: [userId], references: [id])
}
```

**After (com convencoes aplicadas):**
```prisma
model User {
  id        String     @id @default(uuid())
  email     String     @unique
  password  String
  questions Question[]

  @@map("users")
}

model Question {
  id        String    @id @default(uuid())
  title     String
  createdAt DateTime  @default(now()) @map("created_at")
  authorId  String    @map("author_id")
  author    User      @relation(fields: [authorId], references: [id])

  @@map("questions")
}
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Novo model criado | Adicionar `@@map("nome_plural_snake_case")` |
| Campo camelCase | Adicionar `@map("snake_case")` |
| Foreign key generica (`userId`) | Renomear para nome semantico (`authorId`) |
| Campo de data de criacao | `@default(now())` + `@map("created_at")` |
| Campo de data de atualizacao | `@updatedAt` + opcional (`?`) + `@map("updated_at")` |
| Primeira migration | Nome descritivo: `create-users-and-questions` |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| Model sem `@@map` | `@@map("table_name")` em todo model |
| `createdAt` sem `@map` | `createdAt @map("created_at")` |
| `userId` em relacao author | `authorId @map("author_id")` |
| `.env` sem `.gitignore` | Adicionar `.env` ao `.gitignore` antes de commitar |
| `prisma` como dependency normal | `prisma` como devDependency (`-D`) |
| `updatedAt` sem `@updatedAt` | Usar decorator `@updatedAt` para auto-fill |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
