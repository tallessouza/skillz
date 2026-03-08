# Code Examples: Removendo Usuário de Teste

## Exemplo 1: Padrão básico da aula (cleanup de usuário único)

```typescript
import request from "supertest"
import { app } from "@/app"
import { prisma } from "@/database/prisma"

describe("User", () => {
  let userId: string

  it("should create a new user", async () => {
    const response = await request(app)
      .post("/users")
      .send({
        name: "Test User",
        email: "test@example.com",
        password: "123456",
      })

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

## Exemplo 2: Múltiplos registros criados em testes diferentes

```typescript
describe("Delivery", () => {
  const createdIds: string[] = []

  it("should create a delivery", async () => {
    const response = await request(app)
      .post("/deliveries")
      .send({ recipient: "João", address: "Rua A, 123" })

    expect(response.status).toBe(201)
    createdIds.push(response.body.id)
  })

  it("should create another delivery", async () => {
    const response = await request(app)
      .post("/deliveries")
      .send({ recipient: "Maria", address: "Rua B, 456" })

    expect(response.status).toBe(201)
    createdIds.push(response.body.id)
  })

  afterAll(async () => {
    await prisma.delivery.deleteMany({
      where: { id: { in: createdIds } },
    })
  })
})
```

## Exemplo 3: Cleanup com dependências (usuário + registros filhos)

```typescript
describe("User with deliveries", () => {
  let userId: string
  let deliveryId: string

  it("should create user and assign delivery", async () => {
    const userResponse = await request(app)
      .post("/users")
      .send({ name: "Test", email: "test@example.com", password: "123" })

    userId = userResponse.body.id

    const deliveryResponse = await request(app)
      .post("/deliveries")
      .send({ userId, recipient: "Cliente", address: "Rua C" })

    deliveryId = deliveryResponse.body.id

    expect(deliveryResponse.status).toBe(201)
  })

  afterAll(async () => {
    // Deletar filho antes do pai (respeitar foreign keys)
    await prisma.delivery.delete({ where: { id: deliveryId } })
    await prisma.user.delete({ where: { id: userId } })
  })
})
```

## Exemplo 4: Cleanup seguro com guard contra undefined

```typescript
afterAll(async () => {
  if (userId) {
    await prisma.user.delete({
      where: { id: userId },
    })
  }
})
```

## Exemplo 5: beforeAll + afterAll para dados de setup

```typescript
describe("Delivery operations", () => {
  let userId: string
  let deliveryId: string

  beforeAll(async () => {
    // Cria dados necessários para os testes
    const user = await prisma.user.create({
      data: { name: "Setup User", email: "setup@test.com", password: "hashed" },
    })
    userId = user.id
  })

  it("should create delivery for existing user", async () => {
    const response = await request(app)
      .post("/deliveries")
      .send({ userId, recipient: "João", address: "Rua X" })

    expect(response.status).toBe(201)
    deliveryId = response.body.id
  })

  afterAll(async () => {
    if (deliveryId) {
      await prisma.delivery.delete({ where: { id: deliveryId } })
    }
    await prisma.user.delete({ where: { id: userId } })
  })
})
```

## Exemplo 6: Erro que o instrutor demonstrou (sem cleanup)

```typescript
// ❌ PROBLEMA: funciona uma vez, falha na segunda
describe("User", () => {
  it("should create a new user", async () => {
    const response = await request(app)
      .post("/users")
      .send({ name: "Test", email: "test@example.com", password: "123" })

    expect(response.status).toBe(201)
    // Rodada 1: ✓ 201 Created
    // Rodada 2: ✗ 400 Bad Request (email já existe!)
  })
})
```

O erro acontece porque o `UserController` verifica duplicidade de email:
```typescript
// No UserController
const existingUser = await prisma.user.findUnique({
  where: { email },
})

if (existingUser) {
  return response.status(400).json({ error: "Email already exists" })
}
```

Sem o `afterAll` com delete, o registro persiste e a validação bloqueia a criação na próxima rodada.