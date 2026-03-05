# Code Examples: Utilizando Middleware no Node.js

## Exemplo 1: Middleware completo de JSON body

```javascript
// src/middlewares/json-body-handler.js
export async function jsonBodyHandler(request, response) {
  const buffers = []

  // Coleta os chunks de dados da requisicao
  for await (const chunk of request) {
    buffers.push(chunk)
  }

  try {
    // Concatena os chunks e converte para string, depois para JSON
    request.body = JSON.parse(Buffer.concat(buffers).toString())
  } catch {
    // Se nao tem body ou JSON invalido, define como nulo
    request.body = null
  }

  // Define o header de resposta como JSON
  response.setHeader('Content-Type', 'application/json')
}
```

## Exemplo 2: Server usando o middleware

```javascript
// src/server.js
import http from 'node:http'
import { jsonBodyHandler } from './middlewares/json-body-handler.js'

const server = http.createServer(async (request, response) => {
  // Middleware intercepta ANTES das rotas
  await jsonBodyHandler(request, response)

  // POST /products - request.body disponivel gracas ao middleware
  if (request.method === 'POST' && request.url === '/products') {
    const { name, price } = request.body
    console.log(name, price)

    response.writeHead(201)
    return response.end(JSON.stringify(request.body))
  }

  // PUT /users - mesmo request.body, sem duplicar codigo
  if (request.method === 'PUT' && request.url === '/users') {
    response.writeHead(200)
    return response.end(JSON.stringify(request.body))
  }

  response.writeHead(404)
  return response.end()
})

server.listen(3333, () => {
  console.log('Server running on port 3333')
})
```

## Exemplo 3: Acessando propriedades individuais do body

```javascript
// Acessar propriedade string — funciona direto
response.end(request.body.name)

// Acessar propriedade numerica — precisa converter
response.end(request.body.price.toString())

// Retornar objeto inteiro — precisa stringify
response.end(JSON.stringify(request.body))
```

## Exemplo 4: ANTES do middleware (codigo duplicado)

```javascript
const server = http.createServer(async (request, response) => {
  if (request.method === 'POST' && request.url === '/products') {
    const buffers = []
    for await (const chunk of request) {
      buffers.push(chunk)
    }
    const body = JSON.parse(Buffer.concat(buffers).toString())
    console.log(body)

    response.writeHead(201)
    response.setHeader('Content-Type', 'application/json')
    return response.end(JSON.stringify(body))
  }

  // Outra rota — MESMA logica de parsing duplicada
  if (request.method === 'POST' && request.url === '/users') {
    const buffers = []
    for await (const chunk of request) {
      buffers.push(chunk)
    }
    const body = JSON.parse(Buffer.concat(buffers).toString())

    response.writeHead(201)
    response.setHeader('Content-Type', 'application/json')
    return response.end(JSON.stringify(body))
  }
})
```

## Exemplo 5: Variacao — middleware que loga requisicoes

```javascript
// src/middlewares/request-logger.js
export async function requestLogger(request, response) {
  const timestamp = new Date().toISOString()
  console.log(`[${timestamp}] ${request.method} ${request.url}`)
}
```

```javascript
// Uso no server — multiplos middlewares em sequencia
const server = http.createServer(async (request, response) => {
  await requestLogger(request, response)
  await jsonBodyHandler(request, response)

  // rotas...
})
```

## Exemplo 6: Variacao — tratamento de requisicoes sem body

```javascript
// GET /products — middleware roda mas request.body sera null
if (request.method === 'GET' && request.url === '/products') {
  // request.body e null porque GET nao tem body
  // middleware tratou isso gracefully no catch
  const products = [{ name: 'Teclado', price: 200 }]
  response.writeHead(200)
  return response.end(JSON.stringify(products))
}
```