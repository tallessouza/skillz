---
name: rs-node-js-2023-criacao-de-transacoes
description: "Applies Fastify transaction creation patterns when building REST API routes with Node.js. Use when user asks to 'create a route', 'insert into database', 'validate request body', 'create transaction endpoint', or 'build POST route with Fastify'. Enforces Zod body validation, Knex insert patterns, route prefixing via plugins, and proper HTTP status codes. Make sure to use this skill whenever creating Fastify routes that receive and persist data. Not for frontend code, authentication, or database schema design."
---

# Criacao de Transacoes — Fastify + Zod + Knex

> Toda rota de criacao valida o body com Zod antes de qualquer operacao no banco, e retorna 201 sem corpo.

## Rules

1. **Use route prefix no plugin** — registre plugins com `{ prefix: 'transactions' }` e defina rotas internas sem o prefixo, porque todas as rotas do plugin compartilham o mesmo namespace
2. **Valide o body com Zod antes de qualquer logica** — use `schema.parse(request.body)` no inicio do handler, porque o parse lanca erro automaticamente se os dados sao invalidos, impedindo execucao do codigo abaixo
3. **Desestruture apos validacao** — extraia `{ title, amount, type }` do resultado do parse, porque o Zod ja inferiu os tipos e a IDE fornece autocomplete
4. **Use enum para valores finitos** — `z.enum(['credit', 'debit'])` em vez de `z.string()`, porque restringe os valores aceitos no nivel da validacao
5. **Normalize valores no insert** — armazene debito como valor negativo (`amount * -1`), porque simplifica somas futuras sem precisar de logica condicional na leitura
6. **Gere UUID com crypto nativo** — `crypto.randomUUID()` do Node, sem dependencias externas
7. **Retorne 201 sem corpo em rotas de criacao** — `reply.status(201).send()`, porque o padrao HTTP 201 indica recurso criado e geralmente nao exige retorno de dados

## How to write

### Plugin com prefix

```typescript
import { FastifyInstance } from 'fastify'

export async function transactionsRoutes(app: FastifyInstance) {
  app.post('/', async (request, reply) => {
    // rotas internas sem prefix — o prefix vem do register
  })
}

// No server principal:
app.register(transactionsRoutes, { prefix: 'transactions' })
```

### Validacao de body com Zod

```typescript
import { z } from 'zod'

const createTransactionBodySchema = z.object({
  title: z.string(),
  amount: z.number(),
  type: z.enum(['credit', 'debit']),
})

// Dentro do handler:
const { title, amount, type } = createTransactionBodySchema.parse(request.body)
```

### Insert com Knex e normalizacao de valor

```typescript
import { randomUUID } from 'node:crypto'
import { knex } from '../database'

await knex('transactions').insert({
  id: randomUUID(),
  title,
  amount: type === 'credit' ? amount : amount * -1,
})

return reply.status(201).send()
```

## Example

**Before (sem validacao, tipos desconhecidos):**
```typescript
app.post('/transactions', async (request, reply) => {
  const { title, amount, type } = request.body as any
  await knex('transactions').insert({ id: randomUUID(), title, amount })
  return reply.send({ ok: true })
})
```

**After (com este skill aplicado):**
```typescript
app.post('/', async (request, reply) => {
  const createTransactionBodySchema = z.object({
    title: z.string(),
    amount: z.number(),
    type: z.enum(['credit', 'debit']),
  })

  const { title, amount, type } = createTransactionBodySchema.parse(request.body)

  await knex('transactions').insert({
    id: randomUUID(),
    title,
    amount: type === 'credit' ? amount : amount * -1,
  })

  return reply.status(201).send()
})
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Rota de criacao (POST) | Valide body com Zod, retorne 201 sem corpo |
| Valor que pode ser positivo ou negativo | Normalize no insert, nao no select |
| Grupo de rotas com mesmo prefixo | Use plugin com `{ prefix }` |
| Body do request e `unknown` | Sempre passe por `schema.parse()` antes de usar |
| ID de novo recurso | `randomUUID()` de `node:crypto` |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `request.body as any` | `schema.parse(request.body)` |
| `app.post('/transactions', ...)` dentro do plugin | `app.post('/', ...)` com prefix no register |
| `reply.send({ ok: true })` em criacao | `reply.status(201).send()` |
| `if (type === 'debit') amount = -amount` (mutacao) | `amount: type === 'credit' ? amount : amount * -1` |
| `uuid()` de lib externa | `randomUUID()` de `node:crypto` |
| `z.string()` para campo com valores finitos | `z.enum(['credit', 'debit'])` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/node-js/rs-node-js-2023-criacao-de-transacoes/references/deep-explanation.md)
- [Code examples](../../../data/skills/node-js/rs-node-js-2023-criacao-de-transacoes/references/code-examples.md)
