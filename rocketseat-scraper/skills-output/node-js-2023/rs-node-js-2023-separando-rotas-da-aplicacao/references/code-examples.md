# Code Examples: Separando Rotas da Aplicacao

## Exemplo completo do routes.js

```javascript
// routes.js
import { Database } from './database.js'
import { randomUUID } from 'node:crypto'

const database = new Database()

export const routes = [
  {
    method: 'GET',
    path: '/users',
    handler(req, res) {
      const users = database.select('users')
      return res.end(JSON.stringify(users))
    }
  },
  {
    method: 'POST',
    path: '/users',
    handler(req, res) {
      const { name, email } = req.body

      const user = {
        id: randomUUID(),
        name,
        email,
      }

      database.insert('users', user)

      return res.writeHead(201).end()
    }
  },
]
```

## Exemplo completo do server.js refatorado

```javascript
// server.js
import http from 'node:http'
import { routes } from './routes.js'

const server = http.createServer((req, res) => {
  const { method, url } = req

  const route = routes.find(route =>
    route.method === method && route.path === url
  )

  if (route) {
    return route.handler(req, res)
  }

  return res.writeHead(404).end()
})

server.listen(3333)
```

## Passo a passo da validacao (como o instrutor testou)

### Step 1: Verificar se find retorna a rota correta

```javascript
const route = routes.find(route =>
  route.method === method && route.path === url
)

console.log(route)
// GET /users → { method: 'GET', path: '/users', handler: [Function] }
// POST /users → { method: 'POST', path: '/users', handler: [Function] }
// GET /usersd → undefined
```

### Step 2: Conectar o handler apos validacao

```javascript
if (route) {
  return route.handler(req, res)
}

return res.writeHead(404).end()
```

## Adicionando uma nova rota (pattern de extensao)

Para adicionar DELETE /users, basta acrescentar ao array:

```javascript
export const routes = [
  // ... rotas existentes
  {
    method: 'DELETE',
    path: '/users',
    handler(req, res) {
      // logica de remocao
      return res.writeHead(204).end()
    }
  },
]
```

Nenhuma alteracao necessaria no server.js.

## Antes vs Depois — server.js

### Antes (tudo junto)

```javascript
import http from 'node:http'
import { Database } from './database.js'
import { randomUUID } from 'node:crypto'

const database = new Database()

const server = http.createServer((req, res) => {
  const { method, url } = req

  if (method === 'GET' && url === '/users') {
    const users = database.select('users')
    return res.end(JSON.stringify(users))
  }

  if (method === 'POST' && url === '/users') {
    const { name, email } = req.body
    const user = { id: randomUUID(), name, email }
    database.insert('users', user)
    return res.writeHead(201).end()
  }

  return res.writeHead(404).end()
})

server.listen(3333)
```

### Depois (separado)

```javascript
import http from 'node:http'
import { routes } from './routes.js'

const server = http.createServer((req, res) => {
  const { method, url } = req

  const route = routes.find(r => r.method === method && r.path === url)

  if (route) {
    return route.handler(req, res)
  }

  return res.writeHead(404).end()
})

server.listen(3333)
```

O server.js passou de ~20 linhas com logica de negocio para ~12 linhas puramente de infraestrutura.