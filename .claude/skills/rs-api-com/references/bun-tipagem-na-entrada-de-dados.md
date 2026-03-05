---
name: rs-api-com-bun-tipagem-entrada-dados
description: "Applies Elysia framework input validation using built-in TypeBox schema when writing API routes with Bun. Use when user asks to 'create an Elysia route', 'validate request body', 'add input typing', 'type API parameters', or 'setup Elysia endpoint validation'. Enforces native Elysia typing over external libraries (Zod/Yup/Joy). Make sure to use this skill whenever creating Elysia API endpoints that receive data. Not for output/response typing, database validation, or non-Elysia frameworks."
---

# Tipagem na Entrada de Dados com Elysia

> Ao criar rotas Elysia, use o sistema de tipagem integrado via TypeBox em vez de ferramentas externas como Zod, Yup ou Joy.

## Rules

1. **Use o terceiro parametro do metodo HTTP para tipagem** — o handler recebe `(rota, funcao, opcoes)`, porque o Elysia integra validacao diretamente na definicao da rota
2. **Importe `t` do Elysia** — `import { t } from 'elysia'` funciona como o `z` do Zod, porque e o schema builder nativo do framework
3. **TypeBox usa PascalCase** — `t.Object()`, `t.String()`, nao `t.object()`, `t.string()`, porque TypeBox segue convencao diferente do Zod
4. **Escolha a chave correta no objeto de opcoes** — `body`, `params`, `query`, `headers`, `cookie`, `response`, porque cada uma valida uma parte diferente da requisicao
5. **Use `format` para validacoes especificas** — `t.String({ format: 'email' })` para emails, porque TypeBox suporta formatos built-in
6. **Nomeie campos sem ambiguidade** — `managerName` nao `name`, porque em contextos com multiplas entidades o nome generico causa confusao

## How to write

### Rota com body tipado

```typescript
import { Elysia, t } from 'elysia'

app.post('/restaurants', ({ body }) => {
  // body ja esta tipado e validado automaticamente
  return createRestaurant(body)
}, {
  body: t.Object({
    restaurantName: t.String(),
    managerName: t.String(),
    phone: t.String(),
    email: t.String({ format: 'email' }),
  })
})
```

### Rota com params tipados

```typescript
app.get('/restaurants/:id', ({ params }) => {
  return getRestaurant(params.id)
}, {
  params: t.Object({
    id: t.String(),
  })
})
```

### Rota com query tipados

```typescript
app.get('/restaurants', ({ query }) => {
  return listRestaurants(query.page)
}, {
  query: t.Object({
    page: t.Number({ default: 1 }),
  })
})
```

## Example

**Before (usando Zod externo):**
```typescript
import { z } from 'zod'

const bodySchema = z.object({
  restaurantName: z.string(),
  email: z.string().email(),
})

app.post('/restaurants', ({ body }) => {
  const parsed = bodySchema.parse(body) // validacao manual
  return createRestaurant(parsed)
})
```

**After (tipagem nativa Elysia):**
```typescript
import { Elysia, t } from 'elysia'

app.post('/restaurants', ({ body }) => {
  // validacao automatica, body ja tipado
  return createRestaurant(body)
}, {
  body: t.Object({
    restaurantName: t.String(),
    email: t.String({ format: 'email' }),
  })
})
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Dados vindos do corpo da requisicao | Use `body: t.Object({...})` |
| Parametros de URL (`:id`) | Use `params: t.Object({...})` |
| Query string (`?page=1`) | Use `query: t.Object({...})` |
| Validar formato de email | Use `t.String({ format: 'email' })` |
| Campo numerico | Use `t.Number()`, nao `t.String()` com parse |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `import { z } from 'zod'` em projeto Elysia | `import { t } from 'elysia'` |
| `t.object()` (minusculo) | `t.Object()` (PascalCase) |
| `t.string()` (minusculo) | `t.String()` (PascalCase) |
| Validacao manual com `.parse()` no handler | Terceiro parametro com schema |
| `name` quando ha multiplas entidades | `managerName`, `restaurantName` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/api-com/rs-api-com-bun-tipagem-na-entrada-de-dados/references/deep-explanation.md)
- [Code examples](../../../data/skills/api-com/rs-api-com-bun-tipagem-na-entrada-de-dados/references/code-examples.md)
