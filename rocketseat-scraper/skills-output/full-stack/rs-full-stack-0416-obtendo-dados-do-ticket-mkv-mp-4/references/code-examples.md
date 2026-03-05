# Code Examples: Obtendo Dados da Requisicao

## Exemplo 1: Evolucao do acesso a route params

### Passo 1 — Verificando o que chega

```javascript
server.put('/tickets/:id', (request, response) => {
  // Primeiro teste: o que tem em request.params?
  return response.end(JSON.stringify(request.params))
})
// Retorna: {"id":"abc-123"}
```

### Passo 2 — Acesso direto

```javascript
server.put('/tickets/:id', (request, response) => {
  const id = request.params.id
  return response.end(id)
})
// Retorna: abc-123
```

### Passo 3 — Com destructuring (versao final)

```javascript
server.put('/tickets/:id', (request, response) => {
  const { id } = request.params
  return response.end(id)
})
```

## Exemplo 2: Extraindo body params

### Enviando dados no body (via Insomnia/Postman)

```json
{
  "equipment": "mouse",
  "description": "Mouse nao funciona"
}
```

### Extraindo no handler

```javascript
server.put('/tickets/:id', (request, response) => {
  const { id } = request.params
  const { equipment, description } = request.body

  // Agora temos:
  // id -> do path /tickets/:id
  // equipment -> do body JSON
  // description -> do body JSON
})
```

## Exemplo 3: Resposta vazia com status code

### Com 204 No Content

```javascript
server.put('/tickets/:id', (request, response) => {
  const { id } = request.params
  const { equipment, description } = request.body

  // ... logica de atualizacao

  return response.writeHead(204).end()
})
```

### Com 200 OK (padrao implicito)

```javascript
server.put('/tickets/:id', (request, response) => {
  const { id } = request.params
  const { equipment, description } = request.body

  // ... logica de atualizacao

  // 200 e o padrao, nao precisa writeHead
  return response.end()
})
```

## Exemplo 4: Middleware de rotas populando params

```javascript
// Dentro do middleware que faz matching de rotas
const routeParams = route.path.exec(url)

if (routeParams) {
  // query params ja extraidos antes
  request.query = queryParams

  // route params extraidos do regex
  request.params = { ...routeParams.groups }

  // body ja parseado em middleware anterior
  // request.body = parsedBody

  route.handler(request, response)
}
```

## Exemplo 5: Handler completo com todas as fontes

```javascript
// GET /tickets?status=open        -> query params
// PUT /tickets/:id                -> route params + body
// POST /tickets                   -> body apenas

server.get('/tickets', (request, response) => {
  const { status } = request.query  // filtro via query string
  // ... buscar tickets filtrados
  return response.end(JSON.stringify(tickets))
})

server.put('/tickets/:id', (request, response) => {
  const { id } = request.params              // identificador do recurso
  const { equipment, description } = request.body  // dados para atualizar
  // ... atualizar ticket
  return response.writeHead(204).end()
})

server.post('/tickets', (request, response) => {
  const { equipment, description } = request.body  // dados para criar
  // ... criar ticket
  return response.writeHead(201).end(JSON.stringify(newTicket))
})
```

## Variacoes: Quando usar cada status code

```javascript
// CREATE -> 201 Created (com corpo retornando o recurso criado)
return response.writeHead(201).end(JSON.stringify(created))

// UPDATE -> 200 OK (com corpo) ou 204 No Content (sem corpo)
return response.writeHead(204).end()

// DELETE -> 204 No Content
return response.writeHead(204).end()

// READ -> 200 OK (padrao, com corpo)
return response.end(JSON.stringify(data))
```