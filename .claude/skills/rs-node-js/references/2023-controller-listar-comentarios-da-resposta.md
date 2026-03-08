---
name: rs-node-js-2023-controller-listar-comentarios-da-resposta
description: "Applies the NestJS controller duplication pattern when creating similar CRUD endpoints by copying and adapting existing controllers. Use when user asks to 'create a new controller', 'add endpoint for comments', 'list comments', 'fetch answer comments', or 'copy controller pattern'. Follows the copy-adapt-test workflow: duplicate similar controller, swap entity references, update routes, adapt e2e tests, register in module. Make sure to use this skill whenever creating a NestJS controller that mirrors an existing one. Not for creating controllers from scratch, domain layer design, or use case implementation."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: node-js-2023
  module: nestjs-clean-architecture
  tags: [nestjs, controller, clean-architecture, e2e-test, rest-api]
  mind-lenses: [LT_01, LT_02, MF_01, GB_01, TH_04]
---

# Controller: Listar Comentarios da Resposta (Padrao Copy-Adapt-Test)

> Ao criar um controller similar a um existente, copie o controller mais proximo, troque as referencias de entidade, adapte rotas e testes, e registre no modulo.

## Rules

1. **Copie o controller mais similar** — `FetchQuestionCommentsController` vira `FetchAnswerCommentsController`, porque reescrever do zero introduz erros desnecessarios quando a estrutura e identica
2. **Troque todas as referencias de entidade** — `question` → `answer`, `questionId` → `answerId`, porque uma referencia esquecida causa bugs silenciosos em rotas e parametros
3. **Adapte a rota corretamente** — `/questions/:questionId/comments` → `/answers/:answerId/comments`, porque a rota deve refletir o recurso pai
4. **Copie e adapte o teste e2e junto** — troque factories (`QuestionCommentFactory` → `AnswerCommentFactory`), remova factories nao utilizadas, porque teste desatualizado da falsa seguranca
5. **Registre controller e use case no modulo** — adicione no `HttpModule` tanto o controller quanto o use case com `@Injectable()`, porque NestJS ignora silenciosamente providers nao registrados
6. **Rode todos os testes apos cada controller** — `pnpm run test` e `pnpm run test:e2e`, porque a suite completa garante que nenhum controller existente quebrou

## How to write

### Controller copiado e adaptado

```typescript
// fetch-answer-comments.controller.ts
@Controller('/answers/:answerId/comments')
export class FetchAnswerCommentsController {
  constructor(private fetchAnswerComments: FetchAnswerCommentsUseCase) {}

  @Get()
  async handle(@Param('answerId') answerId: string) {
    const result = await this.fetchAnswerComments.execute({ answerId })
    return { comments: result.comments }
  }
}
```

### Teste e2e adaptado

```typescript
// fetch-answer-comments.controller.e2e-spec.ts
// 1. Importar factories corretas (AnswerFactory, AnswerCommentFactory)
// 2. Remover factories desnecessarias (QuestionCommentFactory)
// 3. Criar answer, depois dois comentarios vinculados
// 4. GET /answers/{answerId}/comments
// 5. Verificar que retorna os comentarios corretos
```

### Registro no HttpModule

```typescript
// http.module.ts
@Module({
  controllers: [
    // ... outros controllers
    FetchAnswerCommentsController,
  ],
  providers: [
    // ... outros providers
    FetchAnswerCommentsUseCase, // com @Injectable() no use case
  ],
})
export class HttpModule {}
```

## Example

**Before (controller de question comments):**
```typescript
@Controller('/questions/:questionId/comments')
export class FetchQuestionCommentsController {
  constructor(private fetchQuestionComments: FetchQuestionCommentsUseCase) {}

  @Get()
  async handle(@Param('questionId') questionId: string) {
    const result = await this.fetchQuestionComments.execute({ questionId })
    return { comments: result.comments }
  }
}
```

**After (adaptado para answer comments):**
```typescript
@Controller('/answers/:answerId/comments')
export class FetchAnswerCommentsController {
  constructor(private fetchAnswerComments: FetchAnswerCommentsUseCase) {}

  @Get()
  async handle(@Param('answerId') answerId: string) {
    const result = await this.fetchAnswerComments.execute({ answerId })
    return { comments: result.comments }
  }
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Controller novo com estrutura identica a existente | Copie e adapte, nao reescreva |
| Teste e2e do controller copiado | Copie teste tambem, troque factories e rotas |
| Factory nao existe ainda | Crie antes de escrever o teste |
| Factory importada mas nao usada | Remova imediatamente |
| Ultimo controller de uma serie | Rode suite completa (unit + e2e) para validar tudo |

## Anti-patterns

| Nunca faca | Faca ao inves |
|------------|---------------|
| Reescrever controller similar do zero | Copiar o mais proximo e adaptar referencias |
| Esquecer de trocar o parametro da rota (`questionId` em rota de answer) | Buscar e substituir TODAS as ocorrencias da entidade original |
| Registrar controller sem registrar use case | Registrar ambos no `HttpModule` |
| Pular `@Injectable()` no use case | Adicionar decorator antes de registrar como provider |
| Rodar apenas o teste do controller novo | Rodar `pnpm run test` e `pnpm run test:e2e` completos |
| Deixar factory nao utilizada no import | Remover imports e providers nao usados |

## Troubleshooting

### Erro inesperado ao seguir este padrao
**Symptom:** Codigo segue o padrao mas comportamento nao e o esperado
**Cause:** Dependencia nao registrada no modulo ou configuracao incompleta
**Fix:** Verificar registro completo no modulo (controllers, providers, imports) e dependencias instaladas

## Deep reference library

- [deep-explanation.md](../../../data/skills/node-js-2023/rs-node-js-2023-controller-listar-comentarios-da-resposta/references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](../../../data/skills/node-js-2023/rs-node-js-2023-controller-listar-comentarios-da-resposta/references/code-examples.md) — Todos os exemplos de código expandidos com variações
