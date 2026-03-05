# Code Examples: Utilizando Status Code no Node.js

## Exemplo 1: Status 200 (OK)

```javascript
const http = require('http')

const server = http.createServer((req, res) => {
  res.writeHead(200)
  res.end('Hello World')
})

server.listen(3333)
```

No Insomnia: aparece verde, "200 OK".

## Exemplo 2: Status 404 (Not Found)

```javascript
const server = http.createServer((req, res) => {
  res.writeHead(404)
  res.end('Recurso nao encontrado')
})
```

No Insomnia: aparece "404 Not Found". O texto "Not Found" e adicionado automaticamente pelo HTTP.

## Exemplo 3: Status 500 (Internal Server Error)

```javascript
const server = http.createServer((req, res) => {
  res.writeHead(500)
  res.end('Erro interno')
})
```

No Insomnia: aparece "500 Internal Server Error".

## Exemplo 4: Status 201 com POST (Created)

```javascript
const server = http.createServer((req, res) => {
  if (req.method === 'POST') {
    res.writeHead(201)
    res.end('Criado com sucesso')
    return
  }

  res.writeHead(200)
  res.end(`Metodo: ${req.method}`)
})
```

No Insomnia: aparece verde, "201 Created", com body "Criado com sucesso".

## Exemplo 5: Combinando metodo + status code (padrao completo)

```javascript
const http = require('http')

const server = http.createServer((req, res) => {
  const { method, url } = req

  if (method === 'GET' && url === '/users') {
    res.writeHead(200)
    res.end(JSON.stringify([{ id: 1, name: 'Diego' }]))
    return
  }

  if (method === 'POST' && url === '/users') {
    res.writeHead(201)
    res.end('Usuario criado com sucesso')
    return
  }

  res.writeHead(404)
  res.end('Rota nao encontrada')
})

server.listen(3333)
```

## Exemplo 6: Sem status code (comportamento padrao)

```javascript
const server = http.createServer((req, res) => {
  // Sem writeHead — Node usa 200 automaticamente
  res.end('Resposta padrao')
})
```

No Insomnia: aparece "200 OK" mesmo sem definir explicitamente.

## Variacoes uteis

### Com headers adicionais

```javascript
res.writeHead(200, { 'Content-Type': 'application/json' })
res.end(JSON.stringify({ message: 'OK' }))
```

### Status code com statusMessage customizada

```javascript
res.writeHead(201, 'Recurso Criado')
res.end('OK')
```

### Usando res.statusCode como alternativa

```javascript
res.statusCode = 404
res.end('Not found')
```