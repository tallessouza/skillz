# Code Examples: Middleware de Rotas

## Exemplo 1: routeHandler.js completo (como na aula)

```javascript
// middlewares/routeHandler.js
import { routes } from '../routes/index.js'

export function routeHandler(req, res) {
  const route = routes.find(
    (route) => route.method === req.method && route.path === req.url
  )

  if (route) {
    return route.controller(req, res)
  }

  res.writeHead(404)
  return res.end()
}
```

## Exemplo 2: routes/index.js (estrutura de rotas)

```javascript
// routes/index.js
import { createTicket } from '../controllers/ticketController.js'

export const routes = [
  {
    method: 'POST',
    path: '/tickets',
    controller: createTicket,
  },
]
```

## Exemplo 3: server.js usando o middleware

```javascript
// server.js
import http from 'node:http'
import { routeHandler } from './middlewares/routeHandler.js'

const server = http.createServer((req, res) => {
  routeHandler(req, res)
})

server.listen(3333, () => {
  console.log('Server running on port 3333')
})
```

## Exemplo 4: Controller exemplo

```javascript
// controllers/ticketController.js
export function createTicket(req, res) {
  res.writeHead(201)
  return res.end(JSON.stringify({ message: 'Criado com sucesso' }))
}
```

## Variacao: 404 com body JSON

```javascript
// Se a API precisa retornar JSON consistente em todos os endpoints
if (!route) {
  res.writeHead(404, { 'Content-Type': 'application/json' })
  return res.end(JSON.stringify({ error: 'Route not found' }))
}
```

## Variacao: Adicionando multiplas rotas

```javascript
// routes/index.js
import { createTicket } from '../controllers/ticketController.js'
import { listTickets } from '../controllers/ticketController.js'

export const routes = [
  { method: 'POST', path: '/tickets', controller: createTicket },
  { method: 'GET', path: '/tickets', controller: listTickets },
]
```

## Erro comum: import com path errado

```javascript
// ERRADO — auto-import pode gerar isso
import { routes } from './routes.js'

// CORRETO — saia de middlewares/ e entre em routes/
import { routes } from '../routes/index.js'
```