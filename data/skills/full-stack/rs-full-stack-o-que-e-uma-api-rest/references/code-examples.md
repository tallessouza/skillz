# Code Examples: API RESTful

## Resource-Based Routing

### Exemplo do instrutor: Cadastro de produto

```typescript
// POST /products — Cadastrar novo produto
// Metodo HTTP (POST) + rota descritiva (/products) + body JSON
app.post('/products', async (request, reply) => {
  const { name, price, description } = request.body

  const product = await createProduct({ name, price, description })

  return reply.status(201).send(product)
})
```

### CRUD completo seguindo resource-based

```typescript
// CREATE — POST /products
app.post('/products', async (request, reply) => {
  const product = await createProduct(request.body)
  return reply.status(201).send(product)
})

// READ (lista) — GET /products
app.get('/products', async (request, reply) => {
  const products = await listProducts()
  return reply.send(products)
})

// READ (unitario) — GET /products/:id
app.get('/products/:id', async (request, reply) => {
  const product = await getProductById(request.params.id)
  return reply.send(product)
})

// UPDATE — PUT /products/:id
app.put('/products/:id', async (request, reply) => {
  const product = await updateProduct(request.params.id, request.body)
  return reply.send(product)
})

// DELETE — DELETE /products/:id
app.delete('/products/:id', async (request, reply) => {
  await deleteProduct(request.params.id)
  return reply.status(204).send()
})
```

## Representacao vs Armazenamento

```typescript
// JSON (representacao que trafega na API)
{
  "name": "Camiseta",
  "priceInCents": 2990,
  "category": "vestuario"
}

// No banco relacional (tabelas e linhas)
// products table:
// | id | name      | price_in_cents | category_id |
// | 1  | Camiseta  | 2990           | 3           |

// A API converte entre os dois formatos
app.post('/products', async (request, reply) => {
  // Recebe JSON (representacao)
  const { name, priceInCents, category } = request.body

  // Converte e armazena no banco (formato do banco)
  const product = await db.product.create({
    data: {
      name,
      price_in_cents: priceInCents,
      category_id: await getCategoryId(category),
    },
  })

  // Retorna JSON (representacao)
  return reply.status(201).send({
    id: product.id,
    name: product.name,
    priceInCents: product.price_in_cents,
    category,
  })
})
```

## Stateless — Cada request e auto-suficiente

```typescript
// ERRADO: servidor guarda estado entre requests
let currentUser = null // estado no servidor

app.post('/login', (request, reply) => {
  currentUser = findUser(request.body.email) // guarda estado
  return reply.send({ message: 'logged in' })
})

app.get('/profile', (request, reply) => {
  return reply.send(currentUser) // depende de estado anterior
})

// CORRETO: stateless — cada request carrega suas informacoes
app.get('/profile', async (request, reply) => {
  const token = request.headers.authorization // info vem no request
  const user = await verifyToken(token)       // servidor nao guarda nada
  return reply.send(user)
})
```

## Sistema em Camadas

```typescript
// Camada 1: Controller (recebe request)
app.post('/products', async (request, reply) => {
  const product = await productService.create(request.body)
  return reply.status(201).send(product)
})

// Camada 2: Service (logica de negocio)
const productService = {
  async create(data) {
    if (data.priceInCents < 0) {
      throw new Error('Price must be positive')
    }
    return productRepository.save(data)
  },
}

// Camada 3: Repository (acesso a dados)
const productRepository = {
  async save(data) {
    return db.product.create({ data })
  },
}
```

## Cache — Reutilizar recursos obtidos

```typescript
// Servidor indica que o recurso pode ser cacheado
app.get('/products', async (request, reply) => {
  const products = await listProducts()

  return reply
    .header('Cache-Control', 'public, max-age=60') // cache por 60s
    .send(products)
})
```