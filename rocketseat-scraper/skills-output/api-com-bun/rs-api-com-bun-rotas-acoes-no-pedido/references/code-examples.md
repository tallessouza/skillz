# Code Examples: Rotas — Acoes no Pedido

## Cancel Order

```typescript
app.patch("/orders/:id/cancel", async ({ params, set }) => {
  const order = await db.query.orders.findFirst({
    where(fields, { eq }) {
      return eq(fields.id, params.id)
    },
  })

  if (!order) {
    set.status = 404
    return { message: "Order not found." }
  }

  // Cancel so e permitido em pending ou processing
  if (!["pending", "processing"].includes(order.status)) {
    set.status = 400
    return { message: "You cannot cancel orders after dispatch." }
  }

  await db.update(orders).set({ status: "canceled" }).where(eq(orders.id, params.id))

  return { message: "Order canceled." }
})
```

## Dispatch Order

```typescript
app.patch("/orders/:id/dispatch", async ({ params, set }) => {
  const order = await db.query.orders.findFirst({
    where(fields, { eq }) {
      return eq(fields.id, params.id)
    },
  })

  if (!order) {
    set.status = 404
    return { message: "Order not found." }
  }

  // Dispatch so e permitido em processing
  if (order.status !== "processing") {
    set.status = 400
    return { message: "You cannot dispatch orders that are not in processing status." }
  }

  await db.update(orders).set({ status: "delivering" }).where(eq(orders.id, params.id))

  return { message: "Order dispatched." }
})
```

## Deliver Order

```typescript
app.patch("/orders/:id/deliver", async ({ params, set }) => {
  const order = await db.query.orders.findFirst({
    where(fields, { eq }) {
      return eq(fields.id, params.id)
    },
  })

  if (!order) {
    set.status = 404
    return { message: "Order not found." }
  }

  // Deliver so e permitido em delivering
  if (order.status !== "delivering") {
    set.status = 400
    return { message: "You cannot deliver orders that are not in delivering status." }
  }

  await db.update(orders).set({ status: "delivered" }).where(eq(orders.id, params.id))

  return { message: "Order delivered." }
})
```

## Registro no Server

```typescript
// No arquivo principal do server, registrar todas as rotas:
import { cancelOrder } from "./routes/cancel-order"
import { dispatchOrder } from "./routes/dispatch-order"
import { deliverOrder } from "./routes/deliver-order"

app.use(cancelOrder)
app.use(dispatchOrder)
app.use(deliverOrder)
```

## Variacao: Factory de acoes (para projetos maiores)

```typescript
// Se o padrao se repetir muitas vezes, extraia uma factory:
function createOrderAction(config: {
  action: string
  allowedStatuses: string[]
  newStatus: string
  errorMessage: string
  successMessage: string
}) {
  return app.patch(`/orders/:id/${config.action}`, async ({ params, set }) => {
    const order = await db.query.orders.findFirst({
      where(fields, { eq }) {
        return eq(fields.id, params.id)
      },
    })

    if (!order) {
      set.status = 404
      return { message: "Order not found." }
    }

    if (!config.allowedStatuses.includes(order.status)) {
      set.status = 400
      return { message: config.errorMessage }
    }

    await db.update(orders).set({ status: config.newStatus }).where(eq(orders.id, params.id))

    return { message: config.successMessage }
  })
}

// Uso:
createOrderAction({
  action: "cancel",
  allowedStatuses: ["pending", "processing"],
  newStatus: "canceled",
  errorMessage: "You cannot cancel orders after dispatch.",
  successMessage: "Order canceled.",
})
```

## Tabela completa de transicoes

```typescript
// Referencia rapida de todas as acoes e seus status:
const ORDER_TRANSITIONS = {
  approve:  { from: ["pending"],                to: "processing"  },
  dispatch: { from: ["processing"],             to: "delivering"  },
  deliver:  { from: ["delivering"],             to: "delivered"   },
  cancel:   { from: ["pending", "processing"],  to: "canceled"    },
} as const
```

## Fluxo de teste manual (Hopscotch)

```
1. Criar pedido → status: "pending"
2. PATCH /orders/:id/approve → status: "processing"
3. PATCH /orders/:id/dispatch → status: "delivering"
4. PATCH /orders/:id/deliver → status: "delivered"

Fluxo alternativo (cancelamento):
1. Criar pedido → status: "pending"
2. PATCH /orders/:id/cancel → status: "canceled"

Ou:
1. Criar pedido → status: "pending"
2. PATCH /orders/:id/approve → status: "processing"
3. PATCH /orders/:id/cancel → status: "canceled"

Teste de erro:
1. Pedido em "delivering"
2. PATCH /orders/:id/cancel → 400: "You cannot cancel orders after dispatch."
```