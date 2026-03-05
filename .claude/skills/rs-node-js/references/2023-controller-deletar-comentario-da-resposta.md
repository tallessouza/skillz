---
name: rs-node-js-2023-delete-answer-comment-ctrl
description: "Generates NestJS controller and e2e test for deleting answer comments following clean architecture patterns. Use when user asks to 'create a delete controller', 'delete comment endpoint', 'CRUD for comments', or 'NestJS controller for deletion'. Applies pattern: copy similar controller, adapt entity names, register in module, write e2e test with factories. Make sure to use this skill whenever creating DELETE endpoints in NestJS clean architecture projects. Not for business logic, use cases, or domain layer changes."
---

# Controller: Deletar Comentario da Resposta

> Ao criar um controller de delecao em NestJS clean architecture, copie o controller analogo mais proximo, adapte nomes de entidade, registre no modulo HTTP e escreva teste e2e com factories.

## Rules

1. **Copie o controller analogo** — se existe `deleteQuestionComment.controller.ts`, use como base para `deleteAnswerComment.controller.ts`, porque a estrutura HTTP e identica e so muda a entidade
2. **Nomeie arquivo com padrao completo** — `{acao}{Entidade}.controller.ts` e `{acao}{Entidade}.controller.e2e-spec.ts`, porque consistencia de nomes permite busca rapida no codebase
3. **Adapte rota e parametro** — rota muda para `/answers/comments/:id` e o parametro para `answerCommentId`, porque cada entidade tem sua rota REST propria
4. **Registre controller E use case no modulo** — adicione tanto o controller quanto o use case no `http.module.ts`, porque NestJS ignora silenciosamente controllers nao registrados
5. **Use factories especificas no teste** — `AnswerFactory` e `AnswerCommentFactory` no lugar de `QuestionFactory` e `QuestionCommentFactory`, porque o teste precisa criar a cadeia completa de dependencias (question → answer → answerComment)
6. **Verifique o repositorio Prisma** — bugs sutis surgem quando o repositorio Prisma referencia a tabela errada (ex: `comment` vs `question`), porque copiar codigo entre entidades frequentemente deixa referencias antigas

## How to write

### Controller de delecao

```typescript
@Controller('/answers/comments/:id')
export class DeleteAnswerCommentController {
  constructor(private deleteAnswerComment: DeleteAnswerCommentUseCase) {}

  @Delete()
  @HttpCode(204)
  async handle(
    @CurrentUser() user: UserPayload,
    @Param('id') answerCommentId: string,
  ) {
    await this.deleteAnswerComment.execute({
      answerCommentId,
      authorId: user.sub,
    })
  }
}
```

### Registro no HTTP Module

```typescript
// http.module.ts - adicionar nos arrays
controllers: [
  // ... outros controllers
  DeleteAnswerCommentController,
],
providers: [
  // ... outros providers
  DeleteAnswerCommentUseCase,
],
```

### Teste e2e com cadeia de factories

```typescript
let answerFactory: AnswerFactory
let answerCommentFactory: AnswerCommentFactory

// No beforeAll, registrar providers:
providers: [AnswerFactory, AnswerCommentFactory]

// No teste:
const question = await questionFactory.makePrismaQuestion()
const answer = await answerFactory.makePrismaAnswer({
  questionId: question.id,
  authorId: user.id,
})
const answerComment = await answerCommentFactory.makePrismaAnswerComment({
  answerId: answer.id,
  authorId: user.id,
})

const response = await request(app.getHttpServer())
  .delete(`/answers/comments/${answerComment.id}`)
  .set('Authorization', `Bearer ${accessToken}`)

expect(response.statusCode).toBe(204)

const commentOnDatabase = await prisma.comment.findUnique({
  where: { id: answerComment.id.toString() },
})
expect(commentOnDatabase).toBeNull()
```

## Example

**Before (copiou mas nao adaptou):**
```typescript
// Bug: repositorio Prisma deletando da tabela errada
async delete(comment: AnswerComment) {
  await this.prisma.comment.delete({
    where: { id: comment.questionId.toString() }, // ERRADO: referencia question
  })
}
```

**After (adaptado corretamente):**
```typescript
async delete(comment: AnswerComment) {
  await this.prisma.comment.delete({
    where: { id: comment.id.toString() }, // CORRETO: usa comment.id
  })
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Controller de DELETE novo | Copie o DELETE mais similar, adapte entidade |
| Teste retorna 500 inesperado | Verifique repositorio Prisma por referencias a entidade errada |
| Cadeia de dependencias no teste | Crie na ordem: question → answer → answerComment |
| Factory nao existe no teste | Adicione no array de providers do TestingModule |

## Anti-patterns

| Nunca faca | Faca ao inves |
|------------|---------------|
| Criar controller do zero quando existe analogo | Copiar e adaptar controller existente |
| Esquecer de registrar no http.module.ts | Adicionar controller E use case no modulo |
| Usar QuestionCommentFactory para testar AnswerComment | Usar AnswerCommentFactory especifica |
| Ignorar erro 500 no teste | Investigar repositorio Prisma por referencias cruzadas |
| Deixar imports do controller copiado | Limpar imports nao utilizados apos adaptacao |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/node-js/rs-node-js-2023-controller-deletar-comentario-da-resposta/references/deep-explanation.md)
- [Code examples](../../../data/skills/node-js/rs-node-js-2023-controller-deletar-comentario-da-resposta/references/code-examples.md)
