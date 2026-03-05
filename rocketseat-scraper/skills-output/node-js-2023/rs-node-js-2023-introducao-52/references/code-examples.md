# Code Examples: Introducao — API REST com Node.js

## Nota

Esta aula e introdutoria e nao contem codigo. Os exemplos abaixo ilustram a stack mencionada pelo instrutor para referencia rapida.

## Stack setup basico (o que sera construido ao longo do modulo)

### Estrutura de projeto esperada

```
src/
├── app.ts              # Configuracao do Fastify
├── server.ts           # Entry point
├── routes/             # Rotas da API
├── database.ts         # Configuracao do Knex
├── env/                # Validacao de variaveis ambiente
│   └── index.ts
└── middlewares/         # Middlewares customizados

test/
├── routes/             # Testes E2E por rota
│   └── transactions.spec.ts

db/
├── migrations/         # Migrations SQL via Knex
├── knexfile.ts         # Config do Knex

.env                    # Variaveis ambiente
.env.example            # Template de variaveis
.eslintrc.json          # Config do ESLint
tsconfig.json           # Config do TypeScript
```

### Fastify — setup basico

```typescript
import fastify from 'fastify'

const app = fastify()

app.get('/hello', async () => {
  return { hello: 'world' }
})

app.listen({ port: 3333 }).then(() => {
  console.log('HTTP Server Running!')
})
```

### Knex — configuracao basica

```typescript
import { knex as setupKnex } from 'knex'

export const knex = setupKnex({
  client: 'sqlite3',
  connection: {
    filename: './db/app.db',
  },
  useNullAsDefault: true,
  migrations: {
    extension: 'ts',
    directory: './db/migrations',
  },
})
```

### Variaveis ambiente — validacao com Zod

```typescript
import { z } from 'zod'

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('production'),
  DATABASE_URL: z.string(),
  PORT: z.coerce.number().default(3333),
})

export const env = envSchema.parse(process.env)
```

### Teste E2E basico

```typescript
import { test, beforeAll, afterAll, describe } from 'vitest'
import request from 'supertest'
import { app } from '../src/app'

describe('Transactions routes', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  test('should be able to create a new transaction', async () => {
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

### ESLint — configuracao basica

```json
{
  "extends": ["@rocketseat/eslint-config/node"]
}
```

### Deploy automatizado — conceito

```yaml
# .github/workflows/deploy.yml (conceitual)
name: Deploy
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: npm ci
      - run: npm test
      - run: npm run build
      # Deploy step depends on hosting provider
```