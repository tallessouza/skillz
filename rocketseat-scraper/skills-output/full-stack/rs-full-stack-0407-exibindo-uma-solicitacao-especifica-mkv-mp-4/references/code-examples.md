# Code Examples: Exibindo uma Solicitação Específica

## Exemplo completo do controller

```typescript
// src/controllers/refunds-controller.ts
import { Request, Response } from "express"
import { z } from "zod"
import { prisma } from "@/database/prisma"

class RefundsController {
  // ... index method ...

  async show(request: Request, response: Response) {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = paramsSchema.parse(request.params)

    const refund = await prisma.refund.findFirst({
      where: { id },
      include: {
        user: true,
      },
    })

    return response.json(refund)
  }
}

export { RefundsController }
```

## Exemplo completo da rota

```typescript
// src/routes/refund-routes.ts
import { Router } from "express"
import { RefundsController } from "@/controllers/refunds-controller"
import { verifyUserAuthorization } from "@/middlewares/verify-user-authorization"

const refundRoutes = Router()
const refundsController = new RefundsController()

// Index - lista todas as solicitações
refundRoutes.get(
  "/",
  verifyUserAuthorization(["employee", "manager"]),
  refundsController.index
)

// Show - exibe uma solicitação específica
refundRoutes.get(
  "/:id",
  verifyUserAuthorization(["employee", "manager"]),
  refundsController.show
)

export { refundRoutes }
```

## Variações do padrão show

### Show com verificação de existência

```typescript
async show(request: Request, response: Response) {
  const paramsSchema = z.object({
    id: z.string().uuid(),
  })

  const { id } = paramsSchema.parse(request.params)

  const refund = await prisma.refund.findFirst({
    where: { id },
    include: { user: true },
  })

  if (!refund) {
    throw new AppError("Refund not found", 404)
  }

  return response.json(refund)
}
```

### Show com filtro por usuário (Employee só vê o seu)

```typescript
async show(request: Request, response: Response) {
  const paramsSchema = z.object({
    id: z.string().uuid(),
  })

  const { id } = paramsSchema.parse(request.params)
  const userId = request.user.id
  const userRole = request.user.role

  const whereClause = userRole === "manager"
    ? { id }
    : { id, userId }

  const refund = await prisma.refund.findFirst({
    where: whereClause,
    include: { user: true },
  })

  if (!refund) {
    throw new AppError("Refund not found", 404)
  }

  return response.json(refund)
}
```

### Show com múltiplas relações incluídas

```typescript
async show(request: Request, response: Response) {
  const paramsSchema = z.object({
    id: z.string().uuid(),
  })

  const { id } = paramsSchema.parse(request.params)

  const refund = await prisma.refund.findFirst({
    where: { id },
    include: {
      user: true,
      logs: {
        orderBy: { createdAt: "desc" },
      },
    },
  })

  return response.json(refund)
}
```

## Testando no Insomnia

### Request configurada

```
Method: GET
URL: {{ base_url }}/refunds/{{ refund_id }}
Headers:
  Authorization: Bearer {{ token }}
```

### Response esperada (sucesso)

```json
{
  "id": "abc123-uuid-here",
  "description": "Reembolso da palestra",
  "amount": 150.00,
  "status": "pending",
  "userId": "user-uuid-here",
  "createdAt": "2024-01-15T10:30:00.000Z",
  "user": {
    "id": "user-uuid-here",
    "name": "João Silva",
    "email": "joao@email.com",
    "role": "employee"
  }
}
```

### Response com UUID inválido

```
URL: {{ base_url }}/refunds/abc123-invalid-x
```

```json
{
  "message": "Validation error",
  "issues": [
    {
      "validation": "uuid",
      "code": "invalid_string",
      "message": "Invalid uuid",
      "path": ["id"]
    }
  ]
}
```