# Code Examples: Teste no Cadastro do Usuário

## Exemplo 1: Teste completo do cadastro (da aula)

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

    // Camada 1: status code
    expect(response.statusCode).toBe(201)

    // Camada 2: propriedade estrutural
    expect(response.body).toHaveProperty("id")

    // Camada 3: valor específico
    expect(response.body.name).toBe("Test User")
  })
})
```

## Exemplo 2: Separação app vs server

```typescript
// src/app.ts
import express from "express"
import { usersRoutes } from "./routes/users.routes"

const app = express()

app.use(express.json())
app.use("/users", usersRoutes)

export default app
```

```typescript
// src/server.ts
import app from "./app"

const PORT = 3000

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
```

## Exemplo 3: Controller que retorna 201

```typescript
// src/controllers/UsersController.ts
import { Request, Response } from "express"

class UsersController {
  async create(request: Request, response: Response) {
    const { name, email, password } = request.body

    // ... lógica de criação no banco

    return response.status(201).json(user)
  }
}

export { UsersController }
```

## Variação: Teste com verificação de banco

```typescript
import request from "supertest"
import { prisma } from "@/database"
import app from "@/app"

describe("UsersController", () => {
  afterAll(async () => {
    await prisma.user.deleteMany()
    await prisma.$disconnect()
  })

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

    // Verificação direta no banco (alternativa ao Prisma Studio)
    const userInDb = await prisma.user.findUnique({
      where: { email: "testuser@example.com" },
    })

    expect(userInDb).toBeTruthy()
    expect(userInDb?.name).toBe("Test User")
  })
})
```

## Variação: Teste de erro (email duplicado)

```typescript
it("should not create user with duplicate email", async () => {
  // Primeiro cadastro
  await request(app)
    .post("/users")
    .send({
      name: "Test User",
      email: "duplicate@example.com",
      password: "password123",
    })

  // Segundo cadastro com mesmo email
  const response = await request(app)
    .post("/users")
    .send({
      name: "Another User",
      email: "duplicate@example.com",
      password: "password456",
    })

  expect(response.statusCode).toBe(400)
  expect(response.body).toHaveProperty("message")
})
```

## Variação: Teste com campos obrigatórios ausentes

```typescript
it("should return 400 when name is missing", async () => {
  const response = await request(app)
    .post("/users")
    .send({
      email: "noname@example.com",
      password: "password123",
    })

  expect(response.statusCode).toBe(400)
})
```

## Execução

```bash
# Rodar todos os testes
npm run test:dev

# Verificar no banco após teste (manual)
npx prisma studio
```