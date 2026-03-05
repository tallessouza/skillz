---
name: rs-node-2023-delete-question-comment-ctrl
description: "Generates NestJS DELETE controller for question comments following Clean Architecture. Use when user asks to 'create delete controller', 'delete comment endpoint', 'remove question comment route', or 'NestJS comment controller'. Applies pattern: copy similar controller, adapt route/use-case/params, register in module, write e2e test. Make sure to use this skill whenever creating DELETE endpoints in NestJS Clean Architecture projects. Not for business logic, use case implementation, or non-NestJS frameworks."
---

# Controller: Deletar Comentario da Pergunta

> Ao criar um controller DELETE em NestJS Clean Architecture, siga o padrao: copiar controller similar, adaptar rota/use-case/params, registrar no module, testar com e2e.

## Rules

1. **Copie um controller DELETE existente como base** — copie o mais similar (ex: `delete-answer-comment`) e adapte, porque a estrutura e identica e evita erros de boilerplate
2. **Prefixe a rota pelo recurso pai** — `questions/comments/:id` nao `comments/:id`, porque deixa claro a qual recurso o comentario pertence
3. **Use apenas o ID do comentario na rota** — nao precisa do ID da pergunta na URL para deletar, porque o use case ja resolve a relacao internamente
4. **Registre controller E use case no module** — adicione ambos no `http.module.ts`, porque NestJS nao injeta automaticamente
5. **Adicione `@Injectable()` no use case** — sem este decorator o NestJS nao consegue fazer dependency injection
6. **No param pipe, use exatamente o nome da rota** — `:commentId` na rota exige `@Param('commentId')`, porque divergencia causa `undefined` silencioso

## How to write

### Controller

```typescript
@Controller('/questions/comments/:commentId')
export class DeleteQuestionCommentController {
  constructor(private deleteQuestionComment: DeleteQuestionCommentUseCase) {}

  @Delete()
  @HttpCode(204)
  async handle(
    @CurrentUser() user: UserPayload,
    @Param('commentId') questionCommentId: string,
  ) {
    const result = await this.deleteQuestionComment.execute({
      questionCommentId,
      authorId: user.sub,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
```

### Registro no Module

```typescript
// http.module.ts
@Module({
  controllers: [
    // ... existentes
    DeleteQuestionCommentController,
  ],
  providers: [
    // ... existentes
    DeleteQuestionCommentUseCase,
  ],
})
```

### Teste E2E

```typescript
test('[DELETE] /questions/comments/:commentId', async () => {
  const user = await studentFactory.makePrismaStudent()
  const accessToken = jwt.sign({ sub: user.id.toString() })

  const question = await questionFactory.makePrismaQuestion({
    authorId: user.id,
  })

  const comment = await questionCommentFactory.makePrismaQuestionComment({
    authorId: user.id,
    questionId: question.id,
  })

  const commentId = comment.id.toString()

  const response = await request(app.getHttpServer())
    .delete(`/questions/comments/${commentId}`)
    .set('Authorization', `Bearer ${accessToken}`)

  expect(response.statusCode).toBe(204)

  const commentOnDatabase = await prisma.comment.findUnique({
    where: { id: commentId },
  })

  expect(commentOnDatabase).toBeNull()
})
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Criar DELETE controller | Copie o DELETE mais similar e adapte |
| Rota envolve recurso aninhado | Prefixe: `/pai/filho/:id` |
| Teste retorna 400 ao inves de 204 | Verifique nome do param na rota vs `@Param()` |
| `resource not found` no use case | Verifique se o param name bate com a rota exatamente |
| Precisa de factory no teste | Crie factory especifica (ex: `QuestionCommentFactory`) |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| `@Param('question_comment')` com rota `:questionCommentId` | Nome identico: `@Param('commentId')` com `:commentId` |
| Esquecer `@Injectable()` no use case | Sempre adicionar decorator antes de registrar no module |
| Criar controller do zero | Copiar similar e adaptar — menos erro |
| Testar sem factory dedicada | Criar factory (ex: `QuestionCommentFactory`) para o recurso |
| Rota `/comments/:id` sem contexto | Rota `/questions/comments/:id` com prefixo do pai |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/node-js/rs-node-js-2023-controller-deletar-comentario-da-pergunta/references/deep-explanation.md)
- [Code examples](../../../data/skills/node-js/rs-node-js-2023-controller-deletar-comentario-da-pergunta/references/code-examples.md)
