---
name: rs-full-stack-tratando-dados-do-pedido
description: "Enforces Zod request body validation pattern in Express controllers when creating API endpoints. Use when user asks to 'create a controller', 'add validation', 'create an endpoint', 'handle request body', or 'add a route'. Applies pattern: Zod schema parse on req.body, try/catch with next(error), proper route wiring. Make sure to use this skill whenever building Express API endpoints with input validation. Not for frontend form validation, database queries, or authentication middleware."
---

# Validacao de Dados com Zod em Controllers Express

> Toda entrada de dados via request body deve ser validada com Zod schema antes de qualquer logica de negocio.

## Rules

1. **Crie um bodySchema com z.object() no inicio do try** — define o contrato de dados antes de qualquer processamento, porque erros de validacao devem falhar rapido
2. **Use bodySchema.parse(request.body)** — parse lanca ZodError automaticamente, que o catch repassa via next(error)
3. **Sempre envolva em try/catch com next(error)** — porque o Express precisa do next para delegar erros ao middleware de tratamento
4. **Desestruture os campos validados do parse** — `const { tableSessionId, productId, quantity } = bodySchema.parse(request.body)`, porque garante tipagem e validacao simultaneas
5. **Um controller por dominio, um arquivo de rotas por dominio** — `orders-controller.ts` + `orders-routes.ts`, porque mantem responsabilidades separadas e nomes consistentes
6. **Conecte rotas no index com prefixo plural** — `routes.use("/orders", ordersRoutes)`, porque URLs devem ser consistentes e seguir convencao REST

## How to write

### Controller com validacao Zod

```typescript
import { Request, Response, NextFunction } from "express"
import { z } from "zod"

class OrdersController {
  async create(request: Request, response: Response, next: NextFunction) {
    try {
      const bodySchema = z.object({
        tableSessionId: z.number(),
        productId: z.number(),
        quantity: z.number(),
      })

      const { tableSessionId, productId, quantity } = bodySchema.parse(request.body)

      // logica de negocio aqui

      return response.status(201).json({})
    } catch (error) {
      next(error)
    }
  }
}

export { OrdersController }
```

### Arquivo de rotas do dominio

```typescript
import { Router } from "express"
import { OrdersController } from "../controllers/orders-controller"

const ordersRoutes = Router()
const ordersController = new OrdersController()

ordersRoutes.post("/", ordersController.create)

export { ordersRoutes }
```

### Conexao no index de rotas

```typescript
import { ordersRoutes } from "./orders-routes"

routes.use("/orders", ordersRoutes)
```

## Example

**Before (sem validacao):**
```typescript
async create(request: Request, response: Response, next: NextFunction) {
  try {
    const { tableSessionId, productId, quantity } = request.body
    // campos podem ser undefined, string, ou qualquer tipo
    return response.status(201).json({})
  } catch (error) {
    next(error)
  }
}
```

**After (com Zod):**
```typescript
async create(request: Request, response: Response, next: NextFunction) {
  try {
    const bodySchema = z.object({
      tableSessionId: z.number(),
      productId: z.number(),
      quantity: z.number(),
    })

    const { tableSessionId, productId, quantity } = bodySchema.parse(request.body)
    // campos garantidamente number, Zod lanca erro se invalido
    return response.status(201).json({})
  } catch (error) {
    next(error)
  }
}
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Endpoint recebe dados no body | Criar bodySchema com z.object() |
| Endpoint recebe dados em params | Criar paramsSchema com z.object() |
| Campo e ID numerico | Use z.number(), nao z.string() |
| Campo opcional | Use z.number().optional() |
| Novo dominio (orders, products, etc) | Criar controller + routes separados |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `const { id } = request.body` (sem validacao) | `const { id } = bodySchema.parse(request.body)` |
| `if (!tableSessionId) throw new Error(...)` (validacao manual) | `z.object({ tableSessionId: z.number() }).parse(request.body)` |
| `ordersRoutes.post("/", (req, res) => { ... })` (inline handler) | `ordersRoutes.post("/", ordersController.create)` (controller method) |
| `routes.use("/order", ...)` (singular) | `routes.use("/orders", ...)` (plural, consistente) |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre o padrao controller + Zod + rotas
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes