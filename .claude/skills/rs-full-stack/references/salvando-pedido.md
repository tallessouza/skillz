---
name: rs-full-stack-salvando-pedido
description: "Applies order persistence pattern when building restaurant or e-commerce APIs with Knex.js. Use when user asks to 'save an order', 'insert order items', 'create order endpoint', or 'persist cart items to database'. Enforces storing price-at-order-time separately from product price, proper typing for order repositories, and clean insert patterns. Make sure to use this skill whenever implementing order/cart persistence in Node.js APIs. Not for payment processing, order status management, or frontend cart UI."
---

# Salvando Pedido — Persistência de Itens no Banco

> Ao salvar um pedido, sempre persista o preço no momento da compra separado do preço atual do produto, porque preços mudam e o histórico precisa ser fiel.

## Rules

1. **Crie tipagem dedicada para orders** — `order-repository.d.ts` dentro de `database/types/`, porque cada tabela precisa de contrato tipado
2. **Armazene `price` no pedido separadamente** — copie `product.price` para a coluna `price` da order, porque o preço do produto pode mudar depois e o pedido precisa refletir o valor no momento da compra
3. **Use `table_session_id` para vincular ao contexto** — todo pedido pertence a uma sessão de mesa, porque sem esse vínculo não há como agrupar itens de um mesmo cliente
4. **Não retorne dados desnecessários no insert** — após o insert, retorne status adequado sem devolver o objeto inteiro, porque o cliente não precisa do registro raw do banco
5. **Organize visualmente os campos no insert** — session primeiro, depois produto, quantidade, preço, porque facilita code review e debugging

## How to write

### Tipagem do Order Repository

```typescript
// database/types/order-repository.d.ts
type OrderRepository = {
  id: number
  table_session_id: number
  product_id: number
  quantity: number
  price: number
  created_at: number
  updated_at: number
}
```

### Insert com Knex

```typescript
// No controller, após validar produto e sessão
await knex<OrderRepository>("orders").insert({
  table_session_id: tableSessionId,
  product_id: productId,
  quantity,
  price: product.price, // Preço no momento do pedido, não referência
})
```

## Example

**Before (preço por referência — bug silencioso):**
```typescript
await knex("orders").insert({
  product_id: productId,
  quantity,
  // Sem salvar preço — depende de JOIN com products depois
  // Se o preço do produto mudar, o histórico fica errado
})
```

**After (preço snapshot no pedido):**
```typescript
const product = await knex<ProductRepository>("products")
  .where({ id: productId })
  .first()

await knex<OrderRepository>("orders").insert({
  table_session_id: tableSessionId,
  product_id: product.id,
  quantity,
  price: product.price, // Snapshot do preço atual
})
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Preço pode mudar no futuro | Sempre salve snapshot na tabela de pedidos |
| Precisa calcular total | `quantity * price` nos dados do pedido, não JOIN com products |
| Múltiplos itens no pedido | Um insert por item, cada um com seu preço snapshot |
| Retorno do endpoint de criar pedido | Status 201, sem body ou body mínimo |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `price: productId` (referência) | `price: product.price` (snapshot) |
| `await knex("orders").insert(...)` sem tipagem | `await knex<OrderRepository>("orders").insert(...)` |
| Calcular total via JOIN com products | Calcular com `quantity * price` da própria orders |
| Retornar `product` inteiro após insert | Retornar apenas status ou nada |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre price snapshot, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-salvando-pedido/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-salvando-pedido/references/code-examples.md)
