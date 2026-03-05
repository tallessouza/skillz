# Code Examples: Gerenciamento de Carrinho Multi-Loja

## Teste: adicionar produto a carrinho existente (mesma loja)

```typescript
it('should add a product to an existing cart if the store is the same', async () => {
  // Adiciona produto 1 (loja 1)
  const response1 = await request(app)
    .post('/cart')
    .send({ productId: 1, quantity: 1 })
  expect(response1.status).toBe(201)

  // Adiciona produto 2 (mesma loja 1, quantidade 3)
  const response2 = await request(app)
    .post('/cart')
    .send({ productId: 2, quantity: 3 })
  expect(response2.status).toBe(201)

  // Busca carrinho ativo
  const responseCart = await request(app).get('/cart')

  // Mesmo carrinho para ambas as requisicoes
  expect(response1.body.id).toBe(response2.body.id)
  expect(responseCart.body.id).toBe(response1.body.id)

  // Dois itens no carrinho
  expect(responseCart.body.items).toHaveLength(2)
  expect(responseCart.body.items[0].productId).toBe(1)
  expect(responseCart.body.items[1].productId).toBe(2)
})
```

## Teste: upsert de quantidade (mesmo produto adicionado de novo)

```typescript
// Adiciona produto 2 mais uma vez (1 unidade)
const response3 = await request(app)
  .post('/cart')
  .send({ productId: 2, quantity: 1 })

// Mesmo carrinho
expect(response3.body.id).toBe(response1.body.id)

// Produto 2 agora tem 4 unidades (3 + 1)
const updatedCart = await request(app).get('/cart')
const product2Item = updatedCart.body.items.find(i => i.productId === 2)
expect(product2Item.quantity).toBe(4)
```

## Teste: criar novo carrinho quando loja e diferente

```typescript
it('should create a new cart when the product is from a different store', async () => {
  // Adiciona produto 1 (loja 1)
  const response1 = await request(app)
    .post('/cart')
    .send({ productId: 1, quantity: 1 })
  expect(response1.status).toBe(201)

  // Adiciona produto 17 (loja diferente)
  const response2 = await request(app)
    .post('/cart')
    .send({ productId: 17, quantity: 1 })
  expect(response2.status).toBe(201)

  // IDs diferentes — novo carrinho criado
  expect(response2.body.id).not.toBe(response1.body.id)

  // Carrinho ativo agora e o novo
  const responseCart = await request(app).get('/cart')
  expect(responseCart.body.id).toBe(response2.body.id)
})
```

## Logica completa do addToCart (implementacao da aula)

```typescript
async function addToCart(userId: string, productId: string, quantity: number) {
  // 1. Verificar produto
  const product = await db.select().from(products).where(eq(products.id, productId))
  if (!product.length) throw new Error('Product not found')

  // 2. Buscar carrinho ativo (sem filtrar por loja)
  const [existingCart] = await db
    .select()
    .from(carts)
    .where(and(eq(carts.userId, userId), eq(carts.active, true)))

  // 3. Mesma loja — adicionar item ao carrinho existente
  if (existingCart && existingCart.storeId === product[0].storeId) {
    await db
      .insert(cartItems)
      .values({
        cartId: existingCart.id,
        productId,
        quantity,
      })
      .onConflictDoUpdate({
        target: [cartItems.cartId, cartItems.productId],
        set: {
          quantity: sql`${cartItems.quantity} + ${quantity}`,
        },
      })
    return existingCart
  }

  // 4. Loja diferente — desativar carrinho anterior
  if (existingCart && existingCart.storeId !== product[0].storeId) {
    await db
      .update(carts)
      .set({ active: false })
      .where(eq(carts.id, existingCart.id))
  }

  // 5. Criar novo carrinho
  const [newCart] = await db
    .insert(carts)
    .values({
      userId,
      storeId: product[0].storeId,
      active: true,
    })
    .returning()

  // 6. Inserir item
  await db.insert(cartItems).values({
    cartId: newCart.id,
    productId,
    quantity,
  })

  return newCart
}
```

## ON CONFLICT — upsert pattern com Drizzle

```typescript
// Padrao upsert: se o par (cartId, productId) ja existe,
// soma a quantidade ao inves de falhar
await db
  .insert(cartItems)
  .values({ cartId, productId, quantity })
  .onConflictDoUpdate({
    target: [cartItems.cartId, cartItems.productId],
    set: {
      quantity: sql`${cartItems.quantity} + ${quantity}`,
    },
  })
```

## Desativar carrinho anterior

```typescript
// Setar active = false pelo ID especifico
await db
  .update(carts)
  .set({ active: false })
  .where(eq(carts.id, existingCart.id))
```