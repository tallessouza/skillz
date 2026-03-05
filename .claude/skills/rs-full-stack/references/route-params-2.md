---
name: rs-full-stack-route-params-2
description: "Applies Express.js route parameter patterns when building REST API endpoints. Use when user asks to 'create a route', 'add an endpoint', 'get URL parameters', 'build REST API', or 'extract route params'. Enforces :param syntax, request.params destructuring, and multi-parameter routes. Make sure to use this skill whenever creating Express routes that need dynamic segments. Not for query strings, request body parsing, or middleware configuration."
---

# Route Params no Express

> Definir parametros de rota com dois pontos e recuperar via request.params com desestruturacao.

## Rules

1. **Use dois pontos para definir parametros** — `:id` nao `id`, porque o Express usa os dois pontos para identificar segmentos dinamicos na rota
2. **Recupere via request.params com desestruturacao** — `const { id } = request.params` nao `request.params.id` direto, porque desestruturacao deixa explicito quais parametros a rota espera
3. **Nomeie parametros pelo conteudo** — `:userId` nao `:param1`, porque o nome usado na definicao da rota e o mesmo usado na recuperacao
4. **Nao use dois pontos ao recuperar** — defina `:id` na rota, recupere `id` no params, porque os dois pontos sao sintaxe de definicao apenas
5. **Prefira route params sobre regex manual** — Express abstrai a extracao que em Node puro exigiria expressao regular e tratamento manual

## How to write

### Rota com parametro unico

```typescript
app.get("/products/:id", (request, response) => {
  const { id } = request.params

  return response.json({ product: id })
})
```

### Rota com multiplos parametros

```typescript
app.get("/products/:id/users/:userId", (request, response) => {
  const { id, userId } = request.params

  return response.json({ product: id, user: userId })
})
```

## Example

**Before (Node puro com regex):**
```typescript
// Precisava de regex para extrair parametros
const route = /^\/products\/([a-zA-Z0-9]+)$/
const match = url.match(route)
const id = match ? match[1] : null
```

**After (Express route params):**
```typescript
app.get("/products/:id", (request, response) => {
  const { id } = request.params
  return response.json({ product: id })
})
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Recurso unico por ID | `GET /products/:id` |
| Recurso aninhado | `GET /products/:productId/reviews/:reviewId` |
| Precisa de filtros opcionais | Use query params, nao route params |
| Identificador obrigatorio na URL | Route param com `:nome` |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `app.get("/products/id", ...)` | `app.get("/products/:id", ...)` |
| `const id = request.params.id` | `const { id } = request.params` |
| `app.get("/products/:1", ...)` | `app.get("/products/:id", ...)` |
| Regex manual para extrair segmentos | Route params do Express |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo, comparacao Node puro vs Express, e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-route-params-2/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-route-params-2/references/code-examples.md)
