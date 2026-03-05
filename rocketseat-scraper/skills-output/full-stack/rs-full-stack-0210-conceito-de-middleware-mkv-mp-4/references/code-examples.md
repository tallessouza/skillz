# Code Examples: Middleware em Node.js

## 1. Middleware de logging (global)

```typescript
function logRequest(req, res, next) {
  const start = Date.now()

  // Intercepta o fim da resposta para logar duracao
  res.on('finish', () => {
    const duration = Date.now() - start
    console.log(`${req.method} ${req.url} ${res.statusCode} ${duration}ms`)
  })

  next()
}

app.use(logRequest)
```

## 2. Middleware de autenticacao

```typescript
function ensureAuthenticated(req, res, next) {
  const authHeader = req.headers.authorization

  if (!authHeader) {
    return res.status(401).json({ error: 'Token not provided' })
  }

  const [scheme, token] = authHeader.split(' ')

  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ error: 'Malformed token' })
  }

  try {
    const decoded = verifyToken(token)
    req.userId = decoded.sub
    next()
  } catch {
    return res.status(401).json({ error: 'Invalid token' })
  }
}
```

## 3. Middleware de role/permissao (factory)

```typescript
function ensureRole(role) {
  return (req, res, next) => {
    if (req.userRole !== role) {
      return res.status(403).json({ error: 'Forbidden' })
    }
    next()
  }
}

// Uso:
app.delete('/users/:id', ensureAuthenticated, ensureRole('admin'), deleteUser)
```

## 4. Middleware que enriquece a requisicao

```typescript
function attachTenant(req, res, next) {
  const tenantId = req.headers['x-tenant-id']

  if (!tenantId) {
    return res.status(400).json({ error: 'Tenant header required' })
  }

  req.tenantId = tenantId
  next()
}
```

## 5. Middleware de error handling (4 parametros)

```typescript
function errorHandler(err, req, res, next) {
  console.error(err.stack)

  if (err.name === 'ValidationError') {
    return res.status(400).json({ error: err.message })
  }

  res.status(500).json({ error: 'Internal server error' })
}

// Registrar DEPOIS de todas as rotas
app.use(errorHandler)
```

## 6. Composicao de middlewares em rota

```typescript
app.post(
  '/orders',
  ensureAuthenticated,      // 1. verifica token
  attachTenant,             // 2. identifica tenant
  validateBody(orderSchema),// 3. valida payload
  createOrderHandler        // 4. handler final
)
```

## 7. Middleware condicional por path

```typescript
// Apenas rotas /api/* passam por autenticacao
app.use('/api', ensureAuthenticated)

// Rotas publicas nao sao interceptadas
app.get('/health', (req, res) => res.json({ status: 'ok' }))
```

## 8. Middleware com Node.js puro (sem framework)

O conceito do instrutor aplicado sem Express:

```typescript
import http from 'node:http'

const middlewares = []

function use(middleware) {
  middlewares.push(middleware)
}

function runMiddlewares(req, res, finalHandler) {
  let index = 0

  function next() {
    const middleware = middlewares[index++]
    if (middleware) {
      middleware(req, res, next)
    } else {
      finalHandler(req, res)
    }
  }

  next()
}

use((req, res, next) => {
  console.log(`${req.method} ${req.url}`)
  next()
})

use((req, res, next) => {
  req.receivedAt = new Date()
  next()
})

const server = http.createServer((req, res) => {
  runMiddlewares(req, res, (req, res) => {
    res.end(JSON.stringify({ message: 'Hello', receivedAt: req.receivedAt }))
  })
})

server.listen(3000)
```

Este exemplo mostra o mecanismo interno: middlewares sao funcoes em uma fila, cada uma decide se chama a proxima ou encerra o ciclo.