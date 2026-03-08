# Code Examples: API Node.js Pura — Fundamentos sem Dependências

## Servidor HTTP básico

```javascript
const http = require('node:http')

const server = http.createServer((request, response) => {
  const { method, url } = request

  response.writeHead(200, { 'Content-Type': 'application/json' })
  response.end(JSON.stringify({ message: 'Hello World' }))
})

server.listen(3333, () => {
  console.log('Server running on port 3333')
})
```

## Body parsing manual (coletando chunks do stream)

```javascript
function getRequestBody(request) {
  return new Promise((resolve) => {
    const chunks = []

    request.on('data', (chunk) => {
      chunks.push(chunk)
    })

    request.on('end', () => {
      const body = Buffer.concat(chunks).toString()
      resolve(body ? JSON.parse(body) : null)
    })
  })
}

// Uso no handler
const body = await getRequestBody(request)
```

## Roteamento manual com parâmetros

```javascript
const routes = [
  { method: 'GET', path: '/tickets', handler: listTickets },
  { method: 'POST', path: '/tickets', handler: createTicket },
  { method: 'PUT', path: '/tickets/:id', handler: updateTicket },
  { method: 'DELETE', path: '/tickets/:id', handler: deleteTicket },
]

function matchRoute(method, url) {
  for (const route of routes) {
    if (route.method !== method) continue

    const routeParts = route.path.split('/')
    const urlParts = url.split('/')

    if (routeParts.length !== urlParts.length) continue

    const params = {}
    const match = routeParts.every((part, i) => {
      if (part.startsWith(':')) {
        params[part.slice(1)] = urlParts[i]
        return true
      }
      return part === urlParts[i]
    })

    if (match) return { handler: route.handler, params }
  }
  return null
}
```

## Handler de criação de ticket

```javascript
const tickets = []

function createTicket(request, response, body) {
  const ticket = {
    id: crypto.randomUUID(),
    equipment: body.equipment,
    description: body.description,
    status: 'open',
    createdAt: new Date().toISOString(),
  }

  tickets.push(ticket)

  response.writeHead(201, { 'Content-Type': 'application/json' })
  response.end(JSON.stringify(ticket))
}
```

## Handler de listagem

```javascript
function listTickets(request, response) {
  response.writeHead(200, { 'Content-Type': 'application/json' })
  response.end(JSON.stringify(tickets))
}
```

## Handler de atualização com parâmetro

```javascript
function updateTicket(request, response, body, params) {
  const ticketIndex = tickets.findIndex(t => t.id === params.id)

  if (ticketIndex === -1) {
    response.writeHead(404, { 'Content-Type': 'application/json' })
    response.end(JSON.stringify({ error: 'Ticket not found' }))
    return
  }

  tickets[ticketIndex] = {
    ...tickets[ticketIndex],
    ...body,
    updatedAt: new Date().toISOString(),
  }

  response.writeHead(200, { 'Content-Type': 'application/json' })
  response.end(JSON.stringify(tickets[ticketIndex]))
}
```

## Handler de exclusão

```javascript
function deleteTicket(request, response, _body, params) {
  const ticketIndex = tickets.findIndex(t => t.id === params.id)

  if (ticketIndex === -1) {
    response.writeHead(404, { 'Content-Type': 'application/json' })
    response.end(JSON.stringify({ error: 'Ticket not found' }))
    return
  }

  tickets.splice(ticketIndex, 1)

  response.writeHead(204)
  response.end()
}
```

## Servidor completo com middleware e rotas

```javascript
const http = require('node:http')
const crypto = require('node:crypto')

// Middleware, routes, handlers definidos acima...

const server = http.createServer(async (request, response) => {
  const { method, url } = request

  const body = await getRequestBody(request)
  const route = matchRoute(method, url)

  if (route) {
    route.handler(request, response, body, route.params)
  } else {
    response.writeHead(404, { 'Content-Type': 'application/json' })
    response.end(JSON.stringify({ error: 'Route not found' }))
  }
})

server.listen(3333, () => {
  console.log('Server running on port 3333')
})
```

## Comparação: Nativo vs Framework

### Nativo
```javascript
// Body parsing
const chunks = []
request.on('data', chunk => chunks.push(chunk))
request.on('end', () => {
  const body = JSON.parse(Buffer.concat(chunks).toString())
})

// Roteamento
if (method === 'GET' && url === '/tickets') { ... }

// Resposta
response.writeHead(200, { 'Content-Type': 'application/json' })
response.end(JSON.stringify(data))
```

### Com Express (equivalente)
```javascript
// Body parsing — uma linha
app.use(express.json())

// Roteamento — declarativo
app.get('/tickets', listTickets)

// Resposta — simplificada
res.status(200).json(data)
```

O framework faz exatamente o mesmo que o código nativo, apenas com uma API mais ergonômica. Entender o nativo torna o uso do framework consciente, não mecânico.