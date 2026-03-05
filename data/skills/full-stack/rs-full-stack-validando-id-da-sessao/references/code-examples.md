# Code Examples: Validando ID de Parametros de Rota com Zod

## Exemplo 1: Controller completo com validacao

```typescript
import { z } from "zod"
import { Request, Response, NextFunction } from "express"

class TablesSessionsController {
  async update(request: Request, response: Response, next: NextFunction) {
    try {
      const id = z
        .string()
        .transform((value) => Number(value))
        .refine((value) => !isNaN(value), {
          message: "id must be a number",
        })
        .parse(request.params.id)

      // Aqui entraria a logica de encerrar a sessao no banco
      return response.json()
    } catch (error) {
      next(error)
    }
  }
}
```

## Exemplo 2: Definicao da rota

```typescript
// tables-sessions.routes.ts
import { Router } from "express"
import { TablesSessionsController } from "../controllers/TablesSessionsController"

const router = Router()
const controller = new TablesSessionsController()

router.post("/sessions", controller.create)      // open
router.get("/sessions", controller.index)         // list
router.patch("/sessions/:id", controller.update)  // close

export { router }
```

## Exemplo 3: Teste no Insomnia

```
# Requisicao com texto (erro)
PATCH http://localhost:3000/sessions/abc
→ 400 { message: "id must be a number" }

# Requisicao com numero valido
PATCH http://localhost:3000/sessions/1
→ 200 {}
```

## Variacao: Schema reutilizavel para ID

```typescript
// schemas/params.ts
export const numericIdParam = z
  .string()
  .transform((value) => Number(value))
  .refine((value) => !isNaN(value), {
    message: "id must be a number",
  })

// Uso em qualquer controller
const id = numericIdParam.parse(request.params.id)
```

## Variacao: Validacao de multiplos params

```typescript
const params = z.object({
  tableId: z.string().transform(Number).refine(v => !isNaN(v), {
    message: "tableId must be a number"
  }),
  sessionId: z.string().transform(Number).refine(v => !isNaN(v), {
    message: "sessionId must be a number"
  }),
}).parse(request.params)

// params.tableId e params.sessionId sao numbers validados
```

## Variacao: Com z.coerce (alternativa mais simples)

```typescript
// Funciona, mas da menos controle sobre erros
const id = z.coerce.number({
  invalid_type_error: "id must be a number"
}).parse(request.params.id)
```