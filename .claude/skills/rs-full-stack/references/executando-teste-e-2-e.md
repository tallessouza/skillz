---
name: rs-full-stack-executando-teste-e-2-e
description: "Applies E2E testing patterns with SuperTest when writing Node.js/Express API tests. Use when user asks to 'write e2e test', 'test an endpoint', 'test API route', 'create integration test', or 'setup supertest'. Enforces app/server separation, proper response format handling, and async test patterns. Make sure to use this skill whenever creating HTTP endpoint tests in Node.js projects. Not for unit tests, frontend tests, or browser-based E2E tests like Playwright/Cypress."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: testing
  tags: [testing, e2e, supertest, express, api]
---

# Executando Testes E2E com SuperTest

> Testes E2E de API usam SuperTest com o app separado do server, permitindo requisicoes HTTP sem conflito de porta.

## Rules

1. **Separe app de server** — exporte `app` (Express instance) separado de `server` (que define porta), porque SuperTest precisa subir o servidor internamente sem conflito de porta
2. **Use async/await nos testes** — callbacks com SuperTest geram testes frageis e dificeis de debugar
3. **Defina Content-Type como JSON** — use `response.setHeader('Content-Type', 'application/json')` nas rotas, porque SuperTest nao parseia body automaticamente sem header correto
4. **Acesse response.body** — nunca use `response` direto para validar dados, porque o objeto completo contem metadados HTTP irrelevantes
5. **Instale tipagens separadamente** — `supertest` e `@types/supertest` sao pacotes distintos, instale ambos como devDependencies

## How to write

### Estrutura basica de teste E2E

```typescript
import request from "supertest"
import { app } from "../app"

describe("Products", () => {
  it("should list products", async () => {
    const response = await request(app).get("/products")

    expect(response.status).toBe(200)
    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: expect.any(String) }),
      ])
    )
  })
})
```

### Separacao app/server

```typescript
// app.ts — exporta APENAS a instancia Express
import express from "express"
const app = express()
// rotas aqui
export { app }

// server.ts — sobe o servidor com porta
import { app } from "./app"
app.listen(3000, () => console.log("Server running"))
```

### Rota com Content-Type correto

```typescript
app.get("/products", (req, res) => {
  res.setHeader("Content-Type", "application/json")
  res.send(JSON.stringify(products))
  // ou simplesmente: res.json(products)
})
```

## Example

**Before (teste que nao funciona direito):**

```typescript
import request from "supertest"
import { app } from "../app"

it("list products", (done) => {
  request(app).get("/products").end((err, res) => {
    console.log(res) // objeto gigante com metadados HTTP
    done()
  })
})
```

**After (com este skill aplicado):**

```typescript
import request from "supertest"
import { app } from "../app"

describe("Products", () => {
  it("should list products", async () => {
    const response = await request(app).get("/products")

    expect(response.status).toBe(200)
    expect(response.body).toBeDefined()
    expect(Array.isArray(response.body)).toBe(true)
  })
})
```

## Heuristics

| Situacao | Faca |
|----------|------|
| App e server no mesmo arquivo | Separe antes de escrever testes |
| Body retorna vazio | Verifique Content-Type da rota (`application/json`) |
| Conflito de porta nos testes | Confirme que importa `app`, nao `server` |
| Rodar teste isolado | `npx jest src/products.test.ts` |
| Rodar todos os testes | `npm test` |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `import { server } from "./server"` no teste | `import { app } from "./app"` |
| `request(app).get(...).end(callback)` | `await request(app).get(...)` |
| `console.log(response)` para debugar body | `console.log(response.body)` |
| `res.send(data)` sem Content-Type | `res.json(data)` |
| `supertest` em dependencies | `supertest` em devDependencies (`-D`) |

## Troubleshooting

| Problema | Causa provavel | Solucao |
|----------|---------------|---------|
| Conflito de porta ao rodar testes | Importando `server` em vez de `app` | Importar apenas `app` (instancia Express sem listen) |
| `response.body` vazio | Rota sem Content-Type JSON | Usar `res.json(data)` em vez de `res.send()` |
| Tipos nao reconhecidos para SuperTest | Falta `@types/supertest` | `npm i @types/supertest -D` |
| Teste passa mas nao deveria | Sem assertions no teste | Adicionar `expect()` com verificacoes reais |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre separacao app/server e por que SuperTest precisa disso
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo da aula com variacoes