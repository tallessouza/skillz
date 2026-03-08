# Code Examples: Tratamento de Exceções em API Express

## Setup completo — Instalação de dependências

```bash
npm i express-async-errors@3.1.1
npm i zod@3.24.1
```

## Classe AppError completa

```typescript
// src/utils/AppError.ts
export class AppError {
  message: string
  statusCode: number

  constructor(message: string, statusCode: number = 400) {
    this.message = message
    this.statusCode = statusCode
  }
}
```

**Uso básico:**
```typescript
// Erro 400 (padrão)
throw new AppError("Email already exists")

// Erro 404
throw new AppError("User not found", 404)

// Erro 409
throw new AppError("Conflict: resource already exists", 409)

// Erro 403
throw new AppError("You don't have permission", 403)
```

## Middleware de erro completo

```typescript
// src/middlewares/error-handling.ts
import { ErrorRequestHandler } from "express"
import { AppError } from "@/utils/AppError"
import { ZodError } from "zod"

export const errorHandling: ErrorRequestHandler = (error, req, res, next) => {
  // Erro intencional de negócio
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      message: error.message,
    })
  }

  // Erro de validação do Zod
  if (error instanceof ZodError) {
    return res.status(400).json({
      message: "Validation error",
      issues: error.format(),
    })
  }

  // Erro inesperado (fallback)
  return res.status(500).json({
    message: error.message,
  })
}
```

## Registro no app.ts

```typescript
// src/app.ts
import "express-async-errors" // DEVE ser o primeiro import
import express from "express"
import { routes } from "./routes"
import { errorHandling } from "@/middlewares/error-handling"

const app = express()

app.use(express.json())

// Todas as rotas
app.use(routes)

// Middleware de erro SEMPRE por último
app.use(errorHandling)

export { app }
```

## Exemplo: Validação com Zod em uma rota

```typescript
import { z } from "zod"
import { AppError } from "@/utils/AppError"

// Schema de validação
const createUserSchema = z.object({
  name: z.string().min(2),
  age: z.number().min(18),
  email: z.string().email(),
})

app.post("/users", async (req, res) => {
  // Se a validação falhar, Zod lança ZodError automaticamente
  // express-async-errors captura e envia pro middleware
  const { name, age, email } = createUserSchema.parse(req.body)

  // Se chegar aqui, dados são válidos
  const user = await createUser({ name, age, email })
  res.status(201).json(user)
})
```

**Resposta quando age < 18:**
```json
{
  "message": "Validation error",
  "issues": {
    "_errors": [],
    "age": {
      "_errors": ["Number must be greater than or equal to 18"]
    }
  }
}
```

## Exemplo: Lançando AppError em rota

```typescript
import { AppError } from "@/utils/AppError"

app.get("/users/:id", async (req, res) => {
  const user = await findUserById(req.params.id)

  if (!user) {
    throw new AppError("User not found", 404)
  }

  res.json(user)
})
```

**Resposta:**
```json
{
  "message": "User not found"
}
```
Status: 404 Not Found

## Exemplo: Teste do instrutor no Insomnia

O instrutor testou o fluxo no Insomnia com dois cenários:

### Teste 1 — AppError
```typescript
app.get("/test", async (req, res) => {
  throw new AppError("Erro de teste")
  // Código abaixo nunca executa (fica "apagado" no editor)
  res.send("Nunca chega aqui")
})
```
Resultado: `{ "message": "Erro de teste" }` com status 400

### Teste 2 — ZodError
```typescript
app.post("/test", async (req, res) => {
  const bodySchema = z.object({
    age: z.number().min(18),
  })

  const { age } = bodySchema.parse(req.body)
  res.json({ age })
})
```
Enviando body vazio ou sem age: retorna `"Validation error"` com issues detalhando o campo

## Estrutura de pastas resultante

```
src/
├── utils/
│   └── AppError.ts          # Classe de erro customizado
├── middlewares/
│   └── error-handling.ts     # Middleware central de erros
├── app.ts                    # Express app com errorHandling registrado
└── server.ts                 # Inicialização do servidor
```

## Variação: AppError com status codes comuns

```typescript
// 400 - Bad Request (padrão, não precisa informar)
throw new AppError("Invalid input data")

// 401 - Unauthorized
throw new AppError("Invalid credentials", 401)

// 403 - Forbidden
throw new AppError("Access denied", 403)

// 404 - Not Found
throw new AppError("Resource not found", 404)

// 409 - Conflict
throw new AppError("Email already registered", 409)

// 422 - Unprocessable Entity
throw new AppError("Cannot process this request", 422)
```