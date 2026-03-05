---
name: rs-full-stack-iniciando-com-requisicoes
description: "Applies fetch API patterns when writing JavaScript HTTP requests. Use when user asks to 'fetch data', 'call an API', 'make a request', 'consume an API', or 'send data to API'. Enforces modern fetch usage with proper error handling, async/await, response parsing, and both GET and POST patterns. Make sure to use this skill whenever generating code that communicates with an HTTP API in JavaScript. Not for WebSocket connections, GraphQL clients, or server-side route handlers."
---

# Requisições HTTP com Fetch

> Utilize fetch com async/await para todas as requisições HTTP, tratando erros e parseando respostas de forma explícita.

## Rules

1. **Use async/await ao invés de .then()** — `await fetch(url)` não `fetch(url).then(...)`, porque async/await é mais legível e facilita tratamento de erros com try/catch
2. **Sempre verifique response.ok** — fetch não lança erro para status 4xx/5xx, apenas para falhas de rede, porque silenciar erros HTTP causa bugs difíceis de rastrear
3. **Nomeie variáveis pelo conteúdo retornado** — `products` não `data`, `createdProduct` não `response`, porque o nome deve descrever o domínio
4. **Separe busca de parse** — `const response = await fetch(url)` depois `const products = await response.json()`, porque são duas operações distintas que podem falhar independentemente
5. **Use método e headers explícitos em POST/PUT** — nunca confie nos defaults para mutações, porque fetch assume GET por padrão e omitir Content-Type causa erros silenciosos
6. **Centralize a baseURL** — defina `const API_URL = 'http://...'` uma vez, porque URLs espalhadas quebram quando o endpoint muda

## How to write

### GET — Leitura de dados

```javascript
const API_URL = 'http://localhost:3333'

async function fetchProducts() {
  const response = await fetch(`${API_URL}/products`)

  if (!response.ok) {
    throw new Error(`Erro ao buscar produtos: ${response.status}`)
  }

  const products = await response.json()
  return products
}
```

### POST — Envio de dados

```javascript
async function createProduct({ name, price }) {
  const response = await fetch(`${API_URL}/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, price }),
  })

  if (!response.ok) {
    throw new Error(`Erro ao cadastrar produto: ${response.status}`)
  }

  const createdProduct = await response.json()
  return createdProduct
}
```

## Example

**Before (comum em iniciantes):**
```javascript
fetch('http://localhost:3333/products')
  .then(res => res.json())
  .then(data => console.log(data))
```

**After (com esta skill aplicada):**
```javascript
const API_URL = 'http://localhost:3333'

async function fetchProducts() {
  const response = await fetch(`${API_URL}/products`)

  if (!response.ok) {
    throw new Error(`Erro ao buscar produtos: ${response.status}`)
  }

  const products = await response.json()
  return products
}

const products = await fetchProducts()
console.log(products)
```

## Heuristics

| Situação | Faça |
|----------|------|
| Leitura simples (GET) | `await fetch(url)` sem body, sem headers extras |
| Envio de JSON (POST/PUT) | Sempre inclua `method`, `headers` com Content-Type, e `body` com JSON.stringify |
| Deleção (DELETE) | Inclua `method: 'DELETE'`, geralmente sem body |
| Múltiplas chamadas independentes | Use `Promise.all([fetch1(), fetch2()])` |
| Chamadas dependentes (uma depende da outra) | Use await sequencial |

## Anti-patterns

| Nunca escreva | Escreva no lugar |
|---------------|------------------|
| `fetch(url).then(r => r.json()).then(data => ...)` | `const response = await fetch(url); const products = await response.json()` |
| `const data = await res.json()` | `const products = await response.json()` (nomeie pelo conteúdo) |
| `fetch('http://localhost:3333/products')` espalhado | `fetch(\`${API_URL}/products\`)` com constante centralizada |
| POST sem `Content-Type` header | `headers: { 'Content-Type': 'application/json' }` |
| Ignorar `response.ok` | `if (!response.ok) throw new Error(...)` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre fetch, promessas e ciclo de requisição HTTP
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações GET, POST, PUT, DELETE