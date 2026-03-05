# Code Examples: Categorizando Testes

## Exemplo 1: Renomeando o arquivo

O instrutor comeca renomeando o arquivo de teste de `example.spec.ts` para `transactions.spec.ts`, estabelecendo a convencao de um arquivo por dominio.

## Exemplo 2: Estrutura com describe

```typescript
import { it, beforeAll, afterAll, describe, expect } from 'vitest'
import { execSync } from 'node:child_process'
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
})
```

### O que mudou em relacao ao codigo anterior:
1. `test` foi substituido por `it`
2. Todo o conteudo foi envolvido em `describe('Transactions routes', ...)`
3. `beforeAll` e `afterAll` agora estao dentro do `describe`, criando um contexto isolado
4. O nome do teste mudou para "should be able to create a new transaction"

## Exemplo 3: Subcategoria aninhada (conceitual)

O instrutor mostrou que e possivel aninhar describes:

```typescript
describe('Transactions routes', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  describe('POST /transactions', () => {
    it('should be able to create a new transaction', async () => {
      // ...
    })
  })

  describe('GET /transactions', () => {
    it('should be able to list all transactions', async () => {
      // ...
    })

    it('should be able to filter transactions by date', async () => {
      // ...
    })
  })

  describe('GET /transactions/:id', () => {
    it('should be able to get a specific transaction', async () => {
      // ...
    })
  })
})
```

## Exemplo 4: Saida do teste quando falha

O instrutor forcou um erro mudando `expect(201)` para `expect(400)` para demonstrar a saida:

```
FAIL  test/transactions.spec.ts > Transactions routes > should be able to create a new transaction
```

A hierarquia completa aparece: `arquivo > categoria > nome do teste`. Isso e o principal beneficio pratico do `describe` — erros sao imediatamente localizaveis.

## Variacao: Mesmo padrao no Jest

```typescript
// Funciona identicamente no Jest
import { describe, it, beforeAll, afterAll, expect } from '@jest/globals'

describe('Users routes', () => {
  beforeAll(async () => {
    // setup
  })

  it('should be able to create a new user', async () => {
    // ...
  })
})
```