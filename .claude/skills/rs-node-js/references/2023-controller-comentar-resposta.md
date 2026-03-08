---
name: rs-node-js-2023-controller-comentar-resposta
description: "Generates NestJS controller and E2E test for commenting on an answer resource, following the copy-and-adapt pattern from an existing comment-on-question controller. Use when user asks to 'create comment on answer endpoint', 'add answer comment controller', 'implement comment on answer in NestJS', or 'create a similar controller by copying'. Make sure to use this skill whenever creating a new NestJS controller that mirrors an existing one with minor entity changes. Not for creating controllers from scratch, service logic, or non-NestJS frameworks."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: node-js-2023
  module: nestjs-clean-architecture
  tags: [nestjs, controller, clean-architecture, e2e-test, rest-api]
  mind-lenses: [LT_01, LT_02, MF_01, GB_01, TH_04]
---

# Controller: Comentar Resposta (NestJS)

> Ao criar um controller que espelha outro existente, copie o original e substitua sistematicamente a entidade, o ID e o use case — nunca reescreva do zero.

## Rules

1. **Copie o controller existente como base** — `commentOnQuestion` → `commentOnAnswer`, porque reescrever do zero introduz inconsistencias com o padrao ja estabelecido
2. **Substitua a entidade em todas as camadas** — rota, parametro, use case e import, porque uma substituicao parcial causa bugs silenciosos
3. **Mantenha a mesma estrutura de body** — se o original recebe `content`, o novo tambem recebe `content`, porque a API deve ser consistente entre recursos similares
4. **Registre no HttpModule** — adicione o controller E o use case no module, porque NestJS nao descobre automaticamente
5. **Crie o teste E2E junto com o controller** — nunca commite controller sem teste, porque o teste valida a integracao completa

## How to write

### Controller (copy-and-adapt)

```typescript
// comment-on-answer.controller.ts
@Controller('/answers/:answerId/comments')
export class CommentOnAnswerController {
  constructor(private commentOnAnswer: CommentOnAnswerUseCase) {}

  @Post()
  async handle(
    @Param('answerId') answerId: string,
    @Body() body: { content: string },
    @CurrentUser() user: UserPayload,
  ) {
    await this.commentOnAnswer.execute({
      answerId,
      authorId: user.sub,
      content: body.content,
    })
  }
}
```

### Teste E2E

```typescript
// comment-on-answer.controller.e2e-spec.ts
it('should create a comment on answer', async () => {
  const question = await questionFactory.makeQuestion()
  const answer = await answerFactory.makeAnswer({ questionId: question.id })

  const response = await request(app.getHttpServer())
    .post(`/answers/${answer.id}/comments`)
    .set('Authorization', `Bearer ${accessToken}`)
    .send({ content: 'new comment' })

  expect(response.statusCode).toBe(201)

  const commentOnDb = await prisma.comment.findFirst({
    where: { content: 'new comment' },
  })
  expect(commentOnDb).toBeTruthy()
})
```

### Registro no Module

```typescript
// http.module.ts
@Module({
  controllers: [
    // ... existing controllers
    CommentOnAnswerController,
  ],
  providers: [
    // ... existing providers
    CommentOnAnswerUseCase,
  ],
})
export class HttpModule {}
```

## Example

**Before (commentOnQuestion como base):**
```typescript
@Controller('/questions/:questionId/comments')
export class CommentOnQuestionController {
  constructor(private commentOnQuestion: CommentOnQuestionUseCase) {}

  @Post()
  async handle(@Param('questionId') questionId: string, ...) {
    await this.commentOnQuestion.execute({ questionId, ... })
  }
}
```

**After (adaptado para answer):**
```typescript
@Controller('/answers/:answerId/comments')
export class CommentOnAnswerController {
  constructor(private commentOnAnswer: CommentOnAnswerUseCase) {}

  @Post()
  async handle(@Param('answerId') answerId: string, ...) {
    await this.commentOnAnswer.execute({ answerId, ... })
  }
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Controller novo com mesma estrutura de outro | Copie e substitua entidade sistematicamente |
| Teste E2E precisa de entidade pai | Crie via factory (question → answer → comment) |
| Body identico ao original | Mantenha identico, so mude rota e param |
| Use case ja existe no domain | So importe e adicione `@Injectable()` |

## Anti-patterns

| Nunca faca | Faca assim |
|------------|------------|
| Reescrever controller do zero quando existe similar | Copie e adapte com find-replace |
| Esquecer de registrar no HttpModule | Sempre adicione controller + use case no module |
| Criar controller sem teste E2E | Crie ambos no mesmo commit |
| Substituir parcialmente (rota sim, param nao) | Use replace-all para trocar `question` → `answer` |
| Testar sem a factory da entidade pai | Importe e use answer factory no teste |

## Troubleshooting

### Erro inesperado ao seguir este padrao
**Symptom:** Codigo segue o padrao mas comportamento nao e o esperado
**Cause:** Dependencia nao registrada no modulo ou configuracao incompleta
**Fix:** Verificar registro completo no modulo (controllers, providers, imports) e dependencias instaladas

## Deep reference library

- [deep-explanation.md](../../../data/skills/node-js-2023/rs-node-js-2023-controller-comentar-resposta/references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](../../../data/skills/node-js-2023/rs-node-js-2023-controller-comentar-resposta/references/code-examples.md) — Todos os exemplos de código expandidos com variações
