---
name: rs-saas-nextjs-rbac-rota-cadastro-usuario
description: "Enforces best practices for user registration routes in Node.js/Fastify APIs with Prisma and bcrypt. Use when user asks to 'create a signup route', 'implement user registration', 'hash passwords', 'check duplicate email', or 'create account endpoint'. Applies patterns: Prisma singleton, email uniqueness check before insert, bcrypt hashing with explicit rounds, proper HTTP status codes (409/201). Make sure to use this skill whenever building authentication or user creation endpoints. Not for login, session management, JWT tokens, or OAuth flows."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: saa-s-next-js-rbac
  module: api-routes
  tags: [saas, fastify, api, routes, prisma, nextjs, zod, jwt, oauth, github]
---

# Rota de Cadastro de Usuario

> Toda rota de criacao de usuario segue o fluxo: validar input → verificar duplicidade → hash da senha → criar registro → retornar 201.

## Rules

1. **Prisma Client como singleton em `lib/prisma.ts`** — nunca instancie `new PrismaClient()` dentro de rotas, porque cada instancia abre um pool de conexoes separado
2. **Verifique email duplicado ANTES de criar** — use `findUnique` pelo email e retorne erro especifico, porque o erro do banco (unique constraint) e generico e vaza detalhes internos
3. **Use bcrypt.js com rounds explicitos** — nunca use o default sem declarar, porque o numero de rounds impacta diretamente performance e seguranca
4. **6 rounds para desenvolvimento, 8-12 para producao** — rounds muito altos travam o event loop, rounds muito baixos sao vulneraveis a brute force
5. **Retorne 201 para criacao bem-sucedida** — nunca 200, porque 201 Created e o status semanticamente correto para recursos criados
6. **Nunca retorne o hash da senha na response** — envie apenas confirmacao de sucesso

## How to write

### Prisma singleton

```typescript
// lib/prisma.ts
import { PrismaClient } from '@prisma/client'

export const prisma = new PrismaClient({
  log: ['query'],
})
```

### Rota de registro completa

```typescript
import { hash } from 'bcryptjs'
import { prisma } from '@/lib/prisma'

app.post('/users', async (request, reply) => {
  const { name, email, password } = request.body

  const userWithSameEmail = await prisma.user.findUnique({
    where: { email },
  })

  if (userWithSameEmail) {
    return reply.status(409).send({
      message: 'User with same email already exists.',
    })
  }

  const passwordHash = await hash(password, 6)

  await prisma.user.create({
    data: { name, email, passwordHash },
  })

  return reply.status(201).send()
})
```

## Example

**Before (erros comuns):**
```typescript
app.post('/users', async (req, reply) => {
  const { name, email, password } = req.body
  // Sem verificacao de duplicidade
  // Hash sem rounds explicitos
  const user = await prisma.user.create({
    data: { name, email, passwordHash: await hash(password) },
  })
  return reply.send(user) // Retorna 200 e expoe dados
})
```

**After (com esta skill aplicada):**
```typescript
app.post('/users', async (request, reply) => {
  const { name, email, password } = request.body

  const userWithSameEmail = await prisma.user.findUnique({
    where: { email },
  })

  if (userWithSameEmail) {
    return reply.status(409).send({
      message: 'User with same email already exists.',
    })
  }

  const passwordHash = await hash(password, 6)

  await prisma.user.create({
    data: { name, email, passwordHash },
  })

  return reply.status(201).send()
})
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Validacao de body ja feita por Zod/schema | Confie nos dados tipados, nao revalide manualmente |
| Import paths ficando longos (`../../..`) | Configure `baseUrl` e `paths` no tsconfig com alias `@/` |
| Precisa do usuario criado depois | Retorne apenas `id` do `prisma.user.create`, nunca o hash |
| Ambiente de producao | Aumente rounds do bcrypt para 8-12 |
| Campo opcional (ex: avatar) | Nao inclua na criacao, trate em rota separada |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|---------------------|
| `new PrismaClient()` dentro da rota | `import { prisma } from '@/lib/prisma'` |
| `await hash(password)` sem rounds | `await hash(password, 6)` |
| `reply.send(user)` expondo tudo | `reply.status(201).send()` |
| `reply.status(400)` para duplicado | `reply.status(409)` (Conflict) |
| `try/catch` no unique constraint | `findUnique` antes do `create` |
| `import from '../../../lib/prisma'` | `import from '@/lib/prisma'` com alias |

## Troubleshooting

### Rota retorna 404
**Symptom:** Endpoint nao encontrado mesmo apos definir a rota
**Cause:** Rota nao foi registrada com `app.register()` no server.ts
**Fix:** Adicione `app.register(nomeDaRota)` no arquivo do servidor

### Erro de foreign key constraint
**Symptom:** Prisma lanca erro ao criar registro com referencia invalida
**Cause:** O ID referenciado nao existe na tabela relacionada
**Fix:** Verifique que o registro pai existe antes de criar o registro filho

### Token invalido ou expirado
**Symptom:** Requisicao autenticada retorna 401
**Cause:** Token JWT expirou ou foi assinado com secret diferente
**Fix:** Verifique que o JWT_SECRET e o mesmo entre geracao e verificacao, e que o token nao expirou

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
