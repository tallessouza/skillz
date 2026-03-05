---
name: rs-full-stack-primeiro-servidor-nodejs
description: "Applies Node.js HTTP server creation patterns when writing backend code with native http module. Use when user asks to 'create a server', 'setup Node.js backend', 'build an API', 'start a Node project', or 'listen on a port'. Enforces createServer with request/response naming, proper response handling with .end(), and server.listen structure. Make sure to use this skill whenever generating Node.js HTTP server code from scratch. Not for Express, Fastify, or other framework-based servers."
---

# Criando Servidor HTTP com Node.js Nativo

> Ao criar um servidor HTTP com Node.js nativo, use o modulo `http` com `createServer`, nomeie parametros sem abreviacoes, e sempre finalize respostas com `response.end()`.

## Rules

1. **Use `http.createServer()` para criar o servidor** — este e o metodo nativo do Node.js para instanciar um servidor HTTP, porque e a base antes de qualquer framework
2. **Nomeie `request` e `response` por extenso** — nao use `req`/`res`, porque nomes completos deixam o codigo mais legivel para iniciantes e sao mais buscareis no codebase
3. **Finalize toda resposta com `response.end()`** — porque sem isso a conexao fica pendente e o cliente nunca recebe a resposta
4. **Separe a criacao do servidor do `.listen()`** — `const server = http.createServer(...)` e depois `server.listen(port)`, porque permite reutilizar a referencia do servidor
5. **Use porta 3333 como padrao em desenvolvimento** — porque e a convencao da comunidade Rocketseat e evita conflitos com portas comuns (3000, 8080)
6. **Use arrow function no createServer** — porque e o padrao moderno e mais conciso para callbacks

## How to write

### Servidor basico completo

```javascript
import http from 'node:http'

const server = http.createServer((request, response) => {
  return response.end('Hello World')
})

server.listen(3333)
```

### Estrutura de arquivos

```
src/
  server.js    // Arquivo principal do servidor
```

### Execucao

```bash
node src/server.js
```

## Example

**Before (abreviacoes e sem estrutura):**
```javascript
const http = require('http')
http.createServer((req, res) => {
  res.end('Hello')
}).listen(3000)
```

**After (with this skill applied):**
```javascript
import http from 'node:http'

const server = http.createServer((request, response) => {
  return response.end('Hello World')
})

server.listen(3333)
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Servidor simples de aprendizado | Use `http` nativo sem frameworks |
| Precisa testar no navegador | Acesse `localhost:3333` |
| Servidor nao encerra no terminal | Correto — ele fica escutando requisicoes na porta |
| Quer devolver resposta ao cliente | Use `response.end('conteudo')` |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `req, res` | `request, response` |
| `.createServer(...).listen(...)` encadeado | `const server = createServer(...)` separado de `server.listen()` |
| `response.write()` sem `response.end()` | Sempre finalize com `response.end()` |
| `require('http')` | `import http from 'node:http'` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre request/response, servidor em execucao e o ciclo de vida
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes