---
name: rs-full-stack-utilizando-middleware
description: "Enforces Node.js middleware patterns for request/response interception and code reuse. Use when user asks to 'create middleware', 'handle request body', 'parse JSON body', 'avoid code duplication in routes', or 'intercept requests'. Applies patterns: separate middleware files, body parsing with chunks, request property injection, response header setting. Make sure to use this skill whenever building raw Node.js HTTP servers without Express. Not for Express middleware, authentication, or error handling middleware."
---

# Utilizando Middleware no Node.js

> Middleware intercepta requisicoes e respostas para centralizar logica reutilizavel, eliminando duplicacao entre rotas.

## Rules

1. **Separe middleware em arquivos dedicados** — crie pasta `src/middlewares/` com um arquivo por middleware, porque facilita manutencao e reuso
2. **Middleware recebe request e response como parametros** — nunca chame `response.end()` dentro do middleware, porque ele apenas intercepta e modifica, nao finaliza o ciclo
3. **Injete propriedades na request** — adicione `request.body` no middleware para que todas as rotas acessem o corpo parseado, porque evita repetir logica de parsing em cada rota
4. **Use async/await no middleware** — colete chunks com `for await` e aguarde o middleware completar antes de seguir o fluxo, porque a leitura do body e assincrona
5. **Defina headers de resposta no middleware** — use `response.setHeader('Content-Type', 'application/json')` para centralizar configuracao de headers
6. **Trate falhas com try/catch e body nulo** — se o parse falhar, defina `request.body = null`, porque nem toda requisicao tera corpo

## How to write

### Estrutura do middleware

```javascript
// src/middlewares/json-body-handler.js
export async function jsonBodyHandler(request, response) {
  const buffers = []

  // Coleta os chunks de dados da requisicao
  for await (const chunk of request) {
    buffers.push(chunk)
  }

  try {
    // Concatena chunks e converte para JSON
    request.body = JSON.parse(Buffer.concat(buffers).toString())
  } catch {
    request.body = null
  }

  // Define header de resposta como JSON
  response.setHeader('Content-Type', 'application/json')
}
```

### Uso no server

```javascript
// src/server.js
import { jsonBodyHandler } from './middlewares/json-body-handler.js'

const server = http.createServer(async (request, response) => {
  // Middleware executa ANTES das rotas
  await jsonBodyHandler(request, response)

  // Agora request.body esta disponivel em todas as rotas
  if (request.method === 'POST' && request.url === '/products') {
    response.writeHead(201)
    return response.end(JSON.stringify(request.body))
  }
})
```

## Example

**Before (codigo duplicado em cada rota):**
```javascript
const server = http.createServer(async (request, response) => {
  if (request.method === 'POST' && request.url === '/products') {
    const buffers = []
    for await (const chunk of request) { buffers.push(chunk) }
    const body = JSON.parse(Buffer.concat(buffers).toString())
    // usar body...
  }

  if (request.method === 'PUT' && request.url === '/users') {
    const buffers = []  // duplicacao!
    for await (const chunk of request) { buffers.push(chunk) }
    const body = JSON.parse(Buffer.concat(buffers).toString())
    // usar body...
  }
})
```

**After (middleware centralizado):**
```javascript
const server = http.createServer(async (request, response) => {
  await jsonBodyHandler(request, response)

  if (request.method === 'POST' && request.url === '/products') {
    response.writeHead(201)
    return response.end(JSON.stringify(request.body))
  }

  if (request.method === 'PUT' && request.url === '/users') {
    response.writeHead(200)
    return response.end(JSON.stringify(request.body))
  }
})
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Logica repetida em 2+ rotas | Extrair para middleware |
| Precisa ler body da requisicao | Middleware de JSON body |
| Precisa definir headers padrao | Middleware de headers |
| Retornar objeto na response | `JSON.stringify(obj)` porque response aceita apenas texto |
| Acessar propriedade do body | `request.body.name` apos middleware executar |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `response.end()` dentro do middleware | Apenas modifique request/response, sem finalizar |
| Parsing de body duplicado em cada rota | Um unico middleware `jsonBodyHandler` |
| `response.end(request.body)` (objeto direto) | `response.end(JSON.stringify(request.body))` |
| `response.end(request.body.price)` (numero) | `response.end(request.body.price.toString())` |
| Middleware sincrono lendo body | `async function` com `for await` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre middleware, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-0211-utilizando-middleware-mkv-mp-4/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-0211-utilizando-middleware-mkv-mp-4/references/code-examples.md)
