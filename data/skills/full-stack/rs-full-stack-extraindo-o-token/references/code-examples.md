# Code Examples: Extraindo o Token da Requisição

## Exemplo 1: Middleware básico (como na aula)

```typescript
// src/middlewares/EnsureAuthenticated.ts
import { Request, Response, NextFunction } from "express"
import { AppError } from "../utils/AppError"

export function EnsureAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction
) {
  const authHeader = request.headers.authorization

  if (!authHeader) {
    throw new AppError("JWT token não informado", 401)
  }

  const [, token] = authHeader.split(" ")

  console.log(token) // Para debug — remover em produção

  return next()
}
```

## Exemplo 2: Aplicação na rota de produtos

```typescript
// src/routes/products.routes.ts
import { Router } from "express"
import { EnsureAuthenticated } from "../middlewares/EnsureAuthenticated"
import { ProductsController } from "../controllers/ProductsController"

const productsRoutes = Router()
const productsController = new ProductsController()

// Rota protegida — middleware intercepta antes do controller
productsRoutes.post("/", EnsureAuthenticated, productsController.create)

// Rota pública — sem middleware
productsRoutes.get("/", productsController.index)

export { productsRoutes }
```

## Exemplo 3: Evolução — com jwt.verify (próximo passo natural)

```typescript
import { Request, Response, NextFunction } from "express"
import { verify } from "jsonwebtoken"
import { AppError } from "../utils/AppError"
import authConfig from "../configs/auth"

interface TokenPayload {
  sub: string
  iat: number
  exp: number
}

export function EnsureAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction
) {
  const authHeader = request.headers.authorization

  if (!authHeader) {
    throw new AppError("JWT token não informado", 401)
  }

  const [, token] = authHeader.split(" ")

  try {
    const decoded = verify(token, authConfig.jwt.secret) as TokenPayload
    request.user = { id: decoded.sub }
    return next()
  } catch {
    throw new AppError("JWT token inválido", 401)
  }
}
```

## Exemplo 4: Debug com console.log (passo a passo da aula)

O instrutor demonstrou a progressão:

```typescript
// Passo 1: Ver o que chega no header
console.log(request.headers.authorization)
// Output: "Bearer Rodrigo Gonçalves"

// Passo 2: Ver o split funcionando
console.log(authHeader.split(" "))
// Output: ["Bearer", "Rodrigo Gonçalves"]

// Passo 3: Desestruturar e pegar só o token
const [, token] = authHeader.split(" ")
console.log(token)
// Output: "Rodrigo Gonçalves" (ou o JWT real)
```

## Exemplo 5: Testando no Insomnia

### Sem token (Auth desabilitado):
```
POST /products
Headers: (sem Authorization)

Response: 401 - "JWT token não informado"
```

### Com token (Bearer Token selecionado):
```
POST /products
Headers:
  Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

Response: 201 - Produto criado
Terminal: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Exemplo 6: Aplicação global em grupo de rotas

```typescript
// Proteger todas as rotas de um router
const protectedRoutes = Router()
protectedRoutes.use(EnsureAuthenticated) // Aplica em todas abaixo

protectedRoutes.post("/products", productsController.create)
protectedRoutes.put("/products/:id", productsController.update)
protectedRoutes.delete("/products/:id", productsController.delete)
```

## Exemplo 7: Múltiplos middlewares na mesma rota

```typescript
// Composição de middlewares
productsRoutes.post(
  "/",
  EnsureAuthenticated,  // Primeiro: tem token?
  EnsureAdmin,          // Segundo: é admin?
  productsController.create  // Terceiro: executa
)
```