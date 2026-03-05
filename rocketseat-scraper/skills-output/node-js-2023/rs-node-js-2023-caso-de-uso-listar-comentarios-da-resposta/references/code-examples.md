# Code Examples: Listar Comentarios da Resposta

## 1. Interface do Repository (AnswerCommentsRepository)

Antes, a interface so tinha metodos basicos. Agora adiciona-se o `findManyByAnswerId`:

```typescript
// src/domain/forum/application/repositories/answer-comments-repository.ts
import { PaginationParams } from '@/core/repositories/pagination-params'
import { AnswerComment } from '../../enterprise/entities/answer-comment'

export interface AnswerCommentsRepository {
  create(answerComment: AnswerComment): Promise<void>
  findManyByAnswerId(answerId: string, params: PaginationParams): Promise<AnswerComment[]>
}
```

O `PaginationParams` e um tipo compartilhado:

```typescript
// src/core/repositories/pagination-params.ts
export interface PaginationParams {
  page: number
}
```

## 2. In-Memory Repository

```typescript
// test/repositories/in-memory-answer-comments-repository.ts
import { PaginationParams } from '@/core/repositories/pagination-params'
import { AnswerCommentsRepository } from '@/domain/forum/application/repositories/answer-comments-repository'
import { AnswerComment } from '@/domain/forum/enterprise/entities/answer-comment'

export class InMemoryAnswerCommentsRepository implements AnswerCommentsRepository {
  public items: AnswerComment[] = []

  async create(answerComment: AnswerComment) {
    this.items.push(answerComment)
  }

  async findManyByAnswerId(answerId: string, { page }: PaginationParams) {
    const answerComments = this.items
      .filter((item) => item.answerId.toString() === answerId)
      .slice((page - 1) * 20, page * 20)

    return answerComments
  }
}
```

### Como o slice funciona para paginacao:

| Page | Start Index | End Index | Items |
|------|-------------|-----------|-------|
| 1 | 0 | 20 | 0-19 |
| 2 | 20 | 40 | 20-39 |
| 3 | 40 | 60 | 40-59 |

## 3. Use Case

```typescript
// src/domain/forum/application/use-cases/fetch-answer-comments.ts
import { AnswerComment } from '../../enterprise/entities/answer-comment'
import { AnswerCommentsRepository } from '../repositories/answer-comments-repository'

interface FetchAnswerCommentsUseCaseRequest {
  answerId: string
  page: number
}

interface FetchAnswerCommentsUseCaseResponse {
  answerComments: AnswerComment[]
}

export class FetchAnswerCommentsUseCase {
  constructor(private answerCommentsRepository: AnswerCommentsRepository) {}

  async execute({
    answerId,
    page,
  }: FetchAnswerCommentsUseCaseRequest): Promise<FetchAnswerCommentsUseCaseResponse> {
    const answerComments =
      await this.answerCommentsRepository.findManyByAnswerId(answerId, {
        page,
      })

    return { answerComments }
  }
}
```

## 4. Teste Unitario

```typescript
// src/domain/forum/application/use-cases/fetch-answer-comments.spec.ts
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { makeAnswerComment } from 'test/factories/make-answer-comment'
import { InMemoryAnswerCommentsRepository } from 'test/repositories/in-memory-answer-comments-repository'
import { FetchAnswerCommentsUseCase } from './fetch-answer-comments'

let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository
let sut: FetchAnswerCommentsUseCase

describe('Fetch Answer Comments', () => {
  beforeEach(() => {
    inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository()
    sut = new FetchAnswerCommentsUseCase(inMemoryAnswerCommentsRepository)
  })

  it('should be able to fetch answer comments', async () => {
    await inMemoryAnswerCommentsRepository.create(
      makeAnswerComment({ answerId: new UniqueEntityID('answer-1') }),
    )
    await inMemoryAnswerCommentsRepository.create(
      makeAnswerComment({ answerId: new UniqueEntityID('answer-1') }),
    )
    await inMemoryAnswerCommentsRepository.create(
      makeAnswerComment({ answerId: new UniqueEntityID('answer-1') }),
    )

    const { answerComments } = await sut.execute({
      answerId: 'answer-1',
      page: 1,
    })

    expect(answerComments).toHaveLength(3)
  })

  it('should be able to fetch paginated answer comments', async () => {
    for (let i = 1; i <= 22; i++) {
      await inMemoryAnswerCommentsRepository.create(
        makeAnswerComment({ answerId: new UniqueEntityID('answer-1') }),
      )
    }

    const { answerComments } = await sut.execute({
      answerId: 'answer-1',
      page: 2,
    })

    expect(answerComments).toHaveLength(2)
  })
})
```

## 5. Comparacao: Question vs Answer (padrao identico)

```typescript
// Question version
findManyByQuestionId(questionId: string, params: PaginationParams): Promise<QuestionComment[]>

// Answer version (mesma estrutura, entidade diferente)
findManyByAnswerId(answerId: string, params: PaginationParams): Promise<AnswerComment[]>
```

O padrao e identico — a unica diferenca e o nome da entidade e a FK usada no filtro.