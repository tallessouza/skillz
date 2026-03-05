---
name: rs-node-js-2023-choose-best-answer-ctrl
description: "Generates NestJS controller and e2e test for 'choose best answer' endpoints following clean architecture. Use when user asks to 'create a choose/select best controller', 'implement best answer endpoint', 'create a PATCH endpoint for partial update', or 'pick best answer API'. Applies patterns: PATCH for partial updates, derive parent ID from child entity, 204 No Content response, e2e validation of side effects. Make sure to use this skill whenever building selection/voting endpoints in NestJS clean architecture. Not for full CRUD controllers, GET endpoints, or non-NestJS frameworks."
---

# Controller: Escolher Melhor Resposta (NestJS Clean Architecture)

> Ao criar endpoints de selecao (escolher melhor, favoritar, destacar), use PATCH com 204 No Content e derive o recurso pai a partir do filho.

## Rules

1. **Use PATCH para atualizacoes parciais** — `@Patch()` nao `@Put()`, porque PATCH sinaliza atualizacao de um campo especifico, nao do recurso inteiro
2. **Derive o ID pai do filho** — se Answer ja tem questionId no schema, receba apenas answerId na rota, porque evita redundancia e inconsistencia
3. **Retorne 204 No Content** — `@HttpCode(204)` para operacoes de selecao que nao retornam body, porque o cliente ja sabe o que enviou
4. **Rota semantica no recurso filho** — `/answers/:answerId/choose-as-best` nao `/questions/:questionId/best-answer`, porque a acao parte da resposta
5. **Valide efeito colateral no teste** — busque o recurso pai apos a acao e verifique que o campo foi atualizado, porque testar apenas status code nao garante persistencia
6. **Registre controller e use case no modulo** — adicione ambos no HttpModule e decore o use case com `@Injectable()`, porque NestJS ignora silenciosamente providers nao registrados

## How to write

### Controller

```typescript
@Controller('/answers/:answerId')
export class ChooseQuestionBestAnswerController {
  constructor(private chooseQuestionBestAnswer: ChooseQuestionBestAnswerUseCase) {}

  @Patch('/choose-as-best')
  @HttpCode(204)
  async handle(@Param('answerId') answerId: string) {
    await this.chooseQuestionBestAnswer.execute({ answerId })
  }
}
```

### E2E Test — validar efeito colateral

```typescript
it('[PATCH] /answers/:answerId/choose-as-best', async () => {
  const question = await questionFactory.makePrismaQuestion({ authorId: user.id })
  const answer = await answerFactory.makePrismaAnswer({
    authorId: user.id,
    questionId: question.id,
  })

  const response = await request(app.getHttpServer())
    .patch(`/answers/${answer.id.toString()}/choose-as-best`)
    .set('Authorization', `Bearer ${accessToken}`)
    .send()

  expect(response.statusCode).toBe(204)

  const questionOnDatabase = await prisma.question.findFirst({
    where: { id: question.id.toString() },
  })

  expect(questionOnDatabase?.bestAnswerId).toEqual(answer.id.toString())
})
```

## Example

**Before (abordagem ingenua — rota redundante):**
```typescript
@Put('/questions/:questionId/best-answer')
async handle(
  @Param('questionId') questionId: string,
  @Body() body: { answerId: string },
) {
  await this.useCase.execute({ questionId, answerId: body.answerId })
}
```

**After (com esta skill aplicada):**
```typescript
@Patch('/answers/:answerId/choose-as-best')
@HttpCode(204)
async handle(@Param('answerId') answerId: string) {
  await this.useCase.execute({ answerId })
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Endpoint altera 1 campo de um recurso | Use PATCH, nao PUT |
| Filho ja referencia pai no schema | Receba apenas ID do filho |
| Operacao sem retorno de dados | HttpCode(204), sem body |
| Teste de escrita/atualizacao | Busque recurso no banco e valide campo alterado |
| Novo controller criado | Registre no HttpModule + Injectable no use case |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| `@Put()` para alterar 1 campo | `@Patch()` com rota semantica |
| Receber questionId + answerId quando answer ja tem questionId | Receber apenas answerId |
| Retornar 200 com body vazio | `@HttpCode(204)` sem retorno |
| Testar apenas status code em escrita | Buscar registro no banco e validar campo |
| Esquecer `@Injectable()` no use case | Sempre decorar use cases com `@Injectable()` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
