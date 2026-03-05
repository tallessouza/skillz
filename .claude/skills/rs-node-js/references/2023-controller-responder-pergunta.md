---
name: rs-node-js-2023-controller-responder-pergunta
description: "Enforces NestJS nested resource controller patterns when creating endpoints for child resources like answers, comments, or replies. Use when user asks to 'create a controller', 'add an endpoint', 'nested route', 'child resource', or 'answer/reply endpoint'. Applies rules: prefix param names in nested routes, separate validation schemas per resource, register controller and use case in module. Make sure to use this skill whenever generating NestJS controllers for related/nested resources. Not for standalone CRUD controllers, service logic, or database schema design."
---

# Controller: Recurso Aninhado no NestJS

> Ao criar controllers para recursos aninhados (resposta de pergunta, comentario de post), a rota reflete a hierarquia e os parametros sao prefixados para evitar ambiguidade.

## Rules

1. **Prefixe parametros de rota com o nome do recurso pai** — use `questionId` nao `id`, porque `id` e ambiguo quando o recurso principal e a resposta, nao a pergunta
2. **Estruture rotas como hierarquia** — `questions/:questionId/answers` deixa claro que answers pertence a questions, porque RESTful exige que recursos aninhados reflitam a relacao
3. **Crie schema de validacao especifico por recurso** — answer precisa apenas de `content`, nao de `title`, porque cada recurso tem campos diferentes
4. **Registre controller E use case no module** — ambos devem estar no array do NestJS module, porque sem registro o endpoint simplesmente nao existe
5. **Use `@Injectable()` no use case** — sem decorator o NestJS nao consegue injetar dependencias, porque o container DI precisa do metadata
6. **Nomeie pelo papel semantico, nao pelo tipo tecnico** — `authorId` nao `instructorId` quando qualquer usuario pode responder, porque o nome deve refletir o dominio real

## How to write

### Controller de recurso aninhado

```typescript
@Controller('/questions/:questionId/answers')
export class AnswerQuestionController {
  constructor(private answerQuestion: AnswerQuestionUseCase) {}

  @Post()
  async handle(
    @CurrentUser() user: UserPayload,
    @Param('questionId') questionId: string,
    @Body(bodyValidationPipe) body: AnswerQuestionBodySchema,
  ) {
    const { content } = body
    const userId = user.sub

    await this.answerQuestion.execute({
      questionId,
      authorId: userId,
      content,
    })
  }
}
```

### Schema de validacao especifico

```typescript
const answerQuestionBodySchema = z.object({
  content: z.string(),
})

type AnswerQuestionBodySchema = z.infer<typeof answerQuestionBodySchema>
```

### Registro no module

```typescript
@Module({
  controllers: [
    // ...outros controllers
    AnswerQuestionController,
  ],
  providers: [
    // ...outros use cases
    AnswerQuestionUseCase,
  ],
})
export class HttpModule {}
```

## Example

**Before (parametro ambiguo, rota plana):**

```typescript
@Controller('/answers')
export class AnswerController {
  @Post(':id')
  async handle(@Param('id') id: string) {
    // id de que? da pergunta? da resposta?
  }
}
```

**After (hierarquia clara, parametro prefixado):**

```typescript
@Controller('/questions/:questionId/answers')
export class AnswerQuestionController {
  @Post()
  async handle(
    @Param('questionId') questionId: string,
    @Body(bodyValidationPipe) body: AnswerQuestionBodySchema,
  ) {
    const { content } = body
    await this.answerQuestion.execute({ questionId, authorId: userId, content })
  }
}
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Recurso pertence a outro recurso | Rota aninhada: `/pai/:paiId/filho` |
| Parametro na URL nao e o recurso principal | Prefixe com nome do recurso: `questionId`, `postId` |
| Recurso filho tem campos diferentes do pai | Schema de validacao separado |
| Novo controller criado | Registrar no module imediatamente |
| Use case novo | Adicionar `@Injectable()` e registrar como provider |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `@Param('id')` em rota aninhada | `@Param('questionId')` com prefixo semantico |
| `/answers?questionId=x` (query param) | `/questions/:questionId/answers` (path param) |
| Mesmo schema de validacao do pai | Schema especifico: answer so precisa de `content` |
| Controller sem registrar no module | Sempre adicionar ao `controllers[]` do module |
| `instructorId` quando qualquer um pode responder | `authorId` refletindo o dominio real |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/node-js/rs-node-js-2023-controller-responder-pergunta/references/deep-explanation.md)
- [Code examples](../../../data/skills/node-js/rs-node-js-2023-controller-responder-pergunta/references/code-examples.md)
