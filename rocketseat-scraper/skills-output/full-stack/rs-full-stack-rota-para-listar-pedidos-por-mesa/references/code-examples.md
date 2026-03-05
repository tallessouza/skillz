# Code Examples: Rota Para Listar Pedidos Por Mesa

## Exemplo 1: Esqueleto inicial do metodo index (como o instrutor comeca)

```typescript
// OrdersController.ts — primeiro passo: confirmar que a rota funciona
async index(request: Request, response: Response, next: NextFunction) {
  try {
    return response.json()
  } catch (error) {
    next(error)
  }
}
```

O instrutor comeca retornando `response.json()` vazio apenas para validar que o endpoint responde com 200.

## Exemplo 2: Registro da rota

```typescript
// orders-routes.ts
import { Router } from "express"
import { OrdersController } from "../controllers/OrdersController"

const ordersRoutes = Router()
const ordersController = new OrdersController()

// Rota existente de criar pedido
ordersRoutes.post("/", ordersController.create)

// Nova rota de listar por sessao da mesa
ordersRoutes.get("/table-session/:id", ordersController.index)

export { ordersRoutes }
```

## Exemplo 3: URL completa para teste

```
GET {{base_url}}/orders/table-session/2
```

Onde:
- `{{base_url}}` = `http://localhost:3333` (variavel de ambiente)
- `/orders` = resource base (definido no router principal)
- `/table-session/2` = sub-rota com ID da sessao

## Exemplo 4: Controller completo com metodos create e index

```typescript
import { Request, Response, NextFunction } from "express"
import { knex } from "../database"

class OrdersController {
  async create(request: Request, response: Response, next: NextFunction) {
    try {
      const { table_session_id, product_id, quantity } = request.body

      await knex("orders").insert({
        table_session_id,
        product_id,
        quantity,
      })

      return response.status(201).json()
    } catch (error) {
      next(error)
    }
  }

  async index(request: Request, response: Response, next: NextFunction) {
    try {
      const { id } = request.params

      const orders = await knex("orders")
        .where("table_session_id", id)

      return response.json(orders)
    } catch (error) {
      next(error)
    }
  }
}

export { OrdersController }
```

## Variacao: Index com join para trazer dados do produto

```typescript
async index(request: Request, response: Response, next: NextFunction) {
  try {
    const { id } = request.params

    const orders = await knex("orders")
      .select("orders.*", "products.name as product_name", "products.price")
      .join("products", "products.id", "orders.product_id")
      .where("orders.table_session_id", id)

    return response.json(orders)
  } catch (error) {
    next(error)
  }
}
```

## Variacao: Index com tratamento de sessao inexistente

```typescript
async index(request: Request, response: Response, next: NextFunction) {
  try {
    const { id } = request.params

    const session = await knex("table_sessions").where("id", id).first()

    if (!session) {
      return response.status(404).json({ message: "Table session not found" })
    }

    const orders = await knex("orders").where("table_session_id", id)

    return response.json(orders)
  } catch (error) {
    next(error)
  }
}
```