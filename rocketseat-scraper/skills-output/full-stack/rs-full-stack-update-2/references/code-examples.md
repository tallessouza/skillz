# Code Examples: Update com Prisma ORM

## Exemplo 1: Update basico da aula

```typescript
// Controller de update - extraido diretamente da aula
app.put('/questions/:id', async (request, reply) => {
  // ID vem da URL (parametro de rota)
  const { id } = request.params

  // Apenas campos editaveis vem do body
  const { title, content } = request.body

  // Prisma update com where explicito
  await prisma.question.update({
    data: {
      title,
      content,
    },
    where: {
      id,
    },
  })

  return reply.status(204).send()
})
```

## Exemplo 2: Update com retorno do registro atualizado

```typescript
app.put('/questions/:id', async (request, reply) => {
  const { id } = request.params as { id: string }
  const { title, content } = request.body as { title: string; content: string }

  const updatedQuestion = await prisma.question.update({
    data: { title, content },
    where: { id },
  })

  return reply.status(200).send(updatedQuestion)
})
```

## Exemplo 3: Update parcial (PATCH)

```typescript
// Quando o usuario quer atualizar apenas um campo
app.patch('/questions/:id', async (request, reply) => {
  const { id } = request.params as { id: string }
  const { title, content } = request.body as { title?: string; content?: string }

  await prisma.question.update({
    data: {
      ...(title !== undefined && { title }),
      ...(content !== undefined && { content }),
    },
    where: { id },
  })

  return reply.status(204).send()
})
```

## Exemplo 4: Update com validacao de existencia

```typescript
app.put('/questions/:id', async (request, reply) => {
  const { id } = request.params as { id: string }
  const { title, content } = request.body as { title: string; content: string }

  try {
    await prisma.question.update({
      data: { title, content },
      where: { id },
    })
    return reply.status(204).send()
  } catch (error) {
    // Prisma lanca P2025 se o registro nao existe
    return reply.status(404).send({ message: 'Question not found' })
  }
})
```

## Exemplo 5: Teste no Insomnia (fluxo da aula)

```
# 1. Criar pergunta (POST)
POST /questions
Body: { "title": "Prisma ORM", "content": "Como inserir no banco de dados com Prisma", "userId": "abc123" }

# 2. Copiar o ID retornado

# 3. Atualizar (PUT)
PUT /questions/{id-copiado}
Body: { "title": "Como fazer um insert com o Prisma", "content": "Como inserir no banco de dados com Prisma" }
# Note: userId NAO e enviado no update

# 4. Verificar (GET)
GET /questions
# Confirmar que titulo foi atualizado e userId permanece o mesmo
```

## Estrutura SQL equivalente (para referencia)

```sql
-- O que o Prisma gera por baixo dos panos:
UPDATE "Question"
SET "title" = 'Como fazer um insert com o Prisma',
    "content" = 'Como inserir no banco de dados com Prisma'
WHERE "id" = 'abc123';
```