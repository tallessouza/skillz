---
name: rs-full-stack-criando-estrutura-projeto
description: "Enforces Express API project structure with routes and controllers separation when scaffolding a Node.js/Express backend. Use when user asks to 'create an API', 'setup express project', 'organize routes', 'create controller', or 'structure backend folders'. Applies pattern: routes/ for path mapping, controllers/ for business logic as classes, index.ts as route aggregator. Make sure to use this skill whenever creating or restructuring an Express API project. Not for frontend structure, database schema, or middleware configuration."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: express-api
  tags: [express, project-structure, routes, controllers, typescript]
---

# Estrutura de Projeto Express: Rotas e Controllers

> Separe rotas (caminhos) de controllers (funcionalidades) em pastas distintas, com um index.ts agregador que conecta tudo ao servidor.

## Rules

1. **Crie pasta `src/routes/`** — contém arquivos de rota por domínio + `index.ts` agregador, porque centralizar rotas facilita adicionar novas funcionalidades sem tocar no server.ts
2. **Crie pasta `src/controllers/`** — contém classes controller por domínio, porque separar lógica de negócio dos caminhos HTTP permite reutilização e testabilidade
3. **Nomeie arquivos por domínio** — `products-routes.ts`, `products-controller.ts`, porque facilita localizar código por funcionalidade
4. **Controller como classe com métodos async** — cada método recebe `(request, response, next)` com try/catch chamando `next(error)`, porque erros assíncronos precisam ser repassados ao Express via next
5. **Index.ts agrega rotas com prefixo** — `routes.use("/products", productRoutes)`, porque o servidor só importa um ponto de entrada para todas as rotas
6. **Server.ts importa apenas o index de rotas** — `app.use(routes)` após `app.use(express.json())`, porque mantém o arquivo principal limpo

## How to write

### Estrutura de pastas

```
src/
├── server.ts
├── routes/
│   ├── index.ts              # Agregador
│   └── products-routes.ts    # Rotas por domínio
└── controllers/
    └── products-controller.ts # Lógica por domínio
```

### Controller (classe com async + try/catch + next)

```typescript
import { NextFunction, Request, Response } from "express"

class ProductsController {
  async index(request: Request, response: Response, next: NextFunction) {
    try {
      // lógica com await (banco de dados, etc)
      return response.json({ message: "ok" })
    } catch (error) {
      next(error)
    }
  }
}

export { ProductsController }
```

### Rota por domínio

```typescript
import { Router } from "express"
import { ProductsController } from "../controllers/products-controller"

const productRoutes = Router()
const productController = new ProductsController()

productRoutes.get("/", productController.index)

export { productRoutes }
```

### Index agregador de rotas

```typescript
import { Router } from "express"
import { productRoutes } from "./products-routes"

const routes = Router()
routes.use("/products", productRoutes)

export { routes }
```

### Conexão no server.ts

```typescript
import express from "express"
import { routes } from "./routes"

const app = express()
app.use(express.json())
app.use(routes)
```

## Example

**Before (tudo no server.ts):**
```typescript
import express from "express"
const app = express()
app.use(express.json())

app.get("/products", async (req, res) => {
  return res.json({ message: "ok" })
})

app.listen(3333)
```

**After (estrutura separada):**
```typescript
// src/server.ts
import express from "express"
import { routes } from "./routes"

const app = express()
app.use(express.json())
app.use(routes)
app.listen(3333)
```

## Heuristics

| Situação | Faça |
|----------|------|
| Novo domínio (orders, users, etc) | Crie `{domain}-routes.ts` + `{domain}-controller.ts` e registre no `index.ts` |
| Método que usa banco de dados | Sempre `async` com `try/catch` + `next(error)` |
| Rota sem lógica complexa | Ainda assim use controller — mantém consistência |
| Testar rota nova | Acesse `localhost:PORT/{prefixo}` no navegador para GET |

## Anti-patterns

| Nunca faça | Faça ao invés |
|------------|---------------|
| Todas as rotas no `server.ts` | Separe em `routes/` com arquivos por domínio |
| Controller como função solta | Use classe com métodos nomeados (`index`, `create`, `show`) |
| Ignorar `next(error)` em async | Sempre `catch (error) { next(error) }` para erros assíncronos |
| Importar cada rota no server.ts | Importe apenas o `index.ts` agregador |
| Arquivo `.tsx` para backend | Use `.ts` — não há JSX no backend |

## Troubleshooting

| Problema | Causa | Solucao |
|----------|-------|---------|
| Rota retorna 404 mesmo existindo | Prefixo nao registrado no index.ts ou typo no path | Verifique `routes.use("/prefixo", dominioRoutes)` no index |
| Erro assincrono nao cai no error handler | Controller async sem `try/catch` chamando `next(error)` | Adicione `try/catch` com `next(error)` em todo metodo async |
| Import do controller falha | Path relativo incorreto entre routes/ e controllers/ | Use `../controllers/nome-controller` no import |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre separacao rotas/controllers e tratamento de erros assincronos
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes