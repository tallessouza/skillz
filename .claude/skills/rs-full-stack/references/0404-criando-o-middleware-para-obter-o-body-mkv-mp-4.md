---
name: rs-full-stack-middleware-body-parser
description: "Applies Node.js middleware pattern for parsing request body from streams when writing HTTP servers without frameworks. Use when user asks to 'create a server', 'parse request body', 'handle POST request', 'build middleware', or 'read body from request' in pure Node.js. Enforces buffer collection via for-await, JSON.parse with try-catch, and body injection into request object. Make sure to use this skill whenever building raw Node.js HTTP servers that need body parsing. Not for Express, Fastify, or any framework that has built-in body parsing."
---

# Middleware para Obter o Body da Requisição

> Em Node.js puro, o body da requisição chega em chunks via stream — colete com for-await, concatene os buffers, e injete o resultado parseado no objeto request como middleware.

## Rules

1. **Colete chunks com for-await** — `for await (const chunk of request)`, porque o body é uma readable stream e chega em pedaços, não de uma vez
2. **Concatene com Buffer.concat** — nunca concatene strings diretamente, porque Buffer.concat preserva encoding e lida com dados binários corretamente
3. **Parse com try-catch** — `JSON.parse` pode lançar erro se o body não for JSON válido, então sempre proteja e atribua `null` ao body no catch
4. **Injete body no request** — `request.body = parsed` torna o dado disponível em todas as rotas, porque o middleware roda antes de qualquer handler
5. **Defina Content-Type no response** — `response.setHeader('Content-Type', 'application/json')` no middleware, porque toda resposta da API será JSON
6. **Middleware é async** — a função deve ser `async` e o caller deve usar `await`, porque a leitura do stream é assíncrona

## How to write

### Middleware de body parsing

```javascript
// src/middlewares/jsonHandler.js
export async function jsonHandler(request, response) {
  const buffers = []

  for await (const chunk of request) {
    buffers.push(chunk)
  }

  try {
    request.body = JSON.parse(Buffer.concat(buffers).toString())
  } catch {
    request.body = null
  }

  response.setHeader('Content-Type', 'application/json')
}
```

### Uso no server

```javascript
import http from 'node:http'
import { jsonHandler } from './middlewares/jsonHandler.js'

const server = http.createServer(async (request, response) => {
  await jsonHandler(request, response)

  // request.body agora está disponível
  console.log(request.body)
})
```

## Example

**Before (sem middleware, body inacessível):**
```javascript
const server = http.createServer((request, response) => {
  // request.body não existe em Node.js puro
  console.log(request.body) // undefined
})
```

**After (com middleware aplicado):**
```javascript
const server = http.createServer(async (request, response) => {
  await jsonHandler(request, response)
  console.log(request.body) // { name: "Rodrigo Gonçalves" }
})
```

## Heuristics

| Situação | Faça |
|----------|------|
| Servidor Node.js puro recebendo POST/PUT | Sempre aplique o middleware de body parsing antes dos handlers |
| Body pode não ser JSON (form-data, texto) | Adicione verificação do Content-Type antes do JSON.parse |
| Requisição GET sem body | O middleware roda sem erro — buffers fica vazio, body vira `null` |
| Múltiplos middlewares | Execute em sequência com await antes do routing |

## Anti-patterns

| Nunca escreva | Escreva no lugar |
|---------------|-----------------|
| `request.on('data', cb)` com callbacks aninhados | `for await (const chunk of request)` |
| `let body = ''; ... body += chunk` (concatenar strings) | `buffers.push(chunk)` + `Buffer.concat(buffers)` |
| `JSON.parse(body)` sem try-catch | `try { JSON.parse(...) } catch { request.body = null }` |
| Body parsing duplicado em cada rota | Um middleware centralizado chamado uma vez |
| Função síncrona para ler stream | `async function` com `await` no caller |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre streams, buffers e o padrão middleware
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-0404-criando-o-middleware-para-obter-o-body-mkv-mp-4/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-0404-criando-o-middleware-para-obter-o-body-mkv-mp-4/references/code-examples.md)
