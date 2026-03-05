---
name: rs-node-js-2023-test-environment
description: "Applies test environment isolation patterns when writing end-to-end tests with Vitest and Prisma. Use when user asks to 'create e2e tests', 'setup test database', 'isolate test suites', 'configure vitest environment', or 'separate test db'. Ensures per-suite database isolation using Test Environment concept with custom DATABASE_URL per test file. Make sure to use this skill whenever setting up end-to-end testing infrastructure for Node.js APIs with Prisma. Not for unit tests, in-memory repositories, or frontend testing."
---

# Test Environment para Testes E2E

> Isolar cada suite de testes e2e com seu proprio banco de dados usando Test Environment do Vitest, equilibrando isolamento e performance.

## Rules

1. **Nunca use o banco de desenvolvimento para testes** — crie bancos separados, porque dados de dev corrompem resultados de testes e vice-versa
2. **Isole por suite, nao por teste individual** — um banco por arquivo de testes, nao por `it()`, porque isolamento por teste individual e lento demais em escala (2000 testes * 1.5s = 50min)
3. **Nunca use mocks excessivos em testes e2e** — teste e2e deve bater no banco de dados real, porque mock derrota o proposito de testar ponta a ponta
4. **Use Test Environment do Vitest para gerenciar variaveis** — configure `DATABASE_URL` diferente por suite via environment customizado, porque e a forma idiomatica de trocar configuracao por conjunto de testes
5. **Execute migrations no setup do environment** — cada suite deve ter schema atualizado antes de rodar, porque banco vazio sem migrations nao reflete a aplicacao real
6. **Limpe o banco no teardown do environment** — delete o schema/banco apos a suite completar, porque restos de dados causam interferencia entre suites

## How to write

### Estrutura do Test Environment customizado

```typescript
// prisma/vitest-environment-prisma.ts
import { Environment } from 'vitest'
import { randomUUID } from 'node:crypto'
import { execSync } from 'node:child_process'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

function generateDatabaseURL(schema: string) {
  const url = new URL(process.env.DATABASE_URL!)
  url.searchParams.set('schema', schema)
  return url.toString()
}

export default <Environment>{
  name: 'prisma',
  transformMode: 'ssr',
  async setup() {
    const schema = randomUUID()
    const databaseURL = generateDatabaseURL(schema)

    process.env.DATABASE_URL = databaseURL
    execSync('npx prisma migrate deploy')

    return {
      async teardown() {
        await prisma.$executeRawUnsafe(
          `DROP SCHEMA IF EXISTS "${schema}" CASCADE`
        )
        await prisma.$disconnect()
      },
    }
  },
}
```

### Configuracao no vitest.config.ts

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environmentMatchGlobs: [
      ['src/http/controllers/**', 'prisma/vitest-environment-prisma'],
    ],
  },
})
```

## Example

**Before (banco compartilhado, testes interferem entre si):**
```typescript
// Todos os testes usam o mesmo DATABASE_URL
// Teste 1 cria usuario → Teste 2 lista usuarios e encontra o usuario do Teste 1
describe('Create Gym', () => {
  it('should create a gym', async () => {
    await request(app).post('/gyms').send({ name: 'JS Gym' })
  })
})

describe('List Gyms', () => {
  it('should list gyms', async () => {
    const response = await request(app).get('/gyms')
    // FALHA: encontra a gym criada no teste anterior!
  })
})
```

**After (ambiente isolado por suite):**
```typescript
// Cada arquivo de teste recebe seu proprio schema no Postgres
// via Test Environment customizado

// src/http/controllers/gyms/create.spec.ts
// Automaticamente usa prisma environment (via environmentMatchGlobs)
describe('Create Gym', () => {
  it('should create a gym', async () => {
    const response = await request(app).post('/gyms').send({ name: 'JS Gym' })
    expect(response.statusCode).toBe(201)
  })
})

// src/http/controllers/gyms/list.spec.ts
// Schema separado — nao ve dados do create.spec.ts
describe('List Gyms', () => {
  it('should list gyms', async () => {
    const response = await request(app).get('/gyms')
    expect(response.body.gyms).toHaveLength(0) // limpo!
  })
})
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Testes unitarios | Use in-memory repositories, nao precisa de Test Environment |
| Testes e2e com Prisma/Postgres | Um schema por suite via Test Environment |
| Poucos testes e2e (<20) | Ainda assim isole por suite — o custo e baixo |
| Muitos testes e2e (>500) | Isolamento por suite e obrigatorio para manter performance |
| CI/CD pipeline | Use `migrate deploy` (nao `migrate dev`) no environment setup |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| Rodar e2e no banco de desenvolvimento | Banco separado com schema unico por suite |
| Criar mock do banco em teste e2e | Bater no banco real — e2e testa ponta a ponta |
| Limpar banco antes de cada `it()` | Limpar no teardown do environment (por suite) |
| Hardcodar DATABASE_URL nos testes | Gerar dinamicamente com UUID no environment |
| Usar `migrate dev` no CI | Usar `migrate deploy` — nao gera migrations novas |
| Ignorar teardown (nao dropar schema) | Sempre dropar schema no teardown para nao acumular lixo |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
