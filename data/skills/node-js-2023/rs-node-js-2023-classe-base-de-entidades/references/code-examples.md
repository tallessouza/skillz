# Code Examples: Classe Base de Entidades

## Exemplo 1: Classe Entity completa

```typescript
// src/core/entities/entity.ts
import { randomUUID } from 'node:crypto'

export class Entity<Props> {
  private _id: string
  protected props: Props

  get id() {
    return this._id
  }

  constructor(props: Props, id?: string) {
    this.props = props
    this._id = id ?? randomUUID()
  }
}
```

## Exemplo 2: Answer usando Entity

```typescript
// src/domain/entities/answer.ts
import { Entity } from '@/core/entities/entity'

interface AnswerProps {
  content: string
  authorId: string
  questionId: string
}

export class Answer extends Entity<AnswerProps> {
  get content() {
    return this.props.content
  }

  get authorId() {
    return this.props.authorId
  }

  get questionId() {
    return this.props.questionId
  }
}
```

## Exemplo 3: Question usando Entity

```typescript
interface QuestionProps {
  title: string
  content: string
  authorId: string
}

export class Question extends Entity<QuestionProps> {
  get title() {
    return this.props.title
  }

  get content() {
    return this.props.content
  }

  get authorId() {
    return this.props.authorId
  }
}
```

## Exemplo 4: Entidades simples (Instructor, Student)

```typescript
interface InstructorProps {
  name: string
}

export class Instructor extends Entity<InstructorProps> {
  get name() {
    return this.props.name
  }
}

interface StudentProps {
  name: string
}

export class Student extends Entity<StudentProps> {
  get name() {
    return this.props.name
  }
}
```

## Exemplo 5: Uso nos testes

```typescript
// Criando nova entidade (ID gerado automaticamente)
const answer = new Answer({
  content: 'Nova resposta',
  authorId: 'author-1',
  questionId: 'question-1',
})

console.log(answer.id) // UUID gerado
console.log(answer.content) // 'Nova resposta'

// Recriando entidade existente (ID fornecido)
const existingAnswer = new Answer(
  {
    content: 'Resposta existente',
    authorId: 'author-1',
    questionId: 'question-1',
  },
  'existing-id-123',
)

console.log(existingAnswer.id) // 'existing-id-123'
```

## Exemplo 6: Adicionando setter controlado

```typescript
export class Answer extends Entity<AnswerProps> {
  get content() {
    return this.props.content
  }

  // Setter com validacao — controla a alteracao
  set content(value: string) {
    if (value.trim().length === 0) {
      throw new Error('Content cannot be empty')
    }
    this.props.content = value
  }
}
```

## Estrutura de pastas resultante

```
src/
├── core/
│   └── entities/
│       └── entity.ts          # Classe base
└── domain/
    └── entities/
        ├── answer.ts          # extends Entity<AnswerProps>
        ├── question.ts        # extends Entity<QuestionProps>
        ├── instructor.ts      # extends Entity<InstructorProps>
        └── student.ts         # extends Entity<StudentProps>
```