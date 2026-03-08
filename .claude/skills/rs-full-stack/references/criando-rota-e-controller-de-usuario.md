---
name: rs-full-stack-criando-rota-controller-usuario
description: "Enforces Express route and controller structure when building REST API endpoints with TypeScript. Use when user asks to 'create a route', 'add a controller', 'set up an endpoint', 'build API structure', or 'organize Express routes'. Applies patterns: class-based controllers, separated route files, centralized route index, Router from express. Make sure to use this skill whenever scaffolding new API resources or adding CRUD endpoints in Express. Not for Fastify, NestJS, Next.js API routes, or frontend routing."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: node-api-express
  tags: [express, routes, controllers, typescript, rest-api]
---

# Rotas e Controllers no Express

> Organize cada recurso da API em seu proprio controller (classe) e arquivo de rotas, centralizando tudo num index de rotas.

## Rules

1. **Um controller por recurso** — `UsersController`, `OrdersController`, cada um no seu arquivo em `src/controllers/`, porque facilita localizar e manter a logica de cada dominio
2. **Controllers sao classes com metodos por acao** — `create`, `show`, `update`, `delete`, porque permite instanciar e reutilizar sem repetir imports
3. **Um arquivo de rotas por recurso** — `users-routes.ts`, `orders-routes.ts` em `src/routes/`, porque isola as rotas de cada recurso
4. **Centralize rotas num index** — `src/routes/index.ts` importa todas as rotas de recurso e define prefixos (`/users`, `/orders`), porque o `app.ts` so precisa de um unico import
5. **Use `Router` do Express** — tanto nas rotas de recurso quanto no index, porque permite composicao modular
6. **Tipagem explicita** — importe `Request` e `Response` do express nos controllers, porque garante autocomplete e seguranca de tipos

## Steps

### Step 1: Criar a estrutura de pastas

```
src/
├── controllers/
│   └── users-controller.ts
├── routes/
│   ├── users-routes.ts
│   └── index.ts
└── app.ts
```

### Step 2: Criar o controller

```typescript
// src/controllers/users-controller.ts
import { Request, Response } from "express"

class UsersController {
  create(request: Request, response: Response) {
    return response.json({ message: "User created" })
  }
}

export { UsersController }
```

### Step 3: Criar as rotas do recurso

```typescript
// src/routes/users-routes.ts
import { Router } from "express"
import { UsersController } from "../controllers/users-controller"

const usersRoutes = Router()
const usersController = new UsersController()

usersRoutes.post("/", usersController.create)

export { usersRoutes }
```

### Step 4: Centralizar no index de rotas

```typescript
// src/routes/index.ts
import { Router } from "express"
import { usersRoutes } from "./users-routes"

const routes = Router()

routes.use("/users", usersRoutes)

export { routes }
```

### Step 5: Registrar no app

```typescript
// src/app.ts
import { routes } from "./routes"

app.use(routes)
```

## Example

**Before (tudo no app.ts):**
```typescript
import express from "express"
const app = express()

app.post("/users", (req, res) => {
  return res.json({ message: "User created" })
})

app.get("/orders", (req, res) => {
  return res.json({ orders: [] })
})
```

**After (com controllers e rotas separadas):**
```typescript
// src/app.ts — limpo, so registra rotas
import express from "express"
import { routes } from "./routes"

const app = express()
app.use(express.json())
app.use(routes)
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Novo recurso na API | Criar controller + arquivo de rotas + registrar no index |
| Controller com muitos metodos | Verificar se nao mistura responsabilidades de recursos diferentes |
| Testar rapidamente no navegador | Trocar temporariamente para GET, depois voltar para o metodo HTTP correto |
| Multiplos metodos no mesmo recurso | Adicionar na mesma rota: `.post`, `.get`, `.put`, `.delete` |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| Definir rotas direto no `app.ts` | Separar em `routes/{recurso}-routes.ts` |
| Funcoes anonimas inline nas rotas | Metodos de classe no controller |
| Um arquivo gigante com todas as rotas | Um arquivo por recurso + index centralizador |
| Esquecer de tipar `Request`/`Response` | Importar tipos do express no controller |
| Deixar rota de teste como GET em producao | Usar o metodo HTTP correto (POST para criacao) |

## Troubleshooting

| Problema | Causa provavel | Solucao |
|----------|---------------|---------|
| Rota retorna 404 | Rota nao registrada no index ou prefixo incorreto | Verifique `routes.use("/users", usersRoutes)` no index |
| `Cannot GET /users` | Rota definida como POST mas testando com GET | Use o metodo HTTP correto no cliente (Insomnia/fetch) |
| `this` undefined no metodo do controller | Metodo passado como callback perde contexto | Use arrow function ou `.bind(this)` ao registrar a rota |
| `app.use(routes)` nao funciona | Import do index de rotas incorreto | Verifique o path: `import { routes } from "./routes"` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre separacao de responsabilidades em APIs Express
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes