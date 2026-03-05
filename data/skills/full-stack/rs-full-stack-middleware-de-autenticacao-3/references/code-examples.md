# Code Examples: Middleware de Autenticação

## Exemplo 1: Middleware completo (como ficou na aula)

```typescript
import { verify } from "jsonwebtoken"
import { appConfig } from "@/config"
import { Request, Response, NextFunction } from "express"

export function ensureAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction
) {
  const authHeader = request.headers.authorization

  if (!authHeader) {
    return response.status(401).json({ message: "Token não informado" })
  }

  const [, token] = authHeader.split(" ")

  try {
    const { sub: userId } = verify(token, appConfig.jwt.secret) as { sub: string }

    request.user = {
      id: String(userId),
    }

    return next()
  } catch {
    return response.status(401).json({ message: "Token inválido" })
  }
}
```

## Exemplo 2: Tipagem personalizada

```typescript
// src/types/express.d.ts
declare namespace Express {
  export interface Request {
    user?: {
      id: string
    }
  }
}
```

## Exemplo 3: Controller de sessão (onde o token é criado)

```typescript
import { sign } from "jsonwebtoken"
import { appConfig } from "@/config"

export class SessionController {
  async create(request: Request, response: Response) {
    // ... validação de email/senha ...

    const token = sign({}, appConfig.jwt.secret, {
      subject: String(user.id), // Este é o `sub` que o middleware extrai
    })

    return response.json({ token })
  }
}
```

## Exemplo 4: Rota protegida consumindo request.user

```typescript
// Como o instrutor demonstrou na rota de produtos
app.get("/products", ensureAuthenticated, (request: Request, response: Response) => {
  const userId = request.user?.id
  // userId = "1" (string com o ID do usuário autenticado)
  return response.json({ userId })
})
```

## Exemplo 5: Variação com mais campos no user

```typescript
// Se precisar adicionar role ou email no futuro:

// express.d.ts
declare namespace Express {
  export interface Request {
    user?: {
      id: string
      role?: string
    }
  }
}

// middleware
const { sub: userId, role } = verify(token, secret) as { sub: string; role?: string }

request.user = {
  id: String(userId),
  role,
}
```

## Exemplo 6: Teste do middleware (demonstrado na aula)

```
# Token válido → 200 OK
GET /products
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
→ { "userId": "1" }

# Token inválido (adicionando "x" no final) → 401
GET /products
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...x
→ { "message": "invalid signature" }

# Sem token → 401
GET /products
→ { "message": "Token não informado" }
```