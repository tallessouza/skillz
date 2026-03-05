# Code Examples: Executando Testes E2E com SuperTest

## Instalacao

```bash
# SuperTest + tipagens como devDependencies
npm install supertest@7.0.0 @types/supertest@6.0.2 -D
```

## Arquivo de teste completo (products.test.ts)

```typescript
import request from "supertest"
import { app } from "../app"

describe("Products", () => {
  it("should list products", async () => {
    const response = await request(app).get("/products")

    console.log(response.body) // para debug durante desenvolvimento
    expect(response.body).toBeDefined()
  })
})
```

## Separacao app/server

### app.ts (sem porta, sem listen)

```typescript
import express from "express"

const app = express()

app.get("/products", (req, res) => {
  const products = [
    { id: 1, name: "Product A" },
    { id: 2, name: "Product B" },
  ]

  res.setHeader("Content-Type", "application/json")
  res.send(JSON.stringify(products))
})

export { app }
```

### server.ts (define porta e sobe)

```typescript
import { app } from "./app"

app.listen(3000, () => {
  console.log("Server running on port 3000")
})
```

## Variacao: usando res.json() (recomendado)

```typescript
app.get("/products", (req, res) => {
  const products = [
    { id: 1, name: "Product A" },
    { id: 2, name: "Product B" },
  ]

  // res.json() automaticamente seta Content-Type e serializa
  res.json(products)
})
```

## Variacao: teste com validacao de status

```typescript
describe("Products", () => {
  it("should list products with status 200", async () => {
    const response = await request(app)
      .get("/products")
      .expect(200) // SuperTest permite encadear expects
      .expect("Content-Type", /json/)

    expect(Array.isArray(response.body)).toBe(true)
  })
})
```

## Variacao: teste de rota inexistente

```typescript
describe("Products", () => {
  it("should return 404 for unknown route", async () => {
    const response = await request(app).get("/unknown")

    expect(response.status).toBe(404)
  })
})
```

## Comandos de execucao

```bash
# Rodar apenas um teste especifico
npx jest src/products.test.ts

# Rodar todos os testes do projeto
npm test

# Rodar com verbose para mais detalhes
npx jest --verbose src/products.test.ts
```

## Debug: response completo vs body

```typescript
// O que response contem (objeto enorme):
// {
//   status: 200,
//   headers: { ... },
//   body: [...],     <-- OS DADOS UTEIS
//   text: '...',
//   req: { ... },
//   ... centenas de propriedades
// }

// SEMPRE use response.body para acessar os dados
console.log(response.body) // [{ id: 1, name: "Product A" }, ...]
```