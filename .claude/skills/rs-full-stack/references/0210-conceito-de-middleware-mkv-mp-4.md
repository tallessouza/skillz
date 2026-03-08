---
name: rs-full-stack-conceito-middleware
description: "Applies Node.js middleware patterns when building Express/Fastify/Koa APIs. Use when user asks to 'create middleware', 'add authentication', 'intercept requests', 'validate permissions', or 'add logging to routes'. Enforces correct middleware chain flow: access request, modify, respond early, or call next. Make sure to use this skill whenever implementing request interceptors or route guards in Node.js. Not for frontend interceptors, Axios interceptors, or browser service workers."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: fundamentos
  tags: [middleware, nodejs, express, authentication, request-interceptor]
---

# Middleware em Node.js

> Middleware e um interceptador que acessa, modifica ou interrompe o fluxo de uma requisicao antes (ou depois) dela atingir o handler final da rota.

## Rules

1. **Middleware recebe req, res e next** — sempre declare os tres parametros, porque sem `next()` o fluxo trava silenciosamente
2. **Chame next() ou encerre a resposta** — todo middleware DEVE fazer um ou outro, porque nao fazer nenhum deixa a requisicao pendurada (hanging request)
3. **Ordem de registro importa** — middlewares executam na ordem em que sao registrados, porque o Express/Fastify processa como uma fila FIFO
4. **Middleware pode encerrar o ciclo** — retorne `res.status(401).json(...)` para barrar requisicoes nao autorizadas antes de atingir o handler
5. **Middleware pode enriquecer a requisicao** — adicione dados em `req` (ex: `req.userId`) para que handlers downstream os utilizem sem re-buscar
6. **Um middleware pode chamar outro** — encadeie middlewares especializados em vez de criar um unico monolitico

## How to write

### Middleware basico (interceptador)

```typescript
function logRequest(req, res, next) {
  console.log(`${req.method} ${req.url}`)
  next() // continua para o proximo middleware ou handler
}

app.use(logRequest)
```

### Middleware de guarda (encerra o ciclo)

```typescript
function ensureAuthenticated(req, res, next) {
  const token = req.headers.authorization

  if (!token) {
    return res.status(401).json({ error: 'Not authorized' })
  }

  req.userId = decodeToken(token)
  next()
}

app.get('/protected', ensureAuthenticated, handleProtectedRoute)
```

### Middleware que modifica a requisicao

```typescript
function attachRequestTimestamp(req, res, next) {
  req.receivedAt = new Date()
  next()
}
```

## Example

**Before (logica de autorizacao direto no handler):**

```typescript
app.get('/admin', (req, res) => {
  const token = req.headers.authorization
  if (!token) {
    return res.status(401).json({ error: 'Not authorized' })
  }
  const user = decodeToken(token)
  if (user.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden' })
  }
  // logica real do handler misturada com auth
  res.json({ data: 'admin content' })
})
```

**After (com middlewares separados):**

```typescript
app.get('/admin', ensureAuthenticated, ensureRole('admin'), (req, res) => {
  res.json({ data: 'admin content' })
})
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Validar autenticacao em multiplas rotas | Crie middleware reutilizavel, aplique com `app.use` ou por rota |
| Logar todas as requisicoes | Middleware global com `app.use(logRequest)` no topo |
| Adicionar dados ao req (userId, tenant) | Middleware que enriquece `req` e chama `next()` |
| Barrar requisicao sem permissao | Middleware que retorna resposta e NAO chama `next()` |
| Encadear validacoes complexas | Multiplos middlewares em sequencia na rota |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| Esquecer de chamar `next()` ou `res.end()` | Sempre encerre com `next()` ou uma resposta |
| Duplicar logica de auth em cada handler | Extraia para middleware reutilizavel |
| Middleware monolitico com 10 responsabilidades | Middlewares pequenos e composiveis |
| Modificar `res.body` apos `res.send()` | Toda modificacao ANTES de enviar a resposta |
| Middleware que faz `next()` E envia resposta | Faca um OU outro, nunca ambos |

## Troubleshooting

### Problem: Request hangs indefinitely and never returns a response
- **Cause**: The middleware neither calls `next()` nor sends a response with `res.end()` / `res.json()`
- **Fix**: Every middleware must either call `next()` to continue the chain or send a response to end the cycle

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Analogia do seguranca, fluxo completo do ciclo request-response, e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de middleware expandidos com variacoes