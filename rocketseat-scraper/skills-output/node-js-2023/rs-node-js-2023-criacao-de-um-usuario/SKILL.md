---
name: rs-node-js-2023-criacao-de-um-usuario
description: "Generates user registration routes with Fastify, Prisma, and Zod validation. Use when user asks to 'create a user route', 'register endpoint', 'signup API', 'user CRUD', or 'Fastify POST route with validation'. Applies patterns: Zod body parsing with z.parse() for auto-throw, Prisma client isolation in lib/, conditional query logging, 201 empty response for creation endpoints. Make sure to use this skill whenever building registration or creation endpoints with Fastify and Prisma. Not for authentication flows, JWT tokens, session management, or frontend forms."
---

# Criacao de Usuario — Rota de Registro

> Toda rota de criacao segue: validar input com Zod parse (auto-throw) → executar no banco → retornar 201 vazio.

## Rules

1. **Isole o Prisma Client em `src/lib/prisma.ts`** — exportar uma unica instancia, porque centraliza configuracao (logs, middleware) e evita multiplas conexoes
2. **Use `z.parse()` em vez de `safeParse()`** — parse da throw automatico no erro, eliminando codigo de tratamento manual no handler
3. **Retorne status 201 com body vazio em rotas de criacao** — operacoes de criacao/atualizacao/remocao nao precisam devolver dados do banco, porque o cliente ja tem os dados que enviou
4. **Valide email com `z.string().email()` e senha com `.min(6)`** — validacao no schema impede dados invalidos antes de tocar no banco
5. **Habilite log de queries apenas em desenvolvimento** — `log: env.NODE_ENV === 'dev' ? ['query'] : []`, porque em producao query logs sao ruido e impactam performance
6. **Nunca armazene senha em texto puro** — use hash (bcrypt/argon2) antes do `create`, mesmo em MVPs, porque dados vazam

## How to write

### Prisma Client isolado

```typescript
// src/lib/prisma.ts
import { PrismaClient } from '@prisma/client'
import { env } from '@/env'

export const prisma = new PrismaClient({
  log: env.NODE_ENV === 'dev' ? ['query'] : [],
})
```

### Rota de registro com Zod + Prisma

```typescript
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { hash } from 'bcryptjs'

app.post('/users', async (request, reply) => {
  const registerBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
  })

  const { name, email, password } = registerBodySchema.parse(request.body)

  const passwordHash = await hash(password, 6)

  await prisma.user.create({
    data: { name, email, password_hash: passwordHash },
  })

  return reply.status(201).send()
})
```

## Example

**Before (sem validacao, sem isolamento):**
```typescript
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

app.post('/users', async (request, reply) => {
  const { name, email, password } = request.body as any
  await prisma.user.create({
    data: { name, email, password_hash: password },
  })
  return reply.send({ ok: true })
})
```

**After (com este skill aplicado):**
```typescript
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { hash } from 'bcryptjs'

app.post('/users', async (request, reply) => {
  const registerBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
  })

  const { name, email, password } = registerBodySchema.parse(request.body)
  const passwordHash = await hash(password, 6)

  await prisma.user.create({
    data: { name, email, password_hash: passwordHash },
  })

  return reply.status(201).send()
})
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Rota de criacao (POST) | Retorne 201 com body vazio |
| Rota de leitura (GET) | Retorne 200 com dados |
| Validacao de body | `z.parse(request.body)` — throw automatico |
| Validacao de params/query | Mesmo padrao: schema separado + parse |
| Prisma usado em multiplos arquivos | Isole em `src/lib/prisma.ts` |
| Ambiente dev precisa de debug | Habilite `log: ['query']` condicional |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `request.body as any` | `schema.parse(request.body)` |
| `new PrismaClient()` em cada arquivo | `import { prisma } from '@/lib/prisma'` |
| `password_hash: password` (texto puro) | `password_hash: await hash(password, 6)` |
| `reply.send({ ok: true })` em criacao | `reply.status(201).send()` |
| `safeParse` + if manual no handler | `parse()` com throw automatico |
| `log: ['query']` em producao | `log: env.NODE_ENV === 'dev' ? ['query'] : []` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
