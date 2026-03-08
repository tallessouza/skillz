---
name: rs-api-com-bun-tipagem-entrada-dados
description: "Applies ElysiaJS native input validation using TypeBox schema when writing API routes. Use when user asks to 'validate request body', 'add input typing to elysia', 'type API parameters', 'validate query params', or 'setup elysia validation'. Enforces native t.Object/t.String over Zod/Yup. Make sure to use this skill whenever creating Elysia endpoints that receive data. Not for output typing, database validation, or non-Elysia frameworks (use rs-node-js for Fastify)."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: api-com-bun
  module: elysia
  tags: [elysia, typebox, validation, input, typing, bun]
---

# Tipagem na Entrada de Dados com Elysia

> Use TypeBox integrado (`t` do Elysia) em vez de Zod/Yup.

## Rules

1. **Terceiro parametro** — `(rota, funcao, { body: t.Object({...}) })`
2. **`import { t } from 'elysia'`** — schema builder nativo
3. **PascalCase** — `t.Object()`, `t.String()`
4. **Chave correta** — `body`, `params`, `query`, `headers`
5. **`format` para validacoes** — `t.String({ format: 'email' })`
6. **Nomes sem ambiguidade** — `managerName` nao `name`

## How to write

```typescript
app.post('/restaurants', ({ body }) => createRestaurant(body), {
  body: t.Object({
    restaurantName: t.String(),
    email: t.String({ format: 'email' }),
  })
})
```

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `import { z } from 'zod'` em Elysia | `import { t } from 'elysia'` |
| `t.object()` minusculo | `t.Object()` PascalCase |
| `.parse()` manual | Schema no terceiro parametro |

## Troubleshooting

### Schema nao valida
**Fix:** Schema vai no TERCEIRO argumento, nao no segundo.

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo
- [code-examples.md](references/code-examples.md) — Exemplos expandidos
