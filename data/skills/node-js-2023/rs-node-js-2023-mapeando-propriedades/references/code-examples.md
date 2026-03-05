# Code Examples: Mapeando Propriedades de Entidades DDD

## Evolucao do AnswerProps

### Antes (apenas strings)
```typescript
interface AnswerProps {
  authorId: string
  questionId: string
  content: string
}
```

### Depois (com tipos semanticos e datas)
```typescript
interface AnswerProps {
  authorId: UniqueEntityId
  questionId: UniqueEntityId
  content: string
  createdAt: Date
  updatedAt?: Date
}
```

## Evolucao do QuestionProps

### Antes (campos basicos)
```typescript
interface QuestionProps {
  title: string
  content: string
  slug: string
}
```

### Depois (com relacionamentos e datas)
```typescript
interface QuestionProps {
  title: string
  content: string
  slug: string
  authorId: UniqueEntityId
  bestAnswerId?: UniqueEntityId
  createdAt: Date
  updatedAt?: Date
}
```

## Padroes de campos por tipo

### Campos obrigatorios (sempre presentes na criacao)
```typescript
// Conteudo textual
content: string
title: string
slug: string

// Relacionamentos obrigatorios
authorId: UniqueEntityId
questionId: UniqueEntityId

// Temporal obrigatorio
createdAt: Date
```

### Campos opcionais (podem nao existir)
```typescript
// Relacionamento opcional (nem toda pergunta tem melhor resposta)
bestAnswerId?: UniqueEntityId

// Edicao (so existe se houve modificacao)
updatedAt?: Date
```

## Aplicando o mesmo padrao em outras entidades

### Exemplo: Comment (seguindo o mesmo padrao)
```typescript
interface CommentProps {
  authorId: UniqueEntityId
  answerId: UniqueEntityId
  content: string
  createdAt: Date
  updatedAt?: Date
}
```

### Exemplo: Notification
```typescript
interface NotificationProps {
  recipientId: UniqueEntityId
  title: string
  content: string
  readAt?: Date  // opcional — nem toda notificacao e lida
  createdAt: Date
}
```

## UniqueEntityId como Value Object de referencia

```typescript
// A classe UniqueEntityId usada em QUALQUER propriedade que seja ID
import { UniqueEntityId } from '@/core/entities/unique-entity-id'

// No props da entidade
interface AnswerProps {
  authorId: UniqueEntityId   // referencia a Student
  questionId: UniqueEntityId // referencia a Question
  content: string
  createdAt: Date
  updatedAt?: Date
}

// Na entidade
class Answer extends Entity<AnswerProps> {
  get authorId(): UniqueEntityId {
    return this.props.authorId
  }

  get questionId(): UniqueEntityId {
    return this.props.questionId
  }

  get content(): string {
    return this.props.content
  }

  get createdAt(): Date {
    return this.props.createdAt
  }

  get updatedAt(): Date | undefined {
    return this.props.updatedAt
  }
}
```