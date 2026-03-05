---
name: rs-node-js-2023-corpo-requisicao-json-stream-buffers
description: "Enforces correct request body parsing using Node.js streams and Buffers in raw HTTP servers. Use when user asks to 'read request body', 'parse JSON body', 'create HTTP server', 'handle POST request in Node', or 'build API without Express'. Applies pattern: collect stream chunks into buffer, concatenate, toString, JSON.parse, attach to req.body with try/catch. Make sure to use this skill whenever building raw Node.js HTTP servers without frameworks. Not for Express/Fastify/Koa body parsing, file uploads, or multipart form data."
---

# Corpo da Requisicao em JSON (Stream & Buffers)

> Em servidores HTTP nativos do Node.js, leia a stream da requisicao por completo antes de processar os dados, convertendo o buffer em JSON.

## Rules

1. **Leia a stream inteira antes de usar os dados** — colete todos os chunks em um array e concatene com `Buffer.concat`, porque a requisicao chega em pedacos (stream) e nao de uma vez
2. **Sempre faca JSON.parse do body** — o buffer convertido com `toString()` retorna texto puro, nao um objeto JavaScript
3. **Envolva o parse em try/catch** — porque nem toda requisicao tem body (GET, DELETE), e `JSON.parse` de string vazia lanca erro
4. **Anexe o body parseado em `req.body`** — para que todas as rotas downstream tenham acesso ao corpo da requisicao de forma padronizada
5. **Atribua `req.body = null` no catch** — porque ausencia de body nao e erro, e sim uma condicao normal que o codigo deve tratar graciosamente

## How to write

### Middleware de leitura do body

```javascript
// Coleta todos os chunks da stream e converte para JSON
const buffers = []
for await (const chunk of req) {
  buffers.push(chunk)
}

try {
  req.body = JSON.parse(Buffer.concat(buffers).toString())
} catch {
  req.body = null
}
```

### Uso nas rotas

```javascript
const server = http.createServer(async (req, res) => {
  // Leitura do body ANTES do roteamento
  const buffers = []
  for await (const chunk of req) {
    buffers.push(chunk)
  }

  try {
    req.body = JSON.parse(Buffer.concat(buffers).toString())
  } catch {
    req.body = null
  }

  // Agora req.body esta disponivel nas rotas
  if (req.method === 'POST' && req.url === '/users') {
    const { name, email } = req.body
    database.push({ id: randomUUID(), name, email })
    return res.writeHead(201).end()
  }

  if (req.method === 'GET' && req.url === '/users') {
    return res.end(JSON.stringify(database))
  }
})
```

## Example

**Before (body nao parseado, dados fixos):**
```javascript
const server = http.createServer((req, res) => {
  if (req.method === 'POST' && req.url === '/users') {
    // Dados hardcoded — ignora o que o cliente enviou
    database.push({
      id: randomUUID(),
      name: 'John Doe',
      email: 'johndoe@example.com',
    })
    return res.writeHead(201).end()
  }
})
```

**After (leitura completa da stream + parse):**
```javascript
const server = http.createServer(async (req, res) => {
  const buffers = []
  for await (const chunk of req) {
    buffers.push(chunk)
  }

  try {
    req.body = JSON.parse(Buffer.concat(buffers).toString())
  } catch {
    req.body = null
  }

  if (req.method === 'POST' && req.url === '/users') {
    const { name, email } = req.body
    database.push({ id: randomUUID(), name, email })
    return res.writeHead(201).end()
  }
})
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Rota POST/PUT/PATCH | Sempre leia o body antes de processar |
| Rota GET/DELETE | Body sera null — trate normalmente |
| Body vazio enviado | try/catch garante `req.body = null` |
| Precisa do body em todas as rotas | Extraia a logica de leitura para antes do roteamento |
| Usando framework (Express, Fastify) | Use o middleware de body parsing do framework, nao este pattern |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `req.on('data', cb)` sem concatenar | `for await (const chunk of req)` com array de buffers |
| `JSON.parse(body)` sem try/catch | Envolva em try/catch, atribua null no catch |
| Dados hardcoded no POST handler | Desestruture de `req.body` |
| `body.name` antes do JSON.parse | Sempre parse primeiro, acesse propriedades depois |
| Callback-based stream reading | `async/await` com `for await...of` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
