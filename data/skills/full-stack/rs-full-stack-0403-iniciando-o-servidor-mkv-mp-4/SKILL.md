---
name: rs-full-stack-0403-iniciando-servidor
description: "Applies Node.js native HTTP server creation patterns when writing backend code. Use when user asks to 'create a server', 'start an API', 'setup Node.js backend', 'create HTTP server', or 'initialize express alternative'. Enforces node: protocol imports, createServer chaining, and listener separation. Make sure to use this skill whenever creating Node.js servers from scratch. Not for Express, Fastify, or framework-based server setup."
---

# Iniciando o Servidor Node.js

> Ao criar um servidor HTTP nativo no Node.js, use imports explícitos com protocolo `node:` e separe o listener do createServer para clareza.

## Rules

1. **Importe com protocolo `node:`** — `import http from 'node:http'` não `import http from 'http'`, porque o prefixo `node:` deixa explícito que é uma dependência do core, não de terceiros
2. **Separe o listener em função nomeada** — extraia o callback do `createServer` para uma função separada, porque facilita testes e legibilidade
3. **Encadeie createServer com listen** — `http.createServer(listener).listen(port)` em uma chain, porque elimina variável intermediária desnecessária
4. **Nomeie os parâmetros request/response** — use `request` e `response` (ou `req`/`res` em loops curtos), nunca nomes genéricos como `a`, `b`

## How to write

### Import com protocolo node:

```javascript
import http from 'node:http'
```

### Listener separado + createServer encadeado

```javascript
function listener(request, response) {
  // handle request
  return response.end('OK')
}

http.createServer(listener).listen(3333)
```

## Example

**Before (inline, verbose):**
```javascript
import http from 'http'

const server = http.createServer(function (req, res) {
  res.end('OK')
})

server.listen(3333)
```

**After (with this skill applied):**
```javascript
import http from 'node:http'

function listener(request, response) {
  return response.end('OK')
}

http.createServer(listener).listen(3333)
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Servidor simples sem rotas complexas | Use HTTP nativo com `node:http` |
| Listener com mais de 15 linhas | Extraia para arquivo separado e importe |
| Precisa de rotas, middlewares, etc | Considere framework (fora do escopo desta skill) |
| Porta do servidor | Use variável de ambiente ou constante nomeada |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `import http from 'http'` | `import http from 'node:http'` |
| `const server = http.createServer(...)` + `server.listen(...)` separado | `http.createServer(listener).listen(port)` encadeado |
| Callback anônimo inline no createServer | Função nomeada separada passada como referência |
| `const s = http.createServer(...)` | Nome descritivo ou encadeamento direto |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre protocolo node:, padrões de criação de servidor e evolução da API
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações