# Code Examples: Query Parameters no Express

## Exemplo 1: Rota basica da aula

O instrutor comeca com uma rota simples em `/products`:

```javascript
app.get('/products', (req, res) => {
  res.send('Produtos')
})
```

Essa rota responde tanto para:
- `GET /products`
- `GET /products?page=1&limit=10`

Os query params nao afetam o matching da rota.

## Exemplo 2: Recuperando query params para paginacao

```javascript
app.get('/products', (req, res) => {
  const { page, limit } = req.query

  res.send(`Página ${page} de ${limit}`)
})
```

Requisicoes:
- `GET /products?page=1&limit=10` → "Página 1 de 10"
- `GET /products?page=5&limit=20` → "Página 5 de 20"

## Exemplo 3: Comparacao com route params

```javascript
// Route param — OBRIGATORIO
app.get('/products/:id', (req, res) => {
  const { id } = req.params
  res.send(`Produto ${id}`)
})
// GET /products → 404 (nao encontra a rota!)
// GET /products/42 → "Produto 42"

// Query param — OPCIONAL
app.get('/products', (req, res) => {
  const { page } = req.query
  res.send(`Página ${page}`)
})
// GET /products → "Página undefined"
// GET /products?page=1 → "Página 1"
```

## Exemplo 4: Com defaults e conversao de tipo

```javascript
app.get('/products', (req, res) => {
  const { page = '1', limit = '10' } = req.query

  const pageNumber = Number(page)
  const limitNumber = Number(limit)

  const offset = (pageNumber - 1) * limitNumber

  res.json({
    page: pageNumber,
    limit: limitNumber,
    offset,
    data: [] // resultados do banco
  })
})
```

## Exemplo 5: Multiplos query params para filtragem

```javascript
app.get('/products', (req, res) => {
  const {
    page = '1',
    limit = '10',
    search,
    category,
    minPrice,
    maxPrice,
    sortBy = 'name',
    order = 'asc'
  } = req.query

  // Todos opcionais — construa a query dinamicamente
  const filters = {}
  if (search) filters.name = { $like: `%${search}%` }
  if (category) filters.category = category
  if (minPrice) filters.price = { $gte: Number(minPrice) }
  if (maxPrice) filters.price = { ...filters.price, $lte: Number(maxPrice) }

  res.json({ filters, page: Number(page), limit: Number(limit) })
})
```

## Exemplo 6: Contraste com Node puro (o que o Express elimina)

```javascript
// Node puro — parsing manual
const http = require('http')
const { URL } = require('url')

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`)
  const page = url.searchParams.get('page')
  const limit = url.searchParams.get('limit')

  res.end(`Página ${page} de ${limit}`)
})

// Express — ja vem pronto
const express = require('express')
const app = express()

app.get('/products', (req, res) => {
  const { page, limit } = req.query
  res.send(`Página ${page} de ${limit}`)
})
```

A diferenca e dramatica: zero parsing, zero regex, zero `new URL()`. O Express entrega `req.query` pronto para uso.