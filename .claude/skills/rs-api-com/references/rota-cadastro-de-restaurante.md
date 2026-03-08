---
name: rs-api-com-bun-rota-cadastro-restaurante
description: "Applies Elysia route handler patterns when building REST endpoints with Bun and Drizzle. Use when user asks to 'create a route', 'add endpoint', 'handle POST in Elysia', 'insert with Drizzle returning', or 'return status code'. Covers context destructuring, Drizzle insert with returning, multi-entity creation. Make sure to use this skill whenever writing Elysia handlers or Drizzle inserts. Not for frontend, schema (see configurando-drizzle-orm), or validation (see tipagem-na-entrada-de-dados)."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: api-com-bun
  module: elysia
  tags: [elysia, route, drizzle, insert, returning, rest-api, bun]
---

# Rotas no Elysia com Drizzle ORM

> Desestruture contexto, use returning() para encadear insercoes, set.status para codigos HTTP.

## Rules

1. **Desestruture contexto** — `({ body, set })` nao `(ctx)`
2. **set.status** — `set.status = 204` para sucesso sem corpo
3. **returning()** — obter ID inserido
4. **Desestruturar array** — `const [manager] = await db.insert(...)`
5. **Pai primeiro** — manager antes de restaurant
6. **204 sem corpo** — `set.status = 204` sem return

## How to write

```typescript
app.post('/restaurants', async ({ body, set }) => {
  const [manager] = await db.insert(users).values({
    name: body.managerName, email: body.email, role: 'manager',
  }).returning({ id: users.id })

  await db.insert(restaurants).values({ name: body.restaurantName, managerId: manager.id })
  set.status = 204
})
```

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `(req, res) =>` | `({ body, set }) =>` |
| `res.status(204).send()` | `set.status = 204` |
| Query extra para ID | `.returning({ id })` |

## Troubleshooting

### set.status ignorado
**Fix:** Para 204, nao retorne nada apos set.status.

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo
- [code-examples.md](references/code-examples.md) — Exemplos expandidos
