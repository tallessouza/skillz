---
name: rs-api-com-bun-rota-aprovar-pedido
description: "Applies separate route-per-status-change pattern when building order/status mutation endpoints in REST APIs. Use when user asks to 'create an endpoint to change status', 'approve order route', 'update order status', 'PATCH route for status', or any order state machine API work. Enforces one-route-per-transition with specific business rules per transition, PATCH method, and pending-check validation. Make sure to use this skill whenever building status mutation routes, even for simple status updates. Not for GET/list routes, product CRUD, or frontend state management."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: api-com-bun
  module: elysia
  tags: [elysia, route, order, status, patch, state-machine, bun]
---

# Rota de Mutacao de Status: Uma Rota por Transicao

> Cada transicao de status de um pedido e uma rota separada, porque cada uma tem regras de negocio diferentes.

## Rules

1. **Uma rota por transicao de status** — nao crie uma unica rota generica "alterar status", porque cada transicao (pending→processing, processing→delivered, etc.) tem regras de negocio completamente diferentes
2. **Use PATCH para mutacoes de status** — `PATCH /orders/:orderId/approve`, nao PUT, porque e uma alteracao parcial do recurso
3. **Valide o status atual antes de mutar** — antes de aprovar, verifique se o pedido esta pending; antes de cancelar, verifique se nao esta entregue, porque cada transicao so e valida a partir de estados especificos
4. **Retorne 400 para transicao invalida** — status 400 com mensagem descritiva como "You can only approve pending orders", porque e um erro de regra de negocio, nao de autenticacao
5. **Autentique antes de buscar** — extraia o usuario atual e valide permissao antes de consultar o banco, porque evita queries desnecessarias
6. **Nomeie a rota pela acao, nao pelo campo** — `/orders/:id/approve` nao `/orders/:id/status`, porque o nome da rota documenta a intencao

## How to write

### Rota de aprovacao de pedido

```typescript
app.patch('/orders/:orderId/approve',
  async (request, response) => {
    const { orderId } = request.params
    const restaurantId = await getCurrentUser()

    if (!restaurantId) throw new UnauthorizedError()

    const order = await db.query.orders.findFirst({
      where: eq(orders.id, orderId)
    })

    if (!order) {
      return response.status(400).json({ message: 'Order not found' })
    }

    if (order.status !== 'pending') {
      return response.status(400).json({
        message: 'You can only approve pending orders'
      })
    }

    await db.update(orders)
      .set({ status: 'processing' })
      .where(eq(orders.id, order.id))
  }
)
```

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `PATCH /orders/:id/status` com body `{ status }` | `PATCH /orders/:id/approve` sem body de status |
| `PUT /orders/:id` para mudar so status | `PATCH /orders/:id/approve` (alteracao parcial) |
| Update direto sem checar status atual | `if (order.status !== 'pending')` antes do update |
| Mensagem generica "Invalid status" | Mensagem especifica "You can only approve pending orders" |

## Heuristics

| Situacao | Faca |
|----------|------|
| Status tem regras de negocio diferentes por transicao | Uma rota por transicao |
| Apenas 2 status possiveis (ativo/inativo) | Rota unica de toggle e aceitavel |
| Frontend precisa chamar acoes diferentes | Exponha rotas nomeadas por acao |
| Validacao de status atual e necessaria | Busque o pedido, valide status, depois mute |

## Troubleshooting

### Rota generica escala mal
**Fix:** Separe em rotas por acao — cada transicao tem regras de negocio isoladas.

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo
- [code-examples.md](references/code-examples.md) — Exemplos expandidos
