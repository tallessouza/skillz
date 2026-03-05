# Code Examples: Test Environment para Testes E2E

## Exemplo 1: Estrutura completa do Environment customizado

```typescript
// prisma/vitest-environment-prisma.ts
import { Environment } from 'vitest'
import { randomUUID } from 'node:crypto'
import { execSync } from 'node:child_process'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Gera URL unica por suite usando schema do Postgres
function generateDatabaseURL(schema: string) {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL not set')
  }

  const url = new URL(process.env.DATABASE_URL)
  url.searchParams.set('schema', schema)
  return url.toString()
}

export default <Environment>{
  name: 'prisma',
  transformMode: 'ssr',

  // setup() roda ANTES de cada suite de testes (arquivo)
  async setup() {
    const schema = randomUUID()
    const databaseURL = generateDatabaseURL(schema)

    // Troca a variavel de ambiente para este schema isolado
    process.env.DATABASE_URL = databaseURL

    // Roda migrations no schema novo (cria tabelas)
    execSync('npx prisma migrate deploy')

    return {
      // teardown() roda DEPOIS que a suite termina
      async teardown() {
        // Remove o schema inteiro (CASCADE deleta tudo dentro)
        await prisma.$executeRawUnsafe(
          `DROP SCHEMA IF EXISTS "${schema}" CASCADE`
        )
        await prisma.$disconnect()
      },
    }
  },
}
```

## Exemplo 2: Configuracao do Vitest

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    // Associa pastas de testes a environments
    environmentMatchGlobs: [
      // Todos os testes em controllers/ usam o environment prisma
      ['src/http/controllers/**', 'prisma/vitest-environment-prisma'],
    ],
  },
})
```

## Exemplo 3: Teste e2e usando o environment

```typescript
// src/http/controllers/gyms/create.spec.ts
import { app } from '@/app'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('Create Gym (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to create a gym', async () => {
    const response = await request(app.server).post('/gyms').send({
      title: 'JavaScript Gym',
      description: 'Some description',
      phone: '11999999999',
      latitude: -27.2092052,
      longitude: -49.6401091,
    })

    expect(response.statusCode).toEqual(201)
  })
})
```

## Exemplo 4: .env.test vs .env

```bash
# .env (desenvolvimento)
DATABASE_URL="postgresql://docker:docker@localhost:5432/apisolid?schema=public"

# Nao precisa de .env.test separado porque o Test Environment
# sobrescreve DATABASE_URL dinamicamente com schema UUID
```

## Exemplo 5: Comparacao — isolamento por teste vs por suite

```typescript
// LENTO: isolamento por teste individual
// ~1.5s overhead por it()
beforeEach(async () => {
  await prisma.$executeRawUnsafe('DROP SCHEMA IF EXISTS "test" CASCADE')
  await prisma.$executeRawUnsafe('CREATE SCHEMA "test"')
  execSync('npx prisma migrate deploy')
})

// RAPIDO: isolamento por suite (arquivo)
// ~1.5s overhead por arquivo, compartilhado entre todos os it()
// Feito automaticamente pelo Test Environment
```

## Conceito: Suite de testes

```
arquivo-a.spec.ts    ← Suite A (banco isolado A)
├── it('test 1')     ← Compartilha banco A
├── it('test 2')     ← Compartilha banco A
└── it('test 3')     ← Compartilha banco A

arquivo-b.spec.ts    ← Suite B (banco isolado B)
├── it('test 1')     ← Compartilha banco B
└── it('test 2')     ← Compartilha banco B

// Testes entre suites NAO interferem
// Testes dentro da mesma suite PODEM ver dados uns dos outros
```