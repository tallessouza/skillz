# Code Examples: Prisma Comment With Author Mapper

## Exemplo 1: Tipo intersecao completo

```typescript
import {
  Comment as PrismaComment,
  User as PrismaUser,
} from '@prisma/client'

// Tipo que representa o resultado do Prisma com include
type PrismaCommentWithAuthor = PrismaComment & {
  author: PrismaUser
}
```

O `&` (intersecao) combina todos os campos de `PrismaComment` com um campo adicional `author` que contem todos os campos de `PrismaUser`.

## Exemplo 2: Mapper completo

```typescript
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { CommentWithAuthor } from '@/domain/forum/enterprise/entities/value-objects/comment-with-author'
import {
  Comment as PrismaComment,
  User as PrismaUser,
} from '@prisma/client'

type PrismaCommentWithAuthor = PrismaComment & {
  author: PrismaUser
}

export class PrismaCommentWithAuthorMapper {
  static toDomain(raw: PrismaCommentWithAuthor): CommentWithAuthor {
    return CommentWithAuthor.create({
      commentId: new UniqueEntityId(raw.id),
      authorId: new UniqueEntityId(raw.authorId),
      author: raw.author.name,
      content: raw.content,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    })
  }
}
```

Note que `raw.author.name` acessa o campo `name` do objeto `author` que veio do `include`.

## Exemplo 3: Repositorio com include

```typescript
// Antes — sem author
async findManyByQuestionId(questionId: string) {
  const questionComments = await this.prisma.comment.findMany({
    where: { questionId },
    orderBy: { createdAt: 'desc' },
  })

  return questionComments.map(PrismaQuestionCommentMapper.toDomain)
}

// Depois — com author via include
async findManyByQuestionIdWithAuthor(questionId: string) {
  const questionComments = await this.prisma.comment.findMany({
    where: { questionId },
    include: { author: true },
    orderBy: { createdAt: 'desc' },
  })

  return questionComments.map(PrismaCommentWithAuthorMapper.toDomain)
}
```

## Exemplo 4: Reuso para Answer Comments

O mesmo mapper serve para comentarios de respostas:

```typescript
// No PrismaAnswerCommentsRepository
async findManyByAnswerIdWithAuthor(answerId: string) {
  const answerComments = await this.prisma.comment.findMany({
    where: { answerId },
    include: { author: true },
    orderBy: { createdAt: 'desc' },
  })

  // Mesmo mapper! Nenhuma duplicacao
  return answerComments.map(PrismaCommentWithAuthorMapper.toDomain)
}
```

## Exemplo 5: Presenter ajustado

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

## Exemplo 6: Controller usando o novo presenter

```typescript
@Get('/questions/:questionId/comments')
async handle(@Param('questionId') questionId: string) {
  const result = await this.fetchQuestionComments.execute({ questionId })

  if (result.isLeft()) {
    throw new BadRequestException()
  }

  const comments = result.value.comments

  return {
    comments: comments.map(CommentWithAuthorPresenter.toHTTP),
  }
}
```