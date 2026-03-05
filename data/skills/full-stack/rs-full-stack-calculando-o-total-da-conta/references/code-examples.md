# Code Examples: Calculando o Total da Conta

## Exemplo 1: Estrutura inicial do controller (etapa por etapa)

### Etapa 1 — Esqueleto do metodo
```typescript
async show(request: Request, response: Response, next: NextFunction) {
  try {
    return response.json()
  } catch (error) {
    next(error)
  }
}
```

### Etapa 2 — Confirmar que o parametro chega
```typescript
async show(request: Request, response: Response, next: NextFunction) {
  try {
    const { table_session_id } = request.params
    return response.json({ table_session_id })
  } catch (error) {
    next(error)
  }
}
```

### Etapa 3 — Query basica sem agregacao
```typescript
const orders = await knex("orders")
  .where({ table_session_id })

return response.json(orders)
// Retorna array com todos os itens do pedido
```

### Etapa 4 — Agregacao com SUM
```typescript
const order = await knex("orders")
  .select(
    knex.raw("SUM(orders.price * orders.quantity) AS total")
  )
  .where({ table_session_id })
  .first()

return response.json(order)
// Retorna { total: 115 } — mas null se nao houver itens
```

### Etapa 5 — COALESCE para null safety
```typescript
const order = await knex("orders")
  .select(
    knex.raw("COALESCE(SUM(orders.price * orders.quantity), 0) AS total"),
    knex.raw("COALESCE(SUM(orders.quantity), 0) AS quantity")
  )
  .where({ table_session_id })
  .first()

return response.json(order)
// Retorna { total: 0, quantity: 0 } para sessao sem itens
```

## Exemplo 2: Definicao da rota

```typescript
// routes/order-routes.ts
import { Router } from "express"
import { OrdersController } from "../controllers/OrdersController"

const orderRoutes = Router()
const ordersController = new OrdersController()

// Listar itens de uma sessao
orderRoutes.get(
  "/table-session/:table_session_id",
  ordersController.index
)

// Total/resumo de uma sessao
orderRoutes.get(
  "/table-session/:table_session_id/total",
  ordersController.show
)

export { orderRoutes }
```

## Exemplo 3: Requisicao no Insomnia/Thunder Client

```http
### Listar itens do pedido
GET {{baseUrl}}/orders/table-session/2

### Total do pedido (sessao com itens)
GET {{baseUrl}}/orders/table-session/2/total
# Response: { "total": 115, "quantity": 3 }

### Total do pedido (sessao sem itens)
GET {{baseUrl}}/orders/table-session/3/total
# Response: { "total": 0, "quantity": 0 }
```

## Exemplo 4: Variacoes — outros cenarios de agregacao

### Total com desconto
```typescript
const order = await knex("orders")
  .select(
    knex.raw(`
      COALESCE(SUM(orders.price * orders.quantity * (1 - COALESCE(orders.discount, 0))), 0) AS total
    `)
  )
  .where({ table_session_id })
  .first()
```

### Total agrupado por produto
```typescript
const ordersByProduct = await knex("orders")
  .select(
    "orders.product_id",
    knex.raw("COALESCE(SUM(orders.price * orders.quantity), 0) AS subtotal"),
    knex.raw("COALESCE(SUM(orders.quantity), 0) AS quantity")
  )
  .where({ table_session_id })
  .groupBy("orders.product_id")
```

### Teste de mesa programatico
```typescript
// Validacao manual para desenvolvimento
const items = await knex("orders").where({ table_session_id })
const manualTotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

const { total } = await knex("orders")
  .select(knex.raw("COALESCE(SUM(price * quantity), 0) AS total"))
  .where({ table_session_id })
  .first()

console.assert(manualTotal === Number(total), `Mismatch: JS=${manualTotal}, SQL=${total}`)
```