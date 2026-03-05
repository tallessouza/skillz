# Code Examples: Fundamentos de API REST com Node e Express

## Estrutura basica de uma API Express

```typescript
import express from 'express'

const app = express()

// Middleware para parsing de JSON
app.use(express.json())

// Rotas REST para um recurso "users"
app.get('/users', (req, res) => {
  // Listar todos
  res.json({ users: [] })
})

app.get('/users/:id', (req, res) => {
  // Buscar por ID
  const { id } = req.params
  res.json({ user: { id } })
})

app.post('/users', (req, res) => {
  // Criar novo
  const { name, email } = req.body
  res.status(201).json({ user: { name, email } })
})

app.put('/users/:id', (req, res) => {
  // Atualizar existente
  const { id } = req.params
  const { name, email } = req.body
  res.json({ user: { id, name, email } })
})

app.delete('/users/:id', (req, res) => {
  // Remover
  res.status(204).send()
})

app.listen(3000, () => {
  console.log('Server running on port 3000')
})
```

## Mapeamento de verbos HTTP para operacoes

```
GET    /resources      → Listar todos     → 200
GET    /resources/:id  → Buscar um        → 200 ou 404
POST   /resources      → Criar novo       → 201
PUT    /resources/:id  → Atualizar        → 200 ou 404
DELETE /resources/:id  → Remover          → 204 ou 404
```

## Middleware customizado

```typescript
// Middleware de logging
function logRequest(req, res, next) {
  console.log(`${req.method} ${req.url}`)
  next()
}

app.use(logRequest)
```

## Query params vs Route params

```typescript
// Route params: /users/123
app.get('/users/:id', (req, res) => {
  const userId = req.params.id // "123"
})

// Query params: /users?role=admin&page=2
app.get('/users', (req, res) => {
  const role = req.query.role   // "admin"
  const page = req.query.page   // "2"
})
```

## Status codes mais usados

```typescript
// Sucesso
res.status(200).json(data)        // OK — retorno padrao para GET/PUT
res.status(201).json(created)     // Created — apos POST bem sucedido
res.status(204).send()            // No Content — apos DELETE bem sucedido

// Erro do cliente
res.status(400).json({ error })   // Bad Request — dados invalidos
res.status(404).json({ error })   // Not Found — recurso nao existe

// Erro do servidor
res.status(500).json({ error })   // Internal Server Error
```