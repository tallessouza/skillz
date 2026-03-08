# Code Examples: Recuperando o Usuário na Autenticação

## Exemplo 1: Controller completo de sessão (autenticação)

```typescript
import { Request, Response } from "express"
import { prisma } from "@/database/prisma"
import { compare } from "bcrypt"
import { AppError } from "@/utils/AppError"

class SessionsController {
  async create(request: Request, response: Response) {
    const { email, password } = request.body

    // Busca o usuário pelo e-mail
    const user = await prisma.user.findFirst({
      where: { email },
    })

    // Verifica se o usuário existe
    if (!user) {
      throw new AppError("E-mail ou senha inválido", 401)
    }

    // Compara a senha fornecida com a armazenada (hasheada)
    const passwordMatch = await compare(password, user.password)

    // Verifica se a senha está correta
    if (!passwordMatch) {
      throw new AppError("E-mail ou senha inválido", 401)
    }

    // Usuário autenticado — próximo passo: gerar token JWT
    return response.json({ user })
  }
}

export { SessionsController }
```

## Exemplo 2: Teste da autenticação — e-mail correto, senha correta

**Request:**
```json
{
  "email": "rodrigo@email.com",
  "password": "123456"
}
```

**Response (200):**
```json
{
  "user": {
    "id": 1,
    "name": "Rodrigo",
    "email": "rodrigo@email.com"
  }
}
```

## Exemplo 3: Teste da autenticação — senha incorreta

**Request:**
```json
{
  "email": "rodrigo@email.com",
  "password": "12345"
}
```

**Response (401):**
```json
{
  "message": "E-mail ou senha inválido"
}
```

## Exemplo 4: Teste da autenticação — e-mail inexistente

**Request:**
```json
{
  "email": "odigo@email.com",
  "password": "123456"
}
```

**Response (401):**
```json
{
  "message": "E-mail ou senha inválido"
}
```

Note que as respostas dos exemplos 3 e 4 são idênticas — impossível distinguir se o erro é no e-mail ou na senha.

## Exemplo 5: Importação do Prisma

```typescript
// src/database/prisma.ts (módulo centralizado)
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export { prisma }
```

```typescript
// No controller — importação usando alias de path
import { prisma } from "@/database/prisma"
```

## Exemplo 6: Variação — findUnique (quando email tem @unique)

```typescript
// Se o schema Prisma tem: email String @unique
const user = await prisma.user.findUnique({
  where: { email },
})

if (!user) {
  throw new AppError("E-mail ou senha inválido", 401)
}
```

## Exemplo 7: Padrão completo com AppError

```typescript
// src/utils/AppError.ts
class AppError {
  message: string
  statusCode: number

  constructor(message: string, statusCode: number = 400) {
    this.message = message
    this.statusCode = statusCode
  }
}

export { AppError }
```

```typescript
// Uso no controller — ambas as exceções usam 401
throw new AppError("E-mail ou senha inválido", 401)
```