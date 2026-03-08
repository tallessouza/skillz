---
name: rs-api-com-bun-validando-restaurante
description: "Enforces resource ownership validation in database queries for multi-tenant APIs. Use when user asks to 'create an endpoint', 'fetch order details', 'build API route', 'query database records', or any data access involving tenant-scoped resources. Applies rule: always add AND clauses to verify the requesting user owns the resource via tenant ID (e.g., restaurantId). Make sure to use this skill whenever building queries that access scoped resources, even if the user doesn't mention authorization. Not for authentication flows, login, or JWT token handling."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: api-com-bun
  module: elysia
  tags: [elysia, route, drizzle, ownership, tenant, security, bun]
---

# Validando Proprietario do Recurso nas Rotas

> Toda query que busca, atualiza ou deleta um recurso deve incluir uma clausula AND verificando que o recurso pertence ao tenant (restaurante/usuario) autenticado.

## Rules

1. **Sempre adicione AND com tenant ID nas queries** — `WHERE id = orderId AND restaurantId = authenticatedRestaurantId`, porque sem isso qualquer usuario autenticado acessa recursos de outros tenants
2. **Aplique em TODAS as operacoes sobre o recurso** — GET, UPDATE, DELETE, approve, cancel, dispatch — porque uma unica rota sem validacao e uma brecha de seguranca
3. **Use o ID do contexto autenticado, nunca do request body** — porque o usuario pode forjar o body, mas o contexto vem do token validado

## How to write

### Query com validacao de ownership

```typescript
// Buscar pedido validando que pertence ao restaurante do usuario
const order = await db
  .select()
  .from(orders)
  .where(
    and(
      eq(orders.id, orderId),
      eq(orders.restaurantId, restaurantId) // ownership check
    )
  )
```

### Aplicar em todas as operacoes do recurso

```typescript
// approve, cancel, dispatch — todos precisam da mesma validacao
const [order] = await db
  .update(orders)
  .set({ status: 'approved' })
  .where(
    and(
      eq(orders.id, orderId),
      eq(orders.restaurantId, restaurantId)
    )
  )
  .returning()
```

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `where(eq(orders.id, orderId))` sem tenant check | `where(and(eq(orders.id, orderId), eq(orders.restaurantId, restaurantId)))` |
| Validacao de ownership apenas no GET | Validacao em GET, UPDATE, DELETE, e todas as operacoes de status |
| `restaurantId` vindo do request body | `restaurantId` extraido do token/sessao autenticada |

## Troubleshooting

### Usuario acessa recurso de outro tenant
**Fix:** Adicione clausula AND com tenant ID em TODAS as queries do recurso.

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo
- [code-examples.md](references/code-examples.md) — Exemplos expandidos
