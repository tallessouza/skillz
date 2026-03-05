# Code Examples: Validando Restaurante nas Rotas

## Exemplo 1: getOrderDetails

```typescript
// ANTES — sem validacao de ownership
export async function getOrderDetails({ orderId }: GetOrderDetailsParams) {
  const order = await db
    .select()
    .from(orders)
    .where(eq(orders.id, orderId))

  return order
}

// DEPOIS — com validacao de ownership
export async function getOrderDetails({
  orderId,
  restaurantId,
}: GetOrderDetailsParams) {
  const order = await db
    .select()
    .from(orders)
    .where(
      and(
        eq(orders.id, orderId),
        eq(orders.restaurantId, restaurantId)
      )
    )

  return order
}
```

## Exemplo 2: approveOrder

```typescript
export async function approveOrder({
  orderId,
  restaurantId,
}: ApproveOrderParams) {
  const [order] = await db
    .update(orders)
    .set({ status: 'approved' })
    .where(
      and(
        eq(orders.id, orderId),
        eq(orders.restaurantId, restaurantId)
      )
    )
    .returning()

  if (!order) {
    throw new Error('Order not found or does not belong to your restaurant')
  }

  return order
}
```

## Exemplo 3: cancelOrder

```typescript
export async function cancelOrder({
  orderId,
  restaurantId,
}: CancelOrderParams) {
  const [order] = await db
    .update(orders)
    .set({ status: 'cancelled' })
    .where(
      and(
        eq(orders.id, orderId),
        eq(orders.restaurantId, restaurantId)
      )
    )
    .returning()

  if (!order) {
    throw new Error('Order not found or does not belong to your restaurant')
  }

  return order
}
```

## Exemplo 4: dispatchOrder

```typescript
export async function dispatchOrder({
  orderId,
  restaurantId,
}: DispatchOrderParams) {
  const [order] = await db
    .update(orders)
    .set({ status: 'dispatched' })
    .where(
      and(
        eq(orders.id, orderId),
        eq(orders.restaurantId, restaurantId)
      )
    )
    .returning()

  if (!order) {
    throw new Error('Order not found or does not belong to your restaurant')
  }

  return order
}
```

## Padrao reutilizavel: helper de ownership

```typescript
// Se voce tem muitas rotas com a mesma validacao, extraia um helper
function withRestaurantOwnership(
  resourceId: string,
  restaurantId: string,
  table: typeof orders
) {
  return and(
    eq(table.id, resourceId),
    eq(table.restaurantId, restaurantId)
  )
}

// Uso:
const order = await db
  .select()
  .from(orders)
  .where(withRestaurantOwnership(orderId, restaurantId, orders))
```