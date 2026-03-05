# Code Examples: Middleware de Autorização

## Exemplo 1: Middleware completo

```typescript
// src/middlewares/VerifyUserAuthorization.ts
import { Request, Response, NextFunction } from "express"
import { AppError } from "../utils/AppError"

function VerifyUserAuthorization(roles: string[]) {
  return (request: Request, response: Response, next: NextFunction) => {
    if (!request.user || !roles.includes(request.user.rule)) {
      throw new AppError("Unauthorized", 401)
    }

    return next()
  }
}

export { VerifyUserAuthorization }
```

## Exemplo 2: Aplicação em rota específica

```typescript
// src/routes/products.routes.ts
import { Router } from "express"
import { ProductsController } from "../controllers/ProductsController"
import { EnsureAuthenticated } from "../middlewares/EnsureAuthenticated"
import { VerifyUserAuthorization } from "../middlewares/VerifyUserAuthorization"

const productsRoutes = Router()
const productsController = new ProductsController()

// Listar — qualquer autenticado
productsRoutes.get("/", EnsureAuthenticated, productsController.index)

// Criar — apenas sale e admin
productsRoutes.post(
  "/",
  EnsureAuthenticated,
  VerifyUserAuthorization(["sale", "admin"]),
  productsController.create
)
```

## Exemplo 3: Aplicação em grupo de rotas

```typescript
// Quando TODAS as rotas precisam da mesma autorização
const adminRoutes = Router()

adminRoutes.use(EnsureAuthenticated)
adminRoutes.use(VerifyUserAuthorization(["admin"]))

// Todas as rotas abaixo exigem role "admin"
adminRoutes.get("/users", usersController.index)
adminRoutes.delete("/users/:id", usersController.delete)
adminRoutes.put("/settings", settingsController.update)
```

## Exemplo 4: Múltiplos perfis por rota

```typescript
// Diferentes rotas, diferentes combinações de roles
productsRoutes.get(
  "/",
  EnsureAuthenticated,
  productsController.index
)

productsRoutes.post(
  "/",
  EnsureAuthenticated,
  VerifyUserAuthorization(["sale", "admin"]),
  productsController.create
)

productsRoutes.delete(
  "/:id",
  EnsureAuthenticated,
  VerifyUserAuthorization(["admin"]),
  productsController.delete
)
```

## Exemplo 5: Contexto — como o user.rule chega no request

```typescript
// No middleware de autenticação (EnsureAuthenticated), após validar o token:
const { sub: user_id, rule } = verify(token, authConfig.jwt.secret)

request.user = {
  id: user_id,
  rule: rule, // "customer", "sale", "admin", etc.
}

// Agora o VerifyUserAuthorization pode acessar request.user.rule
```

## Exemplo 6: Type augmentation para request.user

```typescript
// src/@types/express/index.d.ts
declare namespace Express {
  export interface Request {
    user?: {
      id: string
      rule: string
    }
  }
}
```

O `?` (opcional) é o motivo pelo qual o middleware de autorização verifica `!request.user` antes de acessar `.rule` — o TypeScript sabe que user pode não existir.

## Fluxo de teste demonstrado na aula

```bash
# 1. Usuário com role "customer" tenta criar produto
# POST /products → 401 Unauthorized (customer não está em ["sale", "admin"])

# 2. Alterar role para "sale" no código/banco
# 3. Re-autenticar (POST /sessions) para obter novo token

# 4. Com novo token, tentar criar produto
# POST /products → 200 OK (sale está em ["sale", "admin"])

# 5. Listar produtos (sem autorização na rota)
# GET /products → 200 OK (qualquer autenticado pode listar)
```