# Code Examples: Parâmetros Dinâmicos em Rotas Node.js

## Exemplo completo: parseRoutePath

```javascript
// src/utils/parseRoutePath.js

export function parseRoutePath(path) {
  // Encontra padrões :param na definição da rota
  // Ex: /tickets/:id → match em ":id"
  const routeParameterRegex = /:([a-zA-Z]+)/g

  // Substitui :param por grupo de captura nomeado
  // Ex: /tickets/:id → /tickets/(?<id>[a-zA-Z0-9\-_]+)
  const params = path.replaceAll(
    routeParameterRegex,
    '(?<$1>[a-zA-Z0-9\\-_]+)'
  )

  // Monta regex completa:
  // ^ = início da string
  // params = path convertido com grupos
  // (?<query>\\?(.*))?$ = query params opcionais no final
  const pathRegex = new RegExp(`^${params}(?<query>\\?(.*))?$`)

  return pathRegex // IMPORTANTE: não esquecer o return!
}
```

## Exemplo: Registrando rotas com regex

```javascript
// src/index.js
import { parseRoutePath } from './utils/parseRoutePath.js'

const routes = [
  {
    method: 'GET',
    path: '/tickets',
    handler: (req, res) => {
      // listar tickets
    },
  },
  {
    method: 'POST',
    path: '/tickets',
    handler: (req, res) => {
      // criar ticket
    },
  },
].map(route => ({
  ...route,
  path: parseRoutePath(route.path),
}))
```

## Exemplo: Router middleware com regex

```javascript
// src/middlewares/routeMiddleware.js

export function routeMiddleware(routes) {
  return (req, res) => {
    const { method, url } = req

    const matchedRoute = routes.find(
      route => route.method === method && route.path.test(url)
    )

    if (!matchedRoute) {
      res.writeHead(404)
      return res.end(JSON.stringify({ error: 'Not found' }))
    }

    return matchedRoute.handler(req, res)
  }
}
```

## Variações de rotas e o que a regex produz

```javascript
// Rota simples (sem params)
parseRoutePath('/tickets')
// → /^\/tickets(?<query>\?(.*))?$/

// Rota com um route param
parseRoutePath('/tickets/:id')
// → /^\/tickets\/(?<id>[a-zA-Z0-9\-_]+)(?<query>\?(.*))?$/

// Rota com múltiplos route params
parseRoutePath('/orgs/:orgId/members/:memberId')
// → /^\/orgs\/(?<orgId>[a-zA-Z0-9\-_]+)\/members\/(?<memberId>[a-zA-Z0-9\-_]+)(?<query>\?(.*))?$/
```

## URLs que cada regex aceita

```javascript
// /^\/tickets(?<query>\?(.*))?$/
'/tickets'                    // ✅ match
'/tickets?status=closed'      // ✅ match (query capturado)
'/tickets?status=closed&page=2' // ✅ match
'/tickets/abc'                // ❌ no match (sem rota :id)

// /^\/tickets\/(?<id>[a-zA-Z0-9\-_]+)(?<query>\?(.*))?$/
'/tickets/abc-123'            // ✅ match (id = "abc-123")
'/tickets/abc-123?expand=true' // ✅ match
'/tickets'                    // ❌ no match (id obrigatório)
```

## Debugging: console.log para inspecionar rotas

```javascript
// Técnica usada na aula para encontrar o bug do undefined
routes.forEach(route => {
  console.log(route)
  // Se path mostra undefined → a função parseRoutePath não tem return
})
```

## Regex breakdown visual

```
Rota definida:     /tickets/:id
                        ↓
replaceAll:        /tickets/(?<id>[a-zA-Z0-9\-_]+)
                        ↓
+ query suffix:    ^/tickets/(?<id>[a-zA-Z0-9\-_]+)(?<query>\?(.*))?$
                   ↑                                                  ↑
                 início                                              fim

Componentes:
  ^                    → início da string
  /tickets/            → literal
  (?<id>...)           → grupo nomeado "id"
  [a-zA-Z0-9\-_]+     → caracteres válidos para o param (1 ou mais)
  (?<query>...)?       → grupo opcional "query"
  \?                   → literal "?" (escapado)
  (.*)                 → qualquer coisa após o ?
  $                    → fim da string
```