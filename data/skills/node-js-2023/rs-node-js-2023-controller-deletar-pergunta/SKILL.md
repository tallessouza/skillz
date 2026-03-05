---
name: rs-node-js-2023-controller-deletar-pergunta
description: "Applies NestJS delete controller pattern when user asks to 'create a delete endpoint', 'remove resource', 'delete controller', or 'implement DELETE route' in NestJS. Enforces HTTP 204 status, no request body, param-based ID extraction, author authorization, and module registration. Make sure to use this skill whenever building delete operations in NestJS Clean Architecture. Not for soft-delete logic, bulk deletion, or non-NestJS frameworks."
---

# Controller: Deletar Pergunta (NestJS Clean Architecture)

> Ao criar um controller de DELETE no NestJS, retorne 204 No Content, extraia o ID via param, valide autoria, e registre controller + use case no module.

## Rules

1. **HTTP 204 No Content** — delete retorna `HttpCode(204)` sem body de resposta, porque o recurso deixou de existir e nao ha conteudo para retornar
2. **Sem body na request** — DELETE nao recebe corpo na requisicao, apenas o ID via URL param, porque a semantica HTTP define DELETE como idempotente sobre um recurso identificado pela URI
3. **Extraia ID do param** — use `@Param('id')` para capturar o identificador do recurso a deletar
4. **Valide autoria** — passe o `authorId` (do usuario logado via token) junto com o `questionId` para o use case, porque apenas o autor pode deletar seu proprio recurso
5. **Registre no module** — adicione o controller E o use case no `HttpModule`, porque NestJS silenciosamente ignora controllers nao registrados (erro 404 misterioso)
6. **Injectable no use case** — o use case precisa do decorator `@Injectable()` para funcionar no container de DI do NestJS

## How to write

### Delete Controller

```typescript
@Controller('/questions/:id')
export class DeleteQuestionController {
  constructor(private deleteQuestion: DeleteQuestionUseCase) {}

  @Delete()
  @HttpCode(204)
  async handle(
    @CurrentUser() user: UserPayload,
    @Param('id') questionId: string,
  ) {
    const userId = user.sub

    await this.deleteQuestion.execute({
      questionId,
      authorId: userId,
    })
  }
}
```

### Teste E2E

```typescript
test('[DELETE] /questions/:id', async () => {
  const user = await prisma.user.create({ data: { /* ... */ } })
  const accessToken = jwt.sign({ sub: user.id })

  const question = await prisma.question.create({
    data: { title: 'Question 1', content: 'Content', authorId: user.id, slug: 'question-1' },
  })

  await request(app.getHttpServer())
    .delete(`/questions/${question.id}`)
    .set('Authorization', `Bearer ${accessToken}`)
    .expect(204)

  const questionOnDatabase = await prisma.question.findUnique({
    where: { id: question.id },
  })

  expect(questionOnDatabase).toBeNull()
})
```

## Example

**Before (erros comuns):**
```typescript
// Erro 1: Retornando 200 com body vazio
@Delete(':id')
async handle(@Param('id') id: string) {
  await this.deleteQuestion.execute({ questionId: id })
  return {} // Desnecessario
}

// Erro 2: Esquecendo de registrar no module
// → Resultado: 404 Not Found misterioso
```

**After (com esta skill):**
```typescript
@Delete()
@HttpCode(204)
async handle(
  @CurrentUser() user: UserPayload,
  @Param('id') questionId: string,
) {
  await this.deleteQuestion.execute({
    questionId,
    authorId: user.sub,
  })
}
// + registrado no HttpModule controllers[] e providers[]
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Controller retorna 404 inesperado | Verifique se registrou no module (controllers[] e providers[]) |
| Use case nao injeta | Adicione `@Injectable()` no use case |
| Precisa validar quem deleta | Passe `authorId` do token JWT para o use case |
| Teste de delete | Valide com `findUnique` + `toBeNull()` |

## Anti-patterns

| Nunca faca | Faca ao inves |
|------------|---------------|
| `@HttpCode(200)` em DELETE | `@HttpCode(204)` |
| Receber `@Body()` em DELETE | Usar apenas `@Param('id')` |
| Deletar sem verificar autoria | Passar `authorId` do JWT para o use case |
| Testar apenas o status code | Verificar que o registro foi removido do banco (`toBeNull()`) |
| Esquecer de registrar no module | Sempre adicionar controller + use case no module |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
