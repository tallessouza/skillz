---
name: rs-node-js-2023-banco-dados-isolado-testes
description: "Enforces isolated database setup for E2E tests using Prisma and PostgreSQL schemas. Use when user asks to 'setup e2e tests', 'configure test database', 'isolate test environment', 'write integration tests with database', or 'setup vitest for e2e'. Applies pattern: unique PostgreSQL schema per test file, migrate deploy, cascade drop on teardown. Make sure to use this skill whenever setting up E2E test infrastructure with Prisma. Not for unit tests, mock strategies, or non-Prisma ORMs."
---

# Banco de Dados Isolado nos Testes E2E

> Testes end-to-end usam banco de dados real e isolado por arquivo de teste — nunca mocks, nunca o banco de desenvolvimento.

## Rules

1. **Nunca use mocks em testes E2E** — bata no banco de dados real, porque mocks geram falsos positivos e falsos negativos
2. **Nunca use o banco de desenvolvimento para testes** — testes criam dados repetidos (mesmo email, mesmo ID), causando conflitos
3. **Isole por arquivo de teste, nao por teste individual** — use `beforeAll`/`afterAll`, nao `beforeEach`/`afterEach`, porque criar banco por teste e lento demais
4. **Use schemas do PostgreSQL como isolamento** — nao crie bancos novos, troque apenas o parametro `schema` na URL de conexao, porque schemas sao subdivisoes leves dentro do mesmo banco
5. **Use `migrate deploy`, nunca `migrate dev`** — deploy so roda migrations existentes, dev tenta gerar novas migrations a partir do schema
6. **Sempre delete o schema no teardown com CASCADE** — evita schemas orfaos acumulando no banco

## How to write

### Setup file (test/setup-e2e.ts)

```typescript
import "dotenv/config"
import { PrismaClient } from "@prisma/client"
import { randomUUID } from "node:crypto"
import { execSync } from "node:child_process"

const prisma = new PrismaClient()

function generateUniqueDatabaseUrl(schemaId: string) {
  if (!process.env.DATABASE_URL) {
    throw new Error("Please provide a DATABASE_URL environment variable.")
  }

  const url = new URL(process.env.DATABASE_URL)
  url.searchParams.set("schema", schemaId)

  return url.toString()
}

const schemaId = randomUUID()

beforeAll(async () => {
  const databaseUrl = generateUniqueDatabaseUrl(schemaId)
  process.env.DATABASE_URL = databaseUrl
  execSync("npx prisma migrate deploy")
})

afterAll(async () => {
  await prisma.$executeRawUnsafe(
    `DROP SCHEMA IF EXISTS "${schemaId}" CASCADE`
  )
  await prisma.$disconnect()
})
```

### Vitest config (vitest.config.e2e.ts)

```typescript
import { defineConfig } from "vitest/config"

export default defineConfig({
  test: {
    setupFiles: ["./test/setup-e2e.ts"],
    // ... resto da config
  },
})
```

## Example

**Before (teste E2E sem isolamento — quebra na segunda execucao):**
```typescript
// Usa o mesmo banco de dev, dados persistem entre execucoes
it("should create account", async () => {
  const response = await request(app).post("/accounts").send({
    name: "John Doe",
    email: "john@example.com", // UNIQUE constraint falha na 2a vez
    password: "123456",
  })
  expect(response.statusCode).toBe(201)
})
```

**After (com banco isolado — sempre funciona):**
```typescript
// setup-e2e.ts cria schema unico antes, deleta depois
it("should create account", async () => {
  const response = await request(app).post("/accounts").send({
    name: "John Doe",
    email: "john@example.com", // OK: schema limpo a cada suite
    password: "123456",
  })
  expect(response.statusCode).toBe(201)
})
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Teste E2E com banco | Use este pattern de schema isolado |
| Teste unitario | Nao precisa de banco, use in-memory repositories |
| 10+ testes no mesmo arquivo | `beforeAll` (1 schema por arquivo), nao `beforeEach` |
| Setup file precisa de env vars | Use `dotenv/config` direto, nao ConfigModule do Nest |
| Package manager diferente | Troque `npx` por `pnpm`/`yarn` no `execSync` |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| Usar banco de dev para testes | Criar schema PostgreSQL unico por suite |
| `beforeEach` para criar banco novo por teste | `beforeAll` para criar 1 banco por arquivo |
| `prisma migrate dev` no setup | `prisma migrate deploy` (so roda migrations) |
| Esquecer de deletar o schema no afterAll | `DROP SCHEMA IF EXISTS "id" CASCADE` + `disconnect` |
| Mockar banco de dados em teste E2E | Usar banco real com schema isolado |
| Usar ConfigModule do Nest no setup file | Usar `dotenv/config` (setup roda fora do Nest) |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/node-js/rs-node-js-2023-banco-de-dados-isolado-nos-testes/references/deep-explanation.md)
- [Code examples](../../../data/skills/node-js/rs-node-js-2023-banco-de-dados-isolado-nos-testes/references/code-examples.md)
