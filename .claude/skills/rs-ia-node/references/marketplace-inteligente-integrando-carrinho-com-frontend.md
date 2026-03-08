---
name: rs-ia-node-marketplace-integrando-carrinho-frontend
description: "Applies cart-frontend integration patterns when building e-commerce with Next.js and SWR. Use when user asks to 'integrate cart', 'add to cart frontend', 'optimistic update', 'useSWR mutate', or 'shopping cart UI'. Enforces optimistic data updates, proper cache mutation, and cart API module structure. Make sure to use this skill whenever implementing cart functionality in a React/Next.js frontend with SWR. Not for backend cart logic, payment processing, or checkout flow."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: ia-node-marketplace-inteligente
  module: cart
  tags: [e-commerce, next-js, frontend, node-js, ia-node, swr]
---

# Integrando Carrinho com Frontend

> Implemente integracao de carrinho no frontend usando SWR com mutacoes otimistas para feedback instantaneo ao usuario.

## Rules

1. **Centralize funcoes de API em um modulo dedicado** — `getCart`, `addToCart`, `updateCartItem`, `removeFromCart` ficam em um arquivo de API, porque facilita manutencao e reutilizacao
2. **Use `useSWR` para estado do carrinho** — o hook gerencia cache, revalidacao e loading automaticamente, porque evita estado manual e garante sincronizacao com o servidor
3. **Aplique `optimisticData` nas mutacoes** — atualize o cache local antes da resposta do servidor, porque elimina delay visual ao clicar botoes de quantidade
4. **Valide quantidade antes de decidir acao** — se quantidade < 1, chame remove em vez de update, porque o backend rejeita quantidade zero com bad request
5. **Adicione guarda de existencia do cart** — `if (!cart) return` antes de operacoes, porque os botoes so aparecem com carrinho mas TypeScript nao sabe disso
6. **Calcule total no frontend com reduce** — `items.reduce()` com fallback para zero se nao houver itens, porque evita quebra em carrinho vazio

## How to write

### Modulo de API do carrinho

```typescript
// api/cart.ts
export async function getCart(): Promise<Cart> { /* GET /cart */ }
export async function addToCart(productId: string, quantity: number): Promise<{ id: string }> { /* POST */ }
export async function updateCartItem(cartId: string, productId: string, quantity: number): Promise<void> { /* PATCH */ }
export async function removeFromCart(cartId: string, productId: string): Promise<void> { /* DELETE */ }
```

### useSWR com mutate otimista

```typescript
const { data: cart, mutate } = useSWR('cart', getCart)

async function handleUpdateQuantity(productId: string, newQuantity: number) {
  if (!cart) return

  if (newQuantity < 1) {
    await mutate(
      removeFromCart(cart.id, productId),
      {
        optimisticData: {
          ...cart,
          items: cart.items.filter(item => item.productId !== productId)
        }
      }
    )
    return
  }

  await mutate(
    updateCartItem(cart.id, productId, newQuantity),
    {
      optimisticData: {
        ...cart,
        items: cart.items.map(item =>
          item.productId === productId
            ? { ...item, quantity: newQuantity }
            : item
        )
      }
    }
  )
}
```

### Adicionar ao carrinho na pagina de produtos

```typescript
async function handleAddToCart(productId: string) {
  await addToCart(productId, 1)
  toast.success('Produto adicionado ao carrinho')
}
```

## Example

**Before (sem optimistic data — delay visivel):**
```typescript
async function handleUpdate(productId: string, qty: number) {
  await updateCartItem(cart.id, productId, qty)
  mutate() // revalida depois — usuario ve delay
}
```

**After (com optimistic data — instantaneo):**
```typescript
async function handleUpdate(productId: string, qty: number) {
  if (!cart) return
  if (qty < 1) {
    await mutate(removeFromCart(cart.id, productId), {
      optimisticData: { ...cart, items: cart.items.filter(i => i.productId !== productId) }
    })
    return
  }
  await mutate(updateCartItem(cart.id, productId, qty), {
    optimisticData: { ...cart, items: cart.items.map(i => i.productId === productId ? { ...i, quantity: qty } : i) }
  })
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Adicionar produto ao carrinho | Quantidade default 1, toast de sucesso |
| Diminuir quantidade para 0 | Chame remove, nao update com qty=0 |
| Carrinho troca de loja | Backend zera automaticamente — frontend revalida via SWR |
| Calcular total | `items.reduce((sum, item) => sum + item.price * item.quantity, 0)` |
| Precos em centavos da API | Divida por 100 ao exibir |

## Anti-patterns

| Nunca faca | Faca assim |
|------------|------------|
| `useState` manual para estado do carrinho | `useSWR('cart', getCart)` |
| `mutate()` sem optimisticData | `mutate(promise, { optimisticData: ... })` |
| Update com quantidade 0 | `if (qty < 1) removeFromCart(...)` |
| Chamar API direto no onClick | Crie `handleAddToCart` / `handleUpdateQuantity` |
| Ignorar guarda de cart nulo | `if (!cart) return` no inicio da funcao |

## Troubleshooting

### Carrinho retorna vazio mesmo com items
**Symptom:** GET /cart retorna carrinho sem items ou com items nulos
**Cause:** Inner join exclui carrinhos sem items, ou left join retorna [{id: null}] em vez de []
**Fix:** Use left join com filter `WHERE items.id IS NOT NULL` e coalesce para array vazio

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
