# Code Examples: Banco de Dados Isolado nos Testes E2E

## Exemplo completo: setup-e2e.ts

```typescript
// test/setup-e2e.ts
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

  // Sobrescreve a variavel ambiente ANTES da aplicacao inicializar
  process.env.DATABASE_URL = databaseUrl

  // Roda migrations no schema novo (deploy, nao dev!)
  execSync("npx prisma migrate deploy")
})

afterAll(async () => {
  // Deleta o schema inteiro com CASCADE
  await prisma.$executeRawUnsafe(
    `DROP SCHEMA IF EXISTS "${schemaId}" CASCADE`
  )
  // Fecha a conexao
  await prisma.$disconnect()
})
```

## Configuracao do Vitest para E2E

```typescript
// vitest.config.e2e.ts
import swc from "unplugin-swc"
import { defineConfig } from "vitest/config"

export default defineConfig({
  test: {
    include: ["**/*.e2e-spec.ts"],
    globals: true,
    root: "./",
    setupFiles: ["./test/setup-e2e.ts"],
  },
  plugins: [
    swc.vite({
      module: { type: "es6" },
    }),
  ],
})
```

## Como a URL e transformada

```typescript
// URL original (do .env):
// postgresql://postgres:docker@localhost:5432/nest-clean?schema=public

const url = new URL(process.env.DATABASE_URL)
url.searchParams.set("schema", "a1b2c3d4-e5f6-7890-abcd-ef1234567890")

console.log(url.toString())
// postgresql://postgres:docker@localhost:5432/nest-clean?schema=a1b2c3d4-e5f6-7890-abcd-ef1234567890
```

## Nota sobre versoes do Prisma

Em versoes mais recentes do Prisma, o import do PrismaClient pode mudar:

```typescript
// Versoes mais antigas
import { PrismaClient } from "@prisma/client"

// Versoes mais recentes (com generated client customizado)
import { PrismaClient } from "../generated/prisma"
```

## Exemplo de teste E2E usando o banco isolado

```typescript
// src/controllers/create-account.controller.e2e-spec.ts
import { INestApplication } from "@nestjs/common"
import { Test } from "@nestjs/testing"
import request from "supertest"
import { AppModule } from "@/app.module"

describe("Create Account (E2E)", () => {
  let app: INestApplication

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleRef.createNestApplication()
    await app.init()
  })

  test("[POST] /accounts", async () => {
    const response = await request(app.getHttpServer()).post("/accounts").send({
      name: "John Doe",
      email: "johndoe@example.com",
      password: "123456",
    })

    expect(response.statusCode).toBe(201)
  })
})
```

## Comparacao: beforeAll vs beforeEach

```typescript
// RECOMENDADO: 1 schema por arquivo (rapido)
const schemaId = randomUUID()

beforeAll(async () => {
  const databaseUrl = generateUniqueDatabaseUrl(schemaId)
  process.env.DATABASE_URL = databaseUrl
  execSync("npx prisma migrate deploy")
})

afterAll(async () => {
  await prisma.$executeRawUnsafe(`DROP SCHEMA IF EXISTS "${schemaId}" CASCADE`)
  await prisma.$disconnect()
})

// NAO RECOMENDADO: 1 schema por teste (lento)
let schemaId: string

beforeEach(async () => {
  schemaId = randomUUID()
  const databaseUrl = generateUniqueDatabaseUrl(schemaId)
  process.env.DATABASE_URL = databaseUrl
  execSync("npx prisma migrate deploy") // ~1s POR TESTE
})

afterEach(async () => {
  await prisma.$executeRawUnsafe(`DROP SCHEMA IF EXISTS "${schemaId}" CASCADE`)
})
```

## Visualizacao do que acontece no banco

```
PostgreSQL Database: nest-clean
├── public (schema de desenvolvimento)
│   ├── users (seus dados de dev)
│   ├── questions
│   └── ...
├── a1b2c3d4-... (schema de teste — criado no beforeAll)
│   ├── users (vazio, migrations aplicadas)
│   ├── questions (vazio)
│   └── ...                        ← deletado no afterAll com CASCADE
└── (sem schemas orfaos apos os testes)
```