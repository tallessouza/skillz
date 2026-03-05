---
name: rs-api-com-bun-rotas-acoes-no-pedido
description: "Applies order state machine patterns when building REST API order actions with Bun/Elysia. Use when user asks to 'create order endpoints', 'implement order status', 'add cancel/deliver/dispatch route', or 'build order workflow API'. Enforces status validation guards before state transitions and correct HTTP status codes. Make sure to use this skill whenever implementing order lifecycle actions in any API. Not for payment processing, authentication, or database schema design."
---

# Rotas: Acoes no Pedido

> Cada acao sobre um pedido valida o status atual antes de transicionar, garantindo que a maquina de estados nunca entre em estado invalido.

## Rules

1. **Valide o status antes de transicionar** — verifique se `order.status` esta na lista de status permitidos para aquela acao, porque transicoes invalidas corrompem o fluxo do pedido
2. **Use uma whitelist de status permitidos** — `if ![allowed].includes(order.status)` rejeita, porque whitelist e mais segura que blacklist (novos status nao passam por acidente)
3. **Retorne 400 com mensagem descritiva** — informe qual status e necessario, porque o consumidor da API precisa saber como corrigir
4. **Retorne 404 quando pedido nao existe** — antes de qualquer validacao de status, porque nao faz sentido validar status de algo que nao existe
5. **Siga a maquina de estados do pedido** — pending → processing → delivering → delivered (com cancel como ramo lateral), porque pular estados causa inconsistencia de dados
6. **Cancel so aceita pending ou processing** — pedidos ja despachados nao podem ser cancelados, porque o produto ja saiu fisicamente

## How to write

### Acao com guarda de status

```typescript
app.patch("/orders/:id/cancel", async ({ params, set }) => {
  const order = await db.query.orders.findFirst({
    where(fields, { eq }) {
      return eq(fields.id, params.id)
    },
  })

  if (!order) {
    set.status = 404
    return { message: "Order not found." }
  }

  if (!["pending", "processing"].includes(order.status)) {
    set.status = 400
    return { message: "You cannot cancel orders after dispatch." }
  }

  await db.update(orders).set({ status: "canceled" }).where(eq(orders.id, params.id))

  return { message: "Order canceled." }
})
```

### Tabela de transicoes

```typescript
// Cada acao define: status permitidos → novo status
// cancel:   ["pending", "processing"]  → "canceled"
// dispatch: ["processing"]             → "delivering"
// deliver:  ["delivering"]             → "delivered"
// approve:  ["pending"]                → "processing"
```

## Example

**Before (sem validacao de status):**
```typescript
app.patch("/orders/:id/deliver", async ({ params }) => {
  await db.update(orders).set({ status: "delivered" }).where(eq(orders.id, params.id))
  return { message: "Done" }
})
```

**After (com guarda de status):**
```typescript
app.patch("/orders/:id/deliver", async ({ params, set }) => {
  const order = await db.query.orders.findFirst({
    where(fields, { eq }) {
      return eq(fields.id, params.id)
    },
  })

  if (!order) {
    set.status = 404
    return { message: "Order not found." }
  }

  if (order.status !== "delivering") {
    set.status = 400
    return { message: "You cannot deliver orders that are not in delivering status." }
  }

  await db.update(orders).set({ status: "delivered" }).where(eq(orders.id, params.id))

  return { message: "Order delivered." }
})
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Acao permite apenas 1 status de origem | Use comparacao direta: `order.status !== "delivering"` |
| Acao permite multiplos status de origem | Use array + includes: `!["pending", "processing"].includes(order.status)` |
| Novo status adicionado ao sistema | Revise TODAS as guardas — whitelist protege automaticamente |
| Acao irreversivel (cancel, delete) | Restrinja ao maximo os status permitidos |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `update` sem verificar se order existe | Busque primeiro, retorne 404 se nao encontrou |
| `if (order.status === "delivered") throw` (blacklist) | `if (!["pending","processing"].includes(order.status))` (whitelist) |
| Mesmo endpoint pra todas as acoes com `?action=cancel` | Endpoints separados: `/orders/:id/cancel`, `/orders/:id/deliver` |
| Status como string magica espalhada | Defina constantes ou enum para os status |
| Mensagem generica "Bad request" | Mensagem especifica: "You cannot cancel orders after dispatch" |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
