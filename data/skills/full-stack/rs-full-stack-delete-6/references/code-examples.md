# Code Examples: Prisma Delete

## Exemplo base da aula

```typescript
// Rota definida com parametro :id
app.delete('/questions/:id', async (request, reply) => {
  const { id } = request.params

  await prisma.question.delete({
    where: { id }
  })

  return reply.status(204).send()
})
```

## Variacao: retornando o registro deletado

```typescript
app.delete('/questions/:id', async (request, reply) => {
  const { id } = request.params

  const deletedQuestion = await prisma.question.delete({
    where: { id }
  })

  return reply.send(deletedQuestion)
})
```

O `prisma.delete()` retorna o registro que foi deletado, util se quiser confirmar ao cliente o que foi removido.

## Variacao: com tratamento de erro

```typescript
app.delete('/questions/:id', async (request, reply) => {
  const { id } = request.params

  try {
    await prisma.question.delete({
      where: { id }
    })

    return reply.status(204).send()
  } catch (error) {
    if (error.code === 'P2025') {
      return reply.status(404).send({ message: 'Question not found' })
    }
    throw error
  }
})
```

O codigo `P2025` do Prisma indica que o registro nao foi encontrado.

## Variacao: delete com relacoes (cascade)

Se o modelo tem relacoes, configure no schema:

```prisma
model Question {
  id      String   @id @default(uuid())
  title   String
  answers Answer[]
}

model Answer {
  id         String   @id @default(uuid())
  content    String
  question   Question @relation(fields: [questionId], references: [id], onDelete: Cascade)
  questionId String
}
```

Com `onDelete: Cascade`, deletar uma Question automaticamente deleta todos os Answers relacionados.

## Testando no Insomnia

1. Duplique a requisicao de update
2. Renomeie para "Remove"
3. Troque o metodo para `DELETE`
4. Remova o body (selecione "No Body")
5. Mantenha o ID na URL: `http://localhost:3333/questions/{id}`
6. Clique Send — deve retornar 204

## Verificacao pos-delete

```bash
# Via API — listar registros
GET http://localhost:3333/questions

# Via Prisma Studio
npx prisma studio
# Abra no navegador e verifique a tabela Question
```