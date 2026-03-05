---
name: rs-node-js-2023-controller-comentar-pergunta
description: "Generates NestJS controller and E2E test for commenting on a question endpoint following clean architecture. Use when user asks to 'create a comment controller', 'add comment endpoint', 'comment on question API', or 'create NestJS CRUD controller'. Applies pattern: copy similar controller, adapt naming, register in module, wire use case, write E2E test. Make sure to use this skill whenever creating a new NestJS controller that follows an existing pattern in a clean architecture project. Not for business logic, use case implementation, or domain layer changes."
---

# Controller: Comentar Pergunta

> Ao criar um novo controller NestJS em clean architecture, copie o controller mais parecido, adapte nomes, registre no modulo e escreva o teste E2E.

## Rules

1. **Copie o controller mais similar** — identifique qual controller existente tem estrutura mais proxima (mesmo shape de body, rota similar), porque reescrever do zero introduz inconsistencias
2. **Renomeie sistematicamente** — substitua TODAS as ocorrencias do nome antigo pelo novo (classe, decorator, rota, variaveis), porque uma unica referencia esquecida causa erro silencioso
3. **Registre no modulo HTTP imediatamente** — adicione o controller E o use case no modulo antes de testar, porque NestJS nao resolve dependencias nao registradas
4. **Use case precisa do @Injectable()** — ao conectar o use case, garanta que tem o decorator, porque sem ele o container de DI do NestJS nao consegue injetar
5. **Teste E2E valida persistencia** — o teste deve criar o recurso pai (question), executar a acao (comment), e verificar no banco se o dado foi persistido, porque testes que so checam status code nao garantem integridade
6. **Body shape identico = menos mudancas** — quando o novo endpoint tem o mesmo body (ex: content), mantenha o DTO igual, porque criar DTOs desnecessarios viola DRY

## Steps

### Step 1: Identificar controller similar
Encontre o controller existente com a estrutura mais proxima. Para comentar pergunta, `answer-question.controller.ts` e o mais parecido (ambos recebem `content` no body e operam sobre uma question).

### Step 2: Copiar e renomear controller
```typescript
// create-comment-on-question.controller.ts
// Substituir todas as ocorrencias:
// AnswerQuestion → CommentOnQuestion
// answer-question → comment-on-question
// Rota: /questions/:questionId/comments (ao inves de /answers)
// Body: { content } (mesmo shape, sem attachmentIds)
```

### Step 3: Copiar e renomear teste E2E
```typescript
// create-comment-on-question.controller.e2e-spec.ts
// Mesmo padrao: cria question → executa POST → verifica no banco
// Buscar por 'comments' na tabela ao inves de 'answers'
```

### Step 4: Registrar no HTTP module
```typescript
// http.module.ts — adicionar nos arrays:
// controllers: [..., CommentOnQuestionController]
// providers: [..., CommentOnQuestionUseCase]
```

### Step 5: Adicionar @Injectable() no use case
```typescript
// comment-on-question.use-case.ts
@Injectable()
export class CommentOnQuestionUseCase {
  // ...
}
```

### Step 6: Rodar testes
```bash
npm run test:e2e
```

## Example

**Before (copiou answer-question sem adaptar):**
```typescript
@Controller('/questions/:questionId/answers')
export class AnswerQuestionController {
  constructor(private answerQuestion: AnswerQuestionUseCase) {}
}
```

**After (adaptado para comment-on-question):**
```typescript
@Controller('/questions/:questionId/comments')
export class CommentOnQuestionController {
  constructor(private commentOnQuestion: CommentOnQuestionUseCase) {}

  @Post()
  async handle(
    @CurrentUser() user: UserPayload,
    @Param('questionId') questionId: string,
    @Body() body: { content: string },
  ) {
    await this.commentOnQuestion.execute({
      authorId: user.sub,
      questionId,
      content: body.content,
    })
  }
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Novo endpoint com body identico a outro | Copie o controller, renomeie, ajuste rota |
| Novo endpoint com body diferente | Copie o mais proximo, adapte o DTO/body |
| Use case ja existe no dominio | So adicione @Injectable() e registre no modulo |
| Teste E2E precisa de dados relacionados | Crie os recursos pai (question, user) antes de testar |

## Anti-patterns

| Nunca faca | Faca ao inves |
|------------|---------------|
| Criar controller do zero ignorando existentes | Copiar o mais similar e adaptar |
| Registrar so o controller no modulo | Registrar controller E use case |
| Testar so o status code 201 | Verificar se o dado foi persistido no banco |
| Esquecer @Injectable() no use case | Sempre adicionar ao conectar com NestJS |
| Criar rota fora do padrao RESTful | `/questions/:questionId/comments` (recurso aninhado) |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
