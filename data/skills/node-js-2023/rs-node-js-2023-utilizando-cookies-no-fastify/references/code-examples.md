# Code Examples: Utilizando Cookies no Fastify

## Instalação

```bash
npm install @fastify/cookie
```

## Setup completo no server.ts

```typescript
import fastify from 'fastify'
import cookie from '@fastify/cookie'
import { transactionsRoutes } from './routes/transactions'

const app = fastify()

// Plugin de cookie ANTES das rotas
app.register(cookie)

// Rotas DEPOIS
app.register(transactionsRoutes, {
  prefix: 'transactions',
})
```

## Rota de criação com cookie

```typescript
import { randomUUID } from 'node:crypto'
import { FastifyInstance } from 'fastify'
import { knex } from '../database'

export async function transactionsRoutes(app: FastifyInstance) {
  app.post('/', async (request, reply) => {
    const { title, amount, type } = createTransactionBodySchema.parse(
      request.body,
    )

    // 1. Verificar se já existe sessionId nos cookies
    let sessionId = request.cookies.sessionId

    // 2. Se não existir, criar novo e salvar no cookie
    if (!sessionId) {
      sessionId = randomUUID()

      reply.cookie('sessionId', sessionId, {
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 7 days
      })
    }

    // 3. Inserir transação com session_id
    await knex('transactions').insert({
      id: randomUUID(),
      title,
      amount: type === 'credit' ? amount : amount * -1,
      session_id: sessionId,
    })

    return reply.status(201).send()
  })
}
```

## Leitura do cookie nas rotas de listagem

```typescript
app.get('/', async (request) => {
  const { sessionId } = request.cookies

  const transactions = await knex('transactions')
    .where('session_id', sessionId)
    .select()

  return { transactions }
})

app.get('/:id', async (request) => {
  const { id } = getTransactionParamsSchema.parse(request.params)
  const { sessionId } = request.cookies

  const transaction = await knex('transactions')
    .where({
      id,
      session_id: sessionId,
    })
    .first()

  return { transaction }
})
```

## Opções de expiração comparadas

```typescript
// Opção 1: expires (data exata — menos comum)
reply.cookie('sessionId', sessionId, {
  path: '/',
  expires: new Date(2023, 11, 1, 8, 0, 0), // 1 dez 2023 às 8h
})

// Opção 2: maxAge (duração relativa — preferido)
reply.cookie('sessionId', sessionId, {
  path: '/',
  maxAge: 60 * 60 * 24 * 7, // 7 days (em segundos)
})
```

## Composição legível do maxAge

```typescript
// Cada multiplicação adiciona uma unidade de tempo:
const maxAge =
  60 *    // 1 minuto (60 segundos)
  60 *    // 1 hora (60 minutos)
  24 *    // 1 dia (24 horas)
  7       // 7 dias

// Exemplos comuns:
60 * 60               // 1 hour
60 * 60 * 24          // 1 day
60 * 60 * 24 * 7      // 7 days
60 * 60 * 24 * 30     // 30 days
```

## Opções de path do cookie

```typescript
// Todas as rotas podem acessar (recomendado)
reply.cookie('sessionId', sessionId, {
  path: '/',
})

// Apenas rotas que começam com /transactions
reply.cookie('sessionId', sessionId, {
  path: '/transactions',
})
```

## Fluxo completo no Insomnia/cliente

1. **POST /transactions** (primeira vez) → resposta inclui cookie `sessionId=<uuid>`
2. **GET /transactions** → cookie é enviado automaticamente, lista apenas transações do sessionId
3. **POST /transactions** (segunda vez) → cookie já existe, reutiliza o mesmo sessionId
4. Todas as transações ficam vinculadas ao mesmo sessionId