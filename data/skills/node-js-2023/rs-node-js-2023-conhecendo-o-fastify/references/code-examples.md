# Code Examples: Conhecendo o Fastify

## Exemplo basico de rota (do slide da aula)

O unico exemplo de codigo mostrado na aula e a rota basica do Fastify:

```typescript
// Rota GET basica no Fastify
// Note: async e OBRIGATORIO em todas as rotas do Fastify
fastify.get('/users', async (request, reply) => {
  const users = await database.getUsers()
  return users // Fastify serializa automaticamente para JSON
})
```

### Por que async e obrigatorio

No Fastify, todas as handler functions usam `async`. Isso permite:

1. Usar `await` diretamente dentro da rota
2. Retornar valores diretamente (sem `res.send()` explicito)
3. Tratamento automatico de erros em promises rejeitadas

## Comparacao: mesma rota em Express vs Fastify

### Express (sem async seguro)
```javascript
// Express: async/await requer tratamento manual de erros
app.get('/users', async (req, res, next) => {
  try {
    const users = await database.getUsers()
    res.json(users)
  } catch (error) {
    next(error) // Precisa passar erro manualmente
  }
})
```

### Express (com biblioteca express-async-errors)
```javascript
// Express: precisa instalar biblioteca extra
require('express-async-errors')

app.get('/users', async (req, res) => {
  const users = await database.getUsers()
  res.json(users)
})
```

### Fastify (nativo)
```typescript
// Fastify: async nativo, error handling automatico
fastify.get('/users', async (request, reply) => {
  const users = await database.getUsers()
  return users // Retorno direto, sem res.json()
})
```

## Setup basico de um projeto Fastify

```typescript
import Fastify from 'fastify'

const app = Fastify()

app.get('/', async () => {
  return { hello: 'world' }
})

app.listen({ port: 3333 }).then(() => {
  console.log('HTTP Server Running!')
})
```

## Fastify com TypeScript (integracao nativa)

```typescript
import Fastify, { FastifyRequest, FastifyReply } from 'fastify'

// Tipos vem direto do Fastify, sem @types/ externo
const app = Fastify({ logger: true })

interface UserParams {
  id: string
}

app.get<{ Params: UserParams }>('/users/:id', async (request, reply) => {
  const { id } = request.params // Tipado automaticamente
  const user = await findUser(id)
  return user
})
```

## O que o Fastify resolve (vs Node puro)

### Node puro (sem framework)
```javascript
import { createServer } from 'node:http'

const server = createServer((req, res) => {
  // Parsing manual de URL
  const url = new URL(req.url, `http://${req.headers.host}`)

  // Roteamento manual
  if (url.pathname === '/users' && req.method === 'GET') {
    // Parsing manual de body JSON
    let body = ''
    req.on('data', chunk => { body += chunk })
    req.on('end', () => {
      // Headers manuais
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify({ users: [] }))
    })
  }
})

server.listen(3333)
```

### Com Fastify
```typescript
import Fastify from 'fastify'

const app = Fastify()

// Roteamento, parsing JSON, headers — tudo automatico
app.get('/users', async () => {
  return { users: [] }
})

app.listen({ port: 3333 })
```