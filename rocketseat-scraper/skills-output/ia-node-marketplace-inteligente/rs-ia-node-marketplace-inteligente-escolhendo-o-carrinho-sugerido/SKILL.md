---
name: rs-ia-node-marketplace-escolhendo-carrinho
description: "Applies cart activation pattern when building multi-cart systems in Node.js. Use when user asks to 'activate a cart', 'switch cart', 'select cart', 'manage cart state', or implement shopping cart selection logic. Enforces single-active-cart-per-user pattern: deactivate all user carts first, then activate the chosen one. Make sure to use this skill whenever implementing cart state management with multiple carts per user. Not for cart item management, checkout flow, or payment processing."
---

# Escolhendo o Carrinho Sugerido

> Ao gerenciar multiplos carrinhos por usuario, garanta que apenas um carrinho esteja ativo por vez usando o padrao deactivate-all-then-activate-one.

## Rules

1. **Use apenas o cart.id para identificar o carrinho** — nao passe o objeto inteiro, porque o endpoint so precisa do identificador para localizar e ativar
2. **Nao exija que o carrinho esteja ativo para ser selecionado** — se ja estiver ativo, nao quebre nada; se nao estiver, ative normalmente, porque isso simplifica a logica
3. **Desative todos os carrinhos do usuario antes de ativar o escolhido** — `active = false` em todos os carrinhos do userId, depois `active = true` no escolhido, porque garante invariante de um unico carrinho ativo
4. **Coloque a logica de selecao no servico de chat** — porque a escolha do carrinho e uma interacao do chat (o usuario escolhe via conversa), nao uma acao CRUD direta
5. **Crie uma rota POST dedicada para ativar o carrinho** — `POST /cart/:id/use` com userId no body/auth, porque a ativacao e uma acao com side-effect que merece endpoint proprio

## How to write

### Servico de selecao de carrinho

```typescript
// No chat service - useCart recebe apenas o ID
async useCart(cartId: string, userId: string) {
  // Verificar se o carrinho existe (nao precisa estar ativo)
  const cart = await this.cartRepository.findById(cartId)
  if (!cart) throw new Error('Cart not found')

  // Desativar todos os carrinhos ativos do usuario
  await this.cartRepository.deactivateAllByUserId(userId)

  // Ativar apenas o carrinho escolhido
  await this.cartRepository.activate(cartId)
}
```

### Repository - deactivate all

```typescript
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
```

### Rota dedicada

```typescript
// POST /cart/:id/use
router.post('/cart/:id/use', async (req, res) => {
  const { id } = req.params
  const userId = req.userId // do auth middleware

  await chatService.useCart(id, userId)

  return res.status(204).send()
})
```

## Example

**Before (ativacao inline sem desativar outros):**

```typescript
async selectCart(cartId: string) {
  await db.update(carts)
    .set({ active: true })
    .where(eq(carts.id, cartId))
  // BUG: multiplos carrinhos ativos ao mesmo tempo
}
```

**After (padrao deactivate-all-then-activate-one):**

```typescript
async useCart(cartId: string, userId: string) {
  const cart = await this.cartRepository.findById(cartId)
  if (!cart) throw new Error('Cart not found')

  await this.cartRepository.deactivateAllByUserId(userId)
  await this.cartRepository.activate(cartId)
}
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Usuario tem multiplos carrinhos sugeridos pela IA | Deactivate-all-then-activate-one |
| Carrinho ja esta ativo e usuario seleciona ele mesmo | Nao quebre — execute o fluxo normal |
| Endpoint de selecao | POST `/cart/:id/use` — simples, sem body complexo |
| Logica de selecao via chat | Coloque no chat service, nao no cart service |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `useCart(cart)` passando objeto inteiro | `useCart(cartId, userId)` passando apenas IDs |
| Ativar sem desativar os outros | Desativar todos do usuario, depois ativar o escolhido |
| `PUT /cart/:id { active: true }` generico | `POST /cart/:id/use` dedicado para a acao |
| Verificar `if (cart.active)` para rejeitar | Permitir selecao independente do estado atual |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
