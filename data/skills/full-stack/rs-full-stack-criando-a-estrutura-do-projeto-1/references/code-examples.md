# Code Examples: Estrutura de Projeto Express

## Exemplo 1: Controller completo

```typescript
// src/controllers/products-controller.ts
import { NextFunction, Request, Response } from "express"

class ProductsController {
  async index(request: Request, response: Response, next: NextFunction) {
    try {
      // Futuramente: buscar do banco de dados com await
      return response.json({ message: "ok" })
    } catch (error) {
      next(error)
    }
  }

  // Estrutura para novos métodos (mesmo padrão):
  async create(request: Request, response: Response, next: NextFunction) {
    try {
      // await db.insert(...)
      return response.status(201).json({ message: "created" })
    } catch (error) {
      next(error)
    }
  }

  async show(request: Request, response: Response, next: NextFunction) {
    try {
      // await db.findById(request.params.id)
      return response.json({ message: "detail" })
    } catch (error) {
      next(error)
    }
  }
}

export { ProductsController }
```

## Exemplo 2: Arquivo de rotas por domínio

```typescript
// src/routes/products-routes.ts
import { Router } from "express"
import { ProductsController } from "../controllers/products-controller"

const productRoutes = Router()
const productController = new ProductsController()

productRoutes.get("/", productController.index)
productRoutes.post("/", productController.create)
productRoutes.get("/:id", productController.show)

export { productRoutes }
```

## Exemplo 3: Index agregador

```typescript
// src/routes/index.ts
import { Router } from "express"
import { productRoutes } from "./products-routes"

const routes = Router()
routes.use("/products", productRoutes)

export { routes }
```

## Exemplo 4: Server.ts com rotas conectadas

```typescript
// src/server.ts
import express from "express"
import { routes } from "./routes"

const PORT = 3333
const app = express()

app.use(express.json())
app.use(routes)

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
```

## Variação: Adicionando um segundo domínio (orders)

Para replicar a estrutura para orders:

```typescript
// src/controllers/orders-controller.ts
import { NextFunction, Request, Response } from "express"

class OrdersController {
  async index(request: Request, response: Response, next: NextFunction) {
    try {
      return response.json({ message: "orders list" })
    } catch (error) {
      next(error)
    }
  }
}

export { OrdersController }
```

```typescript
// src/routes/orders-routes.ts
import { Router } from "express"
import { OrdersController } from "../controllers/orders-controller"

const orderRoutes = Router()
const orderController = new OrdersController()

orderRoutes.get("/", orderController.index)

export { orderRoutes }
```

```typescript
// src/routes/index.ts (atualizado)
import { Router } from "express"
import { productRoutes } from "./products-routes"
import { orderRoutes } from "./orders-routes"

const routes = Router()
routes.use("/products", productRoutes)
routes.use("/orders", orderRoutes)

export { routes }
```

O `server.ts` não muda — essa é a vantagem do padrão agregador.

## Variação: Testando no navegador

Para rotas GET, basta acessar no navegador:
```
http://localhost:3333/products
```

Resposta esperada:
```json
{ "message": "ok" }
```