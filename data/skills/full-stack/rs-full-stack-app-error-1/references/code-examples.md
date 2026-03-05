# Code Examples: AppError

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

**Nota:** O instrutor não estende `Error` nativa — a classe é standalone. O `statusCode` tem valor padrão `400`.

## Exemplo 2: Uso no controller

```typescript
// src/controllers/ProductsController.ts
import { AppError } from "../utils/AppError"

class ProductsController {
  index(request, response) {
    // Exemplo: validação de parâmetro
    throw new AppError("O campo nome é obrigatório")
    // statusCode será 400 (padrão)
  }
}
```

O instrutor mostra que ao substituir `throw new Error(...)` por `throw new AppError(...)`, o comportamento muda de 500 para 400.

## Exemplo 3: Error handler global no server

```typescript
// server.ts
import { routes } from "./routes"
import { AppError } from "./utils/AppError"

// ... app setup e rotas ...

app.use((error, request, response, next) => {
  // Primeiro: verifica se é erro conhecido (cliente)
  if (error instanceof AppError) {
    return response.status(error.statusCode).json({
      message: error.message,
    })
  }

  // Segundo: erro genérico (servidor)
  return response.status(500).json({
    message: "Internal Server Error",
  })
})
```

## Exemplo 4: Variações de uso com diferentes status codes

```typescript
// 400 — Bad Request (padrão, não precisa passar statusCode)
throw new AppError("Parâmetro inválido")

// 404 — Not Found
throw new AppError("Produto não encontrado", 404)

// 401 — Unauthorized
throw new AppError("Token inválido ou expirado", 401)

// 409 — Conflict
throw new AppError("Email já cadastrado", 409)

// 422 — Unprocessable Entity
throw new AppError("Formato de dados inválido", 422)
```

## Exemplo 5: Antes e depois (demonstrado ao vivo)

### Antes — tudo retorna 500
```typescript
// Controller
throw new Error("O campo nome é obrigatório")

// Server handler
app.use((error, request, response, next) => {
  return response.status(500).json({ message: error.message })
})
// Resultado: { message: "O campo nome é obrigatório" } com status 500
```

### Depois — distinção funcional
```typescript
// Controller
throw new AppError("O campo nome é obrigatório")

// Server handler com instanceof
app.use((error, request, response, next) => {
  if (error instanceof AppError) {
    return response.status(error.statusCode).json({ message: error.message })
  }
  return response.status(500).json({ message: "Internal Server Error" })
})
// Resultado: { message: "O campo nome é obrigatório" } com status 400
```

## Estrutura de pastas resultante

```
src/
├── utils/
│   └── AppError.ts        # Classe de erro customizada
├── controllers/
│   └── ProductsController.ts  # Usa AppError nos throws
├── routes/
│   └── index.ts
└── server.ts              # Error handler global com instanceof
```