# Code Examples: Recuperando Dados no Body

## Exemplo 1: Setup basico do instrutor

O servidor HTTP com rota POST para products:

```javascript
const http = require('node:http')

const server = http.createServer(async (request, response) => {
  if (request.method === 'POST' && request.url === '/products') {
    const buffers = []

    for await (const chunk of request) {
      buffers.push(chunk)
    }

    const body = Buffer.concat(buffers).toString()
    console.log(body) // '{"name":"teclado","price":120.50}'

    response.writeHead(201)
    response.end('Produto cadastrado')
  }
})

server.listen(3333)
```

### Request enviada pelo Insomnia:

```json
{
  "name": "teclado",
  "price": 120.50
}
```

## Exemplo 2: Visualizando os chunks individuais

Para entender como os dados chegam em pedacos:

```javascript
const server = http.createServer(async (request, response) => {
  const buffers = []

  for await (const chunk of request) {
    console.log(chunk) // <Buffer 7b 22 6e 61 6d 65 ...>
    buffers.push(chunk)
  }

  const body = Buffer.concat(buffers).toString()
  console.log(body) // String legivel

  response.end('OK')
})
```

O `console.log(chunk)` mostra os bytes brutos — o instrutor demonstrou que sem o `toString()` os dados sao inlegiveis.

## Exemplo 3: Parse completo com JSON

```javascript
const server = http.createServer(async (request, response) => {
  const buffers = []

  for await (const chunk of request) {
    buffers.push(chunk)
  }

  const body = JSON.parse(Buffer.concat(buffers).toString())

  // Agora body e um objeto JavaScript
  console.log(body.name)  // "teclado"
  console.log(body.price) // 120.5

  response.writeHead(201)
  response.end(JSON.stringify({ id: 1, ...body }))
})
```

## Exemplo 4: Variacao com verificacao de body vazio

```javascript
const server = http.createServer(async (request, response) => {
  const buffers = []

  for await (const chunk of request) {
    buffers.push(chunk)
  }

  const rawBody = Buffer.concat(buffers).toString()

  if (!rawBody) {
    response.writeHead(400)
    return response.end(JSON.stringify({ error: 'Body is required' }))
  }

  const body = JSON.parse(rawBody)
  response.writeHead(201)
  response.end(JSON.stringify(body))
})
```

## Exemplo 5: Pattern extraido como funcao reutilizavel

```javascript
async function getRequestBody(request) {
  const buffers = []

  for await (const chunk of request) {
    buffers.push(chunk)
  }

  return Buffer.concat(buffers).toString()
}

// Uso:
const server = http.createServer(async (request, response) => {
  const body = JSON.parse(await getRequestBody(request))
  response.end(JSON.stringify(body))
})
```

## Exemplo 6: Comparacao com pattern de eventos (classico)

```javascript
// Pattern CLASSICO (callback-based)
const server = http.createServer((request, response) => {
  const buffers = []

  request.on('data', (chunk) => {
    buffers.push(chunk)
  })

  request.on('end', () => {
    const body = Buffer.concat(buffers).toString()
    response.end(body)
  })
})

// Pattern MODERNO (for await — usado na aula)
const server = http.createServer(async (request, response) => {
  const buffers = []

  for await (const chunk of request) {
    buffers.push(chunk)
  }

  const body = Buffer.concat(buffers).toString()
  response.end(body)
})
```

O pattern moderno e mais linear e legivel — mesmo resultado, menos callback nesting.