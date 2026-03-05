# Code Examples: Caso de Uso — Listar Respostas da Pergunta

## Caso de uso completo: FetchQuestionAnswers

```typescript
interface FetchQuestionAnswersRequest {
  questionId: string
  page: number
}

interface FetchQuestionAnswersResponse {
  answers: Answer[]
}

export class FetchQuestionAnswersUseCase {
  constructor(private answersRepository: AnswersRepository) {}

  async execute({
    questionId,
    page,
  }: FetchQuestionAnswersRequest): Promise<FetchQuestionAnswersResponse> {
    const answers = await this.answersRepository.findManyByQuestionId(
      questionId,
      { page },
    )

    return { answers }
  }
}
```

## Interface do repositorio: AnswersRepository

```typescript
export abstract class AnswersRepository {
  abstract create(answer: Answer): Promise<void>
  abstract findById(id: string): Promise<Answer | null>
  abstract findManyByQuestionId(
    questionId: string,
    params: PaginationParams,
  ): Promise<Answer[]>
  abstract delete(answer: Answer): Promise<void>
}
```

## Implementacao in-memory do repositorio

```typescript
export class InMemoryAnswersRepository implements AnswersRepository {
  public items: Answer[] = []

  async findManyByQuestionId(questionId: string, { page }: PaginationParams) {
    const answers = this.items
      .filter((item) => item.questionId.toString() === questionId)
      .slice((page - 1) * 20, page * 20)

    return answers
  }

  // ... outros metodos
}
```

## Teste: listagem basica

```typescript
import { InMemoryAnswersRepository } from '../repositories/in-memory-answers-repository'
import { FetchQuestionAnswersUseCase } from './fetch-question-answers'
import { makeAnswer } from '../factories/make-answer'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'

let inMemoryAnswersRepository: InMemoryAnswersRepository
let sut: FetchQuestionAnswersUseCase

describe('Fetch Question Answers', () => {
  beforeEach(() => {
    inMemoryAnswersRepository = new InMemoryAnswersRepository()
    sut = new FetchQuestionAnswersUseCase(inMemoryAnswersRepository)
  })

  it('should be able to fetch question answers', async () => {
    await inMemoryAnswersRepository.create(
      makeAnswer({ questionId: new UniqueEntityId('question-1') }),
    )
    await inMemoryAnswersRepository.create(
      makeAnswer({ questionId: new UniqueEntityId('question-1') }),
    )
    await inMemoryAnswersRepository.create(
      makeAnswer({ questionId: new UniqueEntityId('question-1') }),
    )

    const { answers } = await sut.execute({
      questionId: 'question-1',
      page: 1,
    })

    expect(answers).toHaveLength(3)
  })
})
```

## Teste: paginacao

```typescript
it('should be able to fetch paginated question answers', async () => {
  for (let i = 1; i <= 22; i++) {
    await inMemoryAnswersRepository.create(
      makeAnswer({ questionId: new UniqueEntityId('question-1') }),
    )
  }

  const { answers } = await sut.execute({
    questionId: 'question-1',
    page: 2,
  })

  expect(answers).toHaveLength(2)
})
```

## Comparacao: FetchRecentQuestions vs FetchQuestionAnswers

```typescript
// FetchRecentQuestions — sem foreign key, ordena por data
const questions = await this.questionsRepository.findManyRecent({ page })

// FetchQuestionAnswers — com foreign key, sem ordenacao especifica
const answers = await this.answersRepository.findManyByQuestionId(
  questionId,
  { page },
)
```

A diferenca estrutural: `FetchRecentQuestions` nao recebe um ID de filtro (lista global), enquanto `FetchQuestionAnswers` recebe o `questionId` como filtro obrigatorio.

## Factory de teste: makeAnswer

```typescript
// Nao precisa de createdAt porque nao ordena por data
makeAnswer({ questionId: new UniqueEntityId('question-1') })

// Compare com makeQuestion que PRECISA de createdAt para testar ordenacao
makeQuestion({ createdAt: new Date(2023, 0, 18) })
```

## Dica: pular testes temporariamente

```typescript
// Use .skip ao inves de comentar
it.skip('should be able to fetch question answers', async () => {
  // ...
})
```