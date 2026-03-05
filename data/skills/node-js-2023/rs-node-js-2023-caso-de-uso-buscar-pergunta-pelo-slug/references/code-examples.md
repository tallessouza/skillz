# Code Examples: Caso de Uso Buscar Pergunta pelo Slug

## Codigo completo do use case

```typescript
// src/domain/forum/application/use-cases/get-question-by-slug.ts

interface GetQuestionBySlugUseCaseRequest {
  slug: string
}

interface GetQuestionBySlugUseCaseResponse {
  question: Question
}

export class GetQuestionBySlugUseCase {
  constructor(private questionsRepository: QuestionsRepository) {}

  async execute({
    slug,
  }: GetQuestionBySlugUseCaseRequest): Promise<GetQuestionBySlugUseCaseResponse> {
    const question = await this.questionsRepository.findBySlug(slug)

    if (!question) {
      throw new Error('Resource not found.')
    }

    return { question }
  }
}
```

## Interface do repositorio atualizada

```typescript
// src/domain/forum/application/repositories/questions-repository.ts

export interface QuestionsRepository {
  create(question: Question): Promise<void>
  findBySlug(slug: string): Promise<Question | null>
}
```

## In-memory repository completo com findBySlug

```typescript
// test/repositories/in-memory-questions-repository.ts

export class InMemoryQuestionsRepository implements QuestionsRepository {
  public items: Question[] = []

  async create(question: Question): Promise<void> {
    this.items.push(question)
  }

  async findBySlug(slug: string): Promise<Question | null> {
    const question = this.items.find((item) => item.slug.value === slug)

    if (!question) {
      return null
    }

    return question
  }
}
```

## Value Object Slug refatorado

```typescript
// src/domain/forum/enterprise/entities/value-objects/slug.ts

export class Slug {
  public value: string

  private constructor(value: string) {
    this.value = value
  }

  /**
   * Cria um Slug a partir de um valor ja formatado.
   * Util para testes e reconstrucao a partir do banco.
   */
  static create(slug: string) {
    return new Slug(slug)
  }

  /**
   * Cria um Slug a partir de texto livre, aplicando normalizacao.
   * Usado na criacao de novas entidades.
   */
  static createFromText(text: string) {
    const slugValue = text
      .normalize('NFKD')
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]+/g, '')
      .replace(/_/g, '-')
      .replace(/--+/g, '-')
      .replace(/-$/g, '')

    return new Slug(slugValue)
  }
}
```

## Teste completo

```typescript
// src/domain/forum/application/use-cases/get-question-by-slug.spec.ts

import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { GetQuestionBySlugUseCase } from './get-question-by-slug'
import { Question } from '../../enterprise/entities/question'
import { Slug } from '../../enterprise/entities/value-objects/slug'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let sut: GetQuestionBySlugUseCase

describe('Get Question By Slug', () => {
  beforeEach(() => {
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository()
    sut = new GetQuestionBySlugUseCase(inMemoryQuestionsRepository)
  })

  it('should be able to get a question by slug', async () => {
    const newQuestion = Question.create({
      title: 'Example Question',
      slug: Slug.create('example-question'),
      content: 'Example content',
      authorId: new UniqueEntityID(),
    })

    await inMemoryQuestionsRepository.create(newQuestion)

    const { question } = await sut.execute({
      slug: 'example-question',
    })

    expect(question.title).toEqual(newQuestion.title)
  })
})
```

## Variacao: teste com slug diferente (falha esperada)

```typescript
it('should throw when question does not exist', async () => {
  await expect(
    sut.execute({ slug: 'non-existing-slug' }),
  ).rejects.toThrow('Resource not found.')
})
```

## Variacao: multiplas perguntas, busca a correta

```typescript
it('should return the correct question among many', async () => {
  const question1 = Question.create({
    title: 'First Question',
    slug: Slug.create('first-question'),
    content: 'Content 1',
    authorId: new UniqueEntityID(),
  })

  const question2 = Question.create({
    title: 'Second Question',
    slug: Slug.create('second-question'),
    content: 'Content 2',
    authorId: new UniqueEntityID(),
  })

  await inMemoryQuestionsRepository.create(question1)
  await inMemoryQuestionsRepository.create(question2)

  const { question } = await sut.execute({ slug: 'second-question' })

  expect(question.title).toEqual('Second Question')
})
```