# Code Examples: Configurando Zod para Validacao em APIs

## 1. Instalacao do Zod (versao fixa)

```bash
npm install zod@3.23.8
```

## 2. Error handler completo (como mostrado na aula)

```typescript
// src/middlewares/error-handler.ts
import { z, ZodError } from "zod"
import { AppError } from "@/utils/AppError"
import { Request, Response, NextFunction } from "express"

export function errorHandler(
  error: Error,
  request: Request,
  response: Response,
  next: NextFunction
) {
  // Erro lancado intencionalmente pelo dev
  if (error instanceof AppError) {
    return response.status(error.statusCode).json({
      message: error.message,
    })
  }

  // Erro de validacao do Zod
  if (error instanceof ZodError) {
    return response.status(400).json({
      message: "validationError",
      issues: error.format(),
    })
  }

  // Erro inesperado
  return response.status(500).json({
    message: "Internal server error",
  })
}
```

## 3. Variacao: usando flatten em vez de format

```typescript
if (error instanceof ZodError) {
  return response.status(400).json({
    message: "validationError",
    issues: error.flatten(),
  })
}
```

Saida:
```json
{
  "message": "validationError",
  "issues": {
    "formErrors": [],
    "fieldErrors": {
      "name": ["Required"],
      "price": ["Expected number, received string"]
    }
  }
}
```

## 4. Exemplo de uso em rota (preview da proxima aula)

```typescript
// src/routes/products.ts
import { z } from "zod"

const createProductSchema = z.object({
  name: z.string().min(3),
  price: z.number().positive(),
  description: z.string().optional(),
})

app.post("/products", (request, response) => {
  const { name, price, description } = createProductSchema.parse(request.body)

  // Se a validacao falhar, ZodError e lancado automaticamente
  // e capturado pelo error handler central

  // ... criar produto
  return response.status(201).json({ name, price, description })
})
```

## 5. Variacao: Fastify em vez de Express

```typescript
// Em Fastify, o error handler usa setErrorHandler
import { ZodError } from "zod"

app.setErrorHandler((error, request, reply) => {
  if (error instanceof ZodError) {
    return reply.status(400).send({
      message: "validationError",
      issues: error.format(),
    })
  }

  return reply.status(500).send({ message: "Internal server error" })
})
```

## 6. Registrando o middleware no app

```typescript
// src/app.ts
import express from "express"
import { errorHandler } from "./middlewares/error-handler"
import { routes } from "./routes"

const app = express()
app.use(express.json())
app.use(routes)
app.use(errorHandler) // DEVE ser o ultimo middleware
```