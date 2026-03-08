---
name: rs-full-stack-teste-no-cadastro-do-usuario
description: "Enforces integration test patterns for user registration endpoints using Jest and Supertest. Use when user asks to 'write a test for signup', 'test user creation', 'test POST /users', 'integration test for registration', or 'validate API endpoint with supertest'. Applies patterns: separate app from server for testability, descriptive test names with 'should', async/await requests, multi-layer assertions (status, properties, values). Make sure to use this skill whenever writing API integration tests for CRUD endpoints. Not for unit tests without HTTP, frontend component tests, or E2E browser tests."
---

# Teste de Cadastro de Usuário com Supertest

> Testes de integração validam o fluxo completo da requisição HTTP até a resposta, verificando status, estrutura e conteúdo.

## Rules

1. **Separe app do server** — o app exporta a aplicação Express/Fastify sem iniciar a porta, porque o supertest precisa controlar o ciclo de vida do servidor
2. **Nomeie testes com "should"** — `it("should create a new user successfully")`, porque descreve o comportamento esperado como especificação
3. **Use async/await** — requisições HTTP são assíncronas, porque callbacks aninhados reduzem legibilidade
4. **Valide em múltiplas camadas** — status code + propriedades da resposta + valores específicos, porque uma única asserção não garante corretude completa
5. **Use dados fictícios explícitos** — `test user`, `test@example.com`, porque dados de teste devem ser óbvios e não confundíveis com dados reais

## How to write

### Estrutura básica do teste

```typescript
import request from "supertest"
import app from "@/app"

describe("UsersController", () => {
  it("should create a new user successfully", async () => {
    const response = await request(app)
      .post("/users")
      .send({
        name: "Test User",
        email: "testuser@example.com",
        password: "password123",
      })

    expect(response.statusCode).toBe(201)
    expect(response.body).toHaveProperty("id")
    expect(response.body.name).toBe("Test User")
  })
})
```

### Separação app vs server

```typescript
// app.ts — exporta a aplicação SEM iniciar
import express from "express"
const app = express()
// ... rotas e middlewares
export default app

// server.ts — inicia a porta (usado em produção)
import app from "./app"
app.listen(3000, () => console.log("Server running"))
```

## Example

**Before (teste fraco, uma única asserção):**
```typescript
it("test", async () => {
  const res = await request(app).post("/users").send({ name: "a" })
  expect(res.status).toBe(201)
})
```

**After (teste completo, múltiplas validações):**
```typescript
it("should create a new user successfully", async () => {
  const response = await request(app)
    .post("/users")
    .send({
      name: "Test User",
      email: "testuser@example.com",
      password: "password123",
    })

  expect(response.statusCode).toBe(201)
  expect(response.body).toHaveProperty("id")
  expect(response.body.name).toBe("Test User")
})
```

## Heuristics

| Situação | Faça |
|----------|------|
| Endpoint retorna recurso criado | Valide status 201 + `toHaveProperty("id")` + campo principal |
| Endpoint retorna lista | Valide status 200 + `toBeInstanceOf(Array)` + length |
| Endpoint com erro esperado | Valide status 4xx + mensagem de erro |
| Precisa verificar persistência | Use Prisma Studio ou query direta ao banco |
| Dados de teste | Use nomes óbvios: "Test User", "test@example.com" |

## Anti-patterns

| Nunca escreva | Escreva no lugar |
|---------------|------------------|
| `it("test", () => {})` | `it("should create a new user successfully", async () => {})` |
| `import app from "./server"` (inicia porta) | `import app from "./app"` (sem porta) |
| Apenas `expect(status).toBe(201)` | Status + propriedades + valores |
| `const res = ...` | `const response = ...` (nome descritivo) |
| Dados reais no teste | Dados fictícios explícitos ("Test User") |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre separação app/server, estratégia de asserções e verificação no banco
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações para diferentes endpoints