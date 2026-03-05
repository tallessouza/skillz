---
name: rs-full-stack-parametros-dinamicos
description: "Applies URL parsing with regex for dynamic route parameters in Node.js HTTP servers. Use when user asks to 'parse URL parameters', 'handle query strings', 'create dynamic routes', 'extract route params', or 'build a Node.js router'. Implements regex-based path matching for named params (:id) and query params (?key=value). Make sure to use this skill whenever building raw Node.js HTTP routing without frameworks. Not for Express/Fastify/Hono routing, frontend URL handling, or redirect logic."
---

# Parâmetros Dinâmicos em Rotas Node.js

> Substituir comparação exata de rotas por expressões regulares que validam parâmetros nomeados (:id) e query params (?key=value).

## Rules

1. **Nunca compare rotas com igualdade estrita** — use `regex.test(url)` em vez de `path === url`, porque query params e route params quebram comparação exata
2. **Separe o parsing de path em um utilitário** — crie `src/utils/parseRoutePath.js` isolado, porque a lógica de regex não pertence ao router principal
3. **Extraia route params com regex nomeada** — converta `:param` em grupo de captura regex, porque permite extrair valores depois
4. **Trate query params como grupo opcional** — adicione `(?<query>\\?(.*))?$` no final da regex, porque query params são opcionais em qualquer rota
5. **Sempre retorne o valor da função** — funções utilitárias que transformam dados devem retornar o resultado, porque esquecer o `return` causa `undefined` silencioso

## How to write

### parseRoutePath utility

```javascript
// src/utils/parseRoutePath.js
export function parseRoutePath(path) {
  // Regex para encontrar :param nas rotas
  const routeParameterRegex = /:([a-zA-Z]+)/g

  // Substitui :param por grupo de captura regex
  const params = path.replaceAll(routeParameterRegex, '(?<$1>[a-zA-Z0-9\\-_]+)')

  // Monta regex final com suporte a query params opcionais
  const pathRegex = new RegExp(`^${params}(?<query>\\?(.*))?$`)

  return pathRegex
}
```

### Aplicando nas rotas (registrar com regex)

```javascript
import { parseRoutePath } from './utils/parseRoutePath.js'

const routes = [
  { method: 'GET', path: '/tickets', handler: listTickets },
  { method: 'POST', path: '/tickets', handler: createTicket },
].map(route => ({
  ...route,
  path: parseRoutePath(route.path),
}))
```

### Comparação no router middleware

```javascript
// Antes (quebra com query params):
const matchedRoute = routes.find(route =>
  route.method === method && route.path === url
)

// Depois (funciona com params e query):
const matchedRoute = routes.find(route =>
  route.method === method && route.path.test(url)
)
```

## Example

**Before (comparação exata — falha com `?status=closed`):**
```javascript
// GET /tickets?status=closed → 404 Not Found
const route = routes.find(r => r.method === method && r.path === url)
```

**After (regex — aceita query params e route params):**
```javascript
// GET /tickets?status=closed → 200 OK
// GET /tickets → 200 OK
// GET /tickets/:id → match (se rota existir)
const route = routes.find(r => r.method === method && r.path.test(url))
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Rota estática sem params (`/tickets`) | Ainda use regex, porque query params podem aparecer |
| Rota com param dinâmico (`/tickets/:id`) | `:id` vira `(?<id>[a-zA-Z0-9\\-_]+)` |
| Múltiplos params (`/orgs/:orgId/members/:memberId`) | Cada `:param` é convertido independentemente |
| Função retorna undefined | Verifique se tem `return` — erro silencioso comum |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `route.path === url` | `route.path.test(url)` |
| Regex inline no router | Utilitário separado em `utils/` |
| Query param parsing manual com `split('?')` | Grupo regex `(?<query>\\?(.*))?$` |
| Esquecer `return` em função utilitária | Sempre retorne o valor transformado |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre regex de rotas, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações