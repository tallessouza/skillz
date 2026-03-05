# Code Examples: Comentário da Resposta com Autor

## 1. Value Object reutilizado (Enterprise layer)

```typescript
// src/domain/forum/enterprise/entities/value-objects/comment-with-author.ts
// Já existia para Question — reutilizado sem alteração
import { ValueObject } from '@/core/entities/value-object'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

export interface CommentWithAuthorProps {
  commentId: UniqueEntityID
  content: string
  authorId: UniqueEntityID
  author: string
  createdAt: Date
  updatedAt?: Date | null
}

export class CommentWithAuthor extends ValueObject<CommentWithAuthorProps> {
  get commentId() { return this.props.commentId }
  get content() { return this.props.content }
  get authorId() { return this.props.authorId }
  get author() { return this.props.author }
  get createdAt() { return this.props.createdAt }
  get updatedAt() { return this.props.updatedAt }

  static create(props: CommentWithAuthorProps) {
    return new CommentWithAuthor(props)
  }
}
```

## 2. Caso de uso adaptado

```typescript
// src/domain/forum/application/use-cases/fetch-answer-comments.ts
import { CommentWithAuthor } from '../../enterprise/entities/value-objects/comment-with-author'
import { AnswerCommentsRepository } from '../repositories/answer-comments-repository'

interface FetchAnswerCommentsUseCaseRequest {
  answerId: string
  page: number
}

interface FetchAnswerCommentsUseCaseResponse {
  comments: CommentWithAuthor[] // Mudou de Comment[] para CommentWithAuthor[]
}

export class FetchAnswerCommentsUseCase {
  constructor(private answerCommentsRepository: AnswerCommentsRepository) {}

  async execute({
    answerId,
    page,
  }: FetchAnswerCommentsUseCaseRequest): Promise<FetchAnswerCommentsUseCaseResponse> {
    const comments = await this.answerCommentsRepository
      .findManyByAnswerIdWithAuthor(answerId, { page })

    return { comments }
  }
}
```

## 3. Interface do repositório

```typescript
// src/domain/forum/application/repositories/answer-comments-repository.ts
import { CommentWithAuthor } from '../../enterprise/entities/value-objects/comment-with-author'
import { PaginationParams } from '@/core/repositories/pagination-params'

export abstract class AnswerCommentsRepository {
  abstract findManyByAnswerId(answerId: string, params: PaginationParams): Promise<AnswerComment[]>
  // Novo método adicionado:
  abstract findManyByAnswerIdWithAuthor(
    answerId: string,
    params: PaginationParams,
  ): Promise<CommentWithAuthor[]>
  abstract create(answerComment: AnswerComment): Promise<void>
  abstract delete(answerComment: AnswerComment): Promise<void>
}
```

## 4. InMemory Repository

```typescript
// test/repositories/in-memory-answer-comments-repository.ts
import { InMemoryStudentsRepository } from './in-memory-students-repository'
import { CommentWithAuthor } from '@/domain/forum/enterprise/entities/value-objects/comment-with-author'

export class InMemoryAnswerCommentsRepository implements AnswerCommentsRepository {
  public items: AnswerComment[] = []

  constructor(
    private studentsRepository: InMemoryStudentsRepository, // Nova dependência
  ) {}

  async findManyByAnswerIdWithAuthor(answerId: string, { page }: PaginationParams) {
    const answerComments = this.items
      .filter((item) => item.answerId.toString() === answerId)
      .slice((page - 1) * 20, page * 20)

    const comments = answerComments.map((comment) => {
      const author = this.studentsRepository.items.find((student) =>
        student.id.equals(comment.authorId),
      )

      if (!author) {
        throw new Error(`Author with ID "${comment.authorId.toString()}" does not exist.`)
      }

      return CommentWithAuthor.create({
        commentId: comment.id,
        content: comment.content,
        authorId: comment.authorId,
        author: author.name,
        createdAt: comment.createdAt,
        updatedAt: comment.updatedAt,
      })
    })

    return comments
  }

  // ... outros métodos existentes
}
```

## 5. Prisma Repository

```typescript
// src/infra/database/prisma/repositories/prisma-answer-comments-repository.ts
import { CommentWithAuthor } from '@/domain/forum/enterprise/entities/value-objects/comment-with-author'
import { PrismaCommentWithAuthorMapper } from '../mappers/prisma-comment-with-author-mapper'

export class PrismaAnswerCommentsRepository implements AnswerCommentsRepository {
  constructor(private prisma: PrismaService) {}

  async findManyByAnswerIdWithAuthor(answerId: string, { page }: PaginationParams) {
    const answerComments = await this.prisma.comment.findMany({
      where: { answerId },
      include: { author: true }, // Join com a tabela de users/students
      orderBy: { createdAt: 'desc' },
      take: 20,
      skip: (page - 1) * 20,
    })

    return answerComments.map(PrismaCommentWithAuthorMapper.toDomain)
    // Mesmo mapper usado para question comments — mesma tabela
  }
}
```

## 6. Controller adaptado

```typescript
// src/infra/http/controllers/fetch-answer-comments.controller.ts
// Mudança: trocar CommentPresenter por CommentWithAuthorPresenter

@Get('/answers/:answerId/comments')
async handle(@Param('answerId') answerId: string, @Query('page') page: number) {
  const result = await this.fetchAnswerComments.execute({ answerId, page })

  if (result.isLeft()) {
    throw new BadRequestException()
  }

  // Antes: CommentPresenter.toHTTP
  // Depois: CommentWithAuthorPresenter.toHTTP
  const comments = result.value.comments.map(CommentWithAuthorPresenter.toHTTP)

  return { comments }
}
```

## 7. Teste unitário adaptado

```typescript
// test/use-cases/fetch-answer-comments.spec.ts
describe('Fetch Answer Comments', () => {
  let inMemoryStudentsRepository: InMemoryStudentsRepository
  let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository
  let sut: FetchAnswerCommentsUseCase

  beforeEach(() => {
    inMemoryStudentsRepository = new InMemoryStudentsRepository()
    inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository(
      inMemoryStudentsRepository, // Passa a dependência
    )
    sut = new FetchAnswerCommentsUseCase(inMemoryAnswerCommentsRepository)
  })

  it('should be able to fetch answer comments with author', async () => {
    // Criar autor real primeiro
    const student = makeStudent({ name: 'John Doe' })
    inMemoryStudentsRepository.items.push(student)

    // Criar comentários com authorId real
    const comment1 = makeAnswerComment({
      answerId: new UniqueEntityID('answer-1'),
      authorId: student.id,
    })
    const comment2 = makeAnswerComment({
      answerId: new UniqueEntityID('answer-1'),
      authorId: student.id,
    })
    const comment3 = makeAnswerComment({
      answerId: new UniqueEntityID('answer-1'),
      authorId: student.id,
    })

    await inMemoryAnswerCommentsRepository.create(comment1)
    await inMemoryAnswerCommentsRepository.create(comment2)
    await inMemoryAnswerCommentsRepository.create(comment3)

    const result = await sut.execute({ answerId: 'answer-1', page: 1 })

    expect(result.value?.comments).toHaveLength(3)
    expect(result.value?.comments).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ author: 'John Doe' }),
      ]),
    )
  })
})
```

## 8. Teste E2E adaptado

```typescript
// src/infra/http/controllers/fetch-answer-comments.controller.e2e-spec.ts
it('should return answer comments with author name', async () => {
  const user = await studentFactory.makePrismaStudent({ name: 'John Doe' })
  // ... criar answer e comments com authorId do user

  const response = await request(app.getHttpServer())
    .get(`/answers/${answerId}/comments`)
    .set('Authorization', `Bearer ${accessToken}`)

  expect(response.statusCode).toBe(200)
  expect(response.body).toEqual({
    comments: expect.arrayContaining([
      expect.objectContaining({ author: 'John Doe' }),
    ]),
  })
})
```