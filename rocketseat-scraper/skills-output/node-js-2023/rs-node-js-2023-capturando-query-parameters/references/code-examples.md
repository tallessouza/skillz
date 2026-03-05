# Code Examples: Capturando Query Parameters

## Exemplo 1: buildRoutePath atualizado com captura de query

```javascript
// utils/build-route-path.js

function buildRoutePath(path) {
  const routeParametersRegex = /:([a-zA-Z]+)/g
  const pathWithParams = path.replaceAll(routeParametersRegex, '(?<$1>[a-z0-9\\-_]+)')

  // A parte nova: (?<query>\\?(.*))?$
  // - (?<query>...) = grupo nomeado "query"
  // - \\? = literal "?" (escapado)
  // - (.*) = qualquer coisa depois do ?
  // - )? = grupo inteiro e opcional
  // - $ = fim da string
  const pathRegex = new RegExp(`^${pathWithParams}(?<query>\\\\?(.*))?$`)

  return pathRegex
}
```

## Exemplo 2: extractQueryParams completo

```javascript
// utils/extract-query-params.js

export function extractQueryParams(query) {
  // Input: "?search=Diego&page=2"

  return query
    .substr(1)          // "search=Diego&page=2" (remove o ?)
    .split('&')         // ["search=Diego", "page=2"]
    .reduce((queryParams, param) => {
      const [key, value] = param.split('=')
      // Iteracao 1: queryParams = {}, key = "search", value = "Diego"
      // Iteracao 2: queryParams = { search: "Diego" }, key = "page", value = "2"

      queryParams[key] = value

      return queryParams
    }, {})

  // Output: { search: "Diego", page: "2" }
}
```

## Exemplo 3: Middleware de roteamento atualizado

```javascript
// server.js (trecho do handler de requisicoes)

const route = routes.find(route => {
  return route.method === method && route.path.test(url)
})

if (route) {
  const routeParams = url.match(route.path)

  // Desestruturacao: separa query dos route params
  const { query, ...params } = routeParams.groups

  req.params = params
  req.query = query
    ? extractQueryParams(query)
    : {}  // fallback para objeto vazio — nunca undefined

  return route.handler(req, res)
}
```

## Exemplo 4: Usando query params na rota de listagem

```javascript
// routes.js

{
  method: 'GET',
  path: buildRoutePath('/users'),
  handler: (req, res) => {
    // req.query = { search: 'Diego', page: '2' } ou {}
    console.log(req.query)

    const { search } = req.query

    // Filtro usando o query param
    const users = database.select('users', search
      ? { name: search }
      : null
    )

    return res.end(JSON.stringify(users))
  }
}
```

## Exemplo 5: Testando no Insomnia

```
# Sem query params — retorna todos os usuarios
GET http://localhost:3333/users
# req.query = {}

# Com um query param — filtra por nome
GET http://localhost:3333/users?search=Diego
# req.query = { search: 'Diego' }

# Com multiplos query params
GET http://localhost:3333/users?search=Diego&page=2
# req.query = { search: 'Diego', page: '2' }
```

## Exemplo 6: Fluxo completo passo a passo

```javascript
// URL recebida: /users?search=Diego&page=2

// 1. Regex match
const match = '/users?search=Diego&page=2'.match(
  /^\/users(?<query>\?(.*))?$/
)
// match.groups = { query: '?search=Diego&page=2' }

// 2. Desestruturacao
const { query, ...params } = match.groups
// query = '?search=Diego&page=2'
// params = {}

// 3. extractQueryParams
extractQueryParams('?search=Diego&page=2')
// substr(1) → 'search=Diego&page=2'
// split('&') → ['search=Diego', 'page=2']
// reduce:
//   'search=Diego' → split('=') → ['search', 'Diego'] → { search: 'Diego' }
//   'page=2'       → split('=') → ['page', '2']       → { search: 'Diego', page: '2' }

// 4. Resultado final
// req.params = {}
// req.query = { search: 'Diego', page: '2' }
```