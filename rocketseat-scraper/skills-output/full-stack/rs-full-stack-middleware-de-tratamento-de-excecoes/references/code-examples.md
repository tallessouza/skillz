# Code Examples: Middleware de Tratamento de Exceções

## Exemplo 1: Classe AppError completa

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

**Uso com diferentes status codes:**
```typescript
// 400 Bad Request (padrão)
throw new AppError("Email is required")

// 404 Not Found
throw new AppError("User not found", 404)

// 401 Unauthorized
throw new AppError("Invalid credentials", 401)

// 409 Conflict
throw new AppError("Email already exists", 409)
```

## Exemplo 2: Middleware error-handling completo

```typescript
// src/middlewares/error-handling.ts
import { Request, Response, NextFunction } from "express"
import { AppError } from "../utils/AppError"

function errorHandling(
  error: any,
  request: Request,
  response: Response,
  next: NextFunction
) {
  // Erro conhecido — lançado intencionalmente com AppError
  if (error instanceof AppError) {
    return response.status(error.statusCode).json({
      message: error.message,
    })
  }

  // Erro desconhecido — erro interno do sistema
  return response.status(500).json({
    message: error.message,
  })
}

export { errorHandling }
```

## Exemplo 3: Registro no app.ts

```typescript
// src/app.ts
import "express-async-errors" // DEVE vir antes das rotas
import express from "express"
import { routes } from "./routes"
import { errorHandling } from "./middlewares/error-handling"

const app = express()

app.use(express.json())

// Rotas
app.use(routes)

// Tratamento de exceções (DEPOIS das rotas)
app.use(errorHandling)

export { app }
```

## Exemplo 4: Rota usando AppError

```typescript
import { Router } from "express"
import { AppError } from "../utils/AppError"

const usersRouter = Router()

usersRouter.post("/", async (request, response) => {
  const { name, email } = request.body

  if (!email) {
    throw new AppError("Email is required")
    // Retorna: { "message": "Email is required" } com status 400
  }

  const userExists = await findUserByEmail(email)
  if (userExists) {
    throw new AppError("Email already in use", 409)
    // Retorna: { "message": "Email already in use" } com status 409
  }

  // ... criar usuário
  return response.status(201).json({ name, email })
})
```

## Exemplo 5: Instalação do express-async-errors

```bash
npm install express-async-errors@3.1.1
```

O instrutor reforça: use a mesma versão (`3.1.1`) para evitar problemas de compatibilidade.

## Variação: Adicionando log para erros 500

```typescript
function errorHandling(
  error: any,
  request: Request,
  response: Response,
  next: NextFunction
) {
  if (error instanceof AppError) {
    return response.status(error.statusCode).json({
      message: error.message,
    })
  }

  // Log do erro inesperado para debugging
  console.error(error)

  return response.status(500).json({
    message: "Internal server error",
  })
}
```

**Nota:** Em produção, considere não expor `error.message` no 500 — use uma mensagem genérica como "Internal server error" para não vazar detalhes internos.