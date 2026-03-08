---
name: rs-full-stack-0204-metodos-http
description: "Enforces correct HTTP method and status code usage when building Node.js APIs or REST endpoints. Use when user asks to 'create an API', 'add a route', 'build an endpoint', 'handle requests', or 'return a response'. Applies rules: GET for reading, POST for creating, PUT for full update, PATCH for partial update, DELETE for removing, correct status codes per action. Make sure to use this skill whenever designing or reviewing API routes. Not for frontend HTTP client code, WebSocket, or GraphQL."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: fundamentos
  tags: [http-methods, status-codes, rest-api, nodejs, routing]
---

# Métodos HTTP

> Toda rota de API combina um método HTTP (a ação) com um path (o recurso), e toda resposta carrega um status code adequado.

## Rules

1. **Use o método HTTP correto para cada ação** — GET lê, POST cria, PUT atualiza tudo, PATCH atualiza parcial, DELETE remove, porque o mesmo path pode executar ações diferentes dependendo do método
2. **Sempre retorne uma resposta** — toda requisição precisa de resposta (sucesso ou erro), porque sem resposta o cliente fica esperando até timeout
3. **Use status codes semânticos** — 200 sucesso genérico, 201 criado, 204 sem conteúdo, 400 bad request, 401 não autorizado, 404 não encontrado, 500 erro interno, porque o status code comunica o resultado sem precisar de body
4. **POST retorna 201, não 200** — após criar um recurso, retorne 201 Created, porque 200 é genérico e 201 indica criação específica
5. **DELETE pode retornar sem conteúdo** — use 204 No Content quando a exclusão não precisa retornar dados, porque o status code já comunica o sucesso
6. **Diferencie erro do cliente vs servidor** — 4xx para erros causados pela requisição, 5xx para erros internos, porque isso indica quem precisa agir para resolver

## How to write

### Rotas com mesmo path, métodos diferentes

```typescript
// O método HTTP diferencia a ação no mesmo recurso
app.get('/products', listProducts)     // Ler/consultar produtos
app.post('/products', createProduct)   // Criar novo produto
app.put('/products/:id', updateProduct)    // Atualizar produto inteiro
app.patch('/products/:id', updateProductStatus) // Atualizar campo específico
app.delete('/products/:id', deleteProduct) // Remover produto
```

### Status codes por ação

```typescript
// GET — sucesso retorna 200 com dados
app.get('/products', (req, res) => {
  const products = getProducts(req.query)
  return res.status(200).json(products)
})

// POST — criação retorna 201
app.post('/products', (req, res) => {
  const product = createProduct(req.body)
  return res.status(201).json(product)
})

// DELETE — sem conteúdo retorna 204
app.delete('/products/:id', (req, res) => {
  deleteProduct(req.params.id)
  return res.status(204).send()
})
```

## Example

**Before (métodos e status codes incorretos):**
```typescript
app.post('/products/list', (req, res) => {
  const products = getAll()
  return res.status(200).json(products)
})

app.post('/products/delete', (req, res) => {
  remove(req.body.id)
  return res.status(200).json({ message: 'ok' })
})
```

**After (com esta skill aplicada):**
```typescript
app.get('/products', (req, res) => {
  const products = getAll()
  return res.status(200).json(products)
})

app.delete('/products/:id', (req, res) => {
  remove(req.params.id)
  return res.status(204).send()
})
```

## Heuristics

| Situação | Faça |
|----------|------|
| Buscar dados | GET + 200 |
| Criar recurso | POST + 201 |
| Atualizar recurso inteiro | PUT + 200 |
| Atualizar campo específico (foto, status) | PATCH + 200 |
| Remover recurso | DELETE + 204 |
| Recurso não encontrado | 404 |
| Requisição mal formada | 400 |
| Sem autorização | 401 |
| Erro interno inesperado | 500 |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|---------------------|
| `POST /products/list` para ler | `GET /products` |
| `POST /products/delete` para remover | `DELETE /products/:id` |
| `GET /products/create` para criar | `POST /products` |
| `200` após criar recurso | `201` após POST de criação |
| `200` com body vazio após delete | `204` sem body |
| Rota sem nenhuma resposta | Sempre retornar status code, mesmo sem body |

## Troubleshooting

### Problem: POST request returns 200 instead of 201
- **Cause**: The route handler does not explicitly set the status code, defaulting to 200
- **Fix**: Use `res.status(201).json(data)` or `response.writeHead(201)` for resource creation endpoints

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre relação cliente-servidor e semântica HTTP
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações