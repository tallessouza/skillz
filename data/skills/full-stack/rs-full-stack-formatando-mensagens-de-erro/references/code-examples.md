# Code Examples: Formatando Mensagens de Erro do Zod

## Exemplo base da aula — Error handler completo

```typescript
import { ZodError } from "zod"
import { AppError } from "./app-error"

app.setErrorHandler((error, request, response) => {
  // Erro de negócio (lançado manualmente pela aplicação)
  if (error instanceof AppError) {
    return response.status(error.statusCode).json({
      message: error.message,
    })
  }

  // Erro de validação (lançado pelo Zod)
  if (error instanceof ZodError) {
    return response.status(400).json({
      message: "Validation error",
      issues: error.format(),
    })
  }

  // Erro desconhecido / interno
  return response.status(500).json({
    message: "Internal server error",
  })
})
```

## Cenário: price recebe string ao invés de number

**Request:**
```json
{
  "name": "Produto X",
  "price": "abc"
}
```

**Response (400):**
```json
{
  "message": "Validation error",
  "issues": {
    "_errors": [],
    "price": {
      "_errors": ["Expected number, received string"]
    }
  }
}
```

## Cenário: name recebe number ao invés de string

**Request:**
```json
{
  "name": 34,
  "price": 100
}
```

**Response (400):**
```json
{
  "message": "Validation error",
  "issues": {
    "_errors": [],
    "name": {
      "_errors": ["Expected string, received number"]
    }
  }
}
```

## Cenário: múltiplos campos inválidos

**Request:**
```json
{
  "name": 34,
  "price": "abc"
}
```

**Response (400):**
```json
{
  "message": "Validation error",
  "issues": {
    "_errors": [],
    "name": {
      "_errors": ["Expected string, received number"]
    },
    "price": {
      "_errors": ["Expected number, received string"]
    }
  }
}
```

## Variação: Express.js (middleware de erro)

```typescript
import { ZodError } from "zod"
import { AppError } from "./app-error"

// Express usa 4 parâmetros para error middleware
app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      message: error.message,
    })
  }

  if (error instanceof ZodError) {
    return res.status(400).json({
      message: "Validation error",
      issues: error.format(),
    })
  }

  return res.status(500).json({
    message: "Internal server error",
  })
})
```

## Variação: usando error.flatten() ao invés de error.format()

```typescript
// flatten() produz estrutura mais simples
if (error instanceof ZodError) {
  return response.status(400).json({
    message: "Validation error",
    issues: error.flatten(),
  })
}
```

**Output de flatten():**
```json
{
  "formErrors": [],
  "fieldErrors": {
    "price": ["Expected number, received string"]
  }
}
```

`flatten()` é mais simples mas perde a estrutura aninhada. `format()` é mais rico para schemas complexos com objetos aninhados.

## Variação: adicionando log em produção

```typescript
if (error instanceof ZodError) {
  return response.status(400).json({
    message: "Validation error",
    issues: error.format(),
  })
}

// Erro desconhecido — loga para investigação
console.error("Unexpected error:", error)

return response.status(500).json({
  message: "Internal server error",
})
```

## Schema Zod que gera esses erros

```typescript
import { z } from "zod"

const createProductSchema = z.object({
  name: z.string(),
  price: z.number(),
})

// No route handler — parse() lança ZodError se inválido
app.post("/products", (request, response) => {
  const { name, price } = createProductSchema.parse(request.body)

  // Se chegou aqui, dados são válidos
  // ...
})
```