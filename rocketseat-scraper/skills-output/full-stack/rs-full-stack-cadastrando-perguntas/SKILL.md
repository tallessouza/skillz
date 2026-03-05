---
name: rs-full-stack-cadastrando-perguntas
description: "Applies Prisma ORM create patterns when building POST endpoints for related entities. Use when user asks to 'create an endpoint', 'insert data with Prisma', 'build a POST route', or 'register a record with foreign key'. Enforces proper body extraction, Prisma create with relations, and controller structure. Make sure to use this skill whenever creating POST endpoints that insert records with foreign keys using Prisma. Not for queries, updates, deletes, or schema/migration definitions."
---

# Cadastrando Registros com Prisma (Create com Relações)

> Ao criar endpoints POST com Prisma, extraia os campos do body, use `prisma.model.create` com data tipada, e sempre inclua a foreign key vinda do body.

## Rules

1. **Extraia campos nomeados do body** — `const { title, content, user_id } = request.body`, porque desestruturação explicita documenta o contrato da API
2. **Use `prisma.model.create({ data })` diretamente** — passe apenas os campos necessarios, porque o Prisma valida tipos e campos obrigatorios em tempo de compilacao
3. **Mantenha nomes de foreign key consistentes com o schema** — se o schema usa `user_id`, o body deve enviar `user_id`, porque inconsistencia causa erros silenciosos
4. **Nao passe campos auto-gerados** — `id`, `created_at`, `updated_at` sao gerados pelo Prisma/banco, porque passa-los manualmente causa conflitos
5. **Importe o client Prisma de um modulo centralizado** — `import { prisma } from "@prisma"`, porque instancias multiplas causam connection pool exhaustion

## How to write

### Controller de criacao com Prisma

```typescript
import { prisma } from "@prisma"

async create(request, reply) {
  const { title, content, user_id } = request.body

  const question = await prisma.questions.create({
    data: {
      title,
      content,
      user_id,
    },
  })

  return reply.status(201).send(question)
}
```

### Estrutura de rotas apontando para o controller

```typescript
// routes/questions.ts
router.post("/questions", questionsController.create)
```

## Example

**Before (campos misturados, sem desestruturacao):**
```typescript
async create(request, reply) {
  const question = await prisma.questions.create({
    data: {
      title: request.body.title,
      content: request.body.content,
      user_id: request.body.userId, // nome inconsistente com schema
      id: "abc-123", // campo auto-gerado passado manualmente
    },
  })
}
```

**After (com esta skill aplicada):**
```typescript
async create(request, reply) {
  const { title, content, user_id } = request.body

  const question = await prisma.questions.create({
    data: {
      title,
      content,
      user_id,
    },
  })

  return reply.status(201).send(question)
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Endpoint POST com foreign key | Extraia FK do body, passe no data do create |
| Precisa verificar o registro criado | Use Prisma Studio ou retorne o objeto criado na response |
| Autocomplete dos campos disponiveis | Use `Ctrl+Space` apos a virgula dentro de `data: {}` para ver campos do modelo |
| Campo opcional no schema | Omita do data — Prisma usa o default |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `request.body.title` repetido inline | `const { title } = request.body` desestruturado |
| `id: uuid()` no create | Omita — Prisma gera automaticamente |
| `created_at: new Date()` no create | Omita — `@default(now())` no schema cuida disso |
| `userId` quando schema usa `user_id` | Use exatamente o nome do campo no schema |
| `new PrismaClient()` no controller | Importe instancia centralizada de `@prisma` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes