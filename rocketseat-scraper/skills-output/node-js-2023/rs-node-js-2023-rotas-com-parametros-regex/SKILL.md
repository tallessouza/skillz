---
name: rs-node-js-2023-rotas-parametros-regex
description: "Applies RegEx-based route parameter extraction when building Node.js HTTP servers from scratch. Use when user asks to 'create routes', 'parse URL parameters', 'build a router', 'extract route params', or 'match dynamic paths'. Implements named capture groups, path-to-regex conversion, and route matching with .test() and .match(). Make sure to use this skill whenever implementing custom routing without Express or similar frameworks. Not for Express/Fastify route handling, query string parsing, or middleware configuration."
---

# Rotas com Parâmetros (RegEx)

> Converta paths com parâmetros dinâmicos (`:id`) em RegEx com named capture groups para extrair valores nomeados da URL.

## Rules

1. **Substitua parâmetros dinâmicos por RegEx de captura** — use `replaceAll` com a regex de detecção para trocar `:param` por um grupo de captura, porque isso transforma o path estático em um matcher dinâmico
2. **Use named capture groups com $1** — `(?<$1>[a-z0-9\\-_]+)` onde `$1` referencia o nome capturado pela regex anterior, porque isso nomeia automaticamente cada parâmetro sem hardcode
3. **Ancore a regex com `^`** — use `^` no início para garantir que a URL começa com o path, porque sem ancoragem `.test()` retorna true para qualquer string que contenha o padrão
4. **Use `.test()` para matching e `.match()` para extração** — `.test()` retorna boolean para encontrar a rota, `.match()` retorna os grupos nomeados com os valores, porque são operações distintas com propósitos diferentes
5. **Permita apenas caracteres seguros na URL** — `[a-z0-9\\-_]+` aceita letras, números, hífen e underline, porque são os caracteres válidos em segmentos de URL

## How to write

### Build Route Path (conversão path → regex)

```javascript
function buildRoutePath(path) {
  const routeParametersRegex = /:([a-zA-Z]+)/g
  const pathWithParams = path.replaceAll(
    routeParametersRegex,
    '(?<$1>[a-z0-9\\-_]+)'
  )

  const pathRegex = new RegExp(`^${pathWithParams}`)
  return pathRegex
}
```

### Route matching no servidor

```javascript
const route = routes.find((route) => {
  return route.method === method && route.path.test(url)
})

if (route) {
  const routeParams = url.match(route.path)
  req.params = routeParams.groups // { id: 'abc-123' }
}
```

## Example

**Before (comparação estática):**
```javascript
// Não suporta parâmetros dinâmicos
const route = routes.find((route) => {
  return route.method === method && route.path === url
})
```

**After (regex com named groups):**
```javascript
// Suporta /users/:id, /users/:id/groups/:groupId, etc.
const route = routes.find((route) => {
  return route.method === method && route.path.test(url)
})

if (route) {
  const routeParams = url.match(route.path)
  req.params = routeParams?.groups ?? {}
}
```

## Heuristics

| Situação | Faça |
|----------|------|
| Rota sem parâmetros (`/users`) | Regex ainda funciona — `^/users` matcha corretamente |
| Múltiplos parâmetros (`:id`, `:groupId`) | Cada um vira um named group separado automaticamente via `$1` |
| Precisa validar se rota existe | Use `.test(url)` — retorna boolean |
| Precisa extrair valores dos params | Use `url.match(route.path).groups` — retorna objeto nomeado |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `route.path === url` (comparação estática) | `route.path.test(url)` (regex matching) |
| `(?<id>[a-z0-9\\-_]+)` hardcoded por param | `(?<$1>[a-z0-9\\-_]+)` com backreference |
| `url.split('/')[2]` para pegar param | `url.match(route.path).groups` |
| Regex sem `^` de ancoragem | `new RegExp(\`^\${pathWithParams}\`)` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
