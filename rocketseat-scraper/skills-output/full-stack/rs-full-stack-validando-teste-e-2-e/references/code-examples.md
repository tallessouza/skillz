# Code Examples: Validando Teste E2E

## Exemplo 1: Validacao basica de status code

Substituindo console.log por expect:

```javascript
// ANTES — sem validacao
it('should list products', async () => {
  const response = await request(app).get('/products')
  console.log(response.body)
})

// DEPOIS — validacao de status
it('should list products', async () => {
  const response = await request(app).get('/products')
  expect(response.status).toBe(200)
})
```

## Exemplo 2: Validacao de tamanho exato com toHaveLength

```javascript
it('should return exactly 3 products', async () => {
  const response = await request(app).get('/products')

  expect(response.status).toBe(200)
  expect(response.body).toHaveLength(3)
})
```

Quando a expectativa nao bate (ex: `toHaveLength(4)` com 3 itens), o Jest mostra:

```
Expected length: 4
Received length: 3
Received array: [item1, item2, item3]
```

## Exemplo 3: Validacao de existencia com toBeGreaterThan

```javascript
it('should return at least one product', async () => {
  const response = await request(app).get('/products')

  expect(response.status).toBe(200)
  expect(response.body.length).toBeGreaterThan(0)
})
```

## Exemplo 4: Expects empilhados — padrao completo da aula

```javascript
it('should list all products', async () => {
  const response = await request(app).get('/products')

  expect(response.status).toBe(200)
  expect(response.body).toHaveLength(3)
  expect(response.body.length).toBeGreaterThan(0)
})
```

## Variacoes para outros cenarios

### POST com validacao de criacao

```javascript
it('should create a product and return 201', async () => {
  const response = await request(app)
    .post('/products')
    .send({ name: 'New Product', price: 29.90 })

  expect(response.status).toBe(201)
  expect(response.body).toHaveProperty('id')
  expect(response.body.name).toBe('New Product')
})
```

### DELETE com validacao de remocao

```javascript
it('should delete a product and return 204', async () => {
  const response = await request(app).delete('/products/1')

  expect(response.status).toBe(204)
})
```

### GET com validacao de item especifico

```javascript
it('should return a specific product', async () => {
  const response = await request(app).get('/products/1')

  expect(response.status).toBe(200)
  expect(response.body).toHaveProperty('name')
  expect(response.body).toHaveProperty('price')
})
```

### Validacao de erro

```javascript
it('should return 404 for non-existent product', async () => {
  const response = await request(app).get('/products/999')

  expect(response.status).toBe(404)
})
```