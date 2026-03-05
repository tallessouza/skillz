# Code Examples: Parâmetros Nomeados

## 1. Montando URL com query params manualmente

```
GET /products?category=computer&price=5000
```

Estrutura:
- `?` após o path inicia a query string
- `category=computer` — primeiro parâmetro nomeado
- `&` — separador
- `price=5000` — segundo parâmetro nomeado

Adicionando mais parâmetros:
```
GET /products?category=computer&price=5000&teste=7
```

## 2. Lendo query params em Node.js puro

```javascript
const http = require('node:http')
const { URL } = require('node:url')

const server = http.createServer((request, response) => {
  const parsedUrl = new URL(request.url, `http://${request.headers.host}`)
  
  // searchParams contém todos os parâmetros nomeados
  const category = parsedUrl.searchParams.get('category')
  const price = parsedUrl.searchParams.get('price')
  
  console.log({ category, price })
  // GET /products?category=computer&price=5000
  // → { category: 'computer', price: '5000' }
  
  response.end(JSON.stringify({ category, price }))
})
```

## 3. Com framework (Fastify/Express)

```javascript
// Fastify
app.get('/products', (request, reply) => {
  const { category, price } = request.query
  // category = 'computer', price = '5000'
})

// Express
app.get('/products', (req, res) => {
  const { category, price } = req.query
})
```

## 4. Combinando route params e query params

```javascript
// Rota: GET /stores/:storeId/products?category=computer&price=5000
app.get('/stores/:storeId/products', (request, reply) => {
  const { storeId } = request.params        // não nomeado (route param)
  const { category, price } = request.query  // nomeados (query params)
})
```

## 5. Usando no Insomnia

### Via URL direta:
```
http://localhost:3333/products?category=computer&price=5000
```

### Via interface de Query Parameters:
| Name     | Value    |
|----------|----------|
| category | computer |
| price    | 5000     |

O Insomnia monta a URL automaticamente e exibe no "URL Preview":
```
http://localhost:3333/products?category=computer&price=5000
```

Funcionalidades do Insomnia para query params:
- Arrastar para reordenar parâmetros
- Adicionar/remover com botões
- Ativar/desativar individualmente sem apagar

## 6. Filtragem opcional com fallback

```javascript
app.get('/products', async (request, reply) => {
  const { category, price, page, limit } = request.query
  
  const filters = {}
  if (category) filters.category = category
  if (price) filters.maxPrice = Number(price)
  
  const pagination = {
    page: Number(page) || 1,
    limit: Number(limit) || 10,
  }
  
  const products = await productRepository.findAll(filters, pagination)
  return reply.send({ products })
})
```

## 7. Anti-pattern: dados sensíveis na URL

```
// ERRADO — senha exposta na URL, logs, histórico
GET /login?email=user@mail.com&password=123456

// CORRETO — dados sensíveis no body
POST /login
Content-Type: application/json
{ "email": "user@mail.com", "password": "123456" }
```