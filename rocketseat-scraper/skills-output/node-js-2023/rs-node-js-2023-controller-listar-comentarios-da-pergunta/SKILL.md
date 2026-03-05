---
name: rs-node-js-2023-controller-listar-comentarios
description: "Applies NestJS controller creation pattern for listing related entities with presenters. Use when user asks to 'create a list controller', 'fetch comments endpoint', 'list related resources in NestJS', or 'create a GET endpoint with presenter'. Follows pattern: controller + use case + presenter + e2e test + module registration. Make sure to use this skill whenever creating NestJS controllers that return lists of related entities. Not for service/use case logic, database queries, or non-NestJS REST endpoints."
---

# Controller: Listar Entidades Relacionadas (NestJS)

> Ao criar um controller NestJS que lista entidades relacionadas, siga o padrao: controller + presenter + e2e test + registro no modulo.

## Rules

1. **Copie de controllers similares** — reutilize a estrutura de um controller existente com funcionalidade parecida, porque a consistencia do codebase e mais importante que originalidade
2. **Crie presenters genericos quando possivel** — um `CommentPresenter` serve tanto para question comments quanto answer comments, porque o presenter mapeia props comuns da classe abstrata
3. **Sempre registre no modulo** — adicione o controller E o use case no modulo NestJS, porque esquecer o registro e a causa mais comum de erro silencioso
4. **Crie o e2e test junto** — copie o teste de um controller similar e substitua as factories e rotas, porque testes e2e garantem que o registro no modulo esta correto
5. **Use o ID da entidade pai na rota** — `questions/:questionId/comments`, porque a rota expressa a relacao hierarquica entre entidades
6. **Injectable no use case** — marque o use case com `@Injectable()`, porque sem isso o NestJS nao consegue injetar dependencias

## How to write

### Controller de listagem

```typescript
@Controller('/questions/:questionId/comments')
export class FetchQuestionCommentsController {
  constructor(private fetchQuestionComments: FetchQuestionCommentsUseCase) {}

  @Get()
  async handle(@Param('questionId') questionId: string) {
    const result = await this.fetchQuestionComments.execute({ questionId })

    const comments = result.value.comments

    return { comments: comments.map(CommentPresenter.toHTTP) }
  }
}
```

### Presenter generico

```typescript
export class CommentPresenter {
  static toHTTP(comment: Comment) {
    return {
      id: comment.id.toString(),
      content: comment.content,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
    }
  }
}
```

### Registro no modulo

```typescript
@Module({
  controllers: [
    // ...outros controllers
    FetchQuestionCommentsController,
  ],
  providers: [
    // ...outros providers
    FetchQuestionCommentsUseCase,
  ],
})
```

## Example

**Processo de criacao (passo a passo):**

1. Criar `fetch-question-comments.controller.ts` copiando de controller similar
2. Criar `CommentPresenter` generico (serve para question e answer comments)
3. Criar `fetch-question-comments.controller.e2e-spec.ts` copiando teste similar
4. Registrar controller e use case no modulo
5. Rodar testes e2e para validar

## Heuristics

| Situacao | Faca |
|----------|------|
| Entidade tem classe abstrata pai (Comment) | Presenter generico usando props da classe pai |
| Controller similar ja existe no codebase | Copie e substitua nomes, nao crie do zero |
| Teste e2e falha sem erro claro | Verifique registro no modulo (controller + use case) |
| Props sao especificas da subclasse | Crie presenter especifico para a subclasse |
| Listagem com paginacao | Adicione query params page/perPage no handler |

## Anti-patterns

| Nunca faca | Faca ao inves |
|------------|---------------|
| Criar controller sem teste e2e | Sempre crie o e2e-spec junto |
| Esquecer `@Injectable()` no use case | Marque todo use case com `@Injectable()` |
| Presenter com props especificas da subclasse quando nao necessario | Use props da classe abstrata pai |
| Criar controller sem registrar no modulo | Registre controller E use case no `@Module` |
| Criar tudo do zero quando existe similar | Copie controller similar e substitua |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
