# Code Examples: Abstraindo Criacao de Entidades

## Optional utility type completo

```typescript
// src/core/types/optional.ts
/**
 * Make some property optional on type
 *
 * @example
 * ```typescript
 * type Post {
 *  id: string;
 *  name: string;
 *  email: string;
 * }
 *
 * Optional<Post, 'id' | 'email'>
 * ```
 **/
export type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>
```

## Question com factory method

```typescript
import { Optional } from '@/core/types/optional'
import { Entity } from '@/core/entities/entity'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'

interface QuestionProps {
  title: string
  content: string
  authorId: UniqueEntityId
  bestAnswerId?: UniqueEntityId  // genuinamente opcional
  createdAt: Date                // obrigatorio na entidade
  updatedAt?: Date               // genuinamente opcional
}

export class Question extends Entity<QuestionProps> {
  get title() { return this.props.title }
  get content() { return this.props.content }
  get authorId() { return this.props.authorId }
  get bestAnswerId() { return this.props.bestAnswerId }
  get createdAt() { return this.props.createdAt }
  get updatedAt() { return this.props.updatedAt }

  static create(
    props: Optional<QuestionProps, 'createdAt'>,
    id?: UniqueEntityId,
  ) {
    const question = new Question(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id ?? new UniqueEntityId(),
    )

    return question
  }
}
```

## Answer com factory method

```typescript
import { Optional } from '@/core/types/optional'
import { Entity } from '@/core/entities/entity'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'

interface AnswerProps {
  content: string
  authorId: UniqueEntityId
  questionId: UniqueEntityId
  createdAt: Date
  updatedAt?: Date
}

export class Answer extends Entity<AnswerProps> {
  get content() { return this.props.content }
  get authorId() { return this.props.authorId }
  get questionId() { return this.props.questionId }
  get createdAt() { return this.props.createdAt }
  get updatedAt() { return this.props.updatedAt }

  static create(
    props: Optional<AnswerProps, 'createdAt'>,
    id?: UniqueEntityId,
  ) {
    const answer = new Answer(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id ?? new UniqueEntityId(),
    )

    return answer
  }
}
```

## Entidade simples (sem campos automaticos)

```typescript
import { Entity } from '@/core/entities/entity'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'

interface StudentProps {
  name: string
  email: string
}

export class Student extends Entity<StudentProps> {
  get name() { return this.props.name }
  get email() { return this.props.email }

  static create(props: StudentProps, id?: UniqueEntityId) {
    const student = new Student(props, id ?? new UniqueEntityId())
    return student
  }
}
```

## Uso no use case (conversao de strings para Value Objects)

```typescript
// answer-question.ts
export class AnswerQuestionUseCase {
  constructor(private answersRepository: AnswersRepository) {}

  async execute({
    instructorId,
    questionId,
    content,
  }: AnswerQuestionUseCaseRequest) {
    const answer = Answer.create({
      content,
      authorId: new UniqueEntityId(instructorId),
      questionId: new UniqueEntityId(questionId),
    })

    await this.answersRepository.create(answer)

    return answer
  }
}
```

## Classe base Entity com construtor protegido

```typescript
export class Entity<Props> {
  private _id: UniqueEntityId
  protected props: Props

  protected constructor(props: Props, id: UniqueEntityId) {
    this.props = props
    this._id = id
  }

  get id() {
    return this._id
  }
}
```

## Em testes

```typescript
// Antes (erro: createdAt obrigatorio)
const question = new Question({
  title: 'Pergunta teste',
  content: 'Conteudo',
  authorId: new UniqueEntityId(),
  createdAt: new Date(), // tinha que passar manualmente
}, new UniqueEntityId())

// Depois (limpo, sem campos automaticos)
const question = Question.create({
  title: 'Pergunta teste',
  content: 'Conteudo',
  authorId: new UniqueEntityId(),
})
```