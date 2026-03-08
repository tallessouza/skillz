# Code Examples: Criando ensureAuthenticated

## Exemplo 1: Middleware completo (como implementado na aula)

```typescript
// src/middlewares/ensure-authenticated.ts
import { Request, Response, NextFunction } from "express"
import { verify } from "jsonwebtoken"
import { authConfig } from "@/configs/auth"
import { AppError } from "@/utils/AppError"

interface TokenPayload {
  role: string
  sub: string
}

function ensureAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const authHeader = request.headers.authorization

    if (!authHeader) {
      throw new AppError("JWT token not found", 401)
    }

    const [, token] = authHeader.split(" ")

    const { role, sub: userId } = verify(
      token,
      authConfig.jwt.secret
    ) as TokenPayload

    request.user = {
      id: userId,
      role,
    }

    return next()
  } catch {
    throw new AppError("Invalid JWT token", 401)
  }
}

export { ensureAuthenticated }
```

## Exemplo 2: Declaration merging para Express

```typescript
// src/types/express.d.ts
declare namespace Express {
  export interface Request {
    user?: {
      id: string
      role: string
    }
  }
}
```

## Exemplo 3: Usando o middleware nas rotas

```typescript
import { Router } from "express"
import { ensureAuthenticated } from "@/middlewares/ensure-authenticated"

const ordersRouter = Router()

// Rota protegida — precisa de autenticacao
ordersRouter.use(ensureAuthenticated)

ordersRouter.get("/", (request, response) => {
  const userId = request.user!.id
  const userRole = request.user!.role

  // Buscar pedidos do usuario autenticado
  response.json({ userId, userRole })
})

export { ordersRouter }
```

## Exemplo 4: Middleware de autorizacao por perfil (extensao natural)

Apos o `ensureAuthenticated` injetar `request.user`, pode-se criar middleware de autorizacao:

```typescript
// src/middlewares/ensure-role.ts
import { Request, Response, NextFunction } from "express"
import { AppError } from "@/utils/AppError"

function ensureRole(allowedRoles: string[]) {
  return (request: Request, response: Response, next: NextFunction) => {
    if (!request.user) {
      throw new AppError("User not authenticated", 401)
    }

    if (!allowedRoles.includes(request.user.role)) {
      throw new AppError("Access denied", 403)
    }

    return next()
  }
}

export { ensureRole }
```

Uso:

```typescript
// Apenas admin pode acessar
ordersRouter.get(
  "/admin/all",
  ensureAuthenticated,
  ensureRole(["admin"]),
  listAllOrdersController
)
```

## Exemplo 5: Estrutura do authConfig referenciado

```typescript
// src/configs/auth.ts
export const authConfig = {
  jwt: {
    secret: process.env.JWT_SECRET || "default-secret",
    expiresIn: "1d",
  },
}
```

## Exemplo 6: Destructuring do Bearer token — passo a passo

```typescript
const authHeader = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.payload.signature"

// split(" ") divide no espaco
const parts = authHeader.split(" ")
// parts = ["Bearer", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.payload.signature"]

// Destructuring ignorando posicao 0
const [, token] = parts
// token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.payload.signature"
```

## Exemplo 7: O que verify retorna (payload decodificado)

```typescript
// Payload dentro do JWT (codificado em base64)
{
  "role": "admin",
  "sub": "user-uuid-123",
  "iat": 1700000000,
  "exp": 1700086400
}

// Apos verify:
const decoded = verify(token, secret) as TokenPayload
// decoded.role = "admin"
// decoded.sub = "user-uuid-123"

// Com rename:
const { role, sub: userId } = decoded
// role = "admin"
// userId = "user-uuid-123"
```