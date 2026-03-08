---
name: 2023-criando-test-environment-2024
description: "Creates an isolated Prisma test environment for Vitest E2E tests using PostgreSQL schema isolation with random UUIDs per test run. Use when user asks to 'setup E2E test environment', 'isolate test database', 'configure Prisma with Vitest', 'create test environment', or 'separate unit and E2E tests'. Enforces: PostgreSQL schema isolation over separate databases, randomUUID for schema names, setup/teardown with CREATE/DROP SCHEMA CASCADE, Vitest projects for unit vs E2E separation, prisma db push over migrate deploy. Make sure to use this skill whenever configuring E2E testing infrastructure with Prisma and Vitest. Not for unit tests with mocks, frontend testing, or non-PostgreSQL databases."
category: coding-lens
tags: [deploy, error-handling, migrations, modules, prisma, testing]
mind_lenses: [LT_01, LT_02, MF_01, GB_01, TH_04]
metadata:
  author: Rocketseat
  version: 2.0.0
  course: node-js-2023
  module: testing-e2e
  tags: [vitest, prisma, test-environment, postgresql, schema-isolation, e2e-testing]
---

# Criando Test Environment (Prisma + Vitest)

> Cada suite de testes end-to-end deve rodar em um schema PostgreSQL isolado, criado antes e destruido depois da execucao.

## Rules

1. **Use schemas do Postgres, nao bancos separados** — schemas sao como branches do banco: isolados, rapidos de criar/destruir, porque evitam overhead de criar/dropar databases inteiros
2. **Gere schema IDs aleatorios** — use `randomUUID()` para cada execucao, porque evita colisao entre execucoes paralelas
3. **Setup cria, teardown destroi** — o environment deve criar o schema antes dos testes e dropar com CASCADE depois, porque garante banco limpo a cada execucao
4. **Configure workspaces separados para unit e e2e** — use `projects` no vitest config para aplicar environments diferentes por pasta de teste, porque testes unitarios nao precisam de banco
5. **Use `prisma db push` ao inves de `prisma migrate deploy`** — a partir do Prisma 6.13.0 migrations apontam para schema `public`, porque `db push` respeita o schema customizado na URL
6. **Renomeie vite.config para .mjs** — Vitest 3+ exige Module JS, porque o parser nao aceita mais CommonJS no config

## How to write

### Arquivo prisma-test-environment.ts

```typescript
// prisma/vitest-environment-prisma/prisma-test-environment.ts
import 'dotenv/config'
import { randomUUID } from 'node:crypto'
import { execSync } from 'node:child_process'
import type { Environment } from 'vitest/environments'
import { prisma } from '@/lib/prisma'

function generateDatabaseURL(schema: string) {
  if (!process.env.DATABASE_URL) {
    throw new Error('Please provide a DATABASE_URL environment variable.')
  }

  const url = new URL(process.env.DATABASE_URL)
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

    execSync('npx prisma db push')

    return {
      async teardown() {
        await prisma.$executeRawUnsafe(
          `DROP SCHEMA IF EXISTS "${schema}" CASCADE`,
        )
        await prisma.$disconnect()
      },
    }
  },
}
```

### Configuracao vitest (vite.config.mjs)

```javascript
import { defineConfig } from 'vitest/config'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    dir: 'src',
    projects: [
      {
        extends: true,
        test: {
          name: 'unit',
          include: ['src/use-cases/**/*.spec.ts'],
        },
      },
      {
        extends: true,
        test: {
          name: 'e2e',
          include: ['src/http/controllers/**/*.spec.ts'],
          environment:
            './prisma/vitest-environment-prisma/prisma-test-environment.ts',
        },
      },
    ],
  },
})
```

### Scripts no package.json

```json
{
  "scripts": {
    "test": "vitest run --project unit",
    "test:watch": "vitest --project unit",
    "test:e2e": "vitest run --project e2e",
    "test:e2e:watch": "vitest --project e2e"
  }
}
```

## Example

**Before (sem test environment):**
```typescript
// Testes e2e rodando no mesmo banco de desenvolvimento
// Dados poluem entre execucoes, testes flaky
describe('Register', () => {
  it('should register', async () => {
    // usa o banco de dev — ERRADO
  })
})
```

**After (com test environment aplicado):**
```typescript
// Cada execucao cria schema isolado, roda migrations, executa testes, destroi schema
// Banco limpo garantido a cada run
describe('Register', () => {
  it('should register', async () => {
    // roda em schema UUID isolado — CORRETO
  })
})
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Projeto usa Prisma + PostgreSQL + Vitest | Aplicar este environment completo |
| Prisma >= 6.13.0 | Usar `prisma db push` (nao `migrate deploy`) |
| Vitest >= 3.x | Config deve ser `.mjs`, usar `projects` (nao `workspace`) |
| Testes e2e precisam de banco | Colocar em pasta separada (ex: `http/controllers/`) |
| Testes unitarios com mocks | Nao precisam deste environment |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `CREATE DATABASE test_db` para cada teste | Schema isolado com `randomUUID()` |
| `execSync('npx prisma migrate deploy')` (Prisma 6.13+) | `execSync('npx prisma db push')` |
| `workspace: [...]` no vitest config (Vitest 3.2+) | `projects: [...]` |
| `vite.config.js` (CommonJS) | `vite.config.mjs` (ESM) |
| Banco de dev compartilhado com testes | Schema isolado por execucao |
| Cleanup manual de tabelas | `DROP SCHEMA CASCADE` no teardown |

## Troubleshooting

### Resultado inesperado ao aplicar o padrao
**Symptom:** Comportamento nao corresponde ao esperado apos seguir os passos
**Cause:** Dependencias ou configuracoes previas podem estar faltando
**Fix:** Verifique os prerequisites e confirme que todas as versoes estao compativeis

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes
