---
name: rs-full-stack-removendo-usuario-de-teste
description: "Enforces test data cleanup patterns when writing integration or E2E tests that create database records. Use when user asks to 'write a test that creates a user', 'fix flaky tests', 'test fails on second run', 'handle duplicate data in tests', or 'clean up test database'. Applies afterEach/afterAll cleanup with Prisma delete, shared variable scoping for IDs across test lifecycle hooks. Make sure to use this skill whenever writing tests that insert data into a real database. Not for unit tests with mocks, frontend component tests, or seed data scripts."
---

# Removendo Usuário de Teste

> Testes que criam registros no banco devem sempre limpar seus dados após execução, garantindo idempotência entre rodadas.

## Rules

1. **Declare IDs compartilhados no topo do describe** — `let userId: string` no escopo do `describe`, porque hooks como `afterAll` precisam acessar o ID criado dentro do `it`
2. **Capture o ID do response após criação** — `userId = response.body.id` logo após o request de criação, porque sem o ID não há como deletar o registro específico
3. **Use `afterAll` para cleanup de registros criados** — delete via Prisma (ou ORM) no hook `afterAll`, porque garante que o banco volta ao estado limpo mesmo se o teste falhar
4. **Delete com cláusula `where` específica** — `prisma.user.delete({ where: { id: userId } })`, porque deletar por ID evita remoção acidental de dados reais
5. **Nunca dependa de estado residual entre execuções** — cada rodada de testes deve funcionar independentemente, porque testes que dependem de dados pré-existentes são frágeis e não-determinísticos

## How to write

### Variável compartilhada no describe

```typescript
describe("User", () => {
  let userId: string

  // ... testes que populam userId
  // ... afterAll que usa userId para cleanup
})
```

### Captura do ID e cleanup com afterAll

```typescript
it("should create a new user", async () => {
  const response = await request(app)
    .post("/users")
    .send({ name: "Test User", email: "test@example.com", password: "123456" })

  expect(response.status).toBe(201)
  userId = response.body.id
})

afterAll(async () => {
  await prisma.user.delete({
    where: { id: userId },
  })
})
```

## Example

**Before (falha na segunda execução):**
```typescript
describe("User", () => {
  it("should create a new user", async () => {
    const response = await request(app)
      .post("/users")
      .send({ name: "Test", email: "test@example.com", password: "123" })

    expect(response.status).toBe(201) // ✗ 400 na segunda rodada (email duplicado)
  })
})
```

**After (execução consistente):**
```typescript
import { prisma } from "@/database/prisma"

describe("User", () => {
  let userId: string

  it("should create a new user", async () => {
    const response = await request(app)
      .post("/users")
      .send({ name: "Test", email: "test@example.com", password: "123" })

    expect(response.status).toBe(201)
    userId = response.body.id
  })

  afterAll(async () => {
    await prisma.user.delete({
      where: { id: userId },
    })
  })
})
```

## Heuristics

| Situação | Faça |
|----------|------|
| Teste cria 1 registro | `afterAll` com `delete` por ID |
| Teste cria múltiplos registros | `afterAll` com `deleteMany` e filtro específico |
| Teste depende de registro pré-existente | Crie no `beforeAll`, remova no `afterAll` |
| Teste falha com "unique constraint" na 2ª rodada | Falta cleanup — adicione `afterAll` com delete |
| Múltiplos `it` criam registros diferentes | Array de IDs no escopo do `describe`, delete todos no `afterAll` |

## Anti-patterns

| Nunca faça | Faça em vez disso |
|------------|-------------------|
| Deletar manualmente no banco entre rodadas | `afterAll` automático com Prisma delete |
| `let userId` dentro do `it` | `let userId` no topo do `describe` |
| `prisma.user.deleteMany({})` sem filtro | `prisma.user.delete({ where: { id: userId } })` com ID específico |
| Ignorar falhas de "duplicate email" | Investigar cleanup ausente nos hooks |
| Confiar que o banco está limpo antes do teste | Criar e limpar dados explicitamente em cada suite |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre idempotência de testes e ciclo de vida dos hooks
- [code-examples.md](references/code-examples.md) — Exemplos expandidos com variações de cleanup para diferentes cenários