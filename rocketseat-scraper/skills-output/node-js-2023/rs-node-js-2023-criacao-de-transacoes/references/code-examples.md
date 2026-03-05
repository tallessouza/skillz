# Code Examples: Criacao de Transacoes

## Exemplo completo: arquivo de rotas de transacoes

```typescript
// src/routes/transactions.ts
import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { randomUUID } from 'node:crypto'
import { knex } from '../database'

export async function transactionsRoutes(app: FastifyInstance) {
  app.post('/', async (request, reply) => {
    const createTransactionBodySchema = z.object({
      title: z.string(),
      amount: z.number(),
      type: z.enum(['credit', 'debit']),
    })

    const { title, amount, type } = createTransactionBodySchema.parse(
      request.body,
    )

    await knex('transactions').insert({
      id: randomUUID(),
      title,
      amount: type === 'credit' ? amount : amount * -1,
    })

    return reply.status(201).send()
  })
}
```

## Exemplo completo: registro do plugin com prefix

```typescript
// src/server.ts
import fastify from 'fastify'
import { transactionsRoutes } from './routes/transactions'

const app = fastify()

app.register(transactionsRoutes, {
  prefix: 'transactions',
})

app.listen({ port: 3333 }).then(() => {
  console.log('HTTP Server Running!')
})
```

## Schema Zod com enum — detalhe

```typescript
// z.enum restringe os valores aceitos
const typeSchema = z.enum(['credit', 'debit'])

// Equivalente a: type Type = 'credit' | 'debit'
// Se o usuario enviar 'creditt' (typo), o parse lanca erro
```

## Normalizacao do amount — logica detalhada

```typescript
// Input do usuario: { title: "Freelancer", amount: 8000, type: "credit" }
// No banco: amount = 8000 (positivo)

// Input do usuario: { title: "Aluguel", amount: 2000, type: "debit" }
// No banco: amount = -2000 (negativo, multiplicado por -1)

// Depois, para calcular o resumo:
const summary = await knex('transactions').sum('amount', { as: 'amount' }).first()
// Resultado: 8000 + (-2000) = 6000
// Sem precisar de logica condicional!
```

## Teste via Insomnia/HTTP client

```http
POST http://localhost:3333/transactions
Content-Type: application/json

{
  "title": "Freelancer",
  "amount": 8000,
  "type": "credit"
}

# Resposta esperada: 201 Created (sem corpo)
```

```http
# Teste com tipo invalido
POST http://localhost:3333/transactions
Content-Type: application/json

{
  "title": "Freelancer",
  "amount": 8000,
  "type": "creditt"
}

# Resposta: 500 Internal Server Error (Zod rejeita o enum invalido)
```

## Duas formas de importar crypto

```typescript
// Forma 1: importar modulo inteiro
import crypto from 'node:crypto'
const id = crypto.randomUUID()

// Forma 2: importar funcao especifica (preferida)
import { randomUUID } from 'node:crypto'
const id = randomUUID()
```