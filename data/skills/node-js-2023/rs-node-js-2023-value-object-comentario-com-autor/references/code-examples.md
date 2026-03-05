# Code Examples: Value Object para Dados Compostos

## 1. Classe base ValueObject (completa)

```typescript
// src/core/entities/value-object.ts
export abstract class ValueObject<Props> {
  protected props: Props

  protected constructor(props: Props) {
    this.props = props
  }

  public equals(vo: ValueObject<Props> | undefined | null): boolean {
    if (vo === null || vo === undefined) {
      return false
    }

    if (vo.props === undefined) {
      return false
    }

    return JSON.stringify(this.props) === JSON.stringify(vo.props)
  }
}
```

### Comparacao com a classe Entity

```typescript
// Entity tem ID — identificacao por identidade
export abstract class Entity<Props> {
  private _id: UniqueEntityID
  protected props: Props

  get id() { return this._id }

  protected constructor(props: Props, id?: UniqueEntityID) {
    this.props = props
    this._id = id ?? new UniqueEntityID()
  }

  public equals(entity: Entity<any>) {
    if (entity === this) return true
    if (entity.id === this._id) return true
    return false
  }
}

// ValueObject NAO tem ID — identificacao por valor das propriedades
export abstract class ValueObject<Props> {
  protected props: Props
  // Sem _id, sem nada relacionado a identidade
}
```

## 2. CommentWithAuthor Value Object

```typescript
// src/domain/forum/enterprise/entities/value-objects/comment-with-author.ts
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ValueObject } from '@/core/entities/value-object'

export interface CommentWithAuthorProps {
  commentId: UniqueEntityID
  content: string
  author: {
    id: UniqueEntityID
    name: string
  }
  createdAt: Date
  updatedAt?: Date | null
}

export class CommentWithAuthor extends ValueObject<CommentWithAuthorProps> {
  static create(props: CommentWithAuthorProps) {
    return new CommentWithAuthor(props)
  }

  get commentId() {
    return this.props.commentId
  }

  get content() {
    return this.props.content
  }

  get author() {
    return this.props.author
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }
}
```

## 3. Uso no repositorio

```typescript
// Contrato do repositorio — ANTES (retorna entidade)
export abstract class QuestionCommentsRepository {
  abstract findManyByQuestionId(questionId: string): Promise<QuestionComment[]>
}

// Contrato do repositorio — DEPOIS (retorna Value Object composto)
export abstract class QuestionCommentsRepository {
  abstract findManyByQuestionId(questionId: string): Promise<QuestionComment[]>
  abstract findManyByQuestionIdWithAuthor(questionId: string): Promise<CommentWithAuthor[]>
}
```

## 4. Uso no caso de uso

```typescript
// Caso de uso retornando Value Objects
export class FetchQuestionCommentsUseCase {
  constructor(private commentsRepository: QuestionCommentsRepository) {}

  async execute({ questionId }: FetchQuestionCommentsRequest) {
    const comments = await this.commentsRepository
      .findManyByQuestionIdWithAuthor(questionId)

    return right({ comments }) // comments: CommentWithAuthor[]
  }
}
```

## 5. Exemplo de equals() em acao

```typescript
const comment1 = CommentWithAuthor.create({
  commentId: new UniqueEntityID('1'),
  content: 'Ótima pergunta!',
  author: { id: new UniqueEntityID('a1'), name: 'Diego' },
  createdAt: new Date('2024-01-01'),
})

const comment2 = CommentWithAuthor.create({
  commentId: new UniqueEntityID('1'),
  content: 'Ótima pergunta!',
  author: { id: new UniqueEntityID('a1'), name: 'Diego' },
  createdAt: new Date('2024-01-01'),
})

comment1.equals(comment2) // true — mesmas propriedades
comment1 === comment2     // false — referencias diferentes na memoria
```

## 6. Outros exemplos de Value Objects compostos (mesmo padrao)

```typescript
// QuestionWithAuthor — mesmo principio
export interface QuestionWithAuthorProps {
  questionId: UniqueEntityID
  title: string
  slug: Slug
  author: { id: UniqueEntityID; name: string }
  createdAt: Date
}

// AnswerWithAuthor
export interface AnswerWithAuthorProps {
  answerId: UniqueEntityID
  content: string
  author: { id: UniqueEntityID; name: string }
  createdAt: Date
  updatedAt?: Date | null
}
```