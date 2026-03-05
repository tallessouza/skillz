# Code Examples: Rotas com Parâmetros (RegEx)

## Exemplo 1: buildRoutePath completo

```javascript
// src/utils/build-route-path.js

function buildRoutePath(path) {
  // Etapa 1: regex para encontrar :param no path
  const routeParametersRegex = /:([a-zA-Z]+)/g

  // Etapa 2: substitui cada :param por named capture group
  // $1 referencia o nome capturado (ex: "id", "groupId")
  const pathWithParams = path.replaceAll(
    routeParametersRegex,
    '(?<$1>[a-z0-9\\-_]+)'
  )

  // Etapa 3: cria regex ancorada no início
  const pathRegex = new RegExp(`^${pathWithParams}`)
  return pathRegex
}

export { buildRoutePath }
```

### Demonstração de transformação

```javascript
// Input:  "/users/:id"
// Output: /^\/users\/(?<id>[a-z0-9\-_]+)/

// Input:  "/users/:id/groups/:groupId"
// Output: /^\/users\/(?<id>[a-z0-9\-_]+)\/groups\/(?<groupId>[a-z0-9\-_]+)/
```

## Exemplo 2: Registro de rotas

```javascript
// src/routes.js
import { buildRoutePath } from './utils/build-route-path.js'

export const routes = [
  {
    method: 'GET',
    path: buildRoutePath('/users'),
    handler: (req, res) => {
      return res.end(JSON.stringify(users))
    },
  },
  {
    method: 'DELETE',
    path: buildRoutePath('/users/:id'),
    handler: (req, res) => {
      const { id } = req.params
      // delete user by id
      return res.writeHead(204).end()
    },
  },
]
```

## Exemplo 3: Server com matching e extração

```javascript
// src/server.js
import http from 'node:http'
import { routes } from './routes.js'

const server = http.createServer((req, res) => {
  const { method, url } = req

  // Encontra a rota usando .test()
  const route = routes.find((route) => {
    return route.method === method && route.path.test(url)
  })

  if (route) {
    // Extrai parâmetros usando .match()
    const routeParams = url.match(route.path)
    req.params = routeParams?.groups ?? {}

    return route.handler(req, res)
  }

  return res.writeHead(404).end()
})

server.listen(3333)
```

## Exemplo 4: Múltiplos parâmetros

```javascript
// Rota com dois parâmetros
{
  method: 'GET',
  path: buildRoutePath('/users/:id/groups/:groupId'),
  handler: (req, res) => {
    const { id, groupId } = req.params
    // id = "abc-123", groupId = "1"
  },
}

// URL testada: /users/abc-123/groups/1
// match.groups = { id: "abc-123", groupId: "1" }
```

## Exemplo 5: Evolução do matching (antes vs depois)

```javascript
// ANTES: comparação estática (não suporta params)
const route = routes.find((route) => {
  return route.method === method && route.path === url
})

// DEPOIS: regex matching (suporta params dinâmicos)
const route = routes.find((route) => {
  return route.method === method && route.path.test(url)
})
```