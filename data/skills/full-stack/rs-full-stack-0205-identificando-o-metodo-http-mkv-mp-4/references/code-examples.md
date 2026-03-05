# Code Examples: Identificando o Método HTTP

## Exemplo 1: Acesso direto ao método (da aula)

```javascript
const http = require('node:http')

const server = http.createServer((req, res) => {
  res.write(`Método: ${req.method}`)
  res.end()
})

server.listen(3333)
```

Testando com Insomnia/curl:
```bash
curl http://localhost:3333          # Método: GET
curl -X POST http://localhost:3333  # Método: POST
curl -X PUT http://localhost:3333   # Método: PUT
curl -X PATCH http://localhost:3333 # Método: PATCH
curl -X DELETE http://localhost:3333 # Método: DELETE
```

## Exemplo 2: Com destructuring (da aula)

```javascript
const http = require('node:http')

const server = http.createServer((req, res) => {
  const { method } = req

  res.write(`Método: ${method}`)
  res.end()
})

server.listen(3333)
```

Resultado idêntico ao exemplo 1, mas com código mais limpo.

## Exemplo 3: Destructuring múltiplo (extensão)

```javascript
const http = require('node:http')

const server = http.createServer((req, res) => {
  const { method, url, headers } = req

  console.log(`${method} ${url}`)
  console.log('Content-Type:', headers['content-type'])

  res.write(`${method} ${url}`)
  res.end()
})

server.listen(3333)
```

## Exemplo 4: Roteamento básico por método

```javascript
const http = require('node:http')

const server = http.createServer((req, res) => {
  const { method, url } = req

  if (method === 'GET' && url === '/users') {
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.write(JSON.stringify([{ id: 1, name: 'Diego' }]))
  } else if (method === 'POST' && url === '/users') {
    res.writeHead(201)
    res.write('Usuário criado')
  } else {
    res.writeHead(404)
    res.write('Rota não encontrada')
  }

  res.end()
})

server.listen(3333)
```

## Exemplo 5: Switch case para métodos

```javascript
const http = require('node:http')

const server = http.createServer((req, res) => {
  const { method, url } = req

  if (url === '/users') {
    switch (method) {
      case 'GET':
        // listar usuarios
        break
      case 'POST':
        // criar usuario
        break
      case 'PUT':
        // atualizar usuario completo
        break
      case 'PATCH':
        // atualizar usuario parcial
        break
      case 'DELETE':
        // remover usuario
        break
      default:
        res.writeHead(405)
        res.write('Método não permitido')
    }
  }

  res.end()
})

server.listen(3333)
```