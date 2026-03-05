---
name: rs-node-js-2023-validando-cookie
description: "Applies Fastify preHandler middleware pattern for cookie/session validation when writing Node.js API routes. Use when user asks to 'protect routes', 'validate session', 'check authentication cookie', 'add middleware to Fastify', or 'reuse route validation'. Implements preHandler array pattern, cookie existence check, and 401 unauthorized responses. Make sure to use this skill whenever creating authenticated Fastify routes or sharing validation logic across multiple routes. Not for JWT token validation, OAuth flows, or Express.js middleware."
---

# Validando Existencia do Cookie com PreHandler

> Extraia validacoes compartilhadas entre rotas para funcoes preHandler reutilizaveis, nunca duplique logica de verificacao dentro de cada handler.

## Rules

1. **Crie middlewares como funcoes async separadas** — em `src/middlewares/`, porque funcoes isoladas sao testáveis e reutilizáveis entre rotas
2. **Tipe request e reply manualmente no middleware** — `FastifyRequest` e `FastifyReply` de `fastify`, porque fora do contexto de `app.get()` o TypeScript nao infere os tipos
3. **Retorne 401 quando sessionId nao existir** — `reply.status(401).send({ error: 'Unauthorized' })`, porque 401 indica que o usuario nao esta autenticado
4. **Nao faca return quando a validacao passa** — o comportamento padrao do preHandler e continuar a requisicao se nenhum return for feito
5. **Use preHandler como array no segundo parametro** — `{ preHandler: [checkSessionIdExists] }`, porque aceita multiplos interceptadores
6. **Filtre dados por sessionId em todas as queries** — `.where({ session_id: sessionId })`, porque cada usuario so deve ver seus proprios dados

## How to write

### Middleware de validacao

```typescript
// src/middlewares/check-session-id-exists.ts
import { FastifyRequest, FastifyReply } from 'fastify'

export async function checkSessionIdExists(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const sessionId = request.cookies.sessionId

  if (!sessionId) {
    return reply.status(401).send({
      error: 'Unauthorized.',
    })
  }
}
```

### Rota protegida com preHandler

```typescript
app.get(
  '/',
  { preHandler: [checkSessionIdExists] },
  async (request) => {
    const { sessionId } = request.cookies

    const transactions = await knex('transactions')
      .where('session_id', sessionId)
      .select()

    return { transactions }
  },
)
```

### Where composto (multiplas condicoes)

```typescript
app.get(
  '/:id',
  { preHandler: [checkSessionIdExists] },
  async (request) => {
    const { id } = request.params
    const { sessionId } = request.cookies

    const transaction = await knex('transactions')
      .where({ id, session_id: sessionId })
      .first()

    return { transaction }
  },
)
```

## Example

**Before (validacao duplicada em cada rota):**
```typescript
app.get('/', async (request, reply) => {
  const sessionId = request.cookies.sessionId
  if (!sessionId) {
    return reply.status(401).send({ error: 'Unauthorized.' })
  }
  const transactions = await knex('transactions').select()
  return { transactions }
})

app.get('/summary', async (request, reply) => {
  const sessionId = request.cookies.sessionId
  if (!sessionId) {
    return reply.status(401).send({ error: 'Unauthorized.' })
  }
  // mesma validacao repetida...
})
```

**After (preHandler reutilizavel + filtro por sessionId):**
```typescript
import { checkSessionIdExists } from '../middlewares/check-session-id-exists'

app.get('/', { preHandler: [checkSessionIdExists] }, async (request) => {
  const { sessionId } = request.cookies
  const transactions = await knex('transactions')
    .where('session_id', sessionId)
    .select()
  return { transactions }
})

app.get('/summary', { preHandler: [checkSessionIdExists] }, async (request) => {
  const { sessionId } = request.cookies
  const summary = await knex('transactions')
    .where('session_id', sessionId)
    .sum('amount', { as: 'amount' })
    .first()
  return { summary }
})
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Validacao usada em 2+ rotas | Extrair para middleware em `src/middlewares/` |
| Rota precisa de dados do usuario | Filtrar query com `.where('session_id', sessionId)` |
| Multiplas condicoes no where | Usar objeto: `.where({ id, session_id: sessionId })` |
| Middleware precisa de tipos | Importar `FastifyRequest`, `FastifyReply` de `fastify` |
| Multiplos middlewares na rota | Adicionar ao array: `{ preHandler: [fn1, fn2] }` |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| Copiar validacao de cookie em cada handler | Extrair para `checkSessionIdExists` middleware |
| `app.get('/', async (req, reply) => { if (!cookie)... })` | `app.get('/', { preHandler: [check] }, async (req) => {...})` |
| `.where('id', id).where('session_id', sid)` | `.where({ id, session_id: sessionId })` |
| Retornar 403 para usuario sem cookie | Retornar 401 (nao autenticado, nao nao autorizado) |
| Listar todas as transacoes sem filtro de sessao | Sempre filtrar por `session_id` do cookie |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
