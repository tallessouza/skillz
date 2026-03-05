# Code Examples: Testes E2E com Supertest

## Exemplo 1: Separacao app/server

### app.ts (ANTES — tudo junto no server.ts)
```typescript
// src/server.ts — tudo junto, problematico para testes
import fastify from 'fastify'
import { transactionsRoutes } from './routes/transactions'
import { env } from './env'

const app = fastify()
app.register(transactionsRoutes)

app.listen({ port: env.PORT }).then(() => {
  console.log('HTTP Server Running!')
})
```

### app.ts (DEPOIS — separado)
```typescript
// src/app.ts — apenas criacao e configuracao
import fastify from 'fastify'
import { transactionsRoutes } from './routes/transactions'

export const app = fastify()
app.register(transactionsRoutes)
```

### server.ts (DEPOIS — apenas listen)
```typescript
// src/server.ts — apenas boot do servidor
import { app } from './app'
import { env } from './env'

app.listen({ port: env.PORT }).then(() => {
  console.log('HTTP Server Running!')
})
```

## Exemplo 2: Primeiro teste E2E completo

```typescript
// test/transactions.spec.ts
import { it, beforeAll, afterAll, describe } from 'vitest'
import request from 'supertest'
import { app } from '../src/app'

describe('Transactions routes', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('user can create a new transaction', async () => {
    await request(app.server)
      .post('/transactions')
      .send({
        title: 'New transaction',
        amount: 5000,
        type: 'credit',
      })
      .expect(201)
  })
})
```

## Exemplo 3: Instalacao de dependencias

```bash
# SuperTest — requisicoes HTTP sem servidor real
npm install supertest -D

# Tipos TypeScript para SuperTest (icone DT no npm)
npm install @types/supertest -D
```

## Exemplo 4: Validacao de status code — duas formas

```typescript
// Forma 1: expect separado (util quando precisa inspecionar o body)
it('creates transaction and checks response', async () => {
  const response = await request(app.server)
    .post('/transactions')
    .send({ title: 'Test', amount: 1000, type: 'credit' })

  expect(response.statusCode).toBe(201)
})

// Forma 2: .expect() encadeado (mais conciso, preferido para status code)
it('creates transaction', async () => {
  await request(app.server)
    .post('/transactions')
    .send({ title: 'Test', amount: 1000, type: 'credit' })
    .expect(201)
})
```

## Exemplo 5: Uso dos lifecycle hooks

```typescript
describe('Example with all hooks', () => {
  // 1x antes de todos os testes
  beforeAll(async () => {
    await app.ready()
  })

  // 1x depois de todos os testes
  afterAll(async () => {
    await app.close()
  })

  // Antes de CADA teste (ex: limpar banco)
  beforeEach(async () => {
    await resetDatabase()
  })

  // Depois de CADA teste (ex: limpar estado)
  afterEach(async () => {
    await cleanupState()
  })

  it('test 1', async () => { /* ... */ })
  it('test 2', async () => { /* ... */ })
})
```