# Code Examples: Primeiro Caso de Uso

## Estrutura de arquivos criada na aula

```
src/
├── domain/
│   ├── entities/
│   │   ├── question.ts
│   │   ├── answer.ts
│   │   ├── student.ts
│   │   └── instructor.ts
│   └── use-cases/
│       └── answer-question.ts
└── test/
    └── answer-question.spec.ts
```

## Entidade Question

```typescript
import { randomUUID } from 'node:crypto'

export class Question {
  public id: string
  public title: string
  public content: string

  constructor(title: string, content: string, id?: string) {
    this.id = id ?? randomUUID()
    this.title = title
    this.content = content
  }
}
```

## Entidade Answer

```typescript
import { randomUUID } from 'node:crypto'

export class Answer {
  public id: string
  public content: string

  constructor(content: string, id?: string) {
    this.id = id ?? randomUUID()
    this.content = content
  }
}
```

## Entidade Student

```typescript
import { randomUUID } from 'node:crypto'

export class Student {
  public id: string
  public name: string

  constructor(name: string, id?: string) {
    this.id = id ?? randomUUID()
    this.name = name
  }
}
```

## Entidade Instructor

```typescript
import { randomUUID } from 'node:crypto'

export class Instructor {
  public id: string
  public name: string

  constructor(name: string, id?: string) {
    this.id = id ?? randomUUID()
    this.name = name
  }
}
```

## Use Case: Answer Question

```typescript
import { Answer } from '../entities/answer'

interface AnswerQuestionUseCaseRequest {
  instructorId: string
  questionId: string
  content: string
}

export class AnswerQuestionUseCase {
  execute({ instructorId, questionId, content }: AnswerQuestionUseCaseRequest) {
    const answer = new Answer(content)
    return answer
  }
}
```

## Teste

```typescript
import { test, expect } from 'vitest'
import { AnswerQuestionUseCase } from './answer-question'

test('create an answer', () => {
  const answerQuestion = new AnswerQuestionUseCase()

  const answer = answerQuestion.execute({
    content: 'Nova resposta',
    questionId: '1',
    instructorId: '2',
  })

  expect(answer.content).toEqual('Nova resposta')
})
```

## Padrao do ID opcional — variacoes

### Criando entidade nova (sem ID)
```typescript
const question = new Question('Como usar DDD?', 'Preciso de ajuda com DDD')
// question.id = uuid gerado automaticamente
```

### Referenciando entidade existente (com ID)
```typescript
const question = new Question('Como usar DDD?', 'Preciso de ajuda', 'existing-uuid')
// question.id = 'existing-uuid'
```

### No use case, usando IDs para referenciar
```typescript
const answer = answerQuestion.execute({
  instructorId: 'uuid-do-instrutor',  // referencia a instrutor existente
  questionId: 'uuid-da-pergunta',      // referencia a pergunta existente
  content: 'Esta e a resposta',
})
```

## Contraste: parametros posicionais vs nomeados

### Posicional (ruim)
```typescript
// O que e '1'? O que e '2'?
answerQuestion.execute('1', '2', 'Nova resposta')
```

### Nomeado (correto)
```typescript
// Cada valor tem nome, impossivel confundir
answerQuestion.execute({
  questionId: '1',
  instructorId: '2',
  content: 'Nova resposta',
})
```