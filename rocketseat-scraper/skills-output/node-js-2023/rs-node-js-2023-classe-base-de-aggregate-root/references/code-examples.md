# Code Examples: AggregateRoot — Classe Base DDD

## Exemplo 1: Estrutura de pastas

```
src/
  core/
    entities/
      entity.ts           # Classe base Entity (abstrata)
      aggregate-root.ts   # Classe base AggregateRoot (abstrata)
  domain/
    entities/
      question.ts         # Extends AggregateRoot (e um agregado)
      answer.ts           # Extends Entity (entidade simples)
      question-comment.ts # Extends Entity (relacionamento, nao agregado)
```

## Exemplo 2: Entity base (abstrata)

```typescript
// core/entities/entity.ts
import { UniqueEntityID } from './unique-entity-id'

export abstract class Entity<Props> {
  private _id: UniqueEntityID
  protected props: Props

  get id() {
    return this._id
  }

  protected constructor(props: Props, id?: UniqueEntityID) {
    this.props = props
    this._id = id ?? new UniqueEntityID()
  }
}
```

## Exemplo 3: AggregateRoot completo

```typescript
// core/entities/aggregate-root.ts
import { Entity } from './entity'

export abstract class AggregateRoot<Props> extends Entity<Props> {
  // Vazio por enquanto
  // Domain events serao adicionados aqui futuramente
}
```

## Exemplo 4: Question como AggregateRoot

```typescript
// domain/entities/question.ts
import { AggregateRoot } from '@/core/entities/aggregate-root'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'

interface QuestionProps {
  authorId: UniqueEntityID
  bestAnswerId?: UniqueEntityID
  title: string
  content: string
  slug: string
  createdAt: Date
  updatedAt?: Date
}

export class Question extends AggregateRoot<QuestionProps> {
  get title() {
    return this.props.title
  }

  get content() {
    return this.props.content
  }

  // ... outros getters e metodos

  static create(
    props: Optional<QuestionProps, 'createdAt' | 'slug'>,
    id?: UniqueEntityID,
  ) {
    const question = new Question(
      {
        ...props,
        slug: props.slug ?? generateSlug(props.title),
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )

    return question
  }
}
```

## Exemplo 5: QuestionComment — NAO e agregado

```typescript
// domain/entities/question-comment.ts
import { Entity } from '@/core/entities/entity'

// Note: extends Entity, NAO AggregateRoot
// Porque comentarios sao criados DEPOIS da question, nao junto
export class QuestionComment extends Entity<QuestionCommentProps> {
  // ...
}
```

## Exemplo 6: Comparacao visual — Agregado vs Relacionamento

```typescript
// AGREGADO: co-manipulacao
// Criar question JA cria attachments e tags junto
const question = Question.create({
  title: 'Como usar DDD?',
  content: '...',
  attachments: [attachment1, attachment2],  // criados JUNTO
  tags: [tag1, tag2],                       // criados JUNTO
})

// RELACIONAMENTO SIMPLES: momentos diferentes
const question = Question.create({ title: 'Como usar DDD?' })
// ... tempo passa ...
// ... usuario decide comentar ...
const comment = QuestionComment.create({
  questionId: question.id,  // criado DEPOIS, separadamente
  content: 'Boa pergunta!',
})
```