---
name: rs-full-stack-inserindo-usuario
description: "Applies Prisma ORM user insertion patterns when writing create operations with Prisma Client. Use when user asks to 'insert a record', 'create a user', 'save to database with Prisma', 'setup Prisma client', or 'configure ORM connection'. Enforces proper client setup with logging, data property usage, and unique constraint handling. Make sure to use this skill whenever generating Prisma create operations or setting up PrismaClient instances. Not for raw SQL queries, Drizzle ORM, TypeORM, or non-database code."
---

# Inserindo Registros com Prisma ORM

> Ao criar registros com Prisma, configure o client com logging de queries e use a propriedade `data` explicitamente no create.

## Rules

1. **Centralize o PrismaClient em um unico arquivo** — crie `src/prisma.ts` exportando uma instancia unica, porque evita multiplas conexoes e facilita importacao em toda a aplicacao
2. **Configure log de queries no client** — passe `log: ['query']` no construtor, porque permite ver o SQL real gerado nos bastidores e facilita debugging
3. **Use a propriedade `data` no create** — passe os campos dentro de `data: {}`, porque torna explicito quais dados estao sendo cadastrados e separa dados de outras opcoes como `select` ou `include`
4. **Aproveite restricoes do schema** — constraints como `@unique` sao enforced automaticamente pelo Prisma, porque o ORM lanca erro se a constraint for violada, sem necessidade de validacao manual
5. **Use async/await nas operacoes** — toda operacao do Prisma retorna Promise, porque acesso a banco e assincrono por natureza

## How to write

### Setup do PrismaClient

```typescript
// src/prisma.ts
import { PrismaClient } from '@prisma/client'

export const prisma = new PrismaClient({
  log: ['query'],
})
```

### Criar um registro

```typescript
import { prisma } from '@/prisma'

const { name, email } = request.body

await prisma.user.create({
  data: {
    name,
    email,
  },
})
```

## Example

**Before (sem Prisma, SQL manual):**
```typescript
import { db } from './database'

async function createUser(req, res) {
  const { name, email } = req.body
  await db.query('INSERT INTO users (name, email) VALUES ($1, $2)', [name, email])
  return res.status(201).send()
}
```

**After (com Prisma ORM):**
```typescript
import { prisma } from '@/prisma'

async function createUser(req, res) {
  const { name, email } = req.body

  await prisma.user.create({
    data: {
      name,
      email,
    },
  })

  return res.status(201).send()
}
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Precisa ver SQL gerado | Adicione `log: ['query']` no PrismaClient |
| Quer ver erros e info tambem | Use `log: ['error', 'info', 'query']` |
| Campo tem `@unique` no schema | Nao precisa validar duplicidade manualmente — Prisma lanca erro |
| Multiplos arquivos usam Prisma | Importe sempre do arquivo centralizado `src/prisma.ts` |
| Ambiente de producao | Remova `'query'` do log para evitar overhead |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `new PrismaClient()` em cada arquivo | Instancia unica exportada de `src/prisma.ts` |
| `prisma.user.create({ name, email })` | `prisma.user.create({ data: { name, email } })` |
| Validacao manual de unique antes do insert | Deixe o Prisma enforcar a constraint e trate o erro |
| SQL raw para inserts simples | `prisma.model.create()` com tipagem automatica |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre setup do client, logging e constraints
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes