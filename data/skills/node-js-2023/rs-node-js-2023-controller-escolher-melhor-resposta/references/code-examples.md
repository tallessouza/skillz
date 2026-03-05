# Code Examples: Controller Escolher Melhor Resposta

## Estrutura completa do controller

```typescript
// choose-question-best-answer.controller.ts
import { Controller, HttpCode, Param, Patch } from '@nestjs/common'
import { ChooseQuestionBestAnswerUseCase } from '@/domain/forum/application/use-cases/choose-question-best-answer'

@Controller('/answers/:answerId')
export class ChooseQuestionBestAnswerController {
  constructor(
    private chooseQuestionBestAnswer: ChooseQuestionBestAnswerUseCase,
  ) {}

  @Patch('/choose-as-best')
  @HttpCode(204)
  async handle(@Param('answerId') answerId: string) {
    await this.chooseQuestionBestAnswer.execute({
      answerId,
    })
  }
}
```

### O que foi removido do editQuestion original:
- `@Body()` e pipe de validacao (nao ha body)
- Schema Zod de validacao (nao ha payload)
- Variavel `title` e `attachments` (nao se aplicam)
- `@Put()` substituido por `@Patch()`

## Teste E2E completo

```typescript
// choose-question-best-answer.controller.e2e-spec.ts
describe('Choose question best answer (E2E)', () => {
  // ... setup com app, prisma, factories, jwt

  test('[PATCH] /answers/:answerId/choose-as-best', async () => {
    // 1. Criar question
    const question = await questionFactory.makePrismaQuestion({
      authorId: user.id,
    })

    // 2. Criar answer vinculada a question
    const answer = await answerFactory.makePrismaAnswer({
      authorId: user.id,
      questionId: question.id,
    })

    // 3. Executar PATCH
    const response = await request(app.getHttpServer())
      .patch(`/answers/${answer.id.toString()}/choose-as-best`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    // 4. Verificar status
    expect(response.statusCode).toBe(204)

    // 5. Verificar efeito colateral no banco
    const questionOnDatabase = await prisma.question.findFirst({
      where: { id: question.id.toString() },
    })

    expect(questionOnDatabase?.bestAnswerId).toEqual(answer.id.toString())
  })
})
```

### Anatomia do teste:
1. **Setup**: cria question e answer (dados necessarios)
2. **Acao**: PATCH sem body (apenas param na URL)
3. **Assertion HTTP**: status 204
4. **Assertion de persistencia**: busca question e valida bestAnswerId

## Registro no HttpModule

```typescript
// http.module.ts
@Module({
  controllers: [
    // ... outros controllers
    ChooseQuestionBestAnswerController,
  ],
  providers: [
    // ... outros providers
    ChooseQuestionBestAnswerUseCase,
  ],
})
export class HttpModule {}
```

## Use case com Injectable

```typescript
// choose-question-best-answer.ts (use case)
import { Injectable } from '@nestjs/common'

@Injectable()
export class ChooseQuestionBestAnswerUseCase {
  // ... implementacao do use case
}
```

## Padrao aplicavel: outros endpoints de selecao

O mesmo padrao se aplica a qualquer "escolher/selecionar/favoritar":

```typescript
// Marcar resposta como aceita (Stack Overflow style)
@Patch('/choose-as-accepted')

// Favoritar um post
@Patch('/favorite')

// Destacar um comentario
@Patch('/pin')
```

Todos seguem: PATCH + 204 + ID do recurso filho na rota + sem body.