---
name: 2023-criando-middleware-de-json
description: "Creates a JSON parsing middleware for raw Node.js HTTP servers that consumes request body via streams and sets Content-Type headers. Use when user asks to 'parse JSON body', 'create middleware', 'handle request body in Node.js', or 'separate JSON parsing logic'. Enforces: middleware as async function consuming stream buffers, separate middleware file, await on middleware calls, .js extension in ES Module imports. Make sure to use this skill whenever building HTTP servers with native Node.js http module that need JSON body parsing. Not for Express/Fastify projects with built-in body parsing, or frontend code."
category: coding-lens
tags: [buffers, fastify, middleware, modules, streams]
mind_lenses: [LT_01, LT_02, MF_01, GB_01, TH_04]
metadata:
  author: Rocketseat
  version: 2.0.0
  course: node-js-2023
  module: fundamentos-http
  tags: [middleware, json, http, streams, buffers, node-js, es-modules]
---

# Middleware de JSON no Node.js

> Separe a logica de parsing e formatacao JSON em middlewares — funcoes interceptadoras async que recebem req/res e transformam a requisicao antes do handler principal.

## Rules

1. **Middleware e uma funcao async que recebe req e res** — porque middlewares interceptam a requisicao e precisam aguardar operacoes async como leitura do body via streams
2. **Consuma o body via stream antes de parsear** — colete os buffers do readable stream, concatene, e so entao faca JSON.parse, porque o body chega em chunks
3. **Sempre use await ao chamar o middleware** — porque a funcao e async e o handler principal precisa aguardar a transformacao completar antes de prosseguir
4. **Separe middlewares em pasta propria** — `middlewares/` com um arquivo por middleware, porque mantem o server.js limpo e cada interceptador isolado
5. **Especifique extensao .js nos imports com ES Modules** — `import { json } from './middlewares/json.js'`, porque Node.js com `type: "module"` exige extensao explicita
6. **Use o middleware para entrada E saida** — parse do body na entrada + `res.setHeader('Content-Type', 'application/json')` na saida, porque centraliza toda logica JSON em um unico interceptador

## How to write

### Middleware de JSON completo

```javascript
// middlewares/json.js
export async function json(req, res) {
  const buffers = []

  for await (const chunk of req) {
    buffers.push(chunk)
  }

  try {
    req.body = JSON.parse(Buffer.concat(buffers).toString())
  } catch {
    req.body = null
  }

  res.setHeader('Content-Type', 'application/json')
}
```

### Uso no server

```javascript
// server.js
import { json } from './middlewares/json.js'

const server = http.createServer(async (req, res) => {
  await json(req, res)

  // req.body ja esta disponivel como objeto
  // res ja tem Content-Type: application/json configurado
})
```

## Example

**Before (tudo no server.js):**
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
  res.setHeader('Content-Type', 'application/json')

  // ... rotas e logica de negocio misturados
})
```

**After (com middleware separado):**
```javascript
import { json } from './middlewares/json.js'

const server = http.createServer(async (req, res) => {
  await json(req, res)

  // rotas limpas, sem boilerplate de parsing
  if (req.method === 'POST' && req.url === '/users') {
    const { name, email } = req.body
    // ...
  }
})
```

## Heuristics

| Situacao | Acao |
|----------|------|
| Body pode estar vazio (GET, DELETE) | try/catch com fallback para `req.body = null` |
| Multiplos middlewares necessarios | Chame cada um com await em sequencia no inicio do handler |
| Novo interceptador (auth, logs) | Crie novo arquivo em `middlewares/`, mesmo padrao async(req, res) |
| Usando ES Modules (`"type": "module"`) | Sempre inclua `.js` nos imports relativos |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| Parsing de body inline no handler | `await json(req, res)` chamando middleware separado |
| `import { json } from './middlewares/json'` (sem extensao) | `import { json } from './middlewares/json.js'` |
| `json(req, res)` sem await | `await json(req, res)` |
| `res.setHeader` repetido em cada rota | Uma vez no middleware de JSON |
| Middleware sincrono para leitura de stream | Middleware async com `for await` |

## Troubleshooting

### Resultado inesperado ao aplicar o padrao
**Symptom:** Comportamento nao corresponde ao esperado apos seguir os passos
**Cause:** Dependencias ou configuracoes previas podem estar faltando
**Fix:** Verifique os prerequisites e confirme que todas as versoes estao compativeis

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes
