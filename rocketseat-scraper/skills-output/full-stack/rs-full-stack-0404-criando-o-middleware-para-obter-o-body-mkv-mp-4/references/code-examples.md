# Code Examples: Middleware para Obter o Body da Requisição

## Exemplo base da aula — jsonHandler.js

```javascript
// src/middlewares/jsonHandler.js
export async function jsonHandler(request, response) {
  const buffers = []

  for await (const chunk of request) {
    buffers.push(chunk)
  }

  try {
    request.body = JSON.parse(Buffer.concat(buffers).toString())
  } catch {
    request.body = null
  }

  response.setHeader('Content-Type', 'application/json')
}
```

## Exemplo base da aula — server.js

```javascript
import http from 'node:http'
import { jsonHandler } from './middlewares/jsonHandler.js'

const server = http.createServer(async (request, response) => {
  await jsonHandler(request, response)

  console.log(request.body)

  // Rotas virão aqui
})

server.listen(3333)
```

## Variação: middleware com verificação de Content-Type

```javascript
export async function jsonHandler(request, response) {
  const contentType = request.headers['content-type']

  if (contentType === 'application/json') {
    const buffers = []

    for await (const chunk of request) {
      buffers.push(chunk)
    }

    try {
      request.body = JSON.parse(Buffer.concat(buffers).toString())
    } catch {
      request.body = null
    }
  } else {
    request.body = null
  }

  response.setHeader('Content-Type', 'application/json')
}
```

## Variação: middleware que ignora GET/DELETE sem body

```javascript
export async function jsonHandler(request, response) {
  const methodsWithBody = ['POST', 'PUT', 'PATCH']

  if (methodsWithBody.includes(request.method)) {
    const buffers = []

    for await (const chunk of request) {
      buffers.push(chunk)
    }

    try {
      request.body = JSON.parse(Buffer.concat(buffers).toString())
    } catch {
      request.body = null
    }
  } else {
    request.body = null
  }

  response.setHeader('Content-Type', 'application/json')
}
```

## Variação: múltiplos middlewares em sequência

```javascript
import http from 'node:http'
import { jsonHandler } from './middlewares/jsonHandler.js'
import { logRequest } from './middlewares/logRequest.js'

const server = http.createServer(async (request, response) => {
  // Middlewares executam em ordem
  await jsonHandler(request, response)
  await logRequest(request)

  // Agora request.body está disponível para as rotas
  if (request.method === 'POST' && request.url === '/tickets') {
    const { name } = request.body
    response.writeHead(201)
    response.end(JSON.stringify({ name }))
    return
  }

  response.writeHead(404)
  response.end(JSON.stringify({ error: 'Not found' }))
})

server.listen(3333)
```

## Exemplo de teste com curl (alternativa ao Insomnia)

```bash
# Enviar POST com body JSON
curl -X POST http://localhost:3333/tickets \
  -H "Content-Type: application/json" \
  -d '{"name": "Rodrigo Gonçalves"}'

# Enviar body inválido (testa o try-catch)
curl -X POST http://localhost:3333/tickets \
  -H "Content-Type: application/json" \
  -d 'isso não é json'

# GET sem body (testa middleware com requisição vazia)
curl http://localhost:3333/tickets
```

## Comparação: event listeners vs for-await

```javascript
// ANTES (callback hell)
function parseBody(request) {
  return new Promise((resolve) => {
    const buffers = []
    request.on('data', (chunk) => {
      buffers.push(chunk)
    })
    request.on('end', () => {
      try {
        resolve(JSON.parse(Buffer.concat(buffers).toString()))
      } catch {
        resolve(null)
      }
    })
  })
}

// DEPOIS (for-await — usado na aula)
async function parseBody(request) {
  const buffers = []
  for await (const chunk of request) {
    buffers.push(chunk)
  }
  try {
    return JSON.parse(Buffer.concat(buffers).toString())
  } catch {
    return null
  }
}
```