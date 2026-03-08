# Code Examples: Rotas e Controllers no Express

## Exemplo completo da aula

### Controller de usuario

```typescript
// src/controllers/users-controller.ts
import { Request, Response } from "express"

class UsersController {
  create(request: Request, response: Response) {
    return response.json({ message: "ok" })
  }
}

export { UsersController }
```

### Rotas de usuario

```typescript
// src/routes/users-routes.ts
import { Router } from "express"
import { UsersController } from "../controllers/users-controller"

const usersRoutes = Router()
const usersController = new UsersController()

// Inicialmente testado com GET, mas o correto e POST
usersRoutes.post("/", usersController.create)

export { usersRoutes }
```

### Index centralizador

```typescript
// src/routes/index.ts
import { Router } from "express"
import { usersRoutes } from "./users-routes"

const routes = Router()

routes.use("/users", usersRoutes)

export { routes }
```

### Registro no app

```typescript
// src/app.ts
import express from "express"
import { routes } from "./routes"

const app = express()

app.use(express.json())
app.use(routes)

export { app }
```

## Variacao: Controller com multiplos metodos

```typescript
// src/controllers/users-controller.ts
import { Request, Response } from "express"

class UsersController {
  create(request: Request, response: Response) {
    const { name, email } = request.body
    // logica de criacao
    return response.status(201).json({ name, email })
  }

  index(request: Request, response: Response) {
    // logica de listagem
    return response.json({ users: [] })
  }

  show(request: Request, response: Response) {
    const { id } = request.params
    // logica de busca por id
    return response.json({ id })
  }

  update(request: Request, response: Response) {
    const { id } = request.params
    const { name, email } = request.body
    // logica de atualizacao
    return response.json({ id, name, email })
  }

  delete(request: Request, response: Response) {
    const { id } = request.params
    // logica de remocao
    return response.status(204).send()
  }
}

export { UsersController }
```

## Variacao: Rotas com todos os metodos CRUD

```typescript
// src/routes/users-routes.ts
import { Router } from "express"
import { UsersController } from "../controllers/users-controller"

const usersRoutes = Router()
const usersController = new UsersController()

usersRoutes.post("/", usersController.create)
usersRoutes.get("/", usersController.index)
usersRoutes.get("/:id", usersController.show)
usersRoutes.put("/:id", usersController.update)
usersRoutes.delete("/:id", usersController.delete)

export { usersRoutes }
```

## Variacao: Adicionando um segundo recurso

```typescript
// src/controllers/orders-controller.ts
import { Request, Response } from "express"

class OrdersController {
  create(request: Request, response: Response) {
    return response.status(201).json({ message: "Order created" })
  }

  index(request: Request, response: Response) {
    return response.json({ orders: [] })
  }
}

export { OrdersController }
```

```typescript
// src/routes/orders-routes.ts
import { Router } from "express"
import { OrdersController } from "../controllers/orders-controller"

const ordersRoutes = Router()
const ordersController = new OrdersController()

ordersRoutes.post("/", ordersController.create)
ordersRoutes.get("/", ordersController.index)

export { ordersRoutes }
```

```typescript
// src/routes/index.ts — atualizado com novo recurso
import { Router } from "express"
import { usersRoutes } from "./users-routes"
import { ordersRoutes } from "./orders-routes"

const routes = Router()

routes.use("/users", usersRoutes)
routes.use("/orders", ordersRoutes)

export { routes }
```

## Variacao: Testando com GET no navegador

```typescript
// TEMPORARIO — so para teste rapido
usersRoutes.get("/", usersController.create)

// Testar no navegador: http://localhost:3333/users
// Resultado: { "message": "ok" }

// DEPOIS DO TESTE — restaurar para POST
usersRoutes.post("/", usersController.create)
```