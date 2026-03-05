# Code Examples: Resposta com JSON e Status Code no Express

## Exemplo 1: Evolucao de send para json (da aula)

```typescript
// ANTES — usando send (devolve como text/html)
app.get("/products/:id", (req, res) => {
  const product = { name: "Teclado", price: 200 }
  res.send(product)
  // Header: Content-Type: text/html
})

// DEPOIS — usando json (devolve como application/json)
app.get("/products/:id", (req, res) => {
  const product = { name: "Teclado", price: 200 }
  res.json(product)
  // Header: Content-Type: application/json
})
```

## Exemplo 2: Adicionando status code (da aula)

```typescript
// POST com status 201 (Created)
app.post("/products", (req, res) => {
  const product = { name: "Teclado", price: 200 }
  res.status(201).json(product)
  // Status: 201 Created
  // Content-Type: application/json
})
```

## Exemplo 3: Comparacao Node puro vs Express

```typescript
// NODE PURO — manual e verboso
import http from "node:http"

const server = http.createServer((req, res) => {
  const product = { name: "Teclado", price: 200 }
  res.writeHead(201, { "Content-Type": "application/json" })
  res.end(JSON.stringify(product))
})

// EXPRESS — simples e direto
import express from "express"
const app = express()

app.post("/products", (req, res) => {
  const product = { name: "Teclado", price: 200 }
  res.status(201).json(product)
})
```

## Exemplo 4: Variacoes por verbo HTTP

```typescript
// GET — 200 e padrao, nao precisa de .status()
app.get("/products", (req, res) => {
  res.json(products)
})

// POST — 201 Created
app.post("/products", (req, res) => {
  const created = createProduct(req.body)
  res.status(201).json(created)
})

// PUT — 200 OK (padrao)
app.put("/products/:id", (req, res) => {
  const updated = updateProduct(req.params.id, req.body)
  res.json(updated)
})

// DELETE — 204 No Content (sem corpo)
app.delete("/products/:id", (req, res) => {
  deleteProduct(req.params.id)
  res.status(204).send()
})
```

## Exemplo 5: Erro comum — status depois de json

```typescript
// ERRADO — status depois de json nao tem efeito
app.post("/products", (req, res) => {
  res.json(product).status(201) // 201 IGNORADO, vai como 200
})

// CORRETO — status antes de json
app.post("/products", (req, res) => {
  res.status(201).json(product) // 201 Created
})
```

## Exemplo 6: Arrays tambem funcionam com res.json()

```typescript
app.get("/products", (req, res) => {
  const products = [
    { name: "Teclado", price: 200 },
    { name: "Mouse", price: 100 },
  ]
  // res.json() funciona com arrays, objetos, strings, numeros, booleans, null
  res.json(products)
})
```