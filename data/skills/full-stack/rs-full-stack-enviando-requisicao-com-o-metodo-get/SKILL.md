---
name: rs-full-stack-enviando-requisicao-get
description: "Applies Express.js GET route patterns when creating API endpoints or handling HTTP requests. Use when user asks to 'create a route', 'add an endpoint', 'handle GET request', 'setup express server', or 'build REST API'. Enforces proper route definition with app.get(), request/response handling, and res.send()/res.json() usage. Make sure to use this skill whenever writing Express route handlers. Not for frontend fetch calls, database queries, or middleware configuration."
---

# Rotas GET com Express

> Definir rotas GET usando `app.get()` com path e callback `(req, res)`, respondendo com `res.send()` ou `res.json()`.

## Rules

1. **Use `app.get(path, callback)` para rotas GET** — o Express resolve method matching e path matching automaticamente, porque no Node puro voce precisaria checar `req.method` e `req.url` manualmente
2. **Callback sempre recebe `(request, response)`** — acesse dados da requisicao via `request`, envie resposta via `response`, porque essa assinatura e o contrato padrao do Express
3. **Use `response.send()` para respostas simples** — texto, HTML ou objetos, porque o Express detecta o content-type automaticamente
4. **Use `response.json()` para APIs REST** — garante `Content-Type: application/json`, porque e mais explicito que `send()` para dados estruturados
5. **Defina rotas ANTES do `app.listen()`** — rotas registradas apos `listen()` funcionam, mas a convencao e declarar antes para clareza
6. **Express retorna 404 automaticamente para rotas inexistentes** — nao precisa tratar manualmente rotas nao encontradas com if/else, porque o Express ja responde `Cannot GET /path`

## How to write

### Rota GET basica

```typescript
app.get("/", (request, response) => {
  response.send("Hello World Express")
})
```

### Rota GET retornando JSON

```typescript
app.get("/products", (request, response) => {
  const products = [
    { id: 1, name: "Keyboard" },
    { id: 2, name: "Mouse" },
  ]
  response.json(products)
})
```

## Example

**Before (Node puro — verbose e manual):**

```typescript
import http from "node:http"

const server = http.createServer((req, res) => {
  if (req.method === "GET" && req.url === "/") {
    res.writeHead(200, { "Content-Type": "text/plain" })
    res.end("Hello World")
  } else {
    res.writeHead(404)
    res.end("Not Found")
  }
})

server.listen(3333)
```

**After (Express — simples e declarativo):**

```typescript
import express from "express"

const app = express()

app.get("/", (request, response) => {
  response.send("Hello World Express")
})

app.listen(3333, () => {
  console.log("Server is running on port 3333")
})
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Resposta e texto ou HTML simples | `response.send("content")` |
| Resposta e dados estruturados (API) | `response.json(data)` |
| Rota na raiz da aplicacao | Path = `"/"` |
| Testar rota GET rapidamente | Abrir no navegador — GET e o metodo padrao |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `if (req.method === "GET")` com Express | `app.get(path, handler)` |
| Tratamento manual de 404 para rotas basicas | Confie no 404 automatico do Express |
| `res.end("text")` | `response.send("text")` — Express seta headers |
| `res.writeHead(200, {...})` | `response.status(200).send()` ou apenas `response.send()` (200 e default) |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre Node puro vs Express e por que aprender ambos
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes