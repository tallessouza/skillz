# Code Examples: Deletar Comentario da Resposta

## Sequencia completa do copy-and-adapt

### 1. Answer Comments Repository (adicionar metodos)

```typescript
// src/domain/forum/application/repositories/answer-comments-repository.ts
import { AnswerComment } from '../../enterprise/entities/answer-comment'

export interface AnswerCommentsRepository {
  findById(id: string): Promise<AnswerComment | null>
  delete(answerComment: AnswerComment): Promise<void>
  create(answerComment: AnswerComment): Promise<void>
}
```

### 2. In-Memory Repository (para testes)

```typescript
// test/repositories/in-memory-answer-comments-repository.ts
import { AnswerCommentsRepository } from '@/domain/forum/application/repositories/answer-comments-repository'
import { AnswerComment } from '@/domain/forum/enterprise/entities/answer-comment'

export class InMemoryAnswerCommentsRepository implements AnswerCommentsRepository {
  public items: AnswerComment[] = []

  async findById(id: string) {
    const answerComment = this.items.find((item) => item.id.toString() === id)
    return answerComment ?? null
  }

  async delete(answerComment: AnswerComment) {
    const itemIndex = this.items.findIndex((item) => item.id === answerComment.id)
    this.items.splice(itemIndex, 1)
  }

  async create(answerComment: AnswerComment) {
    this.items.push(answerComment)
  }
}
```

### 3. Factory

```typescript
// test/factories/make-answer-comment.ts
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  AnswerComment,
  AnswerCommentProps,
} from '@/domain/forum/enterprise/entities/answer-comment'
import { faker } from '@faker-js/faker'

export function makeAnswerComment(
  override: Partial<AnswerCommentProps> = {},
  id?: UniqueEntityID,
) {
  const answerComment = AnswerComment.create(
    {
      authorId: new UniqueEntityID(),
      answerId: new UniqueEntityID(),
      content: faker.lorem.text(),
      ...override,
    },
    id,
  )

  return answerComment
}
```

### 4. Use Case

```typescript
// src/domain/forum/application/use-cases/delete-answer-comment.ts
import { AnswerCommentsRepository } from '../repositories/answer-comments-repository'

interface DeleteAnswerCommentUseCaseRequest {
  authorId: string
  answerCommentId: string
}

interface DeleteAnswerCommentUseCaseResponse {}

export class DeleteAnswerCommentUseCase {
  constructor(private answerCommentsRepository: AnswerCommentsRepository) {}

  async execute({
    authorId,
    answerCommentId,
  }: DeleteAnswerCommentUseCaseRequest): Promise<DeleteAnswerCommentUseCaseResponse> {
    const answerComment =
      await this.answerCommentsRepository.findById(answerCommentId)

    if (!answerComment) {
      throw new Error('Answer comment not found.')
    }

    if (answerComment.authorId.toString() !== authorId) {
      throw new Error('Not allowed.')
    }

    await this.answerCommentsRepository.delete(answerComment)

    return {}
  }
}
```

### 5. Teste completo

```typescript
// src/domain/forum/application/use-cases/delete-answer-comment.spec.ts
import { InMemoryAnswerCommentsRepository } from 'test/repositories/in-memory-answer-comments-repository'
import { DeleteAnswerCommentUseCase } from './delete-answer-comment'
import { makeAnswerComment } from 'test/factories/make-answer-comment'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository
let sut: DeleteAnswerCommentUseCase

describe('Delete Answer Comment', () => {
  beforeEach(() => {
    inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository()
    sut = new DeleteAnswerCommentUseCase(inMemoryAnswerCommentsRepository)
  })

  it('should be able to delete an answer comment', async () => {
    const answerComment = makeAnswerComment()
    await inMemoryAnswerCommentsRepository.create(answerComment)

    await sut.execute({
      answerCommentId: answerComment.id.toString(),
      authorId: answerComment.authorId.toString(),
    })

    expect(inMemoryAnswerCommentsRepository.items).toHaveLength(0)
  })

  it('should not be able to delete another user answer comment', async () => {
    const answerComment = makeAnswerComment({
      authorId: new UniqueEntityID('author-1'),
    })
    await inMemoryAnswerCommentsRepository.create(answerComment)

    await expect(
      sut.execute({
        answerCommentId: answerComment.id.toString(),
        authorId: 'author-2',
      }),
    ).rejects.toBeInstanceOf(Error)
  })
})
```

## Comparacao lado a lado: Question vs Answer

| Artefato | Question | Answer |
|----------|----------|--------|
| Repository | `QuestionCommentsRepository` | `AnswerCommentsRepository` |
| Factory | `makeQuestionComment` | `makeAnswerComment` |
| Use Case | `DeleteQuestionCommentUseCase` | `DeleteAnswerCommentUseCase` |
| Request | `questionCommentId` | `answerCommentId` |
| Error msg | `'Question comment not found.'` | `'Answer comment not found.'` |
| Spec | `delete-question-comment.spec.ts` | `delete-answer-comment.spec.ts` |

A unica diferenca e o nome da entidade. A logica de negocio (verificar autoria, deletar) e identica.