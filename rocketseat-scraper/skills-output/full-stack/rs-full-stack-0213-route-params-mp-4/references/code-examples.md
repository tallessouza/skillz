# Code Examples: Route Params

## 1. Registrando rota DELETE (como mostrado na aula)

```javascript
// routes.js — adicionando a rota de delete
export const routes = [
  {
    method: 'GET',
    path: '/products',
    handler: (request, response) => {
      return response.end(JSON.stringify({ products: [] }))
    },
  },
  {
    method: 'DELETE',
    path: '/products/:id',
    handler: (request, response) => {
      // request.params.id estará disponível após o matching
      return response.end(JSON.stringify({ message: 'Removido' }))
    },
  },
]
```

## 2. Implementação completa do buildRouteRegex

```javascript
// build-route-regex.js
export function buildRouteRegex(path) {
  const paramNames = []

  const regexString = path.replace(/:(\w+)/g, (_, paramName) => {
    paramNames.push(paramName)
    return '([^/]+)'
  })

  return {
    regex: new RegExp(`^${regexString}$`),
    paramNames,
  }
}

// Exemplos de conversão:
// '/products/:id'           → /^\/products\/([^/]+)$/
// '/users/:userId/posts/:postId' → /^\/users\/([^/]+)\/posts\/([^/]+)$/
// '/products'               → /^\/products$/ (sem params, funciona igual)
```

## 3. Middleware de routing com suporte a params

```javascript
// router-middleware.js
import { buildRouteRegex } from './build-route-regex.js'

export function routeMiddleware(routes) {
  return (request, response) => {
    const { method } = request
    const url = new URL(request.url, `http://${request.headers.host}`)
    const pathname = url.pathname

    for (const route of routes) {
      if (route.method !== method) continue

      const { regex, paramNames } = buildRouteRegex(route.path)
      const match = pathname.match(regex)

      if (match) {
        // Extrai params nomeados
        const params = {}
        paramNames.forEach((name, index) => {
          params[name] = match[index + 1]
        })

        request.params = params
        return route.handler(request, response)
      }
    }

    // Nenhuma rota encontrada
    response.writeHead(404)
    return response.end(JSON.stringify({ error: 'Route not found' }))
  }
}
```

## 4. Demonstração do problema (antes do regex)

```javascript
// O que o instrutor mostrou quebrando:
const route = routes.find(
  (route) => route.method === method && route.path === url
)

// Teste:
// method = 'DELETE', url = '/products/7'
// route.path = '/products/:id'
// '/products/:id' === '/products/7' → false
// Resultado: "Rota não encontrada"
```

## 5. Usando params no handler

```javascript
{
  method: 'DELETE',
  path: '/products/:id',
  handler: (request, response) => {
    const productId = Number(request.params.id)

    if (Number.isNaN(productId)) {
      response.writeHead(400)
      return response.end(JSON.stringify({ error: 'Invalid product ID' }))
    }

    // Lógica de remoção usando productId
    console.log(`Removing product ${productId}`)

    response.writeHead(204)
    return response.end()
  },
}
```

## 6. Múltiplos params na mesma rota

```javascript
// Rota com dois params
{
  method: 'GET',
  path: '/users/:userId/orders/:orderId',
  handler: (request, response) => {
    const { userId, orderId } = request.params
    // userId = '42', orderId = '99' para /users/42/orders/99
    return response.end(JSON.stringify({ userId, orderId }))
  },
}
```

## 7. Testando o buildRouteRegex

```javascript
import { buildRouteRegex } from './build-route-regex.js'

// Sem params
const simple = buildRouteRegex('/products')
console.log(simple.regex.test('/products'))     // true
console.log(simple.regex.test('/products/7'))   // false
console.log(simple.paramNames)                   // []

// Com um param
const withId = buildRouteRegex('/products/:id')
console.log(withId.regex.test('/products/7'))    // true
console.log(withId.regex.test('/products/abc'))  // true
console.log(withId.regex.test('/products'))      // false
console.log(withId.paramNames)                    // ['id']

// Com múltiplos params
const nested = buildRouteRegex('/users/:userId/posts/:postId')
const match = '/users/5/posts/42'.match(nested.regex)
// match[1] = '5', match[2] = '42'
// paramNames = ['userId', 'postId']
```