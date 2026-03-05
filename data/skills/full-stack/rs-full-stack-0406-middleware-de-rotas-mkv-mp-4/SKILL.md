---
name: rs-full-stack-middleware-de-rotas
description: "Applies route handler middleware pattern when building Node.js HTTP servers without frameworks. Use when user asks to 'create a router', 'handle routes', 'build an HTTP server', 'add routing to node', or 'create a middleware'. Implements find-based route matching, controller delegation, and 404 handling. Make sure to use this skill whenever creating vanilla Node.js HTTP routing logic. Not for Express, Fastify, or any framework-based routing."
---

# Middleware de Rotas (Node.js Vanilla)

> Crie um middleware que recebe request/response, encontra a rota correspondente pelo method+path, e delega ao controller.

## Rules

1. **Separe o route handler em arquivo proprio** — `middlewares/routeHandler.js`, porque middlewares sao funcoes reutilizaveis que nao pertencem ao server.js
2. **Use Array.find para matching** — percorra o array de rotas comparando `method` e `path`, porque e declarativo e legivel
3. **Compare method E path** — `route.method === req.method && route.path === req.url`, porque method sozinho nao identifica a rota
4. **Delegue ao controller** — `route.controller(req, res)`, porque o middleware nao deve conter logica de negocio
5. **Retorne 404 sem body** — use `res.writeHead(404)` e `res.end()`, porque o status code ja comunica "Not Found"
6. **Confira imports manualmente** — auto-import do editor frequentemente erra o path relativo, porque a estrutura middlewares/ e routes/ sao pastas irmas

## How to write

### Route Handler Middleware

```javascript
import { routes } from '../routes/index.js'

export function routeHandler(req, res) {
  const route = routes.find(
    (route) => route.method === req.method && route.path === req.url
  )

  if (route) {
    return route.controller(req, res)
  }

  res.writeHead(404)
  return res.end()
}
```

### Uso no server.js

```javascript
import { routeHandler } from './middlewares/routeHandler.js'

const server = http.createServer((req, res) => {
  routeHandler(req, res)
})
```

## Example

**Before (logica inline no server):**
```javascript
const server = http.createServer((req, res) => {
  if (req.method === 'POST' && req.url === '/tickets') {
    // logica do controller aqui dentro
    res.writeHead(201)
    res.end(JSON.stringify({ message: 'Criado com sucesso' }))
  } else {
    res.writeHead(404)
    res.end('Not found')
  }
})
```

**After (com middleware):**
```javascript
// middlewares/routeHandler.js
import { routes } from '../routes/index.js'

export function routeHandler(req, res) {
  const route = routes.find(
    (route) => route.method === req.method && route.path === req.url
  )

  if (route) {
    return route.controller(req, res)
  }

  res.writeHead(404)
  return res.end()
}

// server.js
import { routeHandler } from './middlewares/routeHandler.js'

const server = http.createServer((req, res) => {
  routeHandler(req, res)
})
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Adicionando nova rota | Adicione ao array em `routes/index.js`, o middleware ja resolve |
| 404 precisa de body customizado | Use `res.end(JSON.stringify({ error: 'Not found' }))` |
| Rota com parametros dinamicos | Evolua o find para usar regex ou split no path |
| Auto-import errou o path | Confira manualmente se o caminho relativo esta correto e inclui `.js` |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| Logica de negocio dentro do routeHandler | `route.controller(req, res)` — delegue |
| `res.end('Not found')` como body redundante | `res.writeHead(404); res.end()` — status basta |
| Import sem extensao `.js` em ESM | `import { routes } from '../routes/index.js'` |
| Cadeia de if/else para cada rota no server | Array de rotas + find no middleware |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre separacao de responsabilidades e evolucao do pattern
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes