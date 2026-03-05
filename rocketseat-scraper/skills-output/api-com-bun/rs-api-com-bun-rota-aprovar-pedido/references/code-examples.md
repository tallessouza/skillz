# Code Examples: Rota de Aprovar Pedido

## Exemplo completo da aula

```typescript
import { eq } from 'drizzle-orm'

// Arquivo: approve-order.ts
export function approveOrder(app) {
  app.patch('/orders/:orderId/approve', async (request, response) => {
    // 1. Validar parametros
    const { orderId } = z.object({
      orderId: z.string()
    }).parse(request.params)

    // 2. Autenticar
    const restaurantId = await getCurrentUser()
    if (!restaurantId) {
      throw new UnauthorizedError()
    }

    // 3. Buscar pedido
    const order = await db.query.orders.findFirst({
      where: eq(orders.id, orderId)
    })

    // 4. Verificar existencia
    if (!order) {
      return response.status(400).json({
        message: 'Order not found'
      })
    }

    // 5. Verificar pre-condicao de status
    if (order.status !== 'pending') {
      return response.status(400).json({
        message: 'You can only approve pending orders'
      })
    }

    // 6. Executar mutacao
    await db.update(orders)
      .set({ status: 'processing' })
      .where(eq(orders.id, order.id))
  })
}
```

## Registro da rota no servidor

```typescript
import { approveOrder } from './routes/approve-order'

// No arquivo principal do servidor
approveOrder(app)
```

## Padrao para outras transicoes de status (mesmo pattern)

### Cancel Order

```typescript
app.patch('/orders/:orderId/cancel', async (request, response) => {
  const { orderId } = z.object({ orderId: z.string() }).parse(request.params)
  const restaurantId = await getCurrentUser()
  if (!restaurantId) throw new UnauthorizedError()

  const order = await db.query.orders.findFirst({
    where: eq(orders.id, orderId)
  })

  if (!order) {
    return response.status(400).json({ message: 'Order not found' })
  }

  // Regra diferente: nao pode cancelar se ja entregue ou em entrega
  if (['delivered', 'delivering'].includes(order.status)) {
    return response.status(400).json({
      message: 'Cannot cancel orders that are already delivered or in delivery'
    })
  }

  await db.update(orders)
    .set({ status: 'canceled' })
    .where(eq(orders.id, order.id))
})
```

### Dispatch Order

```typescript
app.patch('/orders/:orderId/dispatch', async (request, response) => {
  // ... mesmo padrao de validacao ...

  // Regra: so pode despachar pedidos em processing
  if (order.status !== 'processing') {
    return response.status(400).json({
      message: 'You can only dispatch orders that are being processed'
    })
  }

  await db.update(orders)
    .set({ status: 'delivering' })
    .where(eq(orders.id, order.id))
})
```

## Teste com Hopscotch/Insomnia

```
# 1. Encontrar um pedido pendente
GET /orders?status=pending

# 2. Aprovar
PATCH /orders/{orderId}/approve
# Resposta esperada: 200 (sem body ou com { success: true })

# 3. Verificar
GET /orders/{orderId}
# Resposta esperada: { status: "processing", ... }

# 4. Tentar aprovar de novo (deve falhar)
PATCH /orders/{orderId}/approve
# Resposta esperada: 400 { message: "You can only approve pending orders" }
```