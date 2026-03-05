# Code Examples: Configurando Banco de Testes

## 1. Arquivo .env (desenvolvimento)

```bash
NODE_ENV=development
DATABASE_URL="./db/app.db"
```

## 2. Arquivo .env.test

```bash
DATABASE_URL="./db/test.db"
```

Nota: `NODE_ENV` nao precisa estar aqui — Vitest/Jest setam automaticamente como `test`.

## 3. Arquivo .env.test.example

```bash
DATABASE_URL="./db/test.db"
```

## 4. .gitignore

```
node_modules
db/*.db
.env
.env.test
```

## 5. Carregamento condicional do dotenv

```typescript
// src/env/index.ts
import { config } from 'dotenv'
import { z } from 'zod'

if (process.env.NODE_ENV === 'test') {
  config({ path: '.env.test' })
} else {
  config()
}

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('production'),
  DATABASE_URL: z.string(),
  PORT: z.coerce.number().default(3333),
})

const _env = envSchema.safeParse(process.env)

if (_env.success === false) {
  console.error('Invalid environment variables', _env.error.format())
  throw new Error('Invalid environment variables')
}

export const env = _env.data
```

### Antes (sem condicional)

```typescript
import 'dotenv/config'
// Sempre carrega .env, sem opcao de trocar
```

### Depois (com condicional)

```typescript
import { config } from 'dotenv'

if (process.env.NODE_ENV === 'test') {
  config({ path: '.env.test' })
} else {
  config()
}
```

A diferenca: `import 'dotenv/config'` executa imediatamente e sempre carrega `.env`. Importando `{ config }` separadamente, voce controla QUANDO e COM QUAL ARQUIVO chamar.

## 6. Setup de testes com beforeEach

### Versao inicial (beforeAll — funciona mas nao isola)

```typescript
import { beforeAll, describe, it, expect } from 'vitest'
import { execSync } from 'node:child_process'
import request from 'supertest'
import { app } from '../src/app'

describe('Transactions routes', () => {
  beforeAll(async () => {
    await app.ready()
    execSync('npm run knex migrate:latest')
  })

  it('should be able to create a new transaction', async () => {
    const response = await request(app.server)
      .post('/transactions')
      .send({
        title: 'New Transaction',
        amount: 5000,
        type: 'credit',
      })

    expect(response.statusCode).toBe(201)
  })
})
```

### Versao final (beforeEach — isolamento completo)

```typescript
import { beforeAll, beforeEach, describe, it, expect } from 'vitest'
import { execSync } from 'node:child_process'
import request from 'supertest'
import { app } from '../src/app'

describe('Transactions routes', () => {
  beforeAll(async () => {
    await app.ready()
  })

  beforeEach(() => {
    execSync('npm run knex migrate:rollback --all')
    execSync('npm run knex migrate:latest')
  })

  it('should be able to create a new transaction', async () => {
    const response = await request(app.server)
      .post('/transactions')
      .send({
        title: 'New Transaction',
        amount: 5000,
        type: 'credit',
      })

    expect(response.statusCode).toBe(201)
  })

  it('should be able to list all transactions', async () => {
    const createResponse = await request(app.server)
      .post('/transactions')
      .send({
        title: 'New Transaction',
        amount: 5000,
        type: 'credit',
      })

    const cookies = createResponse.get('Set-Cookie')

    const listResponse = await request(app.server)
      .get('/transactions')
      .set('Cookie', cookies)
      .expect(200)

    expect(listResponse.body.transactions).toEqual([
      expect.objectContaining({
        title: 'New Transaction',
        amount: 5000,
      }),
    ])
  })
})
```

## 7. Debugando o erro 500

Quando o banco de teste nao tem as tabelas, a API retorna 500. Para debugar:

```typescript
it('debug - should create transaction', async () => {
  const response = await request(app.server)
    .post('/transactions')
    .send({
      title: 'New Transaction',
      amount: 5000,
      type: 'credit',
    })

  console.log(response.body) // { error: "insert into transactions... table transactions does not exist" }
  expect(response.statusCode).toBe(201)
})
```

A solucao: garantir que migrations rodem antes dos testes via `execSync('npm run knex migrate:latest')`.

## 8. Importacao correta do child_process

```typescript
// CORRETO — importar de node:child_process
import { execSync } from 'node:child_process'

// CUIDADO — nao importar de node:test (outra coisa completamente diferente)
// import { ... } from 'node:test' // ERRADO
```

O Diego alerta especificamente sobre o autocomplete do editor sugerir `node:test` em vez de `node:child_process`.