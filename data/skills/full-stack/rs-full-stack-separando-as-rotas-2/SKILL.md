---
name: rs-full-stack-separando-as-rotas-2
description: "Enforces Express route separation patterns when structuring Node.js/Express APIs. Use when user asks to 'create routes', 'organize express app', 'add new endpoint', 'structure API', or 'separate routes'. Applies rules: one file per domain, index aggregator, prefix in aggregator not in route file, export Router instances. Make sure to use this skill whenever creating or refactoring Express route files. Not for frontend routing, React Router, or Next.js routes."
---

# Separando Rotas no Express

> Cada dominio tem seu arquivo de rotas, agregados por um index que define os prefixos.

## Rules

1. **Um arquivo por dominio** — `products-routes.ts`, `users-routes.ts`, `clients-routes.ts`, porque facilita encontrar e manter rotas relacionadas
2. **Index agrega todas as rotas** — `routes/index.ts` importa e registra cada arquivo de rota com `routes.use("/prefix", domainRoutes)`, porque o server.ts nao deve conhecer cada dominio
3. **Prefixo no aggregator, nao no arquivo de rota** — defina `/products` no index e use apenas `/` nas rotas individuais, porque evita duplicacao de prefixo (`/products/products`)
4. **Server.ts so conhece o index** — importe apenas `routes` de `./routes` (resolve para index.ts automaticamente), porque mantem o server enxuto
5. **Exporte o Router** — cada arquivo de rota exporta sua constante Router com `export { productRoutes }`, porque permite importacao pelo index
6. **Nomeie arquivos com sufixo `-routes`** — `products-routes.ts` nao `products.ts`, porque deixa explicito o papel do arquivo

## How to write

### Arquivo de rota por dominio

```typescript
// src/routes/products-routes.ts
import { Router } from "express"

const productRoutes = Router()

productRoutes.get("/", (request, response) => {
  // GET /products — listagem
})

productRoutes.post("/", (request, response) => {
  // POST /products — criacao
})

productRoutes.get("/:id", (request, response) => {
  const { id } = request.params
  // GET /products/:id — detalhe
})

export { productRoutes }
```

### Index agregador

```typescript
// src/routes/index.ts
import { Router } from "express"
import { productRoutes } from "./products-routes"

const routes = Router()

routes.use("/products", productRoutes)
// routes.use("/users", userRoutes)
// routes.use("/clients", clientRoutes)

export { routes }
```

### Server enxuto

```typescript
// src/server.ts
import express from "express"
import { routes } from "./routes"

const app = express()
app.use(express.json())
app.use(routes)
```

## Example

**Before (todas rotas no server.ts):**
```typescript
import express from "express"
const app = express()

app.get("/products", (req, res) => { /* lista */ })
app.post("/products", (req, res) => { /* cria */ })
app.get("/users", (req, res) => { /* lista */ })
app.post("/users", (req, res) => { /* cria */ })
```

**After (separado por dominio):**
```
src/
├── server.ts              # so app.use(routes)
└── routes/
    ├── index.ts           # agrega com prefixos
    ├── products-routes.ts # GET /, POST /, GET /:id
    └── users-routes.ts    # GET /, POST /
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Novo dominio (ex: pedidos) | Criar `orders-routes.ts` + registrar no index com `/orders` |
| Rota com sub-recurso (`/products/:id/reviews`) | Manter no mesmo arquivo do dominio pai |
| Server.ts crescendo com rotas | Extrair para `routes/` imediatamente |
| Import de `./routes` sem `/index` | Correto — Node resolve `index.ts` automaticamente |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `app.get("/products", ...)` direto no server | `productRoutes.get("/", ...)` no arquivo de rota |
| Prefixo `/products` no arquivo de rota E no index | Prefixo so no index, `/` no arquivo de rota |
| Importar cada arquivo de rota no server.ts | Importar apenas `routes` do index |
| `export default Router()` anonimo | `const productRoutes = Router(); export { productRoutes }` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre prefixos duplicados e resolucao de index
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo com variacoes e cenarios