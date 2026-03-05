# Code Examples: Caso de Uso Criar Pergunta

## Exemplo completo do caso de uso

```typescript
// src/domain/forum/application/use-cases/create-question.ts

import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Question } from '../../enterprise/entities/question'
import { QuestionsRepository } from '../repositories/questions-repository'

interface CreateQuestionUseCaseRequest {
  authorId: string
  title: string
  content: string
}

interface CreateQuestionUseCaseResponse {
  question: Question
}

export class CreateQuestionUseCase {
  constructor(private questionsRepository: QuestionsRepository) {}

  async execute({
    authorId,
    title,
    content,
  }: CreateQuestionUseCaseRequest): Promise<CreateQuestionUseCaseResponse> {
    const question = Question.create({
      authorId: new UniqueEntityId(authorId),
      title,
      content,
    })

    await this.questionsRepository.create(question)

    return { question }
  }
}
```

## Contrato do repositorio

```typescript
// src/domain/forum/application/repositories/questions-repository.ts

import { Question } from '../../enterprise/entities/question'

export interface QuestionsRepository {
  create(question: Question): Promise<void>
}
```

## Teste unitario completo

```typescript
// src/domain/forum/application/use-cases/create-question.spec.ts

import { CreateQuestionUseCase } from './create-question'
import { QuestionsRepository } from '../repositories/questions-repository'
import { Question } from '../../enterprise/entities/question'

class InMemoryQuestionsRepository implements QuestionsRepository {
  public items: Question[] = []

  async create(question: Question): Promise<void> {
    this.items.push(question)
  }
}

describe('Create Question', () => {
  it('should create a question', async () => {
    const fakeQuestionsRepository = new InMemoryQuestionsRepository()
    const createQuestion = new CreateQuestionUseCase(fakeQuestionsRepository)

    const { question } = await createQuestion.execute({
      authorId: '1',
      title: 'Nova pergunta',
      content: 'Conteudo da pergunta',
    })

    expect(question.id).toBeTruthy()
  })
})
```

## Padrao aplicado a outros casos de uso

### Create Answer (mesmo padrao)

```typescript
interface CreateAnswerUseCaseRequest {
  instructorId: string
  questionId: string
  content: string
}

interface CreateAnswerUseCaseResponse {
  answer: Answer
}

export class CreateAnswerUseCase {
  constructor(private answersRepository: AnswersRepository) {}

  async execute({
    instructorId,
    questionId,
    content,
  }: CreateAnswerUseCaseRequest): Promise<CreateAnswerUseCaseResponse> {
    const answer = Answer.create({
      authorId: new UniqueEntityId(instructorId),
      questionId: new UniqueEntityId(questionId),
      content,
    })

    await this.answersRepository.create(answer)

    return { answer }
  }
}
```

### Create Comment (mesmo padrao)

```typescript
interface CreateCommentUseCaseRequest {
  authorId: string
  questionId: string
  content: string
}

interface CreateCommentUseCaseResponse {
  comment: Comment
}

export class CreateCommentUseCase {
  constructor(private commentsRepository: CommentsRepository) {}

  async execute({
    authorId,
    questionId,
    content,
  }: CreateCommentUseCaseRequest): Promise<CreateCommentUseCaseResponse> {
    const comment = Comment.create({
      authorId: new UniqueEntityId(authorId),
      questionId: new UniqueEntityId(questionId),
      content,
    })

    await this.commentsRepository.create(comment)

    return { comment }
  }
}
```

## Checklist para criar um novo caso de uso

1. Criar interface `Request` com primitivos (string, number, boolean)
2. Criar interface `Response` com objeto contendo a entidade
3. Injetar repositorio como interface no constructor
4. No `execute`: converter primitivos para Value Objects
5. Criar entidade usando factory method (`.create()`)
6. Persistir via repositorio
7. Retornar objeto `{ entidade }`
8. Criar teste com fake repository implementando a interface