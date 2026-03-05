---
name: rs-full-stack-criando-rota
description: "Enforces separation of app logic from server bootstrap in Node.js APIs to enable E2E testing. Use when user asks to 'create an API', 'setup E2E tests', 'organize server files', 'separate app from server', or 'avoid port conflicts in tests'. Applies pattern: app.ts exports the http server instance, server.ts calls listen(). Make sure to use this skill whenever creating Node.js HTTP servers that will be tested. Not for frontend routing, Express middleware patterns, or database setup."
---

# Separacao App/Server para Testes E2E

> Separe a criacao do servidor HTTP (app.ts) do bootstrap com porta (server.ts), porque testes E2E precisam subir o servidor em portas independentes.

## Rules

1. **app.ts cria e exporta o servidor, nunca chama listen()** — porque se o arquivo que define rotas tambem sobe o servidor, o teste E2E nao consegue usar uma porta diferente
2. **server.ts importa app e chama listen()** — porque a responsabilidade de definir porta e iniciar e exclusiva do entrypoint
3. **Separe funcoes utilitarias em arquivos proprios** — `sum.ts` separado de `server.ts`, porque funcoes testadas unitariamente nao pertencem ao arquivo do servidor
4. **Testes E2E importam app, nao server** — porque o teste define sua propria porta, evitando conflito com o servidor em execucao

## How to write

### app.ts (sem listen)

```typescript
import http from "node:http"

const products = [
  { id: 1, name: "Camiseta", price: 29.99 },
  { id: 2, name: "Jaqueta", price: 129.99 },
  { id: 3, name: "Sapato", price: 59.99 },
]

export const app = http.createServer((request, response) => {
  if (request.method === "GET" && request.url === "/products") {
    response.end(JSON.stringify(products))
  }
})
```

### server.ts (apenas bootstrap)

```typescript
import { app } from "./app"

app.listen(3333, () => {
  console.log("Server is running!")
})
```

### Teste E2E (porta independente)

```typescript
import { app } from "../src/app"

// Sobe em porta diferente — sem conflito
app.listen(0) // porta aleatoria disponivel
```

## Example

**Before (tudo junto — quebra no E2E):**

```typescript
// server.ts — faz tudo
import http from "node:http"

const server = http.createServer((req, res) => {
  if (req.method === "GET" && req.url === "/products") {
    res.end(JSON.stringify([{ id: 1, name: "Item" }]))
  }
})

server.listen(3333) // E2E nao consegue importar sem conflito de porta
```

**After (separado — E2E funciona):**

```typescript
// app.ts — so define rotas
import http from "node:http"

export const app = http.createServer((req, res) => {
  if (req.method === "GET" && req.url === "/products") {
    res.end(JSON.stringify([{ id: 1, name: "Item" }]))
  }
})

// server.ts — so sobe
import { app } from "./app"
app.listen(3333, () => console.log("Server is running!"))
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Criando API Node.js do zero | Ja comece com app.ts + server.ts separados |
| Funcao utilitaria no server.ts | Extraia para arquivo proprio (ex: sum.ts) |
| Teste E2E precisa do servidor | Importe app.ts, nunca server.ts |
| Porta fixa no teste | Use porta 0 (aleatoria) ou porta diferente da dev |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `export const app = http.createServer(...); app.listen(3333)` no mesmo arquivo | `listen()` apenas em server.ts |
| Importar server.ts no teste E2E | Importar app.ts no teste E2E |
| Funcoes de logica de negocio dentro de server.ts | Arquivo separado (sum.ts, utils.ts) |
| Porta hardcoded no arquivo de teste | Porta 0 ou variavel de ambiente |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre separacao de responsabilidades e conflito de portas
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo da aula com variacoes