# Code Examples: Rota e Controller de Sessao da Mesa

## Exemplo completo do controller

```typescript
// src/controllers/tables-sessions-controller.ts
import { Request, Response, NextFunction } from "express"

class TablesSessionsController {
  async create(request: Request, response: Response, next: NextFunction) {
    try {
      // Versao inicial de teste (sem logica de banco)
      return response.status(201).json()
    } catch (error) {
      next(error)
    }
  }
}

export { TablesSessionsController }
```

## Exemplo completo do arquivo de rotas

```typescript
// src/routes/tables-sessions-routes.ts
import { Router } from "express"
import { TablesSessionsController } from "../controllers/tables-sessions-controller"

const tablesSessionsRoutes = Router()
const tablesSessionsController = new TablesSessionsController()

tablesSessionsRoutes.post("/", tablesSessionsController.create)

export { tablesSessionsRoutes }
```

## Registro no index

```typescript
// src/routes/index.ts
import { Router } from "express"
import { tablesRoutes } from "./tables-routes"
import { tablesSessionsRoutes } from "./tables-sessions-routes"

const routes = Router()

routes.use("/tables", tablesRoutes)
routes.use("/tables-sessions", tablesSessionsRoutes)

export { routes }
```

## Variacao: Controller com multiplos metodos

```typescript
// src/controllers/tables-sessions-controller.ts
import { Request, Response, NextFunction } from "express"

class TablesSessionsController {
  async create(request: Request, response: Response, next: NextFunction) {
    try {
      return response.status(201).json()
    } catch (error) {
      next(error)
    }
  }

  async index(request: Request, response: Response, next: NextFunction) {
    try {
      return response.status(200).json()
    } catch (error) {
      next(error)
    }
  }

  async update(request: Request, response: Response, next: NextFunction) {
    try {
      return response.status(200).json()
    } catch (error) {
      next(error)
    }
  }
}

export { TablesSessionsController }
```

## Variacao: Arquivo de rotas com multiplos endpoints

```typescript
// src/routes/tables-sessions-routes.ts
import { Router } from "express"
import { TablesSessionsController } from "../controllers/tables-sessions-controller"

const tablesSessionsRoutes = Router()
const tablesSessionsController = new TablesSessionsController()

tablesSessionsRoutes.post("/", tablesSessionsController.create)
tablesSessionsRoutes.get("/", tablesSessionsController.index)
tablesSessionsRoutes.patch("/:id", tablesSessionsController.update)

export { tablesSessionsRoutes }
```

## Padrao generico para qualquer recurso

Para criar um novo recurso, substituir `TablesSession` pelo nome do recurso:

```typescript
// 1. Controller: src/controllers/{recurso}-controller.ts
import { Request, Response, NextFunction } from "express"

class {Recurso}Controller {
  async create(request: Request, response: Response, next: NextFunction) {
    try {
      return response.status(201).json()
    } catch (error) {
      next(error)
    }
  }
}

export { {Recurso}Controller }

// 2. Routes: src/routes/{recurso}-routes.ts
import { Router } from "express"
import { {Recurso}Controller } from "../controllers/{recurso}-controller"

const {recurso}Routes = Router()
const {recurso}Controller = new {Recurso}Controller()

{recurso}Routes.post("/", {recurso}Controller.create)

export { {recurso}Routes }

// 3. Index: adicionar em src/routes/index.ts
import { {recurso}Routes } from "./{recurso}-routes"
routes.use("/{recurso-kebab}", {recurso}Routes)
```

## Teste com cliente HTTP

Configuracao da requisicao de teste:
- **Metodo:** POST
- **URL:** `{{baseURL}}/tables-sessions`
- **Body:** nenhum (para teste inicial)
- **Resposta esperada:** Status 201 com body vazio