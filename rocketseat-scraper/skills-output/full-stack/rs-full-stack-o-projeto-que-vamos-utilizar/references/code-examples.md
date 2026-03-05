# Code Examples: Estrutura de Projeto Express para Autenticação

## Estrutura completa do projeto starter

### package.json (dependências esperadas)

```json
{
  "scripts": {
    "dev": "tsx watch src/server.ts"
  },
  "dependencies": {
    "express": "^4.x"
  },
  "devDependencies": {
    "typescript": "^5.x",
    "tsx": "^4.x",
    "@types/express": "^4.x"
  }
}
```

### src/server.ts

```typescript
import express from "express"
import { routes } from "./routes"

const app = express()
const PORT = 3333

// JSON parsing — DEVE vir antes das rotas
app.use(express.json())

// Rotas da aplicação
app.use(routes)

// Error handler — DEVE vir depois das rotas
app.use((error: Error, request: express.Request, response: express.Response, next: express.NextFunction) => {
  console.error(error)
  return response.status(500).json({ message: "Internal server error" })
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
```

### src/routes/index.ts

```typescript
import { Router } from "express"
import { SessionsController } from "../controllers/sessions-controller"
import { ProductsController } from "../controllers/products-controller"

const routes = Router()

const sessionsController = new SessionsController()
const productsController = new ProductsController()

// Login = criar sessão
routes.post("/sessions", sessionsController.create)

// Produtos (serão protegidas por auth depois)
routes.get("/products", productsController.index)
routes.post("/products", productsController.create)

export { routes }
```

### src/controllers/sessions-controller.ts

```typescript
import { Request, Response } from "express"

export class SessionsController {
  async create(request: Request, response: Response) {
    // Placeholder — auth será implementado nas próximas aulas
    return response.json({ message: "ok" })
  }
}
```

### src/controllers/products-controller.ts

```typescript
import { Request, Response } from "express"

export class ProductsController {
  async index(request: Request, response: Response) {
    // Placeholder — listagem será implementada depois
    return response.json({ message: "products" })
  }

  async create(request: Request, response: Response) {
    // Placeholder — criação será implementada depois
    return response.json({ message: "created" })
  }
}
```

## Configuração do Insomnia para testar

### Estrutura de requests

```
Collection: auth-project
├── sessions/
│   └── POST login         → POST http://localhost:3333/sessions
└── products/
    ├── GET index           → GET  http://localhost:3333/products
    └── POST create         → POST http://localhost:3333/products
```

### Testando cada rota

```bash
# Testar login (sessions)
curl -X POST http://localhost:3333/sessions
# Esperado: { "message": "ok" }

# Testar listagem de produtos
curl -X GET http://localhost:3333/products
# Esperado: { "message": "products" }

# Testar criação de produto
curl -X POST http://localhost:3333/products
# Esperado: { "message": "created" }
```

## Variações do padrão

### Adicionando mais recursos ao mesmo padrão

```typescript
// Se precisar adicionar um recurso "users" para cadastro:
import { UsersController } from "../controllers/users-controller"
const usersController = new UsersController()
routes.post("/users", usersController.create)

// Se precisar de logout:
routes.delete("/sessions", sessionsController.delete)
```

### Controller com todos os métodos REST

```typescript
export class ProductsController {
  // GET /products
  async index(request: Request, response: Response) {}

  // GET /products/:id
  async show(request: Request, response: Response) {}

  // POST /products
  async create(request: Request, response: Response) {}

  // PUT /products/:id
  async update(request: Request, response: Response) {}

  // DELETE /products/:id
  async delete(request: Request, response: Response) {}
}
```

### Mapeamento HTTP → Controller method

| HTTP Method | Route | Controller Method | Ação |
|-------------|-------|-------------------|------|
| GET | /resources | index | Listar todos |
| GET | /resources/:id | show | Detalhar um |
| POST | /resources | create | Criar novo |
| PUT | /resources/:id | update | Atualizar |
| DELETE | /resources/:id | delete | Remover |