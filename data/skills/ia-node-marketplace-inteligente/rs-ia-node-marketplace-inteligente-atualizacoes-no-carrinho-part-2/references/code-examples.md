# Code Examples: Remocao de Itens do Carrinho e Left Join Safety

## Exemplo completo: removeCartItem

```typescript
// src/services/cart.ts
import { db } from '../db'
import { carts, cartItems } from '../db/schema'
import { eq, and } from 'drizzle-orm'

export async function removeCartItem(userId: string, productId: string) {
  // 1. Buscar carrinho ativo (reutilizando funcao existente)
  const cart = await getActiveCart(userId)

  // 2. Validacao em cascata
  if (!cart) {
    throw new NotFoundError('Carrinho nao encontrado')
  }

  if (cart.userId !== userId) {
    throw new ForbiddenError('Carrinho nao pertence ao usuario')
  }

  const itemExists = cart.items.some(item => item.productId === productId)
  if (!itemExists) {
    throw new NotFoundError('Item nao encontrado no carrinho')
  }

  // 3. Executar delete
  await db.delete(cartItems).where(
    and(
      eq(cartItems.cartId, cart.id),
      eq(cartItems.productId, productId)
    )
  )
}
```

## Exemplo completo: getActiveCart com left join

```typescript
// src/services/cart.ts
export async function getActiveCart(userId: string) {
  const result = await db
    .select({
      id: carts.id,
      userId: carts.userId,
      storeId: carts.storeId,
      isActive: carts.isActive,
      items: {
        id: cartItems.id,
        productId: cartItems.productId,
        quantity: cartItems.quantity,
      }
    })
    .from(carts)
    .leftJoin(cartItems, eq(carts.id, cartItems.cartId))  // LEFT join
    .where(
      and(
        eq(carts.userId, userId),
        eq(carts.isActive, true)
      )
    )

  if (result.length === 0) {
    return null  // Nenhum carrinho ativo
  }

  // Tratar null do left join
  const cart = result[0]
  const items = cart.items?.id !== null
    ? result.map(row => row.items)  // Agregar items de multiplas rows
    : []  // Carrinho vazio

  return {
    id: cart.id,
    userId: cart.userId,
    storeId: cart.storeId,
    isActive: cart.isActive,
    items,
  }
}
```

## Exemplo completo: rota DELETE

```typescript
// src/routes/cart.ts
app.delete('/cart/items/:productId', async (request, reply) => {
  const { productId } = request.params as { productId: string }
  const userId = request.user.id

  await removeCartItem(userId, productId)

  return reply.status(204).send()
})
```

## Exemplo: correcao da duplicacao de carrinho

```typescript
// ANTES (bug: criava carrinho duplicado)
async function addToCart(userId: string, productId: string, quantity: number) {
  const cart = await getActiveCart(userId)
  const product = await getProduct(productId)

  if (cart && cart.storeId !== product.storeId) {
    await inactivateCart(cart.id)
    const newCart = await createCart(userId, product.storeId)
    await addItemToCart(newCart.id, productId, quantity)
    // FALTAVA return aqui!
  }

  // Este codigo executava MESMO quando loja era diferente
  const activeCart = cart ?? await createCart(userId, product.storeId)
  await addItemToCart(activeCart.id, productId, quantity)
}

// DEPOIS (corrigido: return dentro do if)
async function addToCart(userId: string, productId: string, quantity: number) {
  const cart = await getActiveCart(userId)
  const product = await getProduct(productId)

  if (cart && cart.storeId !== product.storeId) {
    await inactivateCart(cart.id)
    const newCart = await createCart(userId, product.storeId)
    await addItemToCart(newCart.id, productId, quantity)
    return  // IMPORTANTE: return para nao duplicar
  }

  const activeCart = cart ?? await createCart(userId, product.storeId)
  await addItemToCart(activeCart.id, productId, quantity)
}
```

## Exemplo: teste do remove

```typescript
it('should remove a product from cart', async () => {
  // Arrange: criar carrinho com produtos
  const cart = await createCartWithItems(userId, [
    { productId: product1.id, quantity: 2 },
    { productId: product2.id, quantity: 1 },
  ])

  // Act: remover um produto
  const response = await app.inject({
    method: 'DELETE',
    url: `/cart/items/${product1.id}`,
    headers: { authorization: `Bearer ${token}` },
  })

  // Assert
  expect(response.statusCode).toBe(204)

  // Verificar que item foi removido
  const updatedCart = await getActiveCart(userId)
  expect(updatedCart.items).toHaveLength(1)
  expect(updatedCart.items[0].productId).toBe(product2.id)
})
```