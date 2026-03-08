---
name: rs-ia-node-marketplace-atualizacoes-carrinho-1
description: "Applies cart update patterns when building e-commerce cart APIs with Drizzle ORM and Node.js. Use when user asks to 'update cart item', 'remove from cart', 'change quantity', 'build cart API', or 'implement shopping cart routes'. Enforces ownership verification, item existence checks, type coercion for route params, and query reuse over duplication. Make sure to use this skill whenever implementing cart mutation endpoints or similar resource-update APIs. Not for cart UI, checkout flow, or payment processing."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: ia-node-marketplace-inteligente
  module: cart
  tags: [drizzle-orm, e-commerce, ia-node, node-js]
---

# Atualizacoes no Carrinho — Patterns para Mutacao de Itens

> Ao implementar endpoints de atualizacao de carrinho, sempre verifique ownership, existencia do item, e converta tipos de parametros de rota antes de operar.

## Rules

1. **Verifique ownership do recurso** — filtre por `userId` E `active` no proprio SELECT, porque isso elimina a necessidade de verificacoes separadas e evita race conditions
2. **Verifique existencia do item no carrinho antes de mutar** — use `cart.items.every(i => i.productId !== productId)` para detectar ausencia, porque operacoes em itens inexistentes devem retornar erro claro
3. **Converta params de rota para o tipo correto** — `Number(params.productId)`, porque tipagem TypeScript NAO muda o tipo em runtime e params sempre chegam como string
4. **Reutilize queries complexas via funcoes** — chame `getCart()` ao inves de duplicar queries com joins, porque tipos divergentes entre queries duplicadas causam bugs silenciosos
5. **Unifique o tipo de retorno do recurso** — use tipo simples (id, active) para operacoes internas e tipo completo (com items/joins) para retorno ao cliente, porque multiplas shapes do mesmo recurso geram confusao
6. **Use mensagens de erro distintas durante debug** — `CartNotFound1` vs `CartNotFound2`, porque mensagens identicas em guards diferentes tornam impossivel identificar qual falhou

## How to write

### Endpoint de update de quantidade

```typescript
// PUT /carts/:cartId/items/:productId
app.put('/carts/:cartId/items/:productId', async (request, reply) => {
  const { cartId, productId } = request.params
  const { quantity } = request.body

  const result = await cartService.updateCartItem({
    cartId: Number(cartId),       // SEMPRE converter — params sao string
    productId: Number(productId), // SEMPRE converter
    quantity,
    userId: request.user.id,
  })

  return reply.send(result)
})
```

### Service com verificacoes em cascata

```typescript
async updateCartItem({ productId, quantity, userId }: UpdateCartItemInput) {
  // 1. Buscar carrinho completo (reutiliza getCart que ja faz joins)
  const cart = await this.getCart(userId)

  // 2. Guard: carrinho existe?
  if (!cart) throw new NotFoundError('Cart not found')

  // 3. Guard: ownership (redundante se getCart filtra por userId, mas explicito)
  if (cart.userId !== userId) throw new NotFoundError('Cart not found')

  // 4. Guard: produto existe no carrinho?
  const itemExists = cart.items.some(item => item.productId === productId)
  if (!itemExists) throw new NotFoundError('Product not found in cart')

  // 5. Executar update
  await db.update(cartItems)
    .set({ quantity })
    .where(
      and(
        eq(cartItems.cartId, cart.id),
        eq(cartItems.productId, productId)
      )
    )

  // 6. Retornar estado atualizado
  return this.getCart(userId)
}
```

## Example

**Before (bugs silenciosos):**
```typescript
async updateCartItem({ cartId, productId, quantity, userId }) {
  // Busca simples — nao verifica ownership nem status
  const cart = await db.select().from(carts).where(eq(carts.id, cartId))

  // productId vem como string do param, comparacao falha silenciosamente
  if (cart.items.every(i => i.productId !== productId)) {
    throw new Error('Product not found in cart')
  }

  await db.update(cartItems).set({ quantity }).where(eq(cartItems.productId, productId))
}
```

**After (com this skill applied):**
```typescript
async updateCartItem({ productId, quantity, userId }) {
  // Reutiliza getCart que ja filtra por userId + active + faz joins
  const cart = await this.getCart(userId)
  if (!cart) throw new NotFoundError('Cart not found')

  // productId ja convertido para Number antes de chegar aqui
  const itemExists = cart.items.some(item => item.productId === productId)
  if (!itemExists) throw new NotFoundError('Product not found in cart')

  await db.update(cartItems)
    .set({ quantity })
    .where(and(
      eq(cartItems.cartId, cart.id),
      eq(cartItems.productId, productId)
    ))

  return this.getCart(userId)
}
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Param vem da URL (`:id`) | Sempre `Number()` antes de usar |
| Mesmo recurso buscado em multiplos metodos | Extrair para funcao reutilizavel (`getCart`) |
| Multiplos guards com mesma mensagem de erro | Diferenciar mensagens durante desenvolvimento |
| Verificacao de ownership | Filtrar no WHERE do SELECT, nao em if separado |
| Precisa verificar se item pertence ao recurso pai | Use `.some()` / `.every()` no array de items |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `params.productId` direto em comparacao com number | `Number(params.productId)` |
| Query duplicada com joins diferentes do `getCart` | Chamar `getCart()` que ja tem a query completa |
| `if (cart.userId !== userId)` apos SELECT sem filtro | `where(and(eq(carts.userId, userId), eq(carts.active, true)))` |
| Mesma mensagem de erro em 3 guards diferentes | Mensagens distintas ou pelo menos distintas em dev |
| Confiar na tipagem TS para valores de runtime | Converter explicitamente no boundary (controller/route) |

## Troubleshooting

### Carrinho retorna vazio mesmo com items
**Symptom:** GET /cart retorna carrinho sem items ou com items nulos
**Cause:** Inner join exclui carrinhos sem items, ou left join retorna [{id: null}] em vez de []
**Fix:** Use left join com filter `WHERE items.id IS NOT NULL` e coalesce para array vazio

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
