# Code Examples: Route Params no Express

## Exemplo 1: Parametro unico (da aula)

```typescript
// Definicao da rota com :id
app.get("/products/:id", (request, response) => {
  const { id } = request.params

  return response.send(`Produto ${id}`)
})

// GET /products/set     → "Produto set"
// GET /products/345     → "Produto 345"
// GET /products         → 404 (nao bate com a rota)
```

## Exemplo 2: Multiplos parametros (da aula)

```typescript
app.get("/products/:id/:user", (request, response) => {
  const { id, user } = request.params

  return response.send(`Produto ${id} do usuario ${user}`)
})

// GET /products/set/rodrigo → "Produto set do usuario rodrigo"
```

## Exemplo 3: Parametros em rotas aninhadas

```typescript
app.get("/users/:userId/orders/:orderId", (request, response) => {
  const { userId, orderId } = request.params

  return response.json({
    user: userId,
    order: orderId,
  })
})

// GET /users/5/orders/99 → { "user": "5", "order": "99" }
```

## Exemplo 4: Convertendo parametro para numero

```typescript
app.get("/products/:id", (request, response) => {
  const { id } = request.params
  const productId = Number(id)

  if (isNaN(productId)) {
    return response.status(400).json({ error: "ID must be a number" })
  }

  return response.json({ productId })
})
```

## Exemplo 5: Comparacao Node puro vs Express

### Node puro (complexo):
```typescript
import http from "node:http"

const server = http.createServer((request, response) => {
  const url = request.url
  const productRoute = /^\/products\/([a-zA-Z0-9]+)$/
  const match = url.match(productRoute)

  if (match) {
    const id = match[1]
    response.writeHead(200, { "Content-Type": "text/plain" })
    response.end(`Produto ${id}`)
  } else {
    response.writeHead(404)
    response.end("Not Found")
  }
})
```

### Express (simples):
```typescript
app.get("/products/:id", (request, response) => {
  const { id } = request.params
  return response.send(`Produto ${id}`)
})
```

## Exemplo 6: Parametro opcional (variacao)

```typescript
// Express nao suporta :param? nativamente em todas as versoes
// Alternativa: definir duas rotas
app.get("/products", listProducts)
app.get("/products/:id", getProduct)
```

## Exemplo 7: Uso real — buscar produto no banco

```typescript
app.get("/products/:id", async (request, response) => {
  const { id } = request.params

  const product = await database.findProductById(id)

  if (!product) {
    return response.status(404).json({ error: "Product not found" })
  }

  return response.json({ product })
})
```