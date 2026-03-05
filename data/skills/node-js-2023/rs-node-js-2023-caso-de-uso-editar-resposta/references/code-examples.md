# Code Examples: Caso de Uso Editar Resposta

## Caso de uso completo: EditAnswerUseCase

```typescript
// src/domain/forum/application/use-cases/edit-answer.ts

interface EditAnswerUseCaseRequest {
  authorId: string
  answerId: string
  content: string
}

interface EditAnswerUseCaseResponse {
  answer: Answer
}

export class EditAnswerUseCase {
  constructor(private answersRepository: AnswersRepository) {}

  async execute({
    authorId,
    answerId,
    content,
  }: EditAnswerUseCaseRequest): Promise<EditAnswerUseCaseResponse> {
    const answer = await this.answersRepository.findById(answerId)

    if (!answer) {
      throw new Error('Answer not found.')
    }

    if (authorId !== answer.authorId.toString()) {
      throw new Error('Not allowed.')
    }

    answer.content = content

    await this.answersRepository.save(answer)

    return { answer }
  }
}
```

## Comparacao: EditQuestion vs EditAnswer

```typescript
// EditQuestion — tem titulo E conteudo
interface EditQuestionUseCaseRequest {
  authorId: string
  questionId: string
  title: string    // Question tem titulo
  content: string
}

// EditAnswer — so tem conteudo
interface EditAnswerUseCaseRequest {
  authorId: string
  answerId: string
  content: string  // Answer NAO tem titulo
}
```

## Metodo save no InMemoryAnswersRepository

```typescript
// test/repositories/in-memory-answers-repository.ts

export class InMemoryAnswersRepository implements AnswersRepository {
  public items: Answer[] = []

  async findById(id: string): Promise<Answer | null> {
    const answer = this.items.find((item) => item.id.toString() === id)
    return answer ?? null
  }

  async create(answer: Answer): Promise<void> {
    this.items.push(answer)
  }

  async save(answer: Answer): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id === answer.id)
    this.items[itemIndex] = answer
  }

  async delete(answer: Answer): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id === answer.id)
    this.items.splice(itemIndex, 1)
  }
}
```

## Interface do repositorio (contrato)

```typescript
// src/domain/forum/application/repositories/answers-repository.ts

export abstract class AnswersRepository {
  abstract findById(id: string): Promise<Answer | null>
  abstract create(answer: Answer): Promise<void>
  abstract save(answer: Answer): Promise<void>
  abstract delete(answer: Answer): Promise<void>
}
```

## Teste unitario: EditAnswer

```typescript
// src/domain/forum/application/use-cases/edit-answer.spec.ts

let inMemoryAnswersRepository: InMemoryAnswersRepository
let sut: EditAnswerUseCase

describe('Edit Answer', () => {
  beforeEach(() => {
    inMemoryAnswersRepository = new InMemoryAnswersRepository()
    sut = new EditAnswerUseCase(inMemoryAnswersRepository)
  })

  it('should be able to edit an answer', async () => {
    const newAnswer = makeAnswer(
      { authorId: new UniqueEntityID('author-1') },
      new UniqueEntityID('answer-1'),
    )

    await inMemoryAnswersRepository.create(newAnswer)

    const { answer } = await sut.execute({
      authorId: 'author-1',
      answerId: 'answer-1',
      content: 'New content',
    })

    expect(answer.content).toEqual('New content')
    expect(inMemoryAnswersRepository.items[0].content).toEqual('New content')
  })

  it('should not be able to edit an answer from another user', async () => {
    const newAnswer = makeAnswer(
      { authorId: new UniqueEntityID('author-1') },
      new UniqueEntityID('answer-1'),
    )

    await inMemoryAnswersRepository.create(newAnswer)

    await expect(() =>
      sut.execute({
        authorId: 'author-2',
        answerId: 'answer-1',
        content: 'New content',
      }),
    ).rejects.toThrow('Not allowed.')
  })
})
```

## Padrao de reuso: como adaptar EditQuestion para EditAnswer

```bash
# 1. Copiar o arquivo
cp edit-question.ts edit-answer.ts
cp edit-question.spec.ts edit-answer.spec.ts

# 2. Find-replace no editor
# Question → Answer
# question → answer

# 3. Ajustar campos especificos
# - Remover title do request (Answer nao tem titulo)
# - Remover atribuicao de title no execute
# - Remover assertions de title nos testes
```