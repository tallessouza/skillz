# Code Examples: Separacao App/Server para Testes E2E

## Exemplo 1: Arquivo sum.ts extraido do server

Antes, a funcao `sum` estava dentro de `server.ts`. O instrutor moveu para um arquivo proprio:

```typescript
// src/sum.ts
export function sum(a: number, b: number): number {
  return a + b
}
```

```typescript
// src/sum.test.ts
import { sum } from "./sum"

test("sum 2 + 3", () => {
  expect(sum(2, 3)).toBe(5)
})
```

## Exemplo 2: app.ts completo da aula

```typescript
// src/app.ts
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

## Exemplo 3: server.ts completo da aula

```typescript
// src/server.ts
import { app } from "./app"

app.listen(3333, () => {
  console.log("Server is running!")
})
```

## Exemplo 4: Como o teste E2E usaria o app

```typescript
// test/products.e2e.ts
import { app } from "../src/app"

let server: ReturnType<typeof app.listen>

beforeAll(() => {
  server = app.listen(0) // porta aleatoria
})

afterAll(() => {
  server.close()
})

test("GET /products returns product list", async () => {
  const address = server.address()
  const port = typeof address === "object" ? address?.port : 0

  const response = await fetch(`http://localhost:${port}/products`)
  const products = await response.json()

  expect(products).toHaveLength(3)
  expect(products[0]).toHaveProperty("name", "Camiseta")
})
```

## Variacao: Multiplas rotas no app.ts

```typescript
// src/app.ts — com mais rotas
import http from "node:http"

const products = [
  { id: 1, name: "Camiseta", price: 29.99 },
]

export const app = http.createServer((request, response) => {
  if (request.method === "GET" && request.url === "/products") {
    response.end(JSON.stringify(products))
    return
  }

  if (request.method === "GET" && request.url === "/health") {
    response.end(JSON.stringify({ status: "ok" }))
    return
  }

  response.statusCode = 404
  response.end(JSON.stringify({ error: "Not found" }))
})
```

## Variacao: Usando porta via variavel de ambiente

```typescript
// src/server.ts — com porta configuravel
import { app } from "./app"

const PORT = Number(process.env.PORT) || 3333

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}!`)
})
```