# Code Examples: Finalizando Testes E2E da Aplicacao

## Exemplo 1: Teste de transacao especifica (by ID)

### Contexto
A rota POST de criacao nao retorna o ID. Entao o teste precisa listar para obter o ID antes de buscar o recurso especifico.

```typescript
it('should be able to get a specific transaction', async () => {
  // Step 1: Criar a transacao
  const createTransactionResponse = await request(app.server)
    .post('/transactions')
    .send({
      title: 'New transaction',
      amount: 5000,
      type: 'credit',
    })

  const cookies = createTransactionResponse.get('Set-Cookie')

  // Step 2: Listar para obter o ID (unica forma disponivel)
  const listTransactionsResponse = await request(app.server)
    .get('/transactions')
    .set('Cookie', cookies)
    .expect(200)

  const transactionId = listTransactionsResponse.body.transactions[0].id

  // Step 3: Buscar a transacao especifica pelo ID
  const getTransactionResponse = await request(app.server)
    .get(`/transactions/${transactionId}`)
    .set('Cookie', cookies)
    .expect(200)

  // Step 4: Validar — note que e .transaction (objeto), nao .transactions (array)
  expect(getTransactionResponse.body.transaction).toEqual(
    expect.objectContaining({
      title: 'New transaction',
      amount: 5000,
    }),
  )
})
```

### Pontos-chave:
- `transactions[0].id` — pega o ID da listagem
- Template literal no path: `` `/transactions/${transactionId}` ``
- `body.transaction` (singular) — a rota de detalhe retorna objeto, nao array
- `expect.objectContaining` — ignora campos extras como `id`, `created_at`, `session_id`

## Exemplo 2: Teste do resumo (summary)

### Contexto
O resumo soma creditos e subtrai debitos. Para validar, criamos duas transacoes com tipos diferentes.

```typescript
it('should be able to get the summary', async () => {
  // Step 1: Criar transacao de credito
  const createTransactionResponse = await request(app.server)
    .post('/transactions')
    .send({
      title: 'Credit transaction',
      amount: 5000,
      type: 'credit',
    })

  const cookies = createTransactionResponse.get('Set-Cookie')

  // Step 2: Criar transacao de debito (reutilizando cookies)
  await request(app.server)
    .post('/transactions')
    .set('Cookie', cookies)
    .send({
      title: 'Debit transaction',
      amount: 2000,
      type: 'debit',
    })

  // Step 3: Buscar o resumo
  const summaryResponse = await request(app.server)
    .get('/transactions/summary')
    .set('Cookie', cookies)
    .expect(200)

  // Step 4: Validar o calculo (5000 - 2000 = 3000)
  expect(summaryResponse.body.summary).toEqual({
    amount: 3000,
  })
})
```

### Pontos-chave:
- Duas transacoes com tipos diferentes para validar calculo
- Path completo: `/transactions/summary` (nao `/summary`)
- `body.summary` (nao `body.amount` direto)
- `.toEqual` em vez de `.objectContaining` porque o summary tem shape exata conhecida

## Erros comuns demonstrados na aula

### Erro: shape errada
```typescript
// ERRADO — retorna undefined
expect(summaryResponse.body.amount).toBe(3000)

// CORRETO — acessar a propriedade correta
expect(summaryResponse.body.summary).toEqual({ amount: 3000 })
```

### Erro: path incompleto
```typescript
// ERRADO — retorna 404
const res = await request(app.server).get('/summary')

// CORRETO — path completo
const res = await request(app.server).get('/transactions/summary')
```

### Erro: esquecer cookies
```typescript
// ERRADO — sem autenticacao, retorna vazio ou 401
const res = await request(app.server).get('/transactions')

// CORRETO — enviar cookies
const res = await request(app.server)
  .get('/transactions')
  .set('Cookie', cookies)
```

## Padrao completo da suite de testes

```typescript
import { describe, it, beforeAll, afterAll, beforeEach, expect } from 'vitest'
import request from 'supertest'
import { app } from '../src/app'
import { execSync } from 'node:child_process'

describe('Transactions routes', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  beforeEach(() => {
    execSync('npm run knex migrate:rollback --all')
    execSync('npm run knex migrate:latest')
  })

  it('should be able to create a new transaction', async () => { /* ... */ })

  it('should be able to list all transactions', async () => { /* ... */ })

  it('should be able to get a specific transaction', async () => { /* ... */ })

  it('should be able to get the summary', async () => { /* ... */ })
})
```