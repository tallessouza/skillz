# Code Examples: Controller e Rota de Refunds

## Exemplo completo: Controller

```typescript
// src/controllers/refunds-controller.ts
import { Request, Response } from "express"

class RefundsController {
  async create(request: Request, response: Response) {
    return response.json({ message: "ok" })
  }
}

export { RefundsController }
```

### Variacao: Controller com multiplos metodos

```typescript
// src/controllers/refunds-controller.ts
import { Request, Response } from "express"

class RefundsController {
  async create(request: Request, response: Response) {
    // Logica de criacao de refund
    return response.json({ message: "ok" })
  }

  async index(request: Request, response: Response) {
    // Listar refunds do usuario
    return response.json({ refunds: [] })
  }

  async show(request: Request, response: Response) {
    const { id } = request.params
    // Buscar refund especifico
    return response.json({ id })
  }
}

export { RefundsController }
```

## Exemplo completo: Routes

```typescript
// src/routes/refunds-routes.ts
import { Router } from "express"
import { RefundsController } from "../controllers/refunds-controller"

const refundsRoutes = Router()
const refundsController = new RefundsController()

refundsRoutes.post("/", refundsController.create)

export { refundsRoutes }
```

### Variacao: Routes com multiplos endpoints

```typescript
// src/routes/refunds-routes.ts
import { Router } from "express"
import { RefundsController } from "../controllers/refunds-controller"

const refundsRoutes = Router()
const refundsController = new RefundsController()

refundsRoutes.post("/", refundsController.create)
refundsRoutes.get("/", refundsController.index)
refundsRoutes.get("/:id", refundsController.show)

export { refundsRoutes }
```

## Exemplo completo: Index de rotas

```typescript
// src/routes/index.ts
import { Router } from "express"
import { usersRoutes } from "./users-routes"
import { authRoutes } from "./auth-routes"
import { refundsRoutes } from "./refunds-routes"

const routes = Router()

// Rotas publicas
routes.use("/users", usersRoutes)
routes.use("/auth", authRoutes)

// Rotas privadas (preparadas para middleware de auth)
routes.use("/refunds", refundsRoutes)

export { routes }
```

### Variacao: Index com middleware de autenticacao

```typescript
// src/routes/index.ts
import { Router } from "express"
import { usersRoutes } from "./users-routes"
import { authRoutes } from "./auth-routes"
import { refundsRoutes } from "./refunds-routes"
import { ensureAuthenticated } from "../middlewares/ensure-authenticated"

const routes = Router()

// Rotas publicas
routes.use("/users", usersRoutes)
routes.use("/auth", authRoutes)

// Rotas privadas
routes.use("/refunds", ensureAuthenticated, refundsRoutes)

export { routes }
```

## Configuracao do Insomnia

### Environment da pasta Refunds (JSON)

```json
{
  "resource": "refunds"
}
```

### URL da requisicao POST

```
{{ base_url }}/{{ resource }}
```

Resultado montado: `http://localhost:3333/refunds`

## Padrao completo: adicionando novo recurso

Para adicionar qualquer novo recurso (ex: `orders`), siga os mesmos passos:

### 1. Controller

```typescript
// src/controllers/orders-controller.ts
import { Request, Response } from "express"

class OrdersController {
  async create(request: Request, response: Response) {
    return response.json({ message: "ok" })
  }
}

export { OrdersController }
```

### 2. Routes

```typescript
// src/routes/orders-routes.ts
import { Router } from "express"
import { OrdersController } from "../controllers/orders-controller"

const ordersRoutes = Router()
const ordersController = new OrdersController()

ordersRoutes.post("/", ordersController.create)

export { ordersRoutes }
```

### 3. Index

```typescript
import { ordersRoutes } from "./orders-routes"

routes.use("/orders", ordersRoutes)
```

### 4. Insomnia

- Nova pasta: `Orders`
- Environment: `{ "resource": "orders" }`
- Requisicao POST: `{{ base_url }}/{{ resource }}`