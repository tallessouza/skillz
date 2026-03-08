# Code Examples: Cadastrando Usuário no Banco

## Exemplo completo do controller (como mostrado na aula)

```typescript
import { Router } from "express"
import { prisma } from "@/database/prisma"
import { AppError } from "@/utils/AppError"
import { hash } from "bcryptjs"

const usersRoutes = Router()

usersRoutes.post("/", async (request, response) => {
  const { name, email, password } = request.body

  // 1. Verificar se email já existe
  const userWithSameEmail = await prisma.user.findFirst({
    where: { email }
  })

  if (userWithSameEmail) {
    throw new AppError("User with same email already exists")
  }

  // 2. Criptografar a senha
  const hashedPassword = await hash(password, 8)

  // 3. Criar o usuário no banco
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword
    }
  })

  // 4. Remover a senha da resposta
  const { password: _, ...userWithoutPassword } = user

  return response.status(201).json(userWithoutPassword)
})
```

## Variação: Múltiplos campos sensíveis

Quando o modelo tem mais de um campo que não deve ser exposto:

```typescript
const user = await prisma.user.create({
  data: {
    name,
    email,
    password: hashedPassword,
    refreshToken: generateToken()
  }
})

const { password: _, refreshToken: __, ...userWithoutSensitiveData } = user

return response.status(201).json(userWithoutSensitiveData)
```

## Variação: Usando select do Prisma (alternativa)

Em vez de destructuring, o Prisma permite selecionar apenas os campos desejados:

```typescript
const user = await prisma.user.create({
  data: {
    name,
    email,
    password: hashedPassword
  },
  select: {
    id: true,
    name: true,
    email: true,
    role: true,
    created_at: true,
    updated_at: true
    // password não está listado = não retorna
  }
})

return response.status(201).json(user)
```

**Trade-off:** `select` é mais explícito mas precisa ser atualizado quando novos campos são adicionados ao modelo. A destructuring com spread automaticamente inclui novos campos (exceto os excluídos).

## Variação: Controller como classe

```typescript
class UsersController {
  async create(request: Request, response: Response) {
    const { name, email, password } = request.body

    const userWithSameEmail = await prisma.user.findFirst({
      where: { email }
    })

    if (userWithSameEmail) {
      throw new AppError("User with same email already exists")
    }

    const hashedPassword = await hash(password, 8)

    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword }
    })

    const { password: _, ...userWithoutPassword } = user

    return response.status(201).json(userWithoutPassword)
  }
}

export { UsersController }
```

## Resposta da API

### Sem tratamento (ERRADO):
```json
{
  "id": "uuid-gerado",
  "name": "John Doe",
  "email": "john@example.com",
  "password": "$2a$08$xYz...",
  "role": "customer",
  "created_at": "2024-01-15T10:30:00.000Z",
  "updated_at": "2024-01-15T10:30:00.000Z"
}
```

### Com destructuring (CORRETO):
```json
{
  "id": "uuid-gerado",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "customer",
  "created_at": "2024-01-15T10:30:00.000Z",
  "updated_at": "2024-01-15T10:30:00.000Z"
}
```

## Teste de email duplicado

```typescript
// Primeira requisição — sucesso (201)
POST /users
{ "name": "John", "email": "john@example.com", "password": "123456" }
// → 201 Created

// Segunda requisição — erro (AppError)
POST /users
{ "name": "Jane", "email": "john@example.com", "password": "654321" }
// → 400 Bad Request: "User with same email already exists"
```

## Pattern: Validar → Processar → Persistir → Sanitizar → Responder

Este padrão se repete em qualquer endpoint de criação:

```typescript
// 1. VALIDAR - regras de negócio
const existing = await prisma.model.findFirst({ where: { uniqueField } })
if (existing) throw new AppError("Already exists")

// 2. PROCESSAR - transformações necessárias
const processedData = await transform(rawData)

// 3. PERSISTIR - salvar no banco
const record = await prisma.model.create({ data: processedData })

// 4. SANITIZAR - remover campos sensíveis
const { sensitiveField: _, ...safeRecord } = record

// 5. RESPONDER - retornar ao cliente
return response.status(201).json(safeRecord)
```