# Code Examples: Estrutura de Projeto API REST com CRUD

## Estrutura completa do projeto

```
orm/
├── .gitignore          # Inclui node_modules
├── package.json
├── tsconfig.json
├── src/
│   ├── server.ts
│   ├── routes/
│   │   ├── index.ts
│   │   ├── user-routes.ts
│   │   └── question-routes.ts
│   └── controllers/
│       ├── user-controller.ts
│       └── question-controller.ts
```

## server.ts — Ponto de entrada

```typescript
import express from "express"
import { router } from "./routes"

const app = express()
app.use(express.json())
app.use(router)

app.listen(3333, () => {
  console.log("HTTP server running on port 3333")
})
```

## routes/index.ts — Centralizador

```typescript
import { Router } from "express"
import { userRoutes } from "./user-routes"
import { questionRoutes } from "./question-routes"

const router = Router()

router.use(userRoutes)
router.use(questionRoutes)

export { router }
```

## routes/user-routes.ts — Rotas de usuario

```typescript
import { Router } from "express"
import * as userController from "../controllers/user-controller"

const router = Router()

router.get("/users", userController.list)
router.post("/users", userController.create)
router.get("/users/:id", userController.show)

export { router as userRoutes }
```

## routes/question-routes.ts — Rotas de perguntas

```typescript
import { Router } from "express"
import * as questionController from "../controllers/question-controller"

const router = Router()

router.get("/questions", questionController.list)
router.post("/questions", questionController.create)
router.put("/questions/:id", questionController.update)
router.delete("/questions/:id", questionController.remove)

export { router as questionRoutes }
```

## controllers/user-controller.ts

```typescript
import { Request, Response } from "express"

export function list(req: Request, res: Response) {
  return res.json([])
}

export function create(req: Request, res: Response) {
  return res.json({})
}

export function show(req: Request, res: Response) {
  return res.json({})
}
```

## controllers/question-controller.ts

```typescript
import { Request, Response } from "express"

export function list(req: Request, res: Response) {
  return res.json([])
}

export function create(req: Request, res: Response) {
  return res.json({})
}

export function update(req: Request, res: Response) {
  return res.json({})
}

export function remove(req: Request, res: Response) {
  return res.json({})
}
```

## Variacao: Adicionando um novo recurso (ex: respostas)

### 1. Criar controller

```typescript
// controllers/answer-controller.ts
import { Request, Response } from "express"

export function list(req: Request, res: Response) {
  return res.json([])
}

export function create(req: Request, res: Response) {
  return res.json({})
}

export function remove(req: Request, res: Response) {
  return res.json({})
}
```

### 2. Criar rotas

```typescript
// routes/answer-routes.ts
import { Router } from "express"
import * as answerController from "../controllers/answer-controller"

const router = Router()

router.get("/questions/:questionId/answers", answerController.list)
router.post("/questions/:questionId/answers", answerController.create)
router.delete("/answers/:id", answerController.remove)

export { router as answerRoutes }
```

### 3. Registrar no index

```typescript
// routes/index.ts
import { Router } from "express"
import { userRoutes } from "./user-routes"
import { questionRoutes } from "./question-routes"
import { answerRoutes } from "./answer-routes"

const router = Router()

router.use(userRoutes)
router.use(questionRoutes)
router.use(answerRoutes)

export { router }
```

## Setup apos clone

```bash
# Clonar o projeto
git clone https://github.com/rocketseat-education/fullstack-orm-template

# Entrar na pasta
cd fullstack-orm-template

# Instalar dependencias (gera node_modules)
npm install
# ou abreviado:
npm i
```