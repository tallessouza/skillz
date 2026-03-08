# Code Examples: Controller e Rota de Autenticação

## Exemplo Completo: SessionsController

```typescript
// src/controllers/sessions-controller.ts
import { Request, Response } from "express"

class SessionsController {
  async create(request: Request, response: Response) {
    // Placeholder inicial para validar a estrutura
    return response.json({ message: "ok" })
  }
}

export { SessionsController }
```

## Exemplo Completo: Sessions Routes

```typescript
// src/routes/sessions-routes.ts
import { Router } from "express"
import { SessionsController } from "../controllers/sessions-controller"

const sessionsRoutes = Router()
const sessionsController = new SessionsController()

// POST /sessions — criar sessão (login)
sessionsRoutes.post("/", sessionsController.create)

export { sessionsRoutes }
```

## Exemplo Completo: Index de Rotas

```typescript
// src/routes/index.ts
import { Router } from "express"
import { usersRoutes } from "./users-routes"
import { sessionsRoutes } from "./sessions-routes"

const routes = Router()

// Rotas públicas (sem autenticação)
routes.use("/users", usersRoutes)
routes.use("/sessions", sessionsRoutes)

export { routes }
```

## Variação: Controller com Lógica Real (próximo passo)

```typescript
// Evolução do controller após implementar autenticação
import { Request, Response } from "express"

class SessionsController {
  async create(request: Request, response: Response) {
    const { email, password } = request.body

    // Futura implementação:
    // 1. Buscar usuário pelo email
    // 2. Comparar senha com hash (bcrypt)
    // 3. Gerar token JWT
    // 4. Retornar token e dados do usuário

    return response.json({ token: "jwt-token", user: { email } })
  }
}

export { SessionsController }
```

## Variação: Adicionando DELETE (logout)

```typescript
// Controller com logout
class SessionsController {
  async create(request: Request, response: Response) {
    // login logic
    return response.json({ token: "..." })
  }

  async delete(request: Request, response: Response) {
    // logout logic (invalidar token, limpar refresh token, etc.)
    return response.status(204).send()
  }
}
```

```typescript
// Routes com logout
sessionsRoutes.post("/", sessionsController.create)
sessionsRoutes.delete("/", sessionsController.delete)
```

## Configuração do Insomnia

### Estrutura de pastas
```
API Refund/
├── Users/
│   ├── Environment: { "resource": "users" }
│   └── Create (POST {{base_url}}/{{resource}})
└── Sessions/
    ├── Environment: { "resource": "sessions" }
    └── Create (POST {{base_url}}/{{resource}})
```

### Environment JSON da pasta Sessions
```json
{
  "resource": "sessions"
}
```

### Request Create Session
- **Method:** POST
- **URL:** `{{base_url}}/{{resource}}`
- **Body:** JSON (será preenchido nas próximas aulas com email e password)

### Resposta esperada (placeholder)
```json
{
  "message": "ok"
}
```

## Padrão Completo: Novo Recurso (template)

Para cada novo recurso na API, siga este template:

```typescript
// 1. Controller: src/controllers/{resource}-controller.ts
import { Request, Response } from "express"

class {Resource}Controller {
  async create(request: Request, response: Response) {
    return response.json({ message: "ok" })
  }
}

export { {Resource}Controller }

// 2. Routes: src/routes/{resource}-routes.ts
import { Router } from "express"
import { {Resource}Controller } from "../controllers/{resource}-controller"

const {resource}Routes = Router()
const {resource}Controller = new {Resource}Controller()

{resource}Routes.post("/", {resource}Controller.create)

export { {resource}Routes }

// 3. Index: src/routes/index.ts
import { {resource}Routes } from "./{resource}-routes"
routes.use("/{resource}", {resource}Routes)
```