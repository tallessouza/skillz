# Code Examples: Atualizacoes no Carrinho

## Teste de integracao (estrutura do teste mostrado na aula)

```typescript
// O teste cria um carrinho, adiciona item, atualiza quantidade, e verifica
test('should update cart item quantity', async () => {
  // 1. Criar carrinho (o reset sempre limpa, entao precisa criar)
  await createCart()

  // 2. Adicionar item com quantidade 2
  await addItemToCart({ productId: 1, quantity: 2 })

  // 3. PUT para atualizar quantidade para 5
  const updateResponse = await request
    .put(`/carts/${cartId}/items/${productId}`)
    .send({ quantity: 5 })

  expect(updateResponse.status).toBe(200)

  // 4. GET para verificar estado atualizado
  const getResponse = await request.get(`/carts/${cartId}`)
  const cart = getResponse.body

  const item = cart.items.find(i => i.productId === 1)
  expect(item.quantity).toBe(5)
})
```

## Service completo com getCart reutilizado

```typescript
class CartService {
  // Query completa — UNICA FONTE DE VERDADE para buscar carrinho
  async getCart(userId: string) {
    const result = await db
      .select({
        id: carts.id,
        userId: carts.userId,
        active: carts.active,
        items: jsonAggregate({
          id: cartItems.id,
          productId: cartItems.productId,
          quantity: cartItems.quantity,
          // joins com produto para dados completos
          productName: products.name,
          productPrice: products.price,
        }),
      })
      .from(carts)
      .leftJoin(cartItems, eq(cartItems.cartId, carts.id))
      .leftJoin(products, eq(products.id, cartItems.productId))
      .where(and(
        eq(carts.userId, userId),
        eq(carts.active, true),
      ))
      .groupBy(carts.id)

    return result[0] ?? null
  }

  // Update reutiliza getCart ao inves de query propria
  async updateCartItem({ productId, quantity, userId }: UpdateCartItemInput) {
    const cart = await this.getCart(userId)

    if (!cart) {
      throw new NotFoundError('Cart not found')
    }

    // Ownership ja verificada pelo filtro no getCart (userId + active)

    // Verificar se produto esta no carrinho
    const itemExists = cart.items.some(item => item.productId === productId)
    if (!itemExists) {
      throw new NotFoundError('Product not found in cart')
    }

    // Executar update
    await db.update(cartItems)
      .set({ quantity })
      .where(and(
        eq(cartItems.cartId, cart.id),
        eq(cartItems.productId, productId),
      ))

    // Retornar estado atualizado (reutiliza getCart novamente)
    return this.getCart(userId)
  }
}
```

## Tipagem — tipo simples vs tipo completo

```typescript
// Tipo simples — para operacoes internas que nao precisam de items
type CartBasic = {
  id: number
  userId: string
  active: boolean
}

// Tipo completo — para retorno ao cliente com items e dados do produto
type CartWithItems = CartBasic & {
  items: Array<{
    id: number
    productId: number
    quantity: number
    productName: string
    productPrice: number
  }>
}

// O instrutor decidiu usar SEMPRE o tipo completo via getCart()
// para evitar manter duas queries com tipos divergentes
```

## Conversao de params — o boundary pattern

```typescript
// NO CONTROLLER (boundary) — onde a conversao DEVE acontecer
app.put('/carts/:cartId/items/:productId', async (request) => {
  // Params SEMPRE chegam como string
  const productId = Number(request.params.productId)
  const cartId = Number(request.params.cartId)

  // Validacao pos-conversao
  if (isNaN(productId) || isNaN(cartId)) {
    throw new BadRequestError('Invalid ID format')
  }

  // Service recebe tipos corretos
  return cartService.updateCartItem({
    productId,  // number garantido
    quantity: request.body.quantity,
    userId: request.user.id,
  })
})

// NO SERVICE — NUNCA converter aqui, ja deve chegar correto
async updateCartItem({ productId, quantity, userId }: {
  productId: number    // Ja e number quando chega aqui
  quantity: number
  userId: string
}) {
  // ...
}
```

## JSON Aggregate com Drizzle (pattern usado na aula)

```typescript
// O instrutor usou jsonAggregate para transformar rows em array
const result = await db
  .select({
    id: carts.id,
    items: jsonAggregate(cartItems.productId),  // array de productIds
  })
  .from(carts)
  .leftJoin(cartItems, eq(cartItems.cartId, carts.id))
  .groupBy(carts.id)

// Sem groupBy, o join gera multiplas rows por carrinho
// Com groupBy + jsonAggregate, as rows viram um array dentro do carrinho
```