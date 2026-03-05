---
name: rs-full-stack-separando-rotas
description: "Applies route separation pattern when building Node.js HTTP servers without frameworks. Use when user asks to 'create routes', 'organize express-like routes', 'build HTTP server', 'separate route handlers', or 'create middleware for routing'. Enforces routes array with method/path/controller objects, route handler middleware with find-based matching, and clean server.js. Make sure to use this skill whenever structuring a raw Node.js HTTP API. Not for Express/Fastify/Hono projects that have built-in routers."
---

# Separando Rotas — Node.js Puro

> Separe rotas em arquivo dedicado como array de objetos {method, path, controller} e use um middleware routeHandler para resolver a rota correta.

## Rules

1. **Rotas vivem em `routes.js`** — export const routes como array de objetos, porque centraliza todos os endpoints em um lugar navegavel
2. **Cada rota e um objeto com 3 campos** — `method`, `path`, `controller(request, response)`, porque padroniza a estrutura e permite busca programatica
3. **Controller recebe request e response** — a funcao controller e quem executa a logica, porque desacopla roteamento de execucao
4. **Middleware routeHandler resolve rotas** — usa `routes.find()` comparando method e path com request.method e request.url, porque substitui cadeia de if/else
5. **server.js so orquestra middlewares** — nao contem logica de rotas nem de negocio, porque manter o server pequeno facilita manutencao
6. **Rota nao encontrada retorna 404** — se `find()` retorna undefined, responda com statusCode 404, porque o cliente precisa saber que o endpoint nao existe

## How to write

### routes.js

```javascript
export const routes = [
  {
    method: "GET",
    path: "/products",
    controller: (request, response) => {
      return response.end("Lista de produtos")
    },
  },
  {
    method: "POST",
    path: "/products",
    controller: (request, response) => {
      response.writeHead(201)
      return response.end(request.body)
    },
  },
]
```

### middlewares/routeHandler.js

```javascript
import { routes } from "../routes.js"

export function routeHandler(request, response) {
  const route = routes.find(
    (route) => route.method === request.method && route.path === request.url
  )

  if (route) {
    return route.controller(request, response)
  }

  response.writeHead(404)
  return response.end("Rota nao encontrada")
}
```

### server.js (orquestracao)

```javascript
import { routeHandler } from "./middlewares/routeHandler.js"

// dentro do createServer, apos outros middlewares:
routeHandler(request, response)
```

## Example

**Before (tudo no server.js):**
```javascript
const server = http.createServer(async (request, response) => {
  // middleware de body...
  if (request.method === "GET" && request.url === "/products") {
    return response.end("Lista de produtos")
  }
  if (request.method === "POST" && request.url === "/products") {
    response.writeHead(201)
    return response.end(request.body)
  }
  response.writeHead(404)
  return response.end("Rota nao encontrada")
})
```

**After (separado):**
```
src/
├── server.js              # so middlewares
├── routes.js              # array de rotas
└── middlewares/
    └── routeHandler.js    # resolve rota via find()
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Nova rota necessaria | Adicione objeto em routes.js, nao toque no server.js |
| Logica de negocio cresce | Extraia controller para arquivo separado e importe em routes.js |
| Precisa de parametros dinamicos | Evolua o find() para usar regex no path (proximo passo natural) |
| Middleware nao e async | Nao use await ao chamar, porque nao retorna Promise |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| if/else chain no server.js para cada rota | routes.find() no routeHandler middleware |
| Logica de resposta dentro do server.js | controller function dentro de routes.js |
| Import sem extensao .js em ESM | Sempre inclua extensao: `"../routes.js"` |
| Hardcoded 404 no server.js | 404 no routeHandler como fallback do find() |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre separacao de responsabilidades e evolucao do pattern
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-0212-separando-as-rotas-mkv-mp-4/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-0212-separando-as-rotas-mkv-mp-4/references/code-examples.md)
