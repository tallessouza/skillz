# Code Examples: Middleware ensureAuthenticated com JWT

## Exemplo 1: Middleware completo (como mostrado na aula)

```typescript
// src/middleware/ensureAuthenticated.ts
import { verify } from "jsonwebtoken"
import { authConfig } from "@/config/auth"
import { AppError } from "@/utils/AppError"
import { Request, Response, NextFunction } from "express"

interface TokenPayload {
  role: string
  sub: string
}

export function ensureAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const authHeader = request.headers.authorization

    if (!authHeader) {
      throw new AppError("JWT token not found", 401)
    }

    // Bearer eyJhbGciOiJIUzI1NiI...
    // split(" ") => ["Bearer", "eyJhbGciOiJIUzI1NiI..."]
    // [, token] => ignora "Bearer", captura o token
    const [, token] = authHeader.split(" ")

    const { role, sub: user_id } = verify(
      token,
      authConfig.jwt.secret
    ) as TokenPayload

    request.user = {
      id: user_id,
      role,
    }

    return next()
  } catch {
    throw new AppError("Invalid JWT token", 401)
  }
}
```

## Exemplo 2: Extensao de tipo do Express

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

**Por que `.d.ts`?** Arquivos de declaracao de tipo sao automaticamente globais. Nao precisa importar em nenhum lugar — o TypeScript reconhece a extensao em todo o projeto.

**Por que `interface` e nao `type`?** Apenas interfaces suportam declaration merging. O Express ja define `Request` como interface, entao voce pode "reabrir" e adicionar propriedades.

## Exemplo 3: Organizacao de rotas com middleware global

```typescript
// src/routes/index.ts
import { Router } from "express"
import { ensureAuthenticated } from "@/middleware/ensureAuthenticated"
import { usersRoutes } from "./users.routes"
import { sessionsRoutes } from "./sessions.routes"
import { refundsRoutes } from "./refunds.routes"

const routes = Router()

// Rotas publicas — NAO passam pelo ensureAuthenticated
routes.use("/users", usersRoutes)
routes.use("/sessions", sessionsRoutes)

// Barreira de autenticacao
routes.use(ensureAuthenticated)

// Rotas privadas — TODAS passam pelo ensureAuthenticated
routes.use("/refunds", refundsRoutes)
```

## Exemplo 4: Middleware aplicado em rota individual

Quando nem todas as rotas abaixo precisam de autenticacao:

```typescript
// Aplicar em rota especifica como segundo argumento
routes.get("/profile", ensureAuthenticated, showProfileController)
routes.get("/public-data", listPublicDataController) // sem autenticacao
```

## Exemplo 5: Usando request.user no controller

```typescript
// src/controllers/RefundsController.ts
import { Request, Response } from "express"

export class RefundsController {
  async create(request: Request, response: Response) {
    // request.user foi injetado pelo ensureAuthenticated
    const user_id = request.user?.id

    // Agora pode usar o user_id para associar o refund ao usuario
    const refund = await createRefundService.execute({
      user_id,
      ...request.body,
    })

    return response.status(201).json(refund)
  }
}
```

## Exemplo 6: authConfig referenciado no middleware

```typescript
// src/config/auth.ts
export const authConfig = {
  jwt: {
    secret: process.env.JWT_SECRET || "default-secret",
    expiresIn: "1d",
  },
}
```

O middleware importa `authConfig.jwt.secret` para validar o token. O secret deve ser o MESMO usado na geracao do token no login.

## Variacao: Middleware com roles (autorizacao)

Extensao natural do ensureAuthenticated — verificar se o usuario tem permissao:

```typescript
// src/middleware/ensureRole.ts
import { Request, Response, NextFunction } from "express"
import { AppError } from "@/utils/AppError"

export function ensureRole(allowedRoles: string[]) {
  return (request: Request, response: Response, next: NextFunction) => {
    const userRole = request.user?.role

    if (!userRole || !allowedRoles.includes(userRole)) {
      throw new AppError("Unauthorized", 403)
    }

    return next()
  }
}

// Uso nas rotas:
routes.delete(
  "/refunds/:id",
  ensureAuthenticated,
  ensureRole(["admin"]),
  deleteRefundController
)
```

## Configuracao do Insomnia para token dinamico

No Insomnia, para nao copiar/colar token manualmente:

1. Na aba Auth > Bearer Token do request protegido
2. Pressione `Ctrl + Space` no campo do token
3. Selecione **Response > Body Attribute**
4. Em **Request**: selecione a requisicao de Session (POST /sessions)
5. Em **Filter**: digite `$.token`
6. Em **Trigger**: selecione **Always**

Agora o Insomnia automaticamente executa o login e extrai o token antes de cada requisicao protegida.