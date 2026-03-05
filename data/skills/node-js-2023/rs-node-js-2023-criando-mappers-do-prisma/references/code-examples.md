# Code Examples: Criando Mappers do Prisma

## Mapper completo: PrismaAnswerMapper

```typescript
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Answer } from '@/domain/forum/enterprise/entities/answer'
import { Prisma, Answer as PrismaAnswer } from '@prisma/client'

export class PrismaAnswerMapper {
  static toDomain(raw: PrismaAnswer): Answer {
    return Answer.create(
      {
        content: raw.content,
        authorId: new UniqueEntityId(raw.authorId),
        questionId: new UniqueEntityId(raw.questionId),
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityId(raw.id),
    )
  }

  static toPrisma(answer: Answer): Prisma.AnswerUncheckedCreateInput {
    return {
      id: answer.id.toString(),
      content: answer.content,
      authorId: answer.authorId.toString(),
      questionId: answer.questionId.toString(),
      createdAt: answer.createdAt,
      updatedAt: answer.updatedAt,
    }
  }
}
```

**Diferenca do QuestionMapper:** Answer nao tem `title`, `bestAnswerId`, nem `slug`. Tem `questionId`.

## Mapper com tabela compartilhada: PrismaAnswerCommentMapper

```typescript
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { AnswerComment } from '@/domain/forum/enterprise/entities/answer-comment'
import { Prisma, Comment as PrismaComment } from '@prisma/client'

export class PrismaAnswerCommentMapper {
  static toDomain(raw: PrismaComment): AnswerComment {
    if (!raw.answerId) {
      throw new Error('Invalid comment type.')
    }

    return AnswerComment.create(
      {
        content: raw.content,
        authorId: new UniqueEntityId(raw.authorId),
        answerId: new UniqueEntityId(raw.answerId),
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityId(raw.id),
    )
  }

  static toPrisma(
    comment: AnswerComment,
  ): Prisma.CommentUncheckedCreateInput {
    return {
      id: comment.id.toString(),
      content: comment.content,
      authorId: comment.authorId.toString(),
      answerId: comment.answerId.toString(),
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
    }
  }
}
```

**Pontos-chave:**
- Importa `Comment as PrismaComment` (nao `AnswerComment` — nao existe no Prisma)
- O tipo de retorno e `Prisma.CommentUncheckedCreateInput` (tabela `comment`)
- No `toPrisma`, so passa `answerId` (nao `questionId`), porque sabe que e um comentario de resposta

## Mapper espelho: PrismaQuestionCommentMapper

```typescript
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { QuestionComment } from '@/domain/forum/enterprise/entities/question-comment'
import { Prisma, Comment as PrismaComment } from '@prisma/client'

export class PrismaQuestionCommentMapper {
  static toDomain(raw: PrismaComment): QuestionComment {
    if (!raw.questionId) {
      throw new Error('Invalid comment type.')
    }

    return QuestionComment.create(
      {
        content: raw.content,
        authorId: new UniqueEntityId(raw.authorId),
        questionId: new UniqueEntityId(raw.questionId),
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityId(raw.id),
    )
  }

  static toPrisma(
    comment: QuestionComment,
  ): Prisma.CommentUncheckedCreateInput {
    return {
      id: comment.id.toString(),
      content: comment.content,
      authorId: comment.authorId.toString(),
      questionId: comment.questionId.toString(),
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
    }
  }
}
```

**Unica diferenca do AnswerCommentMapper:** valida `questionId` em vez de `answerId`, e passa `questionId` no toPrisma.

## Mapper somente leitura: PrismaQuestionAttachmentMapper

```typescript
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { QuestionAttachment } from '@/domain/forum/enterprise/entities/question-attachment'
import { Attachment as PrismaAttachment } from '@prisma/client'

export class PrismaQuestionAttachmentMapper {
  static toDomain(raw: PrismaAttachment): QuestionAttachment {
    if (!raw.questionId) {
      throw new Error('Invalid attachment type.')
    }

    return QuestionAttachment.create(
      {
        attachmentId: new UniqueEntityId(raw.id),
        questionId: new UniqueEntityId(raw.questionId),
      },
      new UniqueEntityId(raw.id),
    )
  }
}
```

**Por que sem toPrisma:** o repositorio de attachments so tem metodos de busca e delete — nao ha necessidade de converter dominio → Prisma.

## Mapper somente leitura: PrismaAnswerAttachmentMapper

```typescript
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { AnswerAttachment } from '@/domain/forum/enterprise/entities/answer-attachment'
import { Attachment as PrismaAttachment } from '@prisma/client'

export class PrismaAnswerAttachmentMapper {
  static toDomain(raw: PrismaAttachment): AnswerAttachment {
    if (!raw.answerId) {
      throw new Error('Invalid attachment type.')
    }

    return AnswerAttachment.create(
      {
        attachmentId: new UniqueEntityId(raw.id),
        answerId: new UniqueEntityId(raw.answerId),
      },
      new UniqueEntityId(raw.id),
    )
  }
}
```

## Resumo: todos os mappers criados

| Mapper | Tabela Prisma | toDomain | toPrisma | Validacao FK |
|--------|--------------|----------|----------|-------------|
| PrismaAnswerMapper | Answer | Sim | Sim | — |
| PrismaAnswerCommentMapper | Comment | Sim | Sim | `answerId` |
| PrismaQuestionCommentMapper | Comment | Sim | Sim | `questionId` |
| PrismaQuestionAttachmentMapper | Attachment | Sim | Nao | `questionId` |
| PrismaAnswerAttachmentMapper | Attachment | Sim | Nao | `answerId` |