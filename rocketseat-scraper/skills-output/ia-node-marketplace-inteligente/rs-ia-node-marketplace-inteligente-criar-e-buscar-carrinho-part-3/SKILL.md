---
name: rs-ia-node-marketplace-criar-buscar-carrinho-3
description: "Enforces cart management patterns for marketplace APIs with multi-store logic. Use when user asks to 'add to cart', 'manage cart items', 'handle shopping cart', 'implement cart logic', or 'build e-commerce cart'. Applies rules: one active cart per user, same-store concatenation, different-store cart replacement, upsert on duplicate items via ON CONFLICT. Make sure to use this skill whenever implementing cart or checkout features in a marketplace with multiple stores. Not for payment processing, order fulfillment, or frontend cart UI."
---

# Gerenciamento de Carrinho Multi-Loja

> Ao implementar carrinho em marketplace, garanta um unico carrinho ativo por usuario, concatenando itens da mesma loja e substituindo o carrinho ao trocar de loja.

## Rules

1. **Um carrinho ativo por vez** — sempre que criar novo carrinho, setar `active = false` no anterior, porque o usuario so pode comprar de uma loja por pedido
2. **Mesma loja = concatenar** — se produto pertence a mesma loja do carrinho ativo, apenas inserir novo `cart_item`, porque o carrinho ja existe e e valido
3. **Loja diferente = novo carrinho** — se produto e de outra loja, criar carrinho novo e desativar o anterior, porque assumimos que o usuario confirmou a troca
4. **Upsert em itens duplicados** — usar `ON CONFLICT` no par `(cart_id, product_id)` para somar quantidade ao inves de duplicar registro, porque a constraint unique impede insercao duplicada
5. **Verificar existencia antes de criar** — sempre buscar carrinho ativo do usuario antes de decidir criar ou reutilizar, porque criar sem verificar gera carrinhos orfaos
6. **Nao duplicar inserts** — se a logica de insert existe dentro de um branch condicional E fora dele, remover a duplicacao, porque causa insercao dupla

## How to write

### Verificar carrinho existente

```typescript
const existingCart = await db
  .select()
  .from(carts)
  .where(and(eq(carts.userId, userId), eq(carts.active, true)))
  .limit(1)
```

### Mesma loja — adicionar item

```typescript
if (existingCart && existingCart.storeId === product.storeId) {
  await db
    .insert(cartItems)
    .values({ cartId: existingCart.id, productId: product.id, quantity })
    .onConflictDoUpdate({
      target: [cartItems.cartId, cartItems.productId],
      set: { quantity: sql`${cartItems.quantity} + ${quantity}` },
    })
  return existingCart
}
```

### Loja diferente — substituir carrinho

```typescript
if (existingCart && existingCart.storeId !== product.storeId) {
  await db
    .update(carts)
    .set({ active: false })
    .where(eq(carts.id, existingCart.id))

  const [newCart] = await db
    .insert(carts)
    .values({ userId, storeId: product.storeId, active: true })
    .returning()

  await db
    .insert(cartItems)
    .values({ cartId: newCart.id, productId: product.id, quantity })

  return newCart
}
```

## Example

**Before (cria carrinho toda vez):**
```typescript
async function addToCart(userId: string, productId: string, quantity: number) {
  const product = await getProduct(productId)
  const [cart] = await db.insert(carts).values({ userId, storeId: product.storeId, active: true }).returning()
  await db.insert(cartItems).values({ cartId: cart.id, productId, quantity })
  return cart
}
```

**After (com logica multi-loja):**
```typescript
async function addToCart(userId: string, productId: string, quantity: number) {
  const product = await getProduct(productId)

  const [existingCart] = await db
    .select().from(carts)
    .where(and(eq(carts.userId, userId), eq(carts.active, true)))

  if (existingCart && existingCart.storeId === product.storeId) {
    await db.insert(cartItems)
      .values({ cartId: existingCart.id, productId, quantity })
      .onConflictDoUpdate({
        target: [cartItems.cartId, cartItems.productId],
        set: { quantity: sql`${cartItems.quantity} + ${quantity}` },
      })
    return existingCart
  }

  if (existingCart && existingCart.storeId !== product.storeId) {
    await db.update(carts).set({ active: false }).where(eq(carts.id, existingCart.id))
  }

  const [newCart] = await db.insert(carts)
    .values({ userId, storeId: product.storeId, active: true }).returning()
  await db.insert(cartItems).values({ cartId: newCart.id, productId, quantity })
  return newCart
}
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Produto da mesma loja | Insert cart_item com ON CONFLICT upsert |
| Produto de loja diferente | Desativar carrinho atual, criar novo |
| Mesmo produto adicionado de novo | Somar quantidade via ON CONFLICT |
| Nenhum carrinho ativo | Criar carrinho + item normalmente |
| Buscar carrinho atual (GET /cart) | Filtrar por `active = true` e `userId` |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `INSERT INTO carts` sem verificar existente | Buscar carrinho ativo primeiro, decidir criar ou reutilizar |
| `INSERT INTO cart_items` sem ON CONFLICT | Usar `onConflictDoUpdate` para somar quantidade |
| Manter multiplos carrinhos ativos | Setar `active = false` no anterior ao criar novo |
| Duplicar bloco de insert dentro e fora do if | Manter insert apenas no fluxo correto, sem duplicacao |
| Verificar loja no SELECT do carrinho | Buscar carrinho ativo primeiro, comparar loja no codigo |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
