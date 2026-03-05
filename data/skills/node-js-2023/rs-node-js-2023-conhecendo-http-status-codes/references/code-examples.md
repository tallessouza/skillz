# Code Examples: HTTP Status Codes

## Exemplo 1: Servidor Node.js com status codes corretos

Contexto completo do servidor que o instrutor esta construindo ao longo das aulas:

```javascript
const http = require('node:http')

const users = []

const server = http.createServer((req, res) => {
  const { method, url } = req

  // GET /users — listagem (200 implicito)
  if (method === 'GET' && url === '/users') {
    return res
      .writeHead(200, { 'Content-Type': 'application/json' })
      .end(JSON.stringify(users))
  }

  // POST /users — criacao (201 explicito)
  if (method === 'POST' && url === '/users') {
    users.push({
      id: 1,
      name: 'John Doe',
      email: 'johndoe@example.com'
    })

    return res.writeHead(201).end()
  }

  // Fallback — rota nao encontrada (404)
  return res.writeHead(404).end()
})

server.listen(3333)
```

## Exemplo 2: Evolucao do fallback

### Antes (sem status code semantico):
```javascript
// Rota de escape retornava 200 com texto generico
return res.end('Hello World')
```

### Depois (com 404):
```javascript
// Rota de escape retorna 404 Not Found
return res.writeHead(404).end()
// Opcionalmente com mensagem:
return res.writeHead(404).end('Not found')
```

## Exemplo 3: Evolucao da rota POST

### Antes (retornando texto desnecessario com 200):
```javascript
if (method === 'POST' && url === '/users') {
  users.push({ id: 1, name: 'John Doe', email: 'johndoe@example.com' })
  return res.end('Criação de usuário')  // 200 implicito, texto sem utilidade
}
```

### Depois (201 sem body):
```javascript
if (method === 'POST' && url === '/users') {
  users.push({ id: 1, name: 'John Doe', email: 'johndoe@example.com' })
  return res.writeHead(201).end()  // 201 Created, front-end sabe que foi criado
}
```

## Exemplo 4: Tabela de referencia rapida para APIs REST

```javascript
// CRUD completo com status codes corretos:

// CREATE
res.writeHead(201).end()                    // Recurso criado
res.writeHead(201).end(JSON.stringify(user)) // Criado, retornando o recurso

// READ
res.writeHead(200).end(JSON.stringify(users))  // Lista
res.writeHead(200).end(JSON.stringify(user))   // Detalhe
res.writeHead(404).end()                       // Nao encontrado

// UPDATE
res.writeHead(200).end(JSON.stringify(user))   // Atualizado, retornando
res.writeHead(204).end()                       // Atualizado, sem body

// DELETE
res.writeHead(204).end()                       // Removido com sucesso

// ERRORS
res.writeHead(400).end(JSON.stringify({ message: 'Email is required' }))  // Erro do cliente
res.writeHead(404).end()                       // Recurso nao existe
res.writeHead(500).end()                       // Erro inesperado do servidor
```

## Exemplo 5: O anti-pattern que o instrutor alerta

```javascript
// ERRADO — 200 com erro no body
if (!user) {
  return res
    .writeHead(200)  // Front-end acha que deu certo!
    .end(JSON.stringify({ success: false, error: 'User not found' }))
}

// CORRETO — status code semantico
if (!user) {
  return res
    .writeHead(404)  // Front-end sabe imediatamente que nao encontrou
    .end(JSON.stringify({ message: 'User not found' }))
}
```

## Testando com HTTP client

O instrutor usa um HTTP client (provavelmente REST Client do VS Code ou similar):

```http
### Criar usuario — espera 201
POST http://localhost:3333/users

### Listar usuarios — espera 200
GET http://localhost:3333/users

### Rota inexistente — espera 404
GET http://localhost:3333/qualquer-coisa
```