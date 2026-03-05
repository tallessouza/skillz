# Code Examples: Testando Listagem de Transacoes

## Exemplo completo do teste

```typescript
import { it, beforeAll, afterAll, describe, expect } from 'vitest'
import request from 'supertest'
import { app } from '../src/app'

describe('Transactions routes', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to create a new transaction', async () => {
    await request(app.server)
      .post('/transactions')
      .send({
        title: 'New transaction',
        amount: 5000,
        type: 'credit',
      })
      .expect(201)
  })

  it('should be able to list all transactions', async () => {
    // Setup: criar transacao para ter dados
    const createTransactionResponse = await request(app.server)
      .post('/transactions')
      .send({
        title: 'New transaction',
        amount: 5000,
        type: 'credit',
      })

    // Extrair cookies da resposta de criacao
    const cookies = createTransactionResponse.getSetCookie()

    // Listar transacoes com cookie de sessao
    const listTransactionsResponse = await request(app.server)
      .get('/transactions')
      .set('Cookie', cookies)
      .expect(200)

    // Validar que a transacao criada esta na lista
    expect(listTransactionsResponse.body.transactions).toEqual([
      expect.objectContaining({
        title: 'New transaction',
        amount: 5000,
      }),
    ])
  })
})
```

## Extraindo cookies — duas formas

```typescript
// Forma 1: metodo dedicado (preferida)
const cookies = response.getSetCookie()

// Forma 2: metodo generico de header
const cookies = response.get('Set-Cookie')
```

## Debugando com console.log

```typescript
// Ver todos os headers da resposta
console.log(response.headers)

// Ver o corpo da resposta
console.log(listTransactionsResponse.body)
```

## Controle de execucao de testes

```typescript
// Pular teste
it.skip('should do something', async () => { /* ... */ })

// Marcar como pendente (sem corpo)
it.todo('should do something in the future')

// Executar apenas este teste
it.only('should be able to list all transactions', async () => { /* ... */ })
```

## Validacao alternativa com expect.any

```typescript
// Se voce quer validar TODOS os campos incluindo os gerados:
expect(listTransactionsResponse.body.transactions).toEqual([
  {
    id: expect.any(String),
    title: 'New transaction',
    amount: 5000,
    session_id: expect.any(String),
    created_at: expect.any(String),
  },
])
```

## Erro comum: estrutura de resposta errada

```typescript
// ERRADO — body e um objeto, nao um array
expect(listTransactionsResponse.body).toEqual([
  expect.objectContaining({ title: 'New transaction' }),
])

// CORRETO — acessar a propriedade transactions
expect(listTransactionsResponse.body.transactions).toEqual([
  expect.objectContaining({ title: 'New transaction' }),
])
```

## Pattern para multiplas transacoes

```typescript
it('should be able to list all transactions', async () => {
  const createResponse1 = await request(app.server)
    .post('/transactions')
    .send({ title: 'Credit transaction', amount: 5000, type: 'credit' })

  const cookies = createResponse1.getSetCookie()

  // Segunda transacao usa o MESMO cookie
  await request(app.server)
    .post('/transactions')
    .set('Cookie', cookies)
    .send({ title: 'Debit transaction', amount: 2000, type: 'debit' })

  const listResponse = await request(app.server)
    .get('/transactions')
    .set('Cookie', cookies)
    .expect(200)

  expect(listResponse.body.transactions).toEqual([
    expect.objectContaining({ title: 'Credit transaction', amount: 5000 }),
    expect.objectContaining({ title: 'Debit transaction', amount: -2000 }),
  ])
})
```