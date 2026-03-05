# Code Examples: Entidades de Comentarios

## Entidade AnswerComment completa

```typescript
import { Entity } from '@/core/entities/entity'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'

export interface AnswerCommentProps {
  authorId: UniqueEntityId
  answerId: UniqueEntityId
  content: string
  createdAt: Date
  updatedAt?: Date | null
}

export class AnswerComment extends Entity<AnswerCommentProps> {
  get authorId() {
    return this.props.authorId
  }

  get answerId() {
    return this.props.answerId
  }

  get content() {
    return this.props.content
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  private touch() {
    this.props.updatedAt = new Date()
  }

  set content(content: string) {
    this.props.content = content
    this.touch()
  }

  static create(
    props: Optional<AnswerCommentProps, 'createdAt'>,
    id?: UniqueEntityId,
  ) {
    const answerComment = new AnswerComment(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )

    return answerComment
  }
}
```

## Entidade QuestionComment completa

```typescript
import { Entity } from '@/core/entities/entity'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'

export interface QuestionCommentProps {
  authorId: UniqueEntityId
  questionId: UniqueEntityId
  content: string
  createdAt: Date
  updatedAt?: Date | null
}

export class QuestionComment extends Entity<QuestionCommentProps> {
  get authorId() {
    return this.props.authorId
  }

  get questionId() {
    return this.props.questionId
  }

  get content() {
    return this.props.content
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  private touch() {
    this.props.updatedAt = new Date()
  }

  set content(content: string) {
    this.props.content = content
    this.touch()
  }

  static create(
    props: Optional<QuestionCommentProps, 'createdAt'>,
    id?: UniqueEntityId,
  ) {
    const questionComment = new QuestionComment(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )

    return questionComment
  }
}
```

## Comparacao com a entidade Answer (base da copia)

A entidade Answer original que serviu de base:

```typescript
export interface AnswerProps {
  authorId: UniqueEntityId
  questionId: UniqueEntityId
  content: string
  createdAt: Date
  updatedAt?: Date | null
}

export class Answer extends Entity<AnswerProps> {
  // ... getters/setters similares
  // Diferenca: Answer tem questionId, AnswerComment tem answerId
  // A estrutura e parecida, mas o significado no dominio e diferente
}
```

## Uso das entidades em casos de uso (proximo passo)

```typescript
// Criando um comentario em uma resposta
const comment = AnswerComment.create({
  authorId: new UniqueEntityId('author-1'),
  answerId: new UniqueEntityId('answer-1'),
  content: 'Poderia explicar melhor essa parte?',
})

// Criando um comentario em uma pergunta
const questionComment = QuestionComment.create({
  authorId: new UniqueEntityId('author-2'),
  questionId: new UniqueEntityId('question-1'),
  content: 'Voce ja tentou usar tal abordagem?',
})
```

## Estrutura de pastas resultante

```
src/
  domain/
    forum/
      enterprise/
        entities/
          answer.ts
          question.ts
          answer-comment.ts      # NOVO
          question-comment.ts    # NOVO
```