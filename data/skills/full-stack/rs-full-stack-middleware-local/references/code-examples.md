# Code Examples: Middleware Local

## Exemplo 1: Middleware global (comentado pelo instrutor)

```typescript
// Middleware global — aplica para todas as rotas abaixo
// app.use(logMiddleware)

app.get('/products', (request, reply) => {
  // SEM middleware aqui
  return reply.send({ products: [] })
})

app.post('/products', (request, reply) => {
  // SEM middleware aqui tambem
  return reply.send({ created: true })
})
```

## Exemplo 2: Middleware local em rota especifica

```typescript
function logMiddleware(request, reply, next) {
  console.log('Middleware executou')
  next()
}

app.get('/products', (request, reply) => {
  // Middleware NAO executa aqui
  return reply.send({ products: [] })
})

app.post('/products', logMiddleware, (request, reply) => {
  // Middleware executa APENAS aqui
  return reply.send({ created: true })
})
```

**Teste do instrutor:**
- GET `/products` → resposta normal, sem log do middleware
- POST `/products` → log aparece, middleware executou

## Exemplo 3: Multiplos middlewares encadeados

```typescript
function authenticate(request, reply, next) {
  // verifica token
  next() // passa para o proximo
}

function validateBody(request, reply, next) {
  // valida corpo da requisicao
  next() // passa para o handler
}

app.post('/products', authenticate, validateBody, (request, reply) => {
  // executa apos ambos middlewares
  return reply.send({ created: true })
})
```

## Exemplo 4: Posicionamento para grupo de rotas

```typescript
// Rotas publicas (sem middleware)
app.get('/health', healthCheck)
app.get('/docs', serveDocs)

// Middleware posicional — tudo abaixo e protegido
app.use(authenticate)

// Rotas protegidas
app.get('/products', listProducts)
app.post('/products', createProduct)
app.put('/products/:id', updateProduct)
app.delete('/products/:id', deleteProduct)
```

## Exemplo 5: Middleware duplicado em rotas nao consecutivas

```typescript
app.get('/products', listProducts)           // sem middleware
app.post('/products', validateBody, createProduct)  // com middleware
app.get('/products/:id', getProduct)         // sem middleware
app.put('/products/:id', validateBody, updateProduct)  // com middleware
```

## Exemplo 6: Middleware que interrompe a cadeia

```typescript
function authenticate(request, reply, next) {
  const token = request.headers.authorization
  if (!token) {
    return reply.status(401).send({ error: 'Unauthorized' })
    // next() NAO e chamado — cadeia para aqui
  }
  next()
}

app.post('/products', authenticate, (request, reply) => {
  // so executa se authenticate chamou next()
  return reply.send({ created: true })
})
```