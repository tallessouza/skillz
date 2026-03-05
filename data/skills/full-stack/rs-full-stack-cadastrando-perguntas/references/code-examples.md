# Code Examples: Cadastrando Perguntas com Prisma

## Exemplo 1: Controller completo da aula

```typescript
// questions-controller.ts
import { prisma } from "@prisma"

export class QuestionsController {
  async create(request, reply) {
    const { title, content, user_id } = request.body

    const question = await prisma.questions.create({
      data: {
        title,
        content,
        user_id,
      },
    })

    return reply.status(201).send(question)
  }

  async list(request, reply) {
    // implementado em outra aula
  }

  async update(request, reply) {
    // implementado em outra aula
  }

  async delete(request, reply) {
    // implementado em outra aula
  }
}
```

## Exemplo 2: Rota conectando ao controller

```typescript
// routes/questions.ts
import { QuestionsController } from "./questions-controller"

const questionsController = new QuestionsController()

// POST /questions -> create
router.post("/questions", questionsController.create)
```

## Exemplo 3: Body JSON enviado pelo Insomnia

```json
{
  "title": "Como Prisma ORM",
  "content": "Como inserir no banco com o Prisma",
  "user_id": "abc123-uuid-do-usuario-existente"
}
```

## Exemplo 4: Resposta esperada apos create

```json
{
  "id": "generated-uuid",
  "title": "Como Prisma ORM",
  "content": "Como inserir no banco com o Prisma",
  "user_id": "abc123-uuid-do-usuario-existente",
  "created_at": "2024-01-15T10:30:00.000Z",
  "updated_at": "2024-01-15T10:30:00.000Z"
}
```

## Exemplo 5: Variacao com connect (alternativa ao user_id direto)

```typescript
const question = await prisma.questions.create({
  data: {
    title,
    content,
    user: {
      connect: { id: user_id },
    },
  },
})
```

## Exemplo 6: Variacao com validacao basica

```typescript
async create(request, reply) {
  const { title, content, user_id } = request.body

  if (!title || !content || !user_id) {
    return reply.status(400).send({ error: "Missing required fields" })
  }

  const question = await prisma.questions.create({
    data: {
      title,
      content,
      user_id,
    },
  })

  return reply.status(201).send(question)
}
```

## Exemplo 7: Prisma Client centralizado (importado nos controllers)

```typescript
// prisma.ts (ou lib/prisma.ts)
import { PrismaClient } from "@prisma/client"

export const prisma = new PrismaClient()
```