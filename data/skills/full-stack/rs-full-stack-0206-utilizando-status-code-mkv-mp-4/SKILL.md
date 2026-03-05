---
name: rs-full-stack-status-code
description: "Applies correct HTTP status codes when writing Node.js server responses. Use when user asks to 'create an endpoint', 'return a response', 'handle HTTP request', 'write an API route', or 'set status code'. Enforces semantic status codes (201 for creation, 404 for not found, 500 for server error) and proper use of res.writeHead(). Make sure to use this skill whenever generating HTTP response code in Node.js. Not for frontend code, database queries, or middleware configuration."
---

# Utilizando Status Code no Node.js

> Toda resposta HTTP deve incluir um status code semanticamente correto que descreva o resultado da operacao.

## Rules

1. **Sempre defina o status code explicitamente** — use `res.writeHead(statusCode)` antes de `res.end()`, porque o padrao 200 pode mascarar erros silenciosos
2. **Use o status code semantico para a operacao** — `201` para criacao, `200` para sucesso generico, `404` para nao encontrado, `500` para erro interno, porque o consumidor da API depende disso para tomar decisoes
3. **Combine status code com mensagem descritiva** — `res.writeHead(201)` + body explicativo, porque facilita debugging e integracao
4. **Respeite as faixas de status code** — 1xx informacional, 2xx sucesso, 3xx redirecionamento, 4xx erro do cliente, 5xx erro do servidor, porque cada faixa tem semantica propria

## How to write

### Resposta basica com status code

```javascript
const server = http.createServer((req, res) => {
  res.writeHead(200)
  res.end('OK')
})
```

### Resposta de criacao (POST)

```javascript
if (req.method === 'POST') {
  res.writeHead(201)
  res.end('Criado com sucesso')
}
```

### Resposta de erro

```javascript
if (!resource) {
  res.writeHead(404)
  res.end('Not found')
  return
}
```

## Example

**Before (sem status code explicito):**
```javascript
const server = http.createServer((req, res) => {
  if (req.method === 'POST') {
    res.end('Criado')
  }
  if (!found) {
    res.end('Nao encontrado')
  }
  res.end('OK')
})
```

**After (com status codes semanticos):**
```javascript
const server = http.createServer((req, res) => {
  if (req.method === 'POST') {
    res.writeHead(201)
    res.end('Criado com sucesso')
    return
  }
  if (!found) {
    res.writeHead(404)
    res.end('Nao encontrado')
    return
  }
  res.writeHead(200)
  res.end('OK')
})
```

## Heuristics

| Situation | Do |
|-----------|-----|
| GET retornando dados | `200` |
| POST criando recurso | `201` |
| Recurso nao encontrado | `404` |
| Erro inesperado no servidor | `500` |
| Sem status code definido | Node usa `200` por padrao — defina explicitamente |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `res.end('erro')` sem status code | `res.writeHead(500); res.end('erro')` |
| `res.writeHead(200)` para criacao via POST | `res.writeHead(201)` |
| `res.writeHead(200)` quando recurso nao existe | `res.writeHead(404)` |
| Status code generico 200 para tudo | Status code semantico por operacao |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre faixas de status code e semantica HTTP
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes