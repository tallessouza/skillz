# Code Examples: Rotas e Controllers no Express

## Exemplo 1: Controller básico (da aula)

```typescript
// src/controllers/user-controller.ts
import { Request, Response } from "express"

class UserController {
  async create(request: Request, response: Response) {
    return response.json({ message: "ok" })
  }
}

export { UserController }
```

## Exemplo 2: Rotas de usuário (da aula)

```typescript
// src/routes/users-routes.ts
import { Router } from "express"
import { UserController } from "../controllers/user-controller"

const usersRoutes = Router()
const usersController = new UserController()

usersRoutes.post("/", usersController.create)

export { usersRoutes }
```

## Exemplo 3: Index centralizador (da aula)

```typescript
// src/routes/index.ts
import { Router } from "express"
import { usersRoutes } from "./users-routes"

const routes = Router()

// Rotas públicas
routes.use("/users", usersRoutes)

export { routes }
```

## Exemplo 4: Registro no app (da aula)

```typescript
// src/app.ts
import express from "express"
import { routes } from "./routes"

const app = express()
app.use(express.json())
app.use(routes)
```

## Variação: Controller com múltiplos métodos

```typescript
// src/controllers/user-controller.ts
import { Request, Response } from "express"

class UserController {
  async create(request: Request, response: Response) {
    const { name, email, password } = request.body
    // lógica de criação do usuário
    return response.status(201).json({ name, email })
  }

  async show(request: Request, response: Response) {
    const { id } = request.params
    // lógica de busca do usuário
    return response.json({ id })
  }

  async update(request: Request, response: Response) {
    const { id } = request.params
    const { name, email } = request.body
    // lógica de atualização
    return response.json({ id, name, email })
  }

  async delete(request: Request, response: Response) {
    const { id } = request.params
    // lógica de remoção
    return response.status(204).send()
  }
}

export { UserController }
```

## Variação: Rotas com todos os métodos HTTP

```typescript
// src/routes/users-routes.ts
import { Router } from "express"
import { UserController } from "../controllers/user-controller"

const usersRoutes = Router()
const usersController = new UserController()

usersRoutes.post("/", usersController.create)
usersRoutes.get("/:id", usersController.show)
usersRoutes.put("/:id", usersController.update)
usersRoutes.delete("/:id", usersController.delete)

export { usersRoutes }
```

## Variação: Index com múltiplos recursos

```typescript
// src/routes/index.ts
import { Router } from "express"
import { usersRoutes } from "./users-routes"
import { ticketsRoutes } from "./tickets-routes"
import { categoriesRoutes } from "./categories-routes"

const routes = Router()

// Rotas públicas
routes.use("/users", usersRoutes)
routes.use("/categories", categoriesRoutes)

// Rotas que podem precisar de autenticação
routes.use("/tickets", ticketsRoutes)

export { routes }
```

## Variação: Estrutura de pastas completa

```
src/
├── app.ts
├── server.ts
├── controllers/
│   ├── user-controller.ts
│   ├── ticket-controller.ts
│   └── category-controller.ts
└── routes/
    ├── index.ts
    ├── users-routes.ts
    ├── tickets-routes.ts
    └── categories-routes.ts
```

## Configuração do Insomnia

### Variável de ambiente na pasta "Users"

```json
{
  "resource": "users"
}
```

### Request "Create" dentro da pasta

- **Method:** POST
- **URL:** `{{ base_url }}/{{ resource }}`
- **Body:** JSON com dados do usuário

### Padrão para múltiplas requests na mesma pasta

```
📁 Users (resource: "users")
├── 📄 Create  → POST   {{ base_url }}/{{ resource }}
├── 📄 Show    → GET    {{ base_url }}/{{ resource }}/1
├── 📄 Update  → PUT    {{ base_url }}/{{ resource }}/1
└── 📄 Delete  → DELETE {{ base_url }}/{{ resource }}/1
```