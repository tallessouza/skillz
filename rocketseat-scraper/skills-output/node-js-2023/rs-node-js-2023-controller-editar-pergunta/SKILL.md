---
name: rs-node-js-2023-controller-editar-pergunta
description: "Applies NestJS controller patterns for edit/update endpoints when building REST APIs with NestJS Clean Architecture. Use when user asks to 'create an edit controller', 'update endpoint', 'PUT route in NestJS', 'edit resource controller', or 'CRUD update operation'. Covers PUT routes with param extraction, 204 responses, abstract class repositories for DI, and DatabaseModule provider registration. Make sure to use this skill whenever implementing edit/update controllers in NestJS clean architecture projects. Not for GET/POST/DELETE controllers, authentication, or file upload handling."
---

# Controller: Editar Pergunta (NestJS Clean Architecture)

> Ao criar um controller de edicao no NestJS, reutilize a estrutura do controller de criacao, ajustando rota, metodo HTTP, status code e extracao de parametros.

## Rules

1. **Use PUT e retorne 204** — endpoints de edicao que nao retornam body devem usar `@Put()` com `@HttpCode(204)`, porque 204 (No Content) e semanticamente correto quando nao ha resposta
2. **Extraia o ID da rota como parametro** — use `@Param('id')` e renomeie para um nome descritivo como `questionId`, porque clareza no nome evita confusao com outros IDs
3. **Converta interfaces de repositorio para classes abstratas** — o NestJS compila TypeScript para JavaScript e elimina interfaces, perdendo a referencia para injecao de dependencia. Classes abstratas sobrevivem a compilacao
4. **Registre providers com provide/useClass no DatabaseModule** — cada repositorio abstrato precisa de um mapeamento `{ provide: AbstractRepo, useClass: PrismaRepo }` para o container de DI funcionar
5. **Decore use cases com @Injectable()** — sem o decorator, o NestJS nao consegue injetar as dependencias dos repositorios no use case
6. **Importe controller E use case no HttpModule** — ambos precisam estar registrados para o NestJS resolver a arvore de dependencias

## How to write

### Controller de edicao

```typescript
@Controller('/questions/:id')
@UseGuards(AuthGuard)
export class EditQuestionController {
  constructor(private editQuestion: EditQuestionUseCase) {}

  @Put()
  @HttpCode(204)
  async handle(
    @CurrentUser() user: UserPayload,
    @Param('id') questionId: string,
    @Body() body: EditQuestionBodySchema,
  ) {
    const { title, content } = body
    const userId = user.sub

    await this.editQuestion.execute({
      questionId,
      authorId: userId,
      title,
      content,
      attachmentsIds: [],
    })
  }
}
```

### Repositorio como classe abstrata (nao interface)

```typescript
// CORRETO: sobrevive compilacao TS → JS
export abstract class QuestionsRepository {
  abstract findById(id: string): Promise<Question | null>
  abstract save(question: Question): Promise<void>
  abstract create(question: Question): Promise<void>
  abstract delete(question: Question): Promise<void>
}

// ERRADO: interface e eliminada na compilacao
export interface QuestionsRepository {
  findById(id: string): Promise<Question | null>
}
```

### DatabaseModule com providers mapeados

```typescript
@Module({
  providers: [
    {
      provide: QuestionsRepository,
      useClass: PrismaQuestionsRepository,
    },
    {
      provide: AnswersRepository,
      useClass: PrismaAnswersRepository,
    },
    // ... demais repositorios
  ],
  exports: [
    QuestionsRepository,
    AnswersRepository,
  ],
})
export class DatabaseModule {}
```

## Example

**Before (controller de criacao copiado sem ajustes):**
```typescript
@Controller('/questions')
export class EditQuestionController {
  @Post()
  async handle(@Body() body) {
    // Sem ID, sem 204, metodo errado
  }
}
```

**After (controller de edicao correto):**
```typescript
@Controller('/questions/:id')
export class EditQuestionController {
  constructor(private editQuestion: EditQuestionUseCase) {}

  @Put()
  @HttpCode(204)
  async handle(
    @CurrentUser() user: UserPayload,
    @Param('id') questionId: string,
    @Body() body: EditQuestionBodySchema,
  ) {
    await this.editQuestion.execute({
      questionId,
      authorId: user.sub,
      title: body.title,
      content: body.content,
      attachmentsIds: [],
    })
  }
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Endpoint nao retorna body | Use `@HttpCode(204)` |
| Precisa do ID da URL | `@Param('id')` renomeado para nome descritivo |
| Use case nao injeta dependencias | Adicione `@Injectable()` no use case |
| Interface de repositorio nao resolve no DI | Converta para `abstract class` |
| Teste de edicao precisa de dados pre-existentes | Crie o recurso antes com factory |
| Teste com `Promise.all` falha por ordem | Use `expect.arrayContaining()` |

## Anti-patterns

| Nunca faca | Faca assim |
|------------|------------|
| `@Post()` para edicao | `@Put()` com `@HttpCode(204)` |
| `@Param('id') id: string` (generico) | `@Param('id') questionId: string` |
| `interface QuestionsRepository {}` | `abstract class QuestionsRepository {}` |
| Provider direto: `PrismaQuestionsRepository` | `{ provide: QuestionsRepository, useClass: PrismaQuestionsRepository }` |
| `Promise.all` em teste onde ordem importa | Criar sequencialmente ou usar `expect.arrayContaining()` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
