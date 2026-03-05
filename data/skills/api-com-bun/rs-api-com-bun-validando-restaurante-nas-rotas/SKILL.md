---
name: rs-api-com-bun-validando-restaurante
description: "Enforces resource ownership validation in database queries for multi-tenant APIs. Use when user asks to 'create an endpoint', 'fetch order details', 'build API route', 'query database records', or any data access involving tenant-scoped resources. Applies rule: always add AND clauses to verify the requesting user owns the resource via tenant ID (e.g., restaurantId). Make sure to use this skill whenever building queries that access scoped resources, even if the user doesn't mention authorization. Not for authentication flows, login, or JWT token handling."
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

## Example

**Before (brecha de seguranca):**
```typescript
const order = await db
  .select()
  .from(orders)
  .where(eq(orders.id, orderId))
```

**After (com validacao de ownership):**
```typescript
const order = await db
  .select()
  .from(orders)
  .where(
    and(
      eq(orders.id, orderId),
      eq(orders.restaurantId, restaurantId)
    )
  )
```

## Heuristics

| Situacao | Acao |
|----------|------|
| Endpoint busca recurso por ID | Adicionar AND com tenant ID |
| Endpoint atualiza status de recurso | Adicionar AND com tenant ID |
| Recurso nao tem tenant (e.g., config global) | Nao se aplica |
| Multiplas operacoes no mesmo recurso (approve, cancel, dispatch) | Validar em TODAS, sem excecao |

## Anti-patterns

| Nunca escreva | Escreva instead |
|---------------|-----------------|
| `where(eq(orders.id, orderId))` sem tenant check | `where(and(eq(orders.id, orderId), eq(orders.restaurantId, restaurantId)))` |
| Validacao de ownership apenas no GET | Validacao em GET, UPDATE, DELETE, e todas as operacoes de status |
| `restaurantId` vindo do request body | `restaurantId` extraido do token/sessao autenticada |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
