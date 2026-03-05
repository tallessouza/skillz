# Code Examples: Definindo Papel do Usuário

## Exemplo completo do fluxo (da aula)

### 1. Definição do usuário com role

```typescript
// sessions-controller.ts
const fakeUser = {
  id: "user-id-123",
  role: "customer", // papel definido
}
```

### 2. Geração do JWT com role no payload

```typescript
// sessions-controller.ts
import { sign } from "jsonwebtoken"

const token = sign(
  { role: fakeUser.role }, // payload agora tem o role
  "minha-chave-secreta",
  { subject: fakeUser.id }
)
```

### 3. Interface de tipagem do payload

```typescript
// ensure-authenticated.ts (ou types/)
interface TokenPayload {
  role: string
  sub: string
}
```

### 4. Middleware extraindo role

```typescript
// ensure-authenticated.ts
import { verify } from "jsonwebtoken"
import { Request, Response, NextFunction } from "express"

function ensureAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction
) {
  const authHeader = request.headers.authorization

  if (!authHeader) {
    return response.status(401).json({ message: "Token missing" })
  }

  const [, token] = authHeader.split(" ")

  const { role, sub: userId } = verify(
    token,
    "minha-chave-secreta"
  ) as TokenPayload

  request.user = {
    id: userId,
    role,
  }

  return next()
}
```

### 5. Augmentação de tipos do Express

```typescript
// @types/express.d.ts
declare namespace Express {
  interface Request {
    user: {
      id: string
      role: string
    }
  }
}
```

### 6. Uso no controller

```typescript
// product-controller.ts
class ProductController {
  async create(request: Request, response: Response) {
    const { role } = request.user

    console.log(role) // "customer"

    // ... lógica de criação
  }
}
```

## Variação: Middleware de autorização por role

```typescript
// ensure-role.ts
function ensureRole(allowedRoles: string[]) {
  return (request: Request, response: Response, next: NextFunction) => {
    const { role } = request.user

    if (!allowedRoles.includes(role)) {
      return response.status(403).json({
        message: "Acesso não autorizado para este perfil",
      })
    }

    return next()
  }
}

// routes.ts
router.post(
  "/products",
  ensureAuthenticated,
  ensureRole(["seller", "admin"]),
  productController.create
)

router.get(
  "/products",
  ensureAuthenticated,
  // sem ensureRole — qualquer usuário autenticado pode listar
  productController.index
)
```

## Variação: Múltiplos roles

```typescript
interface TokenPayload {
  roles: string[] // array em vez de string única
  sub: string
}

// No sign
const token = sign(
  { roles: user.roles }, // ["seller", "admin"]
  secret,
  { subject: user.id }
)

// No middleware
const { roles, sub: userId } = verify(token, secret) as TokenPayload
request.user = { id: userId, roles }

// No express.d.ts
declare namespace Express {
  interface Request {
    user: {
      id: string
      roles: string[]
    }
  }
}

// No middleware de autorização
function ensureRole(allowedRoles: string[]) {
  return (request: Request, response: Response, next: NextFunction) => {
    const hasPermission = request.user.roles.some(role =>
      allowedRoles.includes(role)
    )

    if (!hasPermission) {
      return response.status(403).json({ message: "Sem permissão" })
    }

    return next()
  }
}
```

## Variação: Enum para roles (type-safe)

```typescript
enum UserRole {
  CUSTOMER = "customer",
  SELLER = "seller",
  ADMIN = "admin",
}

interface TokenPayload {
  role: UserRole
  sub: string
}

// Tipagem mais segura no middleware de autorização
function ensureRole(allowedRoles: UserRole[]) {
  return (request: Request, response: Response, next: NextFunction) => {
    if (!allowedRoles.includes(request.user.role as UserRole)) {
      return response.status(403).json({ message: "Sem permissão" })
    }
    return next()
  }
}

// Uso nas rotas
router.post(
  "/products",
  ensureAuthenticated,
  ensureRole([UserRole.SELLER, UserRole.ADMIN]),
  productController.create
)
```