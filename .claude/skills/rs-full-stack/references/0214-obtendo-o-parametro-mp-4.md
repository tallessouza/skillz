---
name: rs-full-stack-obtendo-o-parametro
description: "Applies URL route parameter extraction patterns when building Node.js HTTP servers from scratch. Use when user asks to 'parse route params', 'extract URL parameters', 'build a router', 'handle dynamic routes', or 'create HTTP server routing'. Implements regex-based path matching and named group extraction. Make sure to use this skill whenever creating raw Node.js HTTP routing without frameworks. Not for Express/Fastify/Hono route handling or query string parsing."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: fundamentos
  tags: [route-params, regex, named-groups, nodejs, parseOutPath]
---

# Extração de Parâmetros de Rota no Node.js

> Converta paths com parâmetros nomeados (`:id`) em expressões regulares com grupos nomeados para matching e extração automática.

## Rules

1. **Crie a função `parseOutPath` em `src/utils/`** — separe a lógica de conversão de path em um utilitário reutilizável, porque mantém o route handler limpo
2. **Use regex com grupos nomeados** — `(?<param>[a-zA-Z0-9\-_]+)` em vez de captura posicional, porque permite acesso por nome (`groups.id`) em vez de índice
3. **Aplique `parseOutPath` via `.map()` na lista de rotas** — em vez de chamar manualmente para cada rota, porque novas rotas são convertidas automaticamente
4. **Compare rotas por padrão regex, não por igualdade** — use `route.path.test(url)` em vez de `route.path === url`, porque paths dinâmicos nunca serão iguais ao texto literal
5. **Extraia parâmetros com `.match()` e `.groups`** — `url.match(pathRegex).groups` retorna um objeto `{ id: "7" }`, porque grupos nomeados mapeiam diretamente para os parâmetros da rota
6. **Injete params no objeto `request`** — `request.params = groups` no middleware, porque disponibiliza os parâmetros para todos os handlers sem repetição

## How to write

### Função parseOutPath

```javascript
// src/utils/parseOutPath.js
export function parseOutPath(path) {
  const routeParametersRegex = /:([a-zA-Z]+)/g

  const params = path.replaceAll(routeParametersRegex, '(?<$1>[a-zA-Z0-9\\-_]+)')

  const pathRegex = new RegExp(params)
  return pathRegex
}
```

### Aplicar nas rotas via .map()

```javascript
// Ao exportar as rotas, converta todos os paths de uma vez
export const routes = [
  { method: 'GET',    path: '/products',     handler: listHandler },
  { method: 'DELETE', path: '/products/:id',  handler: deleteHandler },
].map(route => {
  route.path = parseOutPath(route.path)
  return route
})
```

### Matching e extração no route handler

```javascript
// No handler principal, compare por padrão e extraia grupos
const route = routes.find(r =>
  r.method === method && r.path.test(request.url)
)

if (route) {
  const routeParams = request.url.match(route.path)
  request.params = routeParams.groups ?? {}
  return route.handler(request, response)
}
```

## Example

**Before (comparação por igualdade — sem parâmetros):**
```javascript
const route = routes.find(r =>
  r.method === method && r.path === request.url
)
// DELETE /products/7 → nunca encontra "/products/:id"
```

**After (comparação por padrão regex):**
```javascript
const route = routes.find(r =>
  r.method === method && r.path.test(request.url)
)
const routeParams = request.url.match(route.path)
request.params = routeParams.groups ?? {}
// DELETE /products/7 → encontra, request.params = { id: "7" }
```

## Heuristics

| Situação | Faça |
|----------|------|
| Path tem `:param` | Converta para regex com grupo nomeado |
| Múltiplos params (`:id`, `:slug`) | A regex com flag `g` captura todos |
| Acesso ao parâmetro no handler | Use `request.params.id` (injetado no middleware) |
| Rota sem parâmetros (`/products`) | `parseOutPath` retorna regex literal — funciona igual |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `route.path === url` para rotas dinâmicas | `route.path.test(url)` |
| `routeParams[1]` (índice posicional) | `routeParams.groups.id` (grupo nomeado) |
| `parseOutPath(route.path)` em cada rota manualmente | `.map()` no array de rotas |
| Regex sem flag `g` para múltiplos params | `/:([a-zA-Z]+)/g` com flag global |
| `routeParams.group` (singular) | `routeParams.groups` (plural — erro comum) |

## Troubleshooting

### Problem: `routeParams.groups` is undefined after `.match()`
- **Cause**: The regex does not contain named groups (`(?<name>...)`) or the URL did not match the pattern
- **Fix**: Ensure `parseOutPath` uses `(?<$1>[a-zA-Z0-9\\-_]+)` for named groups, and add a null check: `request.params = routeParams?.groups ?? {}`

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre regex, grupos nomeados e o fluxo de matching
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações