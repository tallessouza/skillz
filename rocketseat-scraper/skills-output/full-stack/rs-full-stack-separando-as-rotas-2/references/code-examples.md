# Code Examples: Separando Rotas no Express

## Exemplo 1: Estrutura basica (da aula)

### products-routes.ts
```typescript
import { Router } from "express"
import { myMiddleware } from "../middlewares/my-middleware"

const productRoutes = Router()

// Middleware local (apenas para rotas de produto)
productRoutes.use(myMiddleware)

// GET /products — listar produtos
productRoutes.get("/", (request, response) => {
  const { page, limit } = request.query
  return response.json({
    page: Number(page) || 1,
    limit: Number(limit) || 10
  })
})

// POST /products — criar produto
productRoutes.post("/", (request, response) => {
  const { name, price } = request.body
  return response.json({ name, price })
})

// GET /products/:id — detalhe do produto
productRoutes.get("/:id", (request, response) => {
  const { id } = request.params
  return response.json({ id })
})

export { productRoutes }
```

### routes/index.ts
```typescript
import { Router } from "express"
import { productRoutes } from "./products-routes"

const routes = Router()

routes.use("/products", productRoutes)

export { routes }
```

### server.ts
```typescript
import express from "express"
import { routes } from "./routes"

const app = express()
app.use(express.json())
app.use(routes)

const PORT = 3333
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
```

## Exemplo 2: Multiplos dominios

```typescript
// routes/index.ts
import { Router } from "express"
import { productRoutes } from "./products-routes"
import { userRoutes } from "./users-routes"
import { clientRoutes } from "./clients-routes"
import { orderRoutes } from "./orders-routes"

const routes = Router()

routes.use("/products", productRoutes)
routes.use("/users", userRoutes)
routes.use("/clients", clientRoutes)
routes.use("/orders", orderRoutes)

export { routes }
```

## Exemplo 3: Bug do prefixo duplicado

```typescript
// ERRADO — prefixo no arquivo de rota E no index
// products-routes.ts
productRoutes.get("/products", handler)    // define /products
// index.ts
routes.use("/products", productRoutes)     // monta em /products
// URL final: /products/products ← DUPLICADO

// CORRETO — prefixo so no index
// products-routes.ts
productRoutes.get("/", handler)            // define /
// index.ts
routes.use("/products", productRoutes)     // monta em /products
// URL final: /products ← CORRETO
```

## Exemplo 4: Rotas com params e query

```typescript
// products-routes.ts
productRoutes.get("/:id", (request, response) => {
  const { id } = request.params
  const { page, limit } = request.query

  return response.json({
    id,
    page: Number(page) || 1,
    limit: Number(limit) || 10
  })
})

// Requisicao: GET /products/7?page=1&limit=10
// Resultado: { id: "7", page: 1, limit: 10 }
```

## Exemplo 5: Adicionando novo dominio (passo a passo)

```typescript
// 1. Criar arquivo: src/routes/suppliers-routes.ts
import { Router } from "express"

const supplierRoutes = Router()

supplierRoutes.get("/", (request, response) => {
  return response.json({ suppliers: [] })
})

supplierRoutes.post("/", (request, response) => {
  const { name } = request.body
  return response.json({ name })
})

export { supplierRoutes }

// 2. Registrar no index.ts
import { supplierRoutes } from "./suppliers-routes"
routes.use("/suppliers", supplierRoutes)

// 3. Pronto — GET /suppliers e POST /suppliers funcionando
```