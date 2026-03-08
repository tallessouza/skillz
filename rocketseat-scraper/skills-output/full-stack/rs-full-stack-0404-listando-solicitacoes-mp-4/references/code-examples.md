# Code Examples: Listando e Filtrando Dados com Prisma

## Exemplo 1: Listagem básica sem filtro

```typescript
// Ponto de partida — apenas lista tudo
async function index(request, response) {
  const refunds = await prisma.refund.findMany()
  return response.json(refunds)
}
```

Resultado: array com todos os refunds, sem dados de usuário, sem ordem específica.

## Exemplo 2: Validação de query params com Zod

```typescript
const querySchema = z.object({
  name: z.string().optional().default(""),
})

// Parse valida e aplica defaults
const { name } = querySchema.parse(request.query)
// Se ?name=Rodrigo → name = "Rodrigo"
// Se ?name= → name = ""
// Se sem param → name = ""
```

## Exemplo 3: Filtro por campo de relação com contains

```typescript
const refunds = await prisma.refund.findMany({
  where: {
    user: {
      name: {
        contains: name.trim(),
      },
    },
  },
})
```

Testa com `?name=Rodrigo` → retorna apenas refunds do Rodrigo.
Testa com `?name=João` → retorna apenas refunds do João.
Testa sem parâmetro → `contains: ""` retorna todos.

## Exemplo 4: Include para trazer dados da relação

```typescript
const refunds = await prisma.refund.findMany({
  where: {
    user: {
      name: {
        contains: name.trim(),
      },
    },
  },
  include: {
    user: true,
  },
})
```

Resultado agora inclui objeto `user` dentro de cada refund:
```json
[
  {
    "id": "...",
    "description": "Uber para palestra",
    "category": "transporte",
    "amount": 4590,
    "filename": "...",
    "createdAt": "...",
    "user": {
      "id": "...",
      "name": "João",
      "email": "joao@email.com",
      "role": "employee"
    }
  }
]
```

## Exemplo 5: Ordenação por data

```typescript
const refunds = await prisma.refund.findMany({
  where: {
    user: {
      name: {
        contains: name.trim(),
      },
    },
  },
  include: {
    user: true,
  },
  orderBy: {
    createdAt: "desc", // mais recente primeiro
  },
})
```

Com `asc`: Rodrigo (criado primeiro) aparece no topo.
Com `desc`: João (criado por último) aparece no topo.

## Exemplo 6: Código final completo da aula

```typescript
import { z } from "zod"
import { prisma } from "@/database/prisma"

async function index(request, response) {
  const querySchema = z.object({
    name: z.string().optional().default(""),
  })

  const { name } = querySchema.parse(request.query)

  const refunds = await prisma.refund.findMany({
    where: {
      user: {
        name: {
          contains: name.trim(),
        },
      },
    },
    include: {
      user: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  })

  return response.json(refunds)
}
```

## Variações úteis

### Filtro por múltiplos campos

```typescript
const refunds = await prisma.refund.findMany({
  where: {
    AND: [
      { user: { name: { contains: name.trim() } } },
      { category: category || undefined },
    ],
  },
  include: { user: true },
  orderBy: { createdAt: "desc" },
})
```

### Selecionar apenas campos específicos do include

```typescript
include: {
  user: {
    select: {
      name: true,
      email: true,
    },
  },
}
```

### Paginação com skip e take

```typescript
const refunds = await prisma.refund.findMany({
  where: { ... },
  include: { user: true },
  orderBy: { createdAt: "desc" },
  skip: (page - 1) * perPage,
  take: perPage,
})
```

### Contagem total para paginação

```typescript
const [refunds, total] = await Promise.all([
  prisma.refund.findMany({
    where: { ... },
    skip: (page - 1) * perPage,
    take: perPage,
  }),
  prisma.refund.count({
    where: { ... },
  }),
])
```