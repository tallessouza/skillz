# Code Examples: Listando Mesas

## Exemplo completo do instrutor

### 1. Tipo do repositorio

```typescript
// src/database/types/table-repository.d.ts
type TableRepository = {
  id: number
  table_number: number
  created_at: string
  updated_at: string
}
```

### 2. Controller

```typescript
// src/tables-controller.ts
import { Request, Response, NextFunction } from "express"
import knex from "@/database/knex"

class TablesController {
  async index(request: Request, response: Response, next: NextFunction) {
    try {
      const tables = await knex<TableRepository>("tables")
        .select()
        .orderBy("table_number")

      return response.json(tables)
    } catch (error) {
      next(error)
    }
  }
}

export { TablesController }
```

### 3. Arquivo de rotas

```typescript
// src/routes/tables-routes.ts
import { Router } from "express"
import { TablesController } from "@/tables-controller"

const tablesRoutes = Router()
const tablesController = new TablesController()

tablesRoutes.get("/", tablesController.index)

export { tablesRoutes }
```

### 4. Registro no index

```typescript
// src/routes/index.ts
import { tablesRoutes } from "./tables-routes"

// ... outras rotas existentes
routes.use("/tables", tablesRoutes)
```

## Variacoes

### Listagem com filtro por query param

```typescript
async index(request: Request, response: Response, next: NextFunction) {
  try {
    const { status } = request.query

    const query = knex<TableRepository>("tables").select()

    if (status) {
      query.where({ status: String(status) })
    }

    const tables = await query.orderBy("table_number")
    return response.json(tables)
  } catch (error) {
    next(error)
  }
}
```

### Listagem com paginacao

```typescript
async index(request: Request, response: Response, next: NextFunction) {
  try {
    const page = Number(request.query.page) || 1
    const perPage = 20

    const tables = await knex<TableRepository>("tables")
      .select()
      .orderBy("table_number")
      .limit(perPage)
      .offset((page - 1) * perPage)

    return response.json(tables)
  } catch (error) {
    next(error)
  }
}
```

### Mesmo padrao para outro recurso (orders)

```typescript
// src/database/types/order-repository.d.ts
type OrderRepository = {
  id: number
  table_session_id: number
  product_id: number
  quantity: number
  price: number
  created_at: string
  updated_at: string
}

// src/orders-controller.ts
class OrdersController {
  async index(request: Request, response: Response, next: NextFunction) {
    try {
      const orders = await knex<OrderRepository>("orders")
        .select()
        .orderBy("created_at", "desc")

      return response.json(orders)
    } catch (error) {
      next(error)
    }
  }
}

// src/routes/orders-routes.ts
const ordersRoutes = Router()
const ordersController = new OrdersController()
ordersRoutes.get("/", ordersController.index)
export { ordersRoutes }

// src/routes/index.ts
routes.use("/orders", ordersRoutes)
```