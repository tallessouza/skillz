# Code Examples: Validacao de Dados com Zod em Controllers Express

## Exemplo completo da aula: OrdersController

```typescript
// controllers/orders-controller.ts
import { Request, Response, NextFunction } from "express"
import { z } from "zod"

class OrdersController {
  async create(request: Request, response: Response, next: NextFunction) {
    try {
      const bodySchema = z.object({
        tableSessionId: z.number(),
        productId: z.number(),
        quantity: z.number(),
      })

      const { tableSessionId, productId, quantity } = bodySchema.parse(request.body)

      // logica de negocio sera implementada aqui

      return response.status(201).json({})
    } catch (error) {
      next(error)
    }
  }
}

export { OrdersController }
```

## Exemplo completo: orders-routes.ts

```typescript
// routes/orders-routes.ts
import { Router } from "express"
import { OrdersController } from "../controllers/orders-controller"

const ordersRoutes = Router()
const ordersController = new OrdersController()

ordersRoutes.post("/", ordersController.create)

export { ordersRoutes }
```

## Exemplo completo: index.ts de rotas

```typescript
// routes/index.ts
import { Router } from "express"
import { ordersRoutes } from "./orders-routes"

const routes = Router()

routes.use("/orders", ordersRoutes)

export { routes }
```

## Variacao: Validacao com campos opcionais

```typescript
const bodySchema = z.object({
  tableSessionId: z.number(),
  productId: z.number(),
  quantity: z.number().min(1),        // minimo 1
  observation: z.string().optional(),  // campo opcional
})
```

## Variacao: Validacao de params (para rotas com ID)

```typescript
async show(request: Request, response: Response, next: NextFunction) {
  try {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = paramsSchema.parse(request.params)

    // buscar pedido por id

    return response.status(200).json({})
  } catch (error) {
    next(error)
  }
}
```

## Variacao: Validacao de query params

```typescript
async index(request: Request, response: Response, next: NextFunction) {
  try {
    const querySchema = z.object({
      page: z.coerce.number().default(1),
      perPage: z.coerce.number().default(20),
    })

    const { page, perPage } = querySchema.parse(request.query)

    return response.status(200).json({})
  } catch (error) {
    next(error)
  }
}
```

## Teste no Insomnia

### Request sem body (erro de validacao):
```
POST http://localhost:3333/orders
Content-Type: application/json

// sem body
```

Resposta do Zod:
```json
{
  "message": "Validation error",
  "issues": [
    { "path": ["tableSessionId"], "message": "Required" },
    { "path": ["productId"], "message": "Required" },
    { "path": ["quantity"], "message": "Required" }
  ]
}
```

### Request com body valido:
```
POST http://localhost:3333/orders
Content-Type: application/json

{
  "tableSessionId": 1,
  "productId": 1,
  "quantity": 1
}
```

Resposta: `201 Created` com `{}`