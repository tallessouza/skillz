---
name: rs-node-2023-controller-editar-resposta
description: "Applies NestJS controller patterns for editing resources following clean architecture. Use when user asks to 'create a controller', 'edit endpoint', 'update route', 'PUT endpoint in NestJS', or 'handle errors in controller'. Enforces route design without unnecessary params, expected-vs-unexpected error handling strategy, and proper e2e test setup with foreign keys. Make sure to use this skill whenever creating or modifying NestJS controllers. Not for service/use-case layer logic, database schema design, or authentication flows."
---

# Controller: Editar Resposta (NestJS Clean Architecture)

> Ao criar controllers de edicao, inclua apenas parametros necessarios na rota e trate apenas erros esperados.

## Rules

1. **Rota so contem IDs necessarios** — `PUT /answers/:id` nao `PUT /questions/:questionId/answers/:id`, porque o questionId nao e necessario para editar uma resposta e polui a rota sem beneficio
2. **Trate apenas erros esperados no controller** — erros como `WrongCredentialsError` no login sao esperados e merecem tratativa especifica; erros como `ResourceNotFoundError` ao editar sao extremamente improvaveis e nao justificam tratativa detalhada no controller, porque para acontecer o usuario teria que deletar o recurso em outra aba e depois tentar editar
3. **Body do PUT contem apenas campos editaveis** — editar resposta recebe apenas `content`, nao `questionId` ou `authorId`, porque esses campos nao mudam na edicao
4. **Retorne 204 para edicoes bem-sucedidas** — sem body de retorno, porque o cliente ja tem os dados que enviou
5. **Em testes e2e, respeite foreign keys** — ao criar registros de teste, garanta que IDs relacionados (authorId, questionId) apontem para registros reais no banco, porque chaves estrangeiras serao validadas

## How to write

### Controller de edicao

```typescript
@Controller('/answers/:id')
@Put()
@HttpCode(204)
async handle(
  @Body(bodyValidationPipe) body: EditAnswerBodySchema,
  @CurrentUser() user: UserPayload,
  @Param('id') answerId: string,
) {
  const { content } = body
  const userId = user.sub

  const result = await this.editAnswer.execute({
    answerId,
    authorId: userId,
    content,
  })

  if (result.isLeft()) {
    throw new BadRequestException()
  }
}
```

### Teste e2e com foreign keys

```typescript
it('[PUT] /answers/:id', async () => {
  const user = await studentFactory.makePrismaStudent()
  const accessToken = jwt.sign({ sub: user.id.toString() })

  const question = await questionFactory.makePrismaQuestion({
    authorId: user.id,
  })

  const answer = await answerFactory.makePrismaAnswer({
    questionId: question.id,
    authorId: user.id,
  })

  const answerId = answer.id.toString()

  const response = await request(app.getHttpServer())
    .put(`/answers/${answerId}`)
    .set('Authorization', `Bearer ${accessToken}`)
    .send({ content: 'New answer content' })

  expect(response.statusCode).toBe(204)

  const answerOnDatabase = await prisma.answer.findFirst({
    where: { id: answer.id.toString() },
  })

  expect(answerOnDatabase.content).toEqual('New answer content')
})
```

## Example

**Before (rota com parametros desnecessarios e tratativa excessiva):**
```typescript
@Controller('/questions/:questionId/answers/:id')
@Put()
async handle(@Param('questionId') questionId: string, @Param('id') answerId: string, @Body() body) {
  const result = await this.editAnswer.execute({ answerId, content: body.content })

  if (result.isLeft()) {
    if (result.value instanceof ResourceNotFoundError) {
      throw new NotFoundException()
    }
    if (result.value instanceof NotAllowedError) {
      throw new ForbiddenException()
    }
    throw new BadRequestException()
  }

  return result.value
}
```

**After (rota limpa, tratativa proporcional):**
```typescript
@Controller('/answers/:id')
@Put()
@HttpCode(204)
async handle(
  @Body(bodyValidationPipe) body: EditAnswerBodySchema,
  @CurrentUser() user: UserPayload,
  @Param('id') answerId: string,
) {
  const result = await this.editAnswer.execute({
    answerId,
    authorId: user.sub,
    content: body.content,
  })

  if (result.isLeft()) {
    throw new BadRequestException()
  }
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| ID na rota e necessario para a operacao | Inclua como `@Param` |
| ID na rota e apenas contexto (questionId ao editar answer) | Remova da rota |
| Erro e esperado no fluxo normal (credenciais erradas) | Trate com resposta HTTP especifica |
| Erro e improvavel no fluxo normal (recurso deletado entre abas) | `BadRequestException` generico basta |
| PUT com sucesso sem retorno de dados | Use `@HttpCode(204)` |
| Teste e2e com entidade que tem foreign key | Crie registros pai primeiro com factories |

## Anti-patterns

| Nunca escreva | Escreva ao inves |
|---------------|-----------------|
| `PUT /questions/:questionId/answers/:id` (id desnecessario) | `PUT /answers/:id` |
| Tratativa individual para cada erro improvavel | `throw new BadRequestException()` generico |
| Teste e2e com IDs aleatorios em foreign keys | Factory criando registros reais no banco |
| Retornar body em PUT de edicao | `@HttpCode(204)` sem retorno |
| `{ content, questionId, authorId }` no body do PUT | `{ content }` — so campos editaveis |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/node-js/rs-node-js-2023-controller-editar-resposta/references/deep-explanation.md)
- [Code examples](../../../data/skills/node-js/rs-node-js-2023-controller-editar-resposta/references/code-examples.md)
