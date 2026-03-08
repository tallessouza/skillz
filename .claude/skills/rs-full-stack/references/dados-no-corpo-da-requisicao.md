---
name: rs-full-stack-dados-no-corpo-da-requisicao
description: "Applies Express.js request body parsing patterns when building POST endpoints. Use when user asks to 'create a POST route', 'handle request body', 'parse JSON in Express', 'send data via POST', or 'setup Express middleware'. Ensures express.json() middleware is configured and req.body is properly destructured. Make sure to use this skill whenever creating Express POST endpoints or handling incoming JSON data. Not for frontend fetch/axios calls, file uploads, or multipart form data."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: express-api
  tags: [express, request-body, middleware, POST, JSON, req.body]
---

# Dados no Corpo da Requisição (Express)

> Configure o middleware `express.json()` antes de acessar `req.body` em rotas POST — sem ele, o Express não sabe interpretar o corpo da requisição.

## Rules

1. **Sempre registre `express.json()` antes das rotas** — `app.use(express.json())` logo após criar o app, porque o Express não assume um formato padrão de dados (JSON, XML, etc.) e precisa que você declare explicitamente
2. **Desestruture `req.body` com os nomes exatos enviados** — `const { name, price } = req.body` deve corresponder exatamente às chaves do JSON enviado, porque qualquer diferença resulta em `undefined`
3. **Use rotas POST para receber dados** — navegadores fazem GET por padrão, então teste POST com ferramentas como Insomnia ou similar

## How to write

### Middleware de parsing JSON

```typescript
const express = require("express")
const app = express()

// Declara que a API usa JSON para representar dados
app.use(express.json())
```

### Rota POST com body

```typescript
app.post("/products", (req, res) => {
  const { name, price } = req.body

  res.send(`Produto ${name} custa $${price}`)
})
```

## Example

**Before (erro — sem middleware):**

```typescript
const app = express()

// Falta app.use(express.json())

app.post("/products", (req, res) => {
  const { name } = req.body // TypeError: Cannot destructure property 'name' of 'req.body' (undefined)
  res.send(name)
})
```

**After (com middleware configurado):**

```typescript
const app = express()
app.use(express.json())

app.post("/products", (req, res) => {
  const { name, price } = req.body
  res.send(`Produto ${name} custa $${price}`)
})
```

## Heuristics

| Situação | Faça |
|----------|------|
| `req.body` retorna `undefined` | Verifique se `express.json()` está registrado antes da rota |
| Nomes não batem com o JSON enviado | Compare as chaves do body com a desestruturação |
| Precisa aceitar XML também | Adicione middleware específico (ex: `express-xml-bodyparser`) |
| Testando POST no navegador | Use Insomnia, Postman ou curl — navegador faz GET por padrão |

## Anti-patterns

| Nunca escreva | Escreva ao invés |
|---------------|------------------|
| `app.post(...)` sem `app.use(express.json())` | Registre o middleware antes de qualquer rota POST |
| `req.body.nome` quando o JSON envia `name` | Use exatamente as mesmas chaves do JSON |
| Parsing manual de chunks como no Node puro | Use `express.json()` — o Express já resolve isso |

## Troubleshooting

| Problema | Causa provavel | Solucao |
|----------|---------------|---------|
| `req.body` retorna `undefined` | Middleware `express.json()` nao registrado | Adicione `app.use(express.json())` antes das rotas |
| `Cannot destructure property 'name' of undefined` | Body nao esta sendo parseado | Verifique se `express.json()` esta antes da rota POST |
| Campos do body retornam `undefined` | Nomes das chaves nao batem | Compare as chaves do JSON enviado com a desestruturacao |
| POST retorna 404 | Rota nao registrada ou metodo errado | Confirme que a rota usa `app.post()` e o path esta correto |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Por que o Express não assume JSON por padrão, comparação JSON vs XML
- [code-examples.md](references/code-examples.md) — Exemplos completos de rotas POST com variações