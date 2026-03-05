# Code Examples: Obtendo Parâmetros das Rotas

## Exemplo 1: Função completa de extração

```javascript
// utils/extract-query-params.js
export function extractQueryParams(query) {
  return query
    .slice(1)
    .split('&')
    .reduce((queryParams, param) => {
      const [key, value] = param.split('=')
      queryParams[key] = value
      return queryParams
    }, {})
}
```

### Walkthrough passo a passo

Input: `"?status=open&page=2"`

```javascript
// Passo 1: slice(1)
"status=open&page=2"

// Passo 2: split('&')
["status=open", "page=2"]

// Passo 3: reduce
// Iteração 1: queryParams={}, param="status=open"
//   split('=') → key="status", value="open"
//   queryParams = { status: "open" }
// Iteração 2: queryParams={ status: "open" }, param="page=2"
//   split('=') → key="page", value="2"
//   queryParams = { status: "open", page: "2" }

// Output: { status: "open", page: "2" }
```

## Exemplo 2: Uso no route handler

```javascript
import { extractQueryParams } from './utils/extract-query-params.js'

// Dentro do loop de rotas no servidor HTTP
const routeParams = request.url.match(route.path)

if (routeParams) {
  const { query } = routeParams.groups

  request.query = query
    ? extractQueryParams(query)
    : {}

  // Chama o handler da rota
  route.handler(request, response)
}
```

## Exemplo 3: Acesso no controller

```javascript
// routes/users.js — controller para GET /users
export function listUsers(request, response) {
  const { status } = request.query

  console.log(status) // "open" — apenas o valor, limpo

  // Usar o parâmetro para filtrar dados
  const filteredUsers = users.filter(user => {
    if (status) return user.status === status
    return true
  })

  return response
    .writeHead(200, { 'Content-Type': 'application/json' })
    .end(JSON.stringify(filteredUsers))
}
```

## Exemplo 4: Variação com múltiplos parâmetros

```javascript
// URL: /users?status=active&role=admin&page=1
const params = extractQueryParams("?status=active&role=admin&page=1")
// Result: { status: "active", role: "admin", page: "1" }

// Todos os valores são strings — conversão de tipo é responsabilidade do consumer
const pageNumber = Number(params.page) // 1
```

## Exemplo 5: Caso com parâmetro único

```javascript
// URL: /users?search=john
const params = extractQueryParams("?search=john")
// split('&') retorna ["search=john"] — array de 1 elemento
// reduce funciona normalmente
// Result: { search: "john" }
```

## Exemplo 6: Regex da rota com grupo de captura para query

```javascript
// Ao definir a rota, a regex precisa capturar a query string opcionalmente
// Exemplo de como o buildRoutePath pode gerar isso:
function buildRoutePath(path) {
  const routeParametersRegex = /:([a-zA-Z]+)/g
  const pathWithParams = path.replaceAll(routeParametersRegex, '(?<$1>[a-z0-9\\-_]+)')

  const pathRegex = new RegExp(`^${pathWithParams}(?<query>\\?(.*))?$`)
  return pathRegex
}

// /users/:id gera: /^\/users\/(?<id>[a-z0-9\-_]+)(?<query>\?(.*))?$/
// O grupo (?<query>...) captura tudo após o ? incluindo o próprio ?
```

## Exemplo 7: Desestruturação dos groups do match

```javascript
// O que o match retorna:
const url = "/users/abc-123?status=open"
const regex = /^\/users\/(?<id>[a-z0-9\-]+)(?<query>\?.+)?$/
const result = url.match(regex)

console.log(result.groups)
// { id: "abc-123", query: "?status=open" }

// Desestruturação direta:
const { id, query } = result.groups
// id = "abc-123"
// query = "?status=open"
```