# Code Examples: Middleware Global no Express

## Exemplo 1: Middleware basico com tipagem

```typescript
// src/middlewares/my-middleware.ts
import { Request, Response, NextFunction } from "express"

export function myMiddleware(
  request: Request,
  response: Response,
  next: NextFunction
) {
  console.log("Passou pelo middleware!")
  return next()
}
```

## Exemplo 2: Registro global no servidor

```typescript
// src/server.ts
import express from "express"
import { myMiddleware } from "./middlewares/my-middleware"

const app = express()

// Middleware global — registrado ANTES das rotas
app.use(myMiddleware)

app.post("/products", (request, response) => {
  return response.json({ message: "Product created" })
})

app.get("/products", (request, response) => {
  return response.json(["Product 1", "Product 2"])
})

app.listen(3333, () => {
  console.log("Server running on port 3333")
})
```

## Exemplo 3: Demonstracao da ordem — middleware DEPOIS (bug)

```typescript
// BUG: middleware registrado entre rotas
app.get("/products", (request, response) => {
  return response.json(["Product 1", "Product 2"])
})

// Middleware so afeta rotas registradas DEPOIS dele
app.use(myMiddleware)

app.post("/products", (request, response) => {
  return response.json({ message: "Product created" })
})

// Resultado:
// GET /products  → NAO passa pelo middleware
// POST /products → PASSA pelo middleware
```

## Exemplo 4: Middleware de logging com detalhes da requisicao

```typescript
// src/middlewares/request-logger.ts
import { Request, Response, NextFunction } from "express"

export function requestLogger(
  request: Request,
  response: Response,
  next: NextFunction
) {
  const { method, url } = request
  const timestamp = new Date().toISOString()
  console.log(`[${timestamp}] ${method} ${url}`)
  return next()
}
```

## Exemplo 5: Middleware que interrompe (sem next)

```typescript
// src/middlewares/maintenance-mode.ts
import { Request, Response, NextFunction } from "express"

export function maintenanceMode(
  request: Request,
  response: Response,
  next: NextFunction
) {
  const isMaintenanceMode = process.env.MAINTENANCE === "true"

  if (isMaintenanceMode) {
    // NAO chama next() — interrompe aqui
    return response.status(503).json({
      message: "Sistema em manutencao. Tente novamente mais tarde."
    })
  }

  return next()
}
```

## Exemplo 6: Multiplos middlewares globais

```typescript
import express from "express"
import { requestLogger } from "./middlewares/request-logger"
import { myMiddleware } from "./middlewares/my-middleware"

const app = express()

// Ordem de execucao: requestLogger → myMiddleware → rota
app.use(requestLogger)
app.use(myMiddleware)

app.get("/products", (request, response) => {
  return response.json(["Product 1", "Product 2"])
})
```

## Exemplo 7: Sem tipagem vs com tipagem (comparacao)

```typescript
// SEM tipagem — perde IntelliSense
export function badMiddleware(req: any, res: any, next: any) {
  req. // VSCode nao sabe o que sugerir
  return next()
}

// COM tipagem — IntelliSense completo
import { Request, Response, NextFunction } from "express"

export function goodMiddleware(req: Request, res: Response, next: NextFunction) {
  req. // VSCode mostra: body, params, query, headers, method, url, ...
  return next()
}
```

## Estrutura de pastas resultante

```
src/
├── middlewares/
│   └── my-middleware.ts
└── server.ts
```