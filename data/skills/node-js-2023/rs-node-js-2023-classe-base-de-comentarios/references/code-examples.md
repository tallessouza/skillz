# Code Examples: Classe Base de Comentarios

## Exemplo completo: Comment (classe base)

```typescript
import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

export interface CommentProps {
  authorId: UniqueEntityID
  content: string
  createdAt: Date
  updatedAt?: Date
}

export abstract class Comment<
  Props extends CommentProps = CommentProps,
> extends Entity<Props> {
  get authorId() {
    return this.props.authorId
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
}
```

## Exemplo completo: AnswerComment (subclasse)

```typescript
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'
import { Comment, CommentProps } from './comment'

export interface AnswerCommentProps extends CommentProps {
  answerId: UniqueEntityID
}

export class AnswerComment extends Comment<AnswerCommentProps> {
  get answerId() {
    return this.props.answerId
  }

  static create(
    props: Optional<AnswerCommentProps, 'createdAt'>,
    id?: UniqueEntityID,
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

## Exemplo completo: QuestionComment (subclasse)

```typescript
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'
import { Comment, CommentProps } from './comment'

export interface QuestionCommentProps extends CommentProps {
  questionId: UniqueEntityID
}

export class QuestionComment extends Comment<QuestionCommentProps> {
  get questionId() {
    return this.props.questionId
  }

  static create(
    props: Optional<QuestionCommentProps, 'createdAt'>,
    id?: UniqueEntityID,
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

## Aplicando o mesmo padrao em outro dominio: Notification

```typescript
// Base abstrata
export interface NotificationProps {
  recipientId: UniqueEntityID
  title: string
  content: string
  readAt?: Date
  createdAt: Date
}

export abstract class Notification<
  Props extends NotificationProps = NotificationProps,
> extends Entity<Props> {
  get recipientId() { return this.props.recipientId }
  get title() { return this.props.title }
  get content() { return this.props.content }
  get readAt() { return this.props.readAt }
  get createdAt() { return this.props.createdAt }

  read() {
    this.props.readAt = new Date()
  }
}

// Subclasse: email notification
export interface EmailNotificationProps extends NotificationProps {
  email: string
  subject: string
}

export class EmailNotification extends Notification<EmailNotificationProps> {
  get email() { return this.props.email }
  get subject() { return this.props.subject }

  static create(props: Optional<EmailNotificationProps, 'createdAt'>, id?: UniqueEntityID) {
    return new EmailNotification({ ...props, createdAt: props.createdAt ?? new Date() }, id)
  }
}
```

## Erro comum: esquecer de estender CommentProps

```typescript
// ERRADO — TypeScript vai reclamar
interface AnswerCommentProps {
  answerId: UniqueEntityID
}
// Error: Type 'AnswerCommentProps' does not satisfy the constraint 'CommentProps'

// CORRETO
interface AnswerCommentProps extends CommentProps {
  answerId: UniqueEntityID
}
```

## Erro comum: tentar instanciar classe abstrata

```typescript
// ERRADO
const comment = new Comment({ ... })
// Error: Cannot create an instance of an abstract class

const comment = Comment.create({ ... })
// Error: Property 'create' does not exist (foi removido da base)

// CORRETO
const comment = AnswerComment.create({ answerId, authorId, content })
```