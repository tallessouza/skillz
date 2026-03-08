---
name: rs-ia-node-marketplace-cart-removal
description: "Applies cart item removal patterns and left join fixes when building e-commerce cart APIs with Drizzle ORM and Node.js. Use when user asks to 'remove item from cart', 'delete cart item', 'fix empty cart query', 'handle left join null results', or 'build cart API routes'. Ensures proper existence checks, left join for empty carts, and null-safe result mapping. Make sure to use this skill whenever implementing cart deletion or fixing join queries that break on empty relations. Not for frontend cart UI, payment processing, or order management."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: ia-node-marketplace-inteligente
  module: cart
  tags: [drizzle-orm, e-commerce, ia-node, node-js]
---

# Remocao de Itens do Carrinho e Left Join Safety

> Ao implementar remocao de itens do carrinho, valide existencia em cascata (carrinho → usuario → item) e use left join para queries que podem retornar relacoes vazias.

## Rules

1. **Valide em cascata antes de deletar** — verifique carrinho existe → pertence ao usuario → item existe no carrinho, porque cada falha tem uma mensagem de erro diferente pro cliente
2. **Use left join quando relacao pode estar vazia** — inner join em cart→items falha quando carrinho tem zero itens, porque inner join exclui o registro pai quando nao ha filhos
3. **Trate null no resultado do left join** — left join retorna `[{ id: null }]` em vez de `[]` para relacoes vazias, porque o banco forca o retorno do lado esquerdo com nulls no direito
4. **Nao duplique logica de busca de carrinho** — extraia `getActiveCart` como funcao reutilizavel, porque buscar carrinho ativo do usuario aparece em create, update e remove
5. **Inative carrinho antes de criar novo quando loja muda** — se produto e de loja diferente, inative o carrinho atual e crie novo, porque um carrinho so pode ter itens de uma loja
6. **Delete route nao retorna body** — rota DELETE de item retorna status 204 sem corpo, porque a semantica HTTP de delete nao exige payload de resposta

## How to write

### Funcao removeCartItem

```typescript
async function removeCartItem(userId: string, productId: string) {
  const cart = await getActiveCart(userId)
  if (!cart) throw new NotFoundError('Carrinho nao encontrado')
  if (cart.userId !== userId) throw new ForbiddenError('Carrinho nao pertence ao usuario')

  const itemExists = cart.items.some(item => item.productId === productId)
  if (!itemExists) throw new NotFoundError('Item nao encontrado no carrinho')

  await db.delete(cartItems).where(
    and(
      eq(cartItems.cartId, cart.id),
      eq(cartItems.productId, productId)
    )
  )
}
```

### Left join com tratamento de null

```typescript
const result = await db
  .select()
  .from(carts)
  .leftJoin(cartItems, eq(carts.id, cartItems.cartId))  // left join, nao inner
  .where(and(eq(carts.userId, userId), eq(carts.isActive, true)))

// Tratar null do left join
if (result.rows.length > 0 && result.rows[0].items[0]?.id !== null) {
  return { ...result.rows[0], items: result.rows[0].items }
} else if (result.rows.length > 0) {
  return { ...result.rows[0], items: [] }  // carrinho existe, sem itens
}
throw new NotFoundError('Carrinho nao encontrado')
```

### Rota DELETE

```typescript
app.delete('/cart/items/:productId', async (request, reply) => {
  const { productId } = request.params
  const userId = request.user.id

  await removeCartItem(userId, productId)

  return reply.status(204).send()
})
```

## Example

**Before (inner join quebra com carrinho vazio):**
```typescript
const cart = await db
  .select()
  .from(carts)
  .innerJoin(cartItems, eq(carts.id, cartItems.cartId))
  .where(eq(carts.userId, userId))
// Resultado: [] quando carrinho nao tem itens → 404 falso
```

**After (left join + null check):**
```typescript
const cart = await db
  .select()
  .from(carts)
  .leftJoin(cartItems, eq(carts.id, cartItems.cartId))
  .where(eq(carts.userId, userId))

const items = cart[0]?.items[0]?.id !== null ? cart[0].items : []
// Resultado: { id: 1, items: [] } → carrinho encontrado, sem itens
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Query com join em relacao 1:N que pode ter 0 filhos | Usar left join |
| Left join retorna array com objeto de ids null | Filtrar/substituir por array vazio |
| Mesma busca de carrinho ativo em 3+ funcoes | Extrair para funcao reutilizavel |
| Delete de ultimo item do carrinho | Manter carrinho ativo com items vazio |
| Produto de loja diferente da do carrinho | Inativar carrinho atual, criar novo |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `innerJoin` em cart→items sem garantia de items | `leftJoin` com null check |
| Confiar que left join retorna `[]` para filhos vazios | Checar `items[0]?.id !== null` |
| Repetir query de carrinho ativo em cada funcao | `getActiveCart(userId)` reutilizavel |
| Deletar item sem verificar se pertence ao carrinho | Validar existencia antes do delete |
| Retornar body na rota DELETE | `reply.status(204).send()` |
| Criar carrinho duplicado quando loja muda | Inativar o atual antes de criar novo |

## Troubleshooting

### Carrinho retorna vazio mesmo com items
**Symptom:** GET /cart retorna carrinho sem items ou com items nulos
**Cause:** Inner join exclui carrinhos sem items, ou left join retorna [{id: null}] em vez de []
**Fix:** Use left join com filter `WHERE items.id IS NOT NULL` e coalesce para array vazio

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
