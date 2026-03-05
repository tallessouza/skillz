# Code Examples: Extração de Parâmetros de Rota

## Exemplo completo: parseOutPath

```javascript
// src/utils/parseOutPath.js
export function parseOutPath(path) {
  // Identifica padrões :param no path
  const routeParametersRegex = /:([a-zA-Z]+)/g

  // Substitui :param por grupo nomeado regex
  const params = path.replaceAll(
    routeParametersRegex,
    '(?<$1>[a-zA-Z0-9\\-_]+)'
  )

  // Converte string em objeto RegExp
  const pathRegex = new RegExp(params)
  return pathRegex
}
```

### Resultado da conversão:

| Input | Output (RegExp) |
|-------|----------------|
| `/products` | `/products/` |
| `/products/:id` | `/products\/(?<id>[a-zA-Z0-9\-_]+)/` |
| `/users/:userId/posts/:postId` | `/users\/(?<userId>[a-zA-Z0-9\-_]+)\/posts\/(?<postId>[a-zA-Z0-9\-_]+)/` |

## Exemplo completo: definição de rotas com .map()

```javascript
// src/routes.js
import { parseOutPath } from './utils/parseOutPath.js'

export const routes = [
  {
    method: 'GET',
    path: '/products',
    handler: (req, res) => {
      res.writeHead(200, { 'Content-Type': 'application/json' })
      return res.end(JSON.stringify({ products: [] }))
    }
  },
  {
    method: 'DELETE',
    path: '/products/:id',
    handler: (req, res) => {
      const { id } = req.params
      res.writeHead(200, { 'Content-Type': 'application/json' })
      return res.end(JSON.stringify({ message: `Produto removido com id: ${id}` }))
    }
  },
].map(route => {
  route.path = parseOutPath(route.path)
  return route
})
```

## Exemplo completo: route handler com extração de params

```javascript
// src/routeHandler.js
import { routes } from './routes.js'

export function routeHandler(request, response) {
  const { method, url } = request

  const route = routes.find(r =>
    r.method === method && r.path.test(url)
  )

  if (route) {
    const routeParams = url.match(route.path)
    request.params = routeParams.groups ?? {}
    return route.handler(request, response)
  }

  response.writeHead(404)
  return response.end('Rota não encontrada')
}
```

## Variação: múltiplos parâmetros

```javascript
// Rota com dois parâmetros
{
  method: 'GET',
  path: '/users/:userId/posts/:postId',
  handler: (req, res) => {
    const { userId, postId } = req.params
    // userId = "42", postId = "abc-123"
    res.end(JSON.stringify({ userId, postId }))
  }
}

// DELETE /users/42/posts/abc-123
// req.params = { userId: "42", postId: "abc-123" }
```

## Variação: testando o matching manualmente

```javascript
const regex = parseOutPath('/products/:id')

console.log(regex.test('/products/7'))      // true
console.log(regex.test('/products/abc'))    // true
console.log(regex.test('/products/'))       // false
console.log(regex.test('/products'))        // false
console.log(regex.test('/users/7'))         // false

const match = '/products/7'.match(regex)
console.log(match.groups)  // { id: "7" }
```

## Detalhe importante: extensão .js no import

```javascript
// CORRETO — sempre inclua a extensão no Node.js ESM
import { parseOutPath } from './utils/parseOutPath.js'

// ERRADO — vai falhar em ESM
import { parseOutPath } from './utils/parseOutPath'
```

O instrutor cometeu esse erro e corrigiu: "sempre coloque a extensão". No Node.js com ES Modules, a extensão `.js` é obrigatória nos imports relativos.