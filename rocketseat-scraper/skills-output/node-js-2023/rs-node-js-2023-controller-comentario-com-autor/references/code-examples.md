# Code Examples: Controller Comentario com Autor

## Exemplo 1: Criando o Presenter para CommentWithAuthor

O Presenter recebe o Value Object `CommentWithAuthor` e retorna um objeto formatado para o frontend:

```typescript
// src/infra/http/presenters/comment-with-author-presenter.ts
import { CommentWithAuthor } from '@/domain/forum/enterprise/entities/value-objects/comment-with-author'

export class CommentWithAuthorPresenter {
  static toHTTP(commentWithAuthor: CommentWithAuthor) {
    return {
      commentId: commentWithAuthor.commentId.toString(),
      authorId: commentWithAuthor.authorId.toString(),
      authorName: commentWithAuthor.author, // renomeado de "author" para "authorName"
      content: commentWithAuthor.content,
      createdAt: commentWithAuthor.createdAt,
      updatedAt: commentWithAuthor.updatedAt,
    }
  }
}
```

**Ponto chave:** O campo `author` do dominio vira `authorName` no HTTP. O Presenter pode renomear campos livremente — isso e uma feature, nao um problema.

## Exemplo 2: Controller usando o novo Presenter

```typescript
// No controller de fetch question comments
@Get('/questions/:questionId/comments')
async handle(@Param('questionId') questionId: string) {
  const result = await this.fetchQuestionComments.execute({
    questionId,
  })

  if (result.isLeft()) {
    throw new BadRequestException()
  }

  const comments = result.value.comments

  return {
    comments: comments.map(CommentWithAuthorPresenter.toHTTP),
  }
}
```

**Antes:** Usava `CommentPresenter` que retornava apenas dados do comentario.
**Depois:** Usa `CommentWithAuthorPresenter` que inclui `authorName`.

A troca foi direta — sem erros de tipo — porque o Value Object `CommentWithAuthor` ja carregava todas as informacoes necessarias.

## Exemplo 3: Teste E2E verificando o Presenter

```typescript
it('should return comments with author name', async () => {
  const user = await studentFactory.makePrismaStudent({
    name: 'John Doe',
  })

  const question = await questionFactory.makePrismaQuestion({
    authorId: user.id,
  })

  await commentFactory.makePrismaQuestionComment({
    questionId: question.id,
    authorId: user.id,
    content: 'comment 1',
  })

  const response = await request(app.getHttpServer())
    .get(`/questions/${question.id.toString()}/comments`)
    .set('Authorization', `Bearer ${accessToken}`)

  expect(response.statusCode).toBe(200)
  expect(response.body).toEqual({
    comments: expect.arrayContaining([
      expect.objectContaining({
        content: 'comment 1',
        authorName: 'John Doe',
      }),
    ]),
  })
})
```

**Ponto chave:** O teste verifica `authorName` (nome do Presenter), nao `author` ou `name` (nomes do dominio). Isso garante que o Presenter esta funcionando corretamente na integracao.

## Exemplo 4: Comparacao — Presenter simples vs composto

### CommentPresenter (simples)
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

### CommentWithAuthorPresenter (composto)
```typescript
export class CommentWithAuthorPresenter {
  static toHTTP(commentWithAuthor: CommentWithAuthor) {
    return {
      commentId: commentWithAuthor.commentId.toString(),
      authorId: commentWithAuthor.authorId.toString(),
      authorName: commentWithAuthor.author,
      content: commentWithAuthor.content,
      createdAt: commentWithAuthor.createdAt,
      updatedAt: commentWithAuthor.updatedAt,
    }
  }
}
```

Cada Presenter existe para um shape especifico de dados. Nao tente fazer um Presenter "generico" que atenda todos os casos.