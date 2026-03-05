# Code Examples: Escolhendo o Carrinho Sugerido

## Exemplo 1: Chat Service — useCart

O metodo no chat service recebe apenas o `cartId` (nao o objeto completo):

```typescript
// chat.service.ts
async useCart(cartId: string, userId: string) {
  // Verificar existencia do carrinho
  const cart = await this.cartRepository.findById(cartId)
  if (!cart) {
    throw new Error('Cart not found')
  }

  // Desativar TODOS os carrinhos ativos do usuario
  await this.cartRepository.updateMany(
    { userId, active: true },
    { active: false }
  )

  // Ativar apenas o carrinho escolhido
  await this.cartRepository.update(cartId, { active: true })
}
```

## Exemplo 2: Repository — deactivate all by user

```typescript
// cart.repository.ts
async deactivateAllByUserId(userId: string) {
  await db.update(carts)
    .set({ active: false })
    .where(
      and(
        eq(carts.userId, userId),
        eq(carts.active, true)
      )
    )
}

async activate(cartId: string) {
  await db.update(carts)
    .set({ active: true })
    .where(eq(carts.id, cartId))
}
```

## Exemplo 3: Controller — rota POST /cart/:id/use

```typescript
// cart.controller.ts
router.post('/cart/:id/use', authMiddleware, async (req, res) => {
  const { id } = req.params
  const userId = req.userId

  await chatService.useCart(id, userId)

  return res.status(204).send()
})
```

## Exemplo 4: Variacao com transacao (para producao)

Para garantir atomicidade em producao, envolva as operacoes em uma transacao:

```typescript
async useCart(cartId: string, userId: string) {
  const cart = await this.cartRepository.findById(cartId)
  if (!cart) throw new Error('Cart not found')

  await db.transaction(async (tx) => {
    await tx.update(carts)
      .set({ active: false })
      .where(
        and(eq(carts.userId, userId), eq(carts.active, true))
      )

    await tx.update(carts)
      .set({ active: true })
      .where(eq(carts.id, cartId))
  })
}
```

## Exemplo 5: Teste basico

O instrutor menciona que "e mais tranquilinha de fazer teste" — a rota so ativa/desativa:

```typescript
describe('POST /cart/:id/use', () => {
  it('should activate the chosen cart and deactivate others', async () => {
    // Setup: criar 2 carrinhos, ambos ativos
    const cart1 = await createCart({ userId: 'user-1', active: true })
    const cart2 = await createCart({ userId: 'user-1', active: true })

    // Act: selecionar cart2
    await request(app)
      .post(`/cart/${cart2.id}/use`)
      .set('Authorization', 'Bearer token-user-1')
      .expect(204)

    // Assert: apenas cart2 ativo
    const carts = await getCartsByUserId('user-1')
    expect(carts.find(c => c.id === cart1.id).active).toBe(false)
    expect(carts.find(c => c.id === cart2.id).active).toBe(true)
  })

  it('should work even if cart is already active', async () => {
    const cart = await createCart({ userId: 'user-1', active: true })

    await request(app)
      .post(`/cart/${cart.id}/use`)
      .set('Authorization', 'Bearer token-user-1')
      .expect(204)

    const updated = await getCartById(cart.id)
    expect(updated.active).toBe(true)
  })
})
```