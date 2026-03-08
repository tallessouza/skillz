---
name: rs-full-stack-o-projeto-que-vamos-utilizar
description: "Applies Express.js project structure for authentication and authorization modules. Use when user asks to 'setup auth project', 'create express auth structure', 'scaffold login routes', or 'setup session routes with Express'. Follows pattern: server.ts + routes (sessions, products) + controllers separation. Make sure to use this skill whenever scaffolding a Node.js/Express project that needs auth. Not for frontend auth, OAuth providers, or database setup."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: authentication
  tags: [express, auth, sessions, controllers, routes]
---

# Estrutura de Projeto Express para Autenticação

> Ao criar um projeto Express para autenticação, separe server, rotas e controllers desde o início, porque cada peça será estendida independentemente.

## Rules

1. **Separe server de rotas** — `server.ts` inicializa Express e importa rotas, porque misturar configuração com lógica de rotas torna impossível testar isoladamente
2. **Use sessions para login, não users** — a rota de login é `POST /sessions` (criar sessão), porque login não cria usuário, cria uma sessão
3. **Controllers têm métodos isolados** — `index` (listar), `create` (criar), `show` (detalhar), porque cada ação HTTP mapeia para um método separado
4. **JSON middleware antes das rotas** — `app.use(express.json())` antes de `app.use(routes)`, porque o body não será parseado se a ordem estiver invertida
5. **Tratamento de exceções após as rotas** — error handler registrado depois de todas as rotas, porque Express processa middlewares em ordem de registro

## Estrutura

```
src/
├── server.ts              # Inicialização, porta, JSON, rotas, error handler
├── routes/
│   └── index.ts           # Agrupa todas as rotas
├── controllers/
│   ├── sessions-controller.ts   # POST /sessions (login)
│   └── products-controller.ts   # GET /products, POST /products
```

## How to write

### server.ts

```typescript
import express from "express"
import { routes } from "./routes"

const app = express()
const PORT = 3333

app.use(express.json())
app.use(routes)

// Error handler APÓS as rotas
app.use((error, request, response, next) => {
  return response.status(500).json({ message: "Internal server error" })
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
```

### routes/index.ts

```typescript
import { Router } from "express"
import { SessionsController } from "../controllers/sessions-controller"
import { ProductsController } from "../controllers/products-controller"

const routes = Router()
const sessionsController = new SessionsController()
const productsController = new ProductsController()

// Sessão = login (POST cria sessão, não usuário)
routes.post("/sessions", sessionsController.create)

// Produtos = rotas protegidas (auth será adicionado depois)
routes.get("/products", productsController.index)
routes.post("/products", productsController.create)

export { routes }
```

### controllers/sessions-controller.ts

```typescript
import { Request, Response } from "express"

export class SessionsController {
  async create(request: Request, response: Response) {
    // Login logic será implementado aqui
    return response.json({ message: "session created" })
  }
}
```

## Example

**Before (tudo misturado no server.ts):**

```typescript
import express from "express"
const app = express()
app.use(express.json())

app.post("/users/login", (req, res) => {
  res.json({ ok: true })
})
app.get("/products", (req, res) => {
  res.json({ products: [] })
})
app.listen(3333)
```

**After (com separação correta):**

```typescript
// server.ts — só configuração
import express from "express"
import { routes } from "./routes"
const app = express()
app.use(express.json())
app.use(routes)
app.listen(3333)

// routes/index.ts — só mapeamento
routes.post("/sessions", sessionsController.create)
routes.get("/products", productsController.index)
routes.post("/products", productsController.create)

// controllers/ — só lógica de cada ação
```

## Heuristics

| Situação | Faça |
|----------|------|
| Login do usuário | `POST /sessions` (não `/users/login` ou `/auth`) |
| Listar recursos | `GET /resources` → método `index` no controller |
| Criar recurso | `POST /resources` → método `create` no controller |
| Testar rotas antes de implementar auth | Retorne `response.json({ message: "ok" })` temporário |
| Proteger rotas com auth | Adicione middleware ENTRE a rota e o controller (próximas aulas) |

## Anti-patterns

| Nunca faça | Faça assim |
|------------|-----------|
| `POST /users/login` | `POST /sessions` |
| Lógica de negócio dentro de `routes/` | Lógica no controller, rota só mapeia |
| `app.use(routes)` antes de `app.use(express.json())` | JSON middleware primeiro, rotas depois |
| Um arquivo gigante com server + rotas + controllers | Separar em 3 camadas distintas |
| Testar rotas sem servidor rodando | `npm run dev` antes de testar no Insomnia |

## Troubleshooting

| Problema | Causa | Solucao |
|----------|-------|---------|
| Body da requisicao vem undefined | `express.json()` registrado depois das rotas | Mova `app.use(express.json())` para antes de `app.use(routes)` |
| Endpoint retorna 404 | Rota nao registrada no index | Importe e registre a rota no `routes/index.ts` |
| Error handler nao captura erros | Registrado antes das rotas | Mova error handler para depois de todas as rotas |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre separacao de responsabilidades e padrao sessions
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes