---
name: rs-full-stack-0213-route-params
description: "Applies route params patterns when building Node.js HTTP APIs from scratch. Use when user asks to 'create a route', 'add delete endpoint', 'handle route parameters', 'parse URL params', or 'build REST API with Node'. Enforces unnamed params convention with :param syntax, regex-based route matching, and proper param extraction. Make sure to use this skill whenever implementing raw Node.js routing without frameworks. Not for Express/Fastify route handling, query string parameters, or request body parsing."
---

# Route Params em Node.js Puro

> Parâmetros de rota identificam recursos específicos na URL e exigem regex para matching flexível quando se constrói routing do zero.

## Rules

1. **Use parâmetros não nomeados para identificar recursos** — `/products/7` não `/products?id=7`, porque o identificador faz parte da própria rota e segue convenções REST
2. **Declare params com dois pontos na definição da rota** — `/products/:id` não `/products/id`, porque é a convenção universal que torna explícito o que é dinâmico
3. **Nunca compare rotas com igualdade estrita quando há params** — `===` falha porque `/products/7` !== `/products/:id`, use regex para matching flexível
4. **Extraia o valor do param após o match** — o Node não resolve `:id` automaticamente, é responsabilidade do seu código parsear a URL e mapear para o nome do parâmetro
5. **Cada método HTTP tem sua própria rota** — `DELETE /products/:id` é diferente de `GET /products`, registre separadamente

## How to write

### Definindo rota com param

```javascript
// Na definição de rotas, declare o param com :nome
{ method: 'DELETE', path: '/products/:id', handler: handleDeleteProduct }
```

### Convertendo path com params para regex

```javascript
// Transforma /products/:id em /^\/products\/([^/]+)$/
function buildRouteRegex(path) {
  const paramNames = []
  const regexPath = path.replace(/:(\w+)/g, (_, paramName) => {
    paramNames.push(paramName)
    return '([^/]+)'
  })
  return { regex: new RegExp(`^${regexPath}$`), paramNames }
}
```

### Extraindo params da URL

```javascript
function extractParams(routePath, requestUrl) {
  const { regex, paramNames } = buildRouteRegex(routePath)
  const match = requestUrl.match(regex)
  if (!match) return null

  const params = {}
  paramNames.forEach((name, index) => {
    params[name] = match[index + 1]
  })
  return params
}

// extractParams('/products/:id', '/products/7')
// → { id: '7' }
```

## Example

**Before (comparação estrita — quebra com params):**
```javascript
const route = routes.find(
  (route) => route.method === method && route.path === url
)
// /products/:id === /products/7 → false — rota não encontrada
```

**After (regex matching — funciona com params):**
```javascript
const route = routes.find((route) => {
  if (route.method !== method) return false
  const { regex } = buildRouteRegex(route.path)
  return regex.test(url)
})
// /^\/products\/([^/]+)$/.test('/products/7') → true
```

## Heuristics

| Situação | Faça |
|----------|------|
| Identificar recurso específico (id, slug) | Parâmetro de rota: `/products/:id` |
| Filtrar lista (busca, paginação) | Query string: `/products?page=2` |
| Múltiplos params na mesma rota | `/users/:userId/orders/:orderId` |
| Param é sempre numérico | Valide após extrair: `Number(params.id)` |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `route.path === url` (com params) | `buildRouteRegex(route.path).regex.test(url)` |
| `/products/id` (sem dois pontos) | `/products/:id` |
| `url.split('/')[2]` (posição fixa) | `extractParams(route.path, url)` |
| Hardcoded: `if (url === '/products/7')` | Dinâmico: `/products/:id` com regex |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre parâmetros não nomeados, por que regex é necessário, e como o Node processa URLs
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações e implementação completa do router

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-0213-route-params-mp-4/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-0213-route-params-mp-4/references/code-examples.md)
