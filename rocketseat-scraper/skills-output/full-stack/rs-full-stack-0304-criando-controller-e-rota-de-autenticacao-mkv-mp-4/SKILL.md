---
name: rs-full-stack-auth-controller-route
description: "Enforces the pattern for creating authentication controllers and session routes in Express APIs. Use when user asks to 'create login route', 'add authentication endpoint', 'build session controller', 'implement auth route', or 'setup sessions'. Applies structure: SessionsController class with async create method, dedicated sessions-routes file using Router, registration in main index with public route prefix. Make sure to use this skill whenever adding authentication endpoints to Express apps. Not for JWT token generation, password hashing, or middleware guards."
---

# Controller e Rota de Autenticação (Express)

> Crie controllers de autenticação como classes com métodos assíncronos, rotas dedicadas com Router, e registre no index como rota pública.

## Rules

1. **Nomeie o controller como `SessionsController`** — `sessions-controller.ts`, porque "session" representa o conceito de autenticação (criar sessão = login)
2. **Use classe com método assíncrono `create`** — não use funções soltas, porque a classe agrupa operações relacionadas e o método `create` segue a convenção REST
3. **Tipage request e response do Express** — importe `Request` e `Response` do Express, porque garante autocomplete e type safety
4. **Crie arquivo de rotas dedicado** — `sessions-routes.ts` separado, porque isola rotas de autenticação das demais
5. **Instancie o controller dentro do arquivo de rotas** — `new SessionsController()`, porque mantém a instância próxima do uso
6. **Registre como rota pública no index** — `routes.use("/sessions", sessionsRoutes)`, porque autenticação não exige token prévio

## Steps

### Step 1: Criar o controller

```typescript
// src/controllers/sessions-controller.ts
import { Request, Response } from "express"

class SessionsController {
  async create(request: Request, response: Response) {
    return response.json({ message: "ok" })
  }
}

export { SessionsController }
```

### Step 2: Criar as rotas de sessão

```typescript
// src/routes/sessions-routes.ts
import { Router } from "express"
import { SessionsController } from "../controllers/sessions-controller"

const sessionsRoutes = Router()
const sessionsController = new SessionsController()

sessionsRoutes.post("/", sessionsController.create)

export { sessionsRoutes }
```

### Step 3: Registrar no index de rotas

```typescript
// src/routes/index.ts
import { sessionsRoutes } from "./sessions-routes"

// Rota pública (não exige autenticação)
routes.use("/sessions", sessionsRoutes)
```

### Step 4: Testar no Insomnia

1. Criar pasta "Sessions" no Insomnia
2. Configurar Environment com `resource: "sessions"`
3. Criar request POST para `{{base_url}}/{{resource}}`
4. Enviar e validar resposta `{ "message": "ok" }`

## Output format

```
src/
├── controllers/
│   └── sessions-controller.ts   # Classe com método create
├── routes/
│   ├── sessions-routes.ts       # Router dedicado
│   └── index.ts                 # Registro da rota pública
```

## Heuristics

| Situação | Faça |
|----------|------|
| Endpoint de login/autenticação | Use `sessions` como nome do recurso REST |
| Controller de autenticação | Classe `SessionsController` com método `create` |
| Rota de autenticação | POST na raiz (`/`) do Router dedicado |
| Registro no index | Rota pública, sem middleware de auth |

## Anti-patterns

| Nunca faça | Faça em vez disso |
|------------|-------------------|
| `app.post("/login", ...)` direto no app | Router dedicado `sessionsRoutes.post("/", ...)` |
| `authController` / `loginController` | `SessionsController` (REST: criar sessão = login) |
| Função solta `createSession()` | Método `create` em classe `SessionsController` |
| Registrar auth como rota protegida | Registrar como rota pública (não exige token) |
| Request/Response sem tipagem | `request: Request, response: Response` do Express |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre convenção de sessions e organização de rotas
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações