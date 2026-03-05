# Code Examples: Validando Existencia do Cookie com PreHandler

## Exemplo 1: Middleware completo

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

## Exemplo 2: Rota de listagem com preHandler e filtro

```typescript
app.get(
  '/',
  {
    preHandler: [checkSessionIdExists],
  },
  async (request) => {
    const { sessionId } = request.cookies

    const transactions = await knex('transactions')
      .where('session_id', sessionId)
      .select()

    return { transactions }
  },
)
```

## Exemplo 3: Rota de busca unica com where composto

```typescript
app.get(
  '/:id',
  {
    preHandler: [checkSessionIdExists],
  },
  async (request) => {
    const { id } = request.params
    const { sessionId } = request.cookies

    const transaction = await knex('transactions')
      .where({
        session_id: sessionId,
        id,
      })
      .first()

    return { transaction }
  },
)
```

## Exemplo 4: Rota de resumo com filtro por sessao

```typescript
app.get(
  '/summary',
  {
    preHandler: [checkSessionIdExists],
  },
  async (request) => {
    const { sessionId } = request.cookies

    const summary = await knex('transactions')
      .where('session_id', sessionId)
      .sum('amount', { as: 'amount' })
      .first()

    return { summary }
  },
)
```

## Exemplo 5: Estrutura de pastas

```
src/
├── middlewares/
│   └── check-session-id-exists.ts
├── routes/
│   └── transactions.ts
├── database.ts
└── server.ts
```

## Exemplo 6: Import no arquivo de rotas

```typescript
// src/routes/transactions.ts
import { FastifyInstance } from 'fastify'
import { knex } from '../database'
import { checkSessionIdExists } from '../middlewares/check-session-id-exists'

export async function transactionsRoutes(app: FastifyInstance) {
  app.get(
    '/',
    { preHandler: [checkSessionIdExists] },
    async (request) => {
      // ...
    },
  )

  app.get(
    '/:id',
    { preHandler: [checkSessionIdExists] },
    async (request) => {
      // ...
    },
  )

  app.get(
    '/summary',
    { preHandler: [checkSessionIdExists] },
    async (request) => {
      // ...
    },
  )

  // POST para criar transacao NAO usa o preHandler
  // porque e ela quem cria o cookie
  app.post('/', async (request, reply) => {
    // ...
  })
}
```

## Exemplo 7: Validacao inline (ANTES — codigo duplicado)

```typescript
// Este padrao estava em TODAS as 3 rotas de leitura
app.get('/', async (request, reply) => {
  const sessionId = request.cookies.sessionId

  if (!sessionId) {
    return reply.status(401).send({
      error: 'Unauthorized.',
    })
  }

  const transactions = await knex('transactions')
    .where('session_id', sessionId)
    .select()

  return { transactions }
})
```