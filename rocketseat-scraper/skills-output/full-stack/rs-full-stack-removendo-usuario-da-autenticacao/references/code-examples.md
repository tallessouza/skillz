# Code Examples: Limpeza de Dados em Testes de Autenticação

## Exemplo 1: Importação do Prisma no arquivo de teste

```typescript
// Mesma importação usada na aplicação
import { prisma } from "@/lib/prisma"
```

## Exemplo 2: afterAll básico para user controller

```typescript
import { prisma } from "@/lib/prisma"

describe("UserController", () => {
  afterAll(async () => {
    await prisma.user.deleteMany({
      where: { email: "test@example.com" }
    })
  })

  it("should create a new user", async () => {
    const response = await request(app).post("/users").send({
      name: "Test User",
      email: "test@example.com",
      password: "123456"
    })

    expect(response.status).toBe(201)
  })
})
```

## Exemplo 3: afterAll para session controller (padrão que já existia)

```typescript
import { prisma } from "@/lib/prisma"

describe("SessionController", () => {
  beforeAll(async () => {
    // Cria usuário para os testes de sessão
    await request(app).post("/users").send({
      name: "Test User",
      email: "test@example.com",
      password: "123456"
    })
  })

  afterAll(async () => {
    // Limpa sessões e usuário criados durante os testes
    await prisma.session.deleteMany({
      where: { user: { email: "test@example.com" } }
    })
    await prisma.user.deleteMany({
      where: { email: "test@example.com" }
    })
  })

  it("should authenticate a user", async () => {
    const response = await request(app).post("/sessions").send({
      email: "test@example.com",
      password: "123456"
    })

    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty("token")
  })
})
```

## Exemplo 4: Cleanup com múltiplos usuários de teste

```typescript
afterAll(async () => {
  await prisma.user.deleteMany({
    where: {
      email: {
        in: [
          "user1@test.com",
          "user2@test.com",
          "admin@test.com"
        ]
      }
    }
  })
})
```

## Exemplo 5: Cleanup com transação (garantia de atomicidade)

```typescript
afterAll(async () => {
  await prisma.$transaction([
    prisma.session.deleteMany({
      where: { user: { email: "test@example.com" } }
    }),
    prisma.user.deleteMany({
      where: { email: "test@example.com" }
    })
  ])
})
```

## Comando para rodar os testes

```bash
npm run test
# ou para um arquivo específico
npm run test -- user-controller.spec.ts
```