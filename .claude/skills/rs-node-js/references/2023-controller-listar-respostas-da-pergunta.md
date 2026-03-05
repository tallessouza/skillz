---
name: rs-node-js-2023-controller-listar-respostas
description: "Applies NestJS controller pattern for listing nested resources (e.g., answers of a question) with presenter, param extraction, and e2e test. Use when user asks to 'create a list endpoint', 'fetch nested resources', 'list answers', 'list comments', or 'create a controller for child entities'. Make sure to use this skill whenever building GET endpoints that list child resources by parent ID in NestJS. Not for creating, updating, or deleting resources, nor for authentication or middleware setup."
---

# Controller: Listar Recursos Filhos no NestJS

> Ao criar um controller de listagem de recursos filhos, siga o padrao: controller com param do pai + use case + presenter + e2e test.

## Rules

1. **Extraia o ID do pai via @Param** — `@Param('questionId') questionId: string`, porque o recurso filho depende do contexto do pai
2. **Crie um Presenter separado para cada entidade** — `AnswerPresenter.toHttp(answer)`, porque a resposta da API nunca deve expor a entidade de dominio diretamente
3. **Retorne sempre via .map no presenter** — `answers.map(AnswerPresenter.toHttp)`, porque garante transformacao consistente de todos os itens
4. **Registre controller E use case no HttpModule** — ambos devem estar no array do module, porque NestJS nao resolve dependencias nao registradas
5. **Adicione @Injectable() no use case** — sem isso o NestJS nao consegue injetar o use case no controller
6. **Comece simples, evolua depois** — presenter inicial com campos basicos, adicione relacionamentos (autor, etc.) quando necessario

## How to write

### Controller de listagem de recursos filhos

```typescript
@Controller('/questions/:questionId/answers')
export class FetchQuestionAnswersController {
  constructor(
    private fetchQuestionAnswers: FetchQuestionAnswersUseCase,
  ) {}

  @Get()
  async handle(
    @Param('questionId') questionId: string,
    @Query('page', queryValidationPipe) page: PageQueryParamSchema,
  ) {
    const result = await this.fetchQuestionAnswers.execute({
      questionId,
      page,
    })

    const answers = result.value.answers

    return { answers: answers.map(AnswerPresenter.toHttp) }
  }
}
```

### Presenter basico

```typescript
export class AnswerPresenter {
  static toHttp(answer: Answer) {
    return {
      id: answer.id.toString(),
      content: answer.content,
      createdAt: answer.createdAt,
      updatedAt: answer.updatedAt,
    }
  }
}
```

### Registro no HttpModule

```typescript
@Module({
  controllers: [
    // ...existing controllers
    FetchQuestionAnswersController,
  ],
  providers: [
    // ...existing providers
    FetchQuestionAnswersUseCase,
  ],
})
export class HttpModule {}
```

## Example

**Before (retornando entidade direto):**
```typescript
return { answers }
```

**After (com presenter):**
```typescript
return { answers: answers.map(AnswerPresenter.toHttp) }
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Recurso filho listado por ID do pai | Rota: `/parents/:parentId/children` com @Param |
| Listagem retorna dados da API | Sempre usar Presenter.toHttp() |
| Precisa de dados de relacionamento (autor, etc.) | Evoluir presenter depois, nao bloquear a feature |
| Novo controller criado | Registrar no module (controller + use case) |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `return { answers }` (entidade crua) | `return { answers: answers.map(AnswerPresenter.toHttp) }` |
| ID do pai hardcoded ou via body em GET | `@Param('questionId') questionId: string` |
| Use case sem `@Injectable()` | Adicionar `@Injectable()` no use case |
| Controller criado mas nao registrado no module | Registrar controller E use case no HttpModule |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/node-js/rs-node-js-2023-controller-listar-respostas-da-pergunta/references/deep-explanation.md)
- [Code examples](../../../data/skills/node-js/rs-node-js-2023-controller-listar-respostas-da-pergunta/references/code-examples.md)
