# Code Examples: Métodos HTTP

## Exemplo 1: Mesmo path, métodos diferentes

O ponto central da aula — a mesma URL faz coisas diferentes dependendo do método:

```typescript
// Express.js
const express = require('express')
const app = express()

// GET /products — Ler/consultar produtos
app.get('/products', (req, res) => {
  const products = getAllProducts()
  return res.status(200).json(products)
})

// POST /products — Criar novo produto
app.post('/products', (req, res) => {
  const product = createProduct(req.body)
  return res.status(201).json(product)
})

// PUT /products/:id — Atualizar produto inteiro
app.put('/products/:id', (req, res) => {
  const product = updateProduct(req.params.id, req.body)
  return res.status(200).json(product)
})

// PATCH /products/:id — Atualizar campo específico (ex: só o status)
app.patch('/products/:id', (req, res) => {
  const product = updateProductField(req.params.id, req.body)
  return res.status(200).json(product)
})

// DELETE /products/:id — Remover produto
app.delete('/products/:id', (req, res) => {
  deleteProduct(req.params.id)
  return res.status(204).send()
})
```

## Exemplo 2: Status codes por cenário

```typescript
// Sucesso genérico — 200
app.get('/products', (req, res) => {
  const products = getProductsByColor(req.query.color)
  return res.status(200).json(products)
})

// Criação com sucesso — 201
app.post('/products', (req, res) => {
  const exists = findProductByName(req.body.name)
  if (exists) {
    return res.status(400).json({ error: 'Produto já cadastrado' })
  }
  const product = createProduct(req.body)
  return res.status(201).json(product)
})

// Rota não encontrada — 404
app.use((req, res) => {
  return res.status(404).json({ error: 'Rota não encontrada' })
})

// Erro interno — 500
app.use((err, req, res, next) => {
  console.error(err)
  return res.status(500).json({ error: 'Erro interno do servidor' })
})
```

## Exemplo 3: Resposta sem conteúdo (204)

```typescript
// DELETE que não precisa retornar dados do produto removido
app.delete('/products/:id', (req, res) => {
  const product = findProduct(req.params.id)

  if (!product) {
    return res.status(404).json({ error: 'Produto não encontrado' })
  }

  deleteProduct(req.params.id)
  return res.status(204).send() // Sem body, status code comunica o resultado
})
```

## Exemplo 4: PATCH vs PUT

```typescript
// PUT — substitui todos os dados do produto
app.put('/products/:id', (req, res) => {
  // req.body deve conter TODOS os campos do produto
  const { name, price, color, status, image } = req.body
  const product = replaceProduct(req.params.id, { name, price, color, status, image })
  return res.status(200).json(product)
})

// PATCH — atualiza apenas campos específicos
app.patch('/products/:id', (req, res) => {
  // req.body contém APENAS os campos que mudaram
  // Ex: { status: 'sold' } ou { image: 'new-url.jpg' }
  const product = updateProductFields(req.params.id, req.body)
  return res.status(200).json(product)
})
```

## Exemplo 5: Filtro por query params com GET

```typescript
// GET /products?color=vermelha — consultar com filtro
app.get('/products', (req, res) => {
  const { color, status, minPrice } = req.query

  let products = getAllProducts()

  if (color) {
    products = products.filter(p => p.color === color)
  }
  if (status) {
    products = products.filter(p => p.status === status)
  }
  if (minPrice) {
    products = products.filter(p => p.price >= Number(minPrice))
  }

  return res.status(200).json(products)
})
```

## Exemplo 6: Node.js puro (sem framework)

```typescript
import { createServer } from 'node:http'

const server = createServer((req, res) => {
  const { method, url } = req

  if (method === 'GET' && url === '/products') {
    res.writeHead(200, { 'Content-Type': 'application/json' })
    return res.end(JSON.stringify(products))
  }

  if (method === 'POST' && url === '/products') {
    // Ler body da requisição...
    res.writeHead(201, { 'Content-Type': 'application/json' })
    return res.end(JSON.stringify(newProduct))
  }

  // Rota não encontrada
  res.writeHead(404)
  return res.end()
})

server.listen(3333)
```

## Tabela resumo: método + status code padrão

| Método | Ação | Status sucesso | Status erro comum |
|--------|------|---------------|-------------------|
| GET | Ler | 200 | 404 |
| POST | Criar | 201 | 400, 409 (conflito) |
| PUT | Atualizar tudo | 200 | 404, 400 |
| PATCH | Atualizar parcial | 200 | 404, 400 |
| DELETE | Remover | 204 | 404 |