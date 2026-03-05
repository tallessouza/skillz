# Code Examples: Plugins do Fastify

## Exemplo 1: Estrutura basica de projeto

```
src/
├── server.ts          # Ponto de entrada, registra plugins
├── database.ts        # Configuracao do banco (knex)
└── routes/
    └── transactions.ts # Plugin de rotas de transacoes
```

## Exemplo 2: Plugin de rotas (da aula)

```typescript
// src/routes/transactions.ts
import { FastifyInstance } from 'fastify'
import { knex } from '../database'

export async function transactionsRoutes(app: FastifyInstance) {
  app.get('/hello', async () => {
    const transactions = await knex('transactions').select('*')
    return transactions
  })
}
```

Pontos-chave:
- `async` e obrigatorio
- `FastifyInstance` tipa o parametro
- `knex` e importado localmente no plugin

## Exemplo 3: Registro no server (da aula)

```typescript
// src/server.ts
import fastify from 'fastify'
import { transactionsRoutes } from './routes/transactions'

const app = fastify()

app.register(transactionsRoutes)

app.listen({
  port: 3333,
}).then(() => {
  console.log('HTTP Server Running!')
})
```

## Exemplo 4: Multiplos plugins com ordem

```typescript
// src/server.ts
import fastify from 'fastify'
import { databasePlugin } from './plugins/database'
import { authPlugin } from './plugins/auth'
import { transactionsRoutes } from './routes/transactions'
import { usersRoutes } from './routes/users'

const app = fastify()

// 1. Infraestrutura primeiro
app.register(databasePlugin)
app.register(authPlugin)

// 2. Rotas depois
app.register(transactionsRoutes)
app.register(usersRoutes)

app.listen({ port: 3333 })
```

## Exemplo 5: Plugin com prefixo de rota

```typescript
// Registro com prefixo — todas as rotas do plugin ficam sob /transactions
app.register(transactionsRoutes, {
  prefix: 'transactions',
})

// Dentro do plugin, as rotas sao relativas:
export async function transactionsRoutes(app: FastifyInstance) {
  app.get('/', async () => {
    // GET /transactions
  })

  app.post('/', async (request, reply) => {
    // POST /transactions
  })

  app.get('/:id', async (request, reply) => {
    // GET /transactions/:id
  })
}
```

## Exemplo 6: O que NAO fazer

```typescript
// ERRADO: Exportar app do server
// src/server.ts
export const app = fastify() // NAO FACA ISSO

// src/routes/transactions.ts
import { app } from '../server' // INVERTEU A DEPENDENCIA
app.get('/hello', ...) // Funciona mas quebra a arquitetura
```

O fluxo correto e sempre: **server importa rotas, nunca rotas importam server**.

## Exemplo 7: Plugin sincrono (erro comum)

```typescript
// ERRADO: Faltou async
export function transactionsRoutes(app: FastifyInstance) {
  app.get('/hello', async () => {
    return { hello: 'world' }
  })
}
// O Fastify pode nao carregar este plugin corretamente
```

```typescript
// CORRETO: Com async
export async function transactionsRoutes(app: FastifyInstance) {
  app.get('/hello', async () => {
    return { hello: 'world' }
  })
}
```