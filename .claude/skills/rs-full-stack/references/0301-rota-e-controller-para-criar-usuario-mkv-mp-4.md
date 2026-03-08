---
name: rs-full-stack-0301-rota-controller-usuario
description: "Enforces Express route and controller organization pattern when creating API endpoints, structuring controllers as classes, separating route files by domain, and centralizing routes in an index file. Use when user asks to 'create a route', 'add an endpoint', 'organize Express routes', 'create a controller', or 'setup API structure'. Make sure to use this skill whenever building Express APIs with multiple resource domains. Not for Fastify, NestJS, or frontend routing."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: fundamentos
  tags: [express, routes, controllers, api-structure, separation-of-concerns]
---

# Rotas e Controllers no Express

> Organize rotas e controllers por domínio, separando cada recurso em seu próprio arquivo e centralizando tudo em um index de rotas.

## Rules

1. **Controllers são classes** — cada domínio tem sua classe controller (ex: `UserController`), porque classes agrupam métodos relacionados e facilitam instanciação
2. **Métodos do controller são async** — recebem `Request` e `Response` tipados do Express, porque operações de banco são assíncronas
3. **Um arquivo de rotas por recurso** — `users-routes.ts`, `tickets-routes.ts`, porque mantém cada domínio isolado e fácil de localizar
4. **Centralize rotas em `routes/index.ts`** — use `routes.use("/users", usersRoutes)` para montar sub-rotas, porque um único ponto de entrada simplifica o `app.ts`
5. **Instancie o controller no arquivo de rotas** — `const usersController = new UserController()`, porque mantém a rota como ponto de ligação entre URL e handler
6. **Exporte a instância do router, não a classe** — `export { usersRoutes }`, porque o `app.ts` só precisa do router montado

## How to write

### Controller (classe com métodos async)

```typescript
// src/controllers/user-controller.ts
import { Request, Response } from "express"

class UserController {
  async create(request: Request, response: Response) {
    // lógica de criação
    return response.json({ message: "ok" })
  }
}

export { UserController }
```

### Rotas por recurso

```typescript
// src/routes/users-routes.ts
import { Router } from "express"
import { UserController } from "../controllers/user-controller"

const usersRoutes = Router()
const usersController = new UserController()

usersRoutes.post("/", usersController.create)

export { usersRoutes }
```

### Index centralizador de rotas

```typescript
// src/routes/index.ts
import { Router } from "express"
import { usersRoutes } from "./users-routes"

const routes = Router()

// Rotas públicas
routes.use("/users", usersRoutes)

export { routes }
```

### Registro no app

```typescript
// src/app.ts
import express from "express"
import { routes } from "./routes"

const app = express()
app.use(express.json())
app.use(routes)

export { app }
```

## Example

**Before (tudo no app.ts):**
```typescript
import express from "express"
const app = express()
app.use(express.json())

app.post("/users", async (req, res) => {
  return res.json({ message: "ok" })
})

app.post("/tickets", async (req, res) => {
  return res.json({ message: "ok" })
})
```

**After (com estrutura de controllers e rotas):**
```
src/
├── app.ts                          # só registra middleware e routes
├── controllers/
│   ├── user-controller.ts          # classe UserController
│   └── ticket-controller.ts        # classe TicketController
└── routes/
    ├── index.ts                    # centraliza todas as sub-rotas
    ├── users-routes.ts             # rotas de /users
    └── tickets-routes.ts           # rotas de /tickets
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Novo recurso na API (ex: produtos) | Criar `product-controller.ts` + `products-routes.ts` + registrar no `index.ts` |
| Rota precisa de autenticação | Separar rotas públicas e autenticadas no `index.ts` |
| Controller ficou com muitos métodos | Manter na mesma classe — cada método = um endpoint do recurso |
| Testar endpoint novo | Criar pasta no Insomnia por recurso, usar variável `resource` para o path base |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| Handlers inline no `app.ts` | Controller separado em classe |
| Um único arquivo de rotas gigante | Um arquivo de rotas por recurso |
| `export default new UserController()` | `export { UserController }` (instanciar nas rotas) |
| `app.post("/users", handler)` direto no app | `routes.use("/users", usersRoutes)` via index |
| Controller como objeto literal `{ create: ... }` | Controller como classe com métodos async |

## Troubleshooting

### Problem: `this` is undefined inside controller method when used as route handler
- **Cause**: Passing `usersController.create` as a callback loses the `this` context binding
- **Fix**: Bind the method explicitly: `usersRoutes.post("/", usersController.create.bind(usersController))` or use arrow functions in the class

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre separação por domínio, padrão MVC no Express, e organização do Insomnia
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações para múltiplos recursos