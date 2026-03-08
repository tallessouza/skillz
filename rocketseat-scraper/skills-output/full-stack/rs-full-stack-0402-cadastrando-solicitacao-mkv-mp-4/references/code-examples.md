# Code Examples: Cadastrando Solicitação com Prisma

## Exemplo completo do controller (baseado na aula)

```typescript
import { prisma } from "@/database/prisma"
import { AppError } from "@/utils/AppError"
import { Request, Response } from "express"

class RefundsController {
  async create(request: Request, response: Response) {
    const { name, category, amount, filename } = request.body

    // Double check: garante que o usuário está autenticado
    if (!request.user?.id) {
      throw new AppError("Unauthorized", 401)
    }

    // Cria o registro no banco
    const refund = await prisma.refund.create({
      data: {
        name,
        category,
        amount,
        filename,
        userId: request.user.id,
      },
    })

    // Retorna 201 com a entidade criada
    return response.status(201).json(refund)
  }
}

export { RefundsController }
```

## Variação: Com validação de campos obrigatórios

```typescript
async create(request: Request, response: Response) {
  const { name, category, amount, filename } = request.body

  if (!request.user?.id) {
    throw new AppError("Unauthorized", 401)
  }

  if (!name || !category || !amount) {
    throw new AppError("Missing required fields: name, category, amount", 400)
  }

  const refund = await prisma.refund.create({
    data: {
      name,
      category,
      amount,
      filename,
      userId: request.user.id,
    },
  })

  return response.status(201).json(refund)
}
```

## Variação: Retornando apenas campos específicos com select

```typescript
const refund = await prisma.refund.create({
  data: {
    name,
    category,
    amount,
    filename,
    userId: request.user.id,
  },
  select: {
    id: true,
    name: true,
    category: true,
    amount: true,
    createdAt: true,
  },
})
```

## Variação: Relacionando com o usuário no retorno

```typescript
const refund = await prisma.refund.create({
  data: {
    name,
    category,
    amount,
    filename,
    userId: request.user.id,
  },
  include: {
    user: {
      select: {
        id: true,
        name: true,
        email: true,
      },
    },
  },
})
```

## Teste via Insomnia

**Request:**
```
POST http://localhost:3333/refunds
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Reembolso viagem",
  "category": "transport",
  "amount": 15000,
  "filename": "receipt.pdf"
}
```

**Response (201):**
```json
{
  "id": "clx1abc...",
  "name": "Reembolso viagem",
  "category": "transport",
  "amount": 15000,
  "filename": "receipt.pdf",
  "userId": "clx0xyz...",
  "createdAt": "2024-06-01T10:00:00.000Z",
  "updatedAt": "2024-06-01T10:00:00.000Z"
}
```

## Verificação no Prisma Studio

```bash
npx prisma studio
```

Abra `http://localhost:5555`, navegue até a tabela `Refund` e clique no botão de reload para ver o registro recém-criado.