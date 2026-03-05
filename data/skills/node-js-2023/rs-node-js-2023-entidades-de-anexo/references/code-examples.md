# Code Examples: Entidades de Anexo

## Exemplo completo: Attachment (entidade base)

```typescript
import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

export interface AttachmentProps {
  title: string
  link: string
}

export class Attachment extends Entity<AttachmentProps> {
  get title() {
    return this.props.title
  }

  get link() {
    return this.props.link
  }

  static create(props: AttachmentProps, id?: UniqueEntityID) {
    const attachment = new Attachment(props, id)
    return attachment
  }
}
```

## Exemplo completo: QuestionAttachment (bridge)

```typescript
import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

export interface QuestionAttachmentProps {
  questionId: UniqueEntityID
  attachmentId: UniqueEntityID
}

export class QuestionAttachment extends Entity<QuestionAttachmentProps> {
  get questionId() {
    return this.props.questionId
  }

  get attachmentId() {
    return this.props.attachmentId
  }

  static create(props: QuestionAttachmentProps, id?: UniqueEntityID) {
    const questionAttachment = new QuestionAttachment(props, id)
    return questionAttachment
  }
}
```

## Exemplo completo: AnswerAttachment (bridge)

```typescript
import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

export interface AnswerAttachmentProps {
  answerId: UniqueEntityID
  attachmentId: UniqueEntityID
}

export class AnswerAttachment extends Entity<AnswerAttachmentProps> {
  get answerId() {
    return this.props.answerId
  }

  get attachmentId() {
    return this.props.attachmentId
  }

  static create(props: AnswerAttachmentProps, id?: UniqueEntityID) {
    const answerAttachment = new AnswerAttachment(props, id)
    return answerAttachment
  }
}
```

## Extensao: CommentAttachment (seguindo o padrao)

Se no futuro comentarios tambem tiverem anexos:

```typescript
export interface CommentAttachmentProps {
  commentId: UniqueEntityID
  attachmentId: UniqueEntityID
}

export class CommentAttachment extends Entity<CommentAttachmentProps> {
  get commentId() {
    return this.props.commentId
  }

  get attachmentId() {
    return this.props.attachmentId
  }

  static create(props: CommentAttachmentProps, id?: UniqueEntityID) {
    const commentAttachment = new CommentAttachment(props, id)
    return commentAttachment
  }
}
```

## Comparacao: Polimorfismo vs Bridge Entities

### Abordagem polimorfica (NAO usada aqui, mas valida)

```typescript
interface AttachmentProps {
  title: string
  link: string
  parentId: UniqueEntityID
  parentType: 'question' | 'answer'
}

// Problema: ao buscar do banco, precisa de switch/if
function getParent(attachment: Attachment) {
  switch (attachment.parentType) {
    case 'question':
      return questionRepository.findById(attachment.parentId)
    case 'answer':
      return answerRepository.findById(attachment.parentId)
  }
}
```

### Abordagem bridge (USADA aqui)

```typescript
// Sem ambiguidade — o tipo da bridge ja diz qual e o pai
const questionAttachments = await questionAttachmentRepository
  .findByQuestionId(questionId)

const answerAttachments = await answerAttachmentRepository
  .findByAnswerId(answerId)
```