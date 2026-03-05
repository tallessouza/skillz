---
name: rs-node-js-2023-controller-comentario-autor
description: "Applies the Presenter pattern for API response formatting in NestJS clean architecture. Use when user asks to 'create a controller', 'format API response', 'return data from endpoint', 'add presenter', or 'map domain to response'. Enforces separation between domain objects and HTTP responses using Presenter classes that rename and reshape data for the frontend. Make sure to use this skill whenever building NestJS controllers that return domain entities. Not for database queries, use case logic, or frontend components."
---

# Controller com Presenter Pattern (NestJS Clean Architecture)

> Nunca retorne objetos de dominio diretamente do controller — use um Presenter para formatar a resposta no formato ideal para o frontend.

## Rules

1. **Crie um Presenter por formato de resposta** — `CommentPresenter` para comentario simples, `CommentWithAuthorPresenter` para comentario com autor, porque cada endpoint pode precisar de um shape diferente dos dados
2. **O Presenter e um metodo estatico `toHTTP`** — recebe o Value Object ou Entity do dominio e retorna um objeto plain, porque isso desacopla o formato HTTP do dominio
3. **Renomeie campos no Presenter quando necessario** — `authorName` ao inves de `name`, porque o frontend precisa de clareza sobre o que cada campo representa
4. **O Controller usa o Presenter no map** — `comments.map(CommentWithAuthorPresenter.toHTTP)`, porque a transformacao fica centralizada e testavel
5. **Teste o controller verificando campos do Presenter** — verifique que `authorName` retorna o valor correto, nao apenas o conteudo, porque garante que a integracao dominio-HTTP funciona

## How to write

### Presenter para Value Object composto

```typescript
// comment-with-author-presenter.ts
export class CommentWithAuthorPresenter {
  static toHTTP(commentWithAuthor: CommentWithAuthor) {
    return {
      commentId: commentWithAuthor.commentId.toString(),
      authorId: commentWithAuthor.authorId.toString(),
      authorName: commentWithAuthor.author, // renomeia para clareza
      content: commentWithAuthor.content,
      createdAt: commentWithAuthor.createdAt,
      updatedAt: commentWithAuthor.updatedAt,
    }
  }
}
```

### Controller usando o Presenter

```typescript
@Get('/questions/:questionId/comments')
async handle(@Param('questionId') questionId: string) {
  const result = await this.fetchQuestionComments.execute({ questionId })

  const comments = result.value.comments

  return { comments: comments.map(CommentWithAuthorPresenter.toHTTP) }
}
```

### Teste E2E verificando dados do Presenter

```typescript
const user = await studentFactory.makePrismaStudent({ name: 'John Doe' })
const question = await questionFactory.makePrismaQuestion({ authorId: user.id })

await commentFactory.makePrismaQuestionComment({
  questionId: question.id,
  authorId: user.id,
  content: 'comment 1',
})

const response = await request(app.getHttpServer())
  .get(`/questions/${question.id.toString()}/comments`)
  .set('Authorization', `Bearer ${accessToken}`)

expect(response.body.comments[0]).toEqual(
  expect.objectContaining({
    content: 'comment 1',
    authorName: 'John Doe', // verifica campo renomeado pelo Presenter
  }),
)
```

## Example

**Before (retornando dominio direto):**
```typescript
return { comments: comments.map((c) => ({
  id: c.id,
  name: c.author.name, // campo generico
  content: c.content,
})) }
```

**After (com Presenter):**
```typescript
return { comments: comments.map(CommentWithAuthorPresenter.toHTTP) }
// Presenter centraliza: commentId, authorId, authorName, content, createdAt, updatedAt
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Endpoint retorna entidade simples | Presenter basico com `toHTTP` |
| Endpoint retorna Value Object composto (ex: CommentWithAuthor) | Presenter dedicado para o Value Object |
| Campo do dominio tem nome ambiguo para o frontend | Renomeie no Presenter (ex: `name` → `authorName`) |
| Novo endpoint com shape diferente dos mesmos dados | Crie novo Presenter, nao reutilize o existente |

## Anti-patterns

| Nunca faca | Faca ao inves |
|------------|---------------|
| Retornar entity/VO do dominio direto no controller | Usar `Presenter.toHTTP()` |
| Formatar resposta inline no controller | Centralizar no Presenter |
| Usar mesmo Presenter para shapes diferentes | Criar Presenter por formato de resposta |
| Testar E2E sem verificar campos renomeados | Verificar `authorName`, nao apenas `content` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/node-js/rs-node-js-2023-controller-comentario-com-autor/references/deep-explanation.md)
- [Code examples](../../../data/skills/node-js/rs-node-js-2023-controller-comentario-com-autor/references/code-examples.md)
