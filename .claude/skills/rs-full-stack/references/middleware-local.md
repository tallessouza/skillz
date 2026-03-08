---
name: rs-full-stack-middleware-local
description: "Applies local middleware patterns in Express/Fastify route definitions. Use when user asks to 'add middleware to a route', 'protect a specific endpoint', 'validate request on one route', or 'apply middleware selectively'. Covers inline middleware placement, chaining multiple middlewares, next() flow, and global vs local middleware strategy. Make sure to use this skill whenever adding route-specific middleware logic. Not for global middleware setup, error handling middleware, or authentication system design."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: express-middleware
  tags: [express, middleware, local, route-specific, chaining]
---

# Middleware Local

> Aplique middleware diretamente na definicao da rota para controle granular de execucao por endpoint.

## Rules

1. **Middleware local vai entre a rota e o handler** — `app.post('/route', middleware, handler)`, porque essa posicao garante execucao apenas naquele endpoint
2. **next() chama a proxima funcao na cadeia** — pode ser outro middleware ou o handler final, porque Express/Fastify executa em sequencia linear
3. **Encadeie multiplos middlewares por posicao** — `app.post('/route', mw1, mw2, handler)`, porque cada next() avanca para o proximo na fila
4. **Use global quando aplica a todas as rotas** — `app.use(middleware)` antes das rotas, porque evita duplicacao
5. **Use local quando aplica a rotas especificas** — insira diretamente na rota, porque mantem outras rotas livres do middleware
6. **Use posicionamento com app.use() para aplicar em grupo** — coloque o `app.use(middleware)` acima do grupo de rotas desejado, porque tudo abaixo sera afetado

## How to write

### Middleware local em rota especifica

```typescript
// Middleware aplicado APENAS nesta rota
app.post('/products', validateBody, (request, reply) => {
  // handler executa depois do middleware
})
```

### Encadeamento de multiplos middlewares

```typescript
// Cada middleware chama next() para o proximo
app.post('/products', authenticate, validateBody, (request, reply) => {
  // executa apos authenticate E validateBody
})
```

### Middleware por posicionamento (grupo de rotas)

```typescript
// Rotas SEM middleware
app.get('/public', publicHandler)

// Tudo abaixo recebe o middleware
app.use(authenticate)
app.get('/products', listProducts)
app.post('/products', createProduct)
app.delete('/products/:id', deleteProduct)
```

## Example

**Before (middleware global desnecessario):**
```typescript
app.use(validateBody) // aplica em TODAS as rotas

app.get('/products', listProducts)    // nao precisa de validacao
app.post('/products', createProduct)  // precisa de validacao
```

**After (middleware local preciso):**
```typescript
app.get('/products', listProducts)
app.post('/products', validateBody, createProduct)  // so aqui valida
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Middleware para todas as rotas | `app.use(middleware)` global |
| Middleware para uma rota | Inline na definicao da rota |
| Middleware para grupo de rotas | `app.use()` posicionado acima do grupo |
| Middleware para 2-3 rotas nao consecutivas | Inline em cada rota individualmente |

## Anti-patterns

| Nunca faca | Faca assim |
|------------|------------|
| `app.use(validate)` quando so 1 rota precisa | `app.post('/x', validate, handler)` |
| Duplicar logica de middleware no handler | Extraia para middleware e encadeie |
| Esquecer `next()` no middleware | Sempre chame `next()` para passar ao proximo |
| Colocar middleware depois do handler | Middleware vai ANTES do handler na lista de argumentos |

## Troubleshooting

| Problema | Causa | Solucao |
|----------|-------|---------|
| Middleware local nao executa | Middleware colocado depois do handler na lista de argumentos | Mova para antes do handler: `app.post('/x', middleware, handler)` |
| Requisicao trava sem resposta | Middleware nao chama `next()` | Adicione `return next()` no final do middleware |
| Middleware executa em rotas erradas | Usando `app.use()` em vez de inline | Aplique diretamente na rota especifica |
| Encadeamento de middlewares falha | Um middleware intermediario nao chama `next()` | Verifique que todos os middlewares da cadeia chamam `next()` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre next(), cadeia de execucao e estrategias de posicionamento
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes