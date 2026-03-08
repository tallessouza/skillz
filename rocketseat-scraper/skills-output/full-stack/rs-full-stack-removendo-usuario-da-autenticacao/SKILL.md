---
name: rs-full-stack-removendo-usuario-da-autenticacao
description: "Enforces test cleanup patterns when writing integration tests that create users or authentication sessions. Use when user asks to 'write auth tests', 'test login', 'test user registration', 'add afterAll cleanup', or 'fix flaky tests'. Applies afterAll hooks with Prisma to delete test data, preventing test pollution across runs. Make sure to use this skill whenever writing tests that persist data to a database. Not for unit tests with mocks, frontend component tests, or non-database test scenarios."
---

# Limpeza de Dados em Testes de Autenticação

> Todo teste que cria dados no banco DEVE deletá-los no afterAll, garantindo que execuções subsequentes não falhem por dados residuais.

## Rules

1. **Sempre adicione afterAll para limpar dados criados** — testes que criam usuários, sessões ou qualquer registro devem deletá-los ao final, porque dados residuais causam falhas intermitentes em execuções futuras
2. **Importe o Prisma no arquivo de teste** — o mesmo client usado na aplicação serve para cleanup, porque garante consistência de conexão e schema
3. **Delete na ordem inversa das dependências** — sessões antes de usuários, porque foreign keys bloqueiam deleção de registros referenciados
4. **Nunca dependa de deleção manual no banco** — se precisou deletar manualmente para o teste passar, falta um afterAll, porque testes devem ser auto-suficientes

## How to write

### afterAll com Prisma para cleanup de usuário

```typescript
import { prisma } from "@/lib/prisma"

afterAll(async () => {
  await prisma.user.deleteMany({
    where: { email: "test@example.com" }
  })
})
```

### Cleanup completo em testes de autenticação

```typescript
import { prisma } from "@/lib/prisma"

afterAll(async () => {
  // Deletar sessões primeiro (dependência)
  await prisma.session.deleteMany({
    where: { user: { email: "test@example.com" } }
  })
  // Depois deletar o usuário
  await prisma.user.deleteMany({
    where: { email: "test@example.com" }
  })
})
```

## Example

**Before (teste que falha na segunda execução):**
```typescript
describe("UserController", () => {
  it("should create a user", async () => {
    const response = await request(app).post("/users").send({
      name: "Test User",
      email: "test@example.com",
      password: "123456"
    })
    expect(response.status).toBe(201)
  })
  // Sem cleanup — próxima execução falha com "email already exists"
})
```

**After (com cleanup no afterAll):**
```typescript
import { prisma } from "@/lib/prisma"

describe("UserController", () => {
  afterAll(async () => {
    await prisma.user.deleteMany({
      where: { email: "test@example.com" }
    })
  })

  it("should create a user", async () => {
    const response = await request(app).post("/users").send({
      name: "Test User",
      email: "test@example.com",
      password: "123456"
    })
    expect(response.status).toBe(201)
  })
})
```

## Heuristics

| Situação | Ação |
|----------|------|
| Teste cria usuário no banco | Adicionar afterAll com deleteMany |
| Teste cria sessão/token | Deletar sessão E usuário no afterAll |
| Teste falha só na segunda execução | Falta cleanup — adicionar afterAll |
| Múltiplos describes criam dados | Cada describe tem seu próprio afterAll |

## Anti-patterns

| Nunca faça | Faça em vez disso |
|------------|-------------------|
| Deletar dados manualmente no banco antes de rodar testes | Adicionar afterAll com Prisma cleanup |
| Ignorar falhas intermitentes em CI | Investigar dados residuais e adicionar cleanup |
| Usar `deleteMany({})` sem where | Filtrar por email/id do teste específico |
| Colocar cleanup no afterEach para dados criados uma vez | Usar afterAll para dados criados no beforeAll/describe |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre test isolation e cleanup patterns
- [code-examples.md](references/code-examples.md) — Exemplos expandidos de cleanup em diferentes cenários de autenticação