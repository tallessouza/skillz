# Code Examples: Listando Comentários com Autor

## 1. Contrato do repositório — antes e depois

### Antes (só entidade)

```typescript
export abstract class QuestionCommentsRepository {
  abstract findById(id: string): Promise<QuestionComment | null>
  abstract findManyByQuestionId(
    questionId: string,
    params: PaginationParams,
  ): Promise<QuestionComment[]>
  abstract create(questionComment: QuestionComment): Promise<void>
  abstract delete(questionComment: QuestionComment): Promise<void>
}
```

### Depois (com método composto)

```typescript
export abstract class QuestionCommentsRepository {
  abstract findById(id: string): Promise<QuestionComment | null>
  abstract findManyByQuestionId(
    questionId: string,
    params: PaginationParams,
  ): Promise<QuestionComment[]>
  abstract findManyByQuestionIdWithAuthor(
    questionId: string,
    params: PaginationParams,
  ): Promise<CommentWithAuthor[]>
  abstract create(questionComment: QuestionComment): Promise<void>
  abstract delete(questionComment: QuestionComment): Promise<void>
}
```

## 2. InMemory completo com dependência

```typescript
import { InMemoryStudentsRepository } from './in-memory-students-repository'

export class InMemoryQuestionCommentsRepository implements QuestionCommentsRepository {
  public items: QuestionComment[] = []

  constructor(
    private studentsRepository: InMemoryStudentsRepository,
  ) {}

  async findById(id: string) {
    const questionComment = this.items.find((item) => item.id.toString() === id)
    return questionComment ?? null
  }

  async findManyByQuestionId(questionId: string, { page }: PaginationParams) {
    const questionComments = this.items
      .filter((item) => item.questionId.toString() === questionId)
      .slice((page - 1) * 20, page * 20)

    return questionComments
  }

  async findManyByQuestionIdWithAuthor(questionId: string, { page }: PaginationParams) {
    const questionComments = this.items
      .filter((item) => item.questionId.toString() === questionId)
      .slice((page - 1) * 20, page * 20)
      .map((comment) => {
        const author = this.studentsRepository.items.find((student) =>
          student.id.equals(comment.authorId),
        )

        if (!author) {
          throw new Error(
            `Author with ID "${comment.authorId.toString()}" does not exist.`,
          )
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

    return questionComments
  }

  async create(questionComment: QuestionComment) {
    this.items.push(questionComment)
  }

  async delete(questionComment: QuestionComment) {
    const itemIndex = this.items.findIndex((item) => item.id === questionComment.id)
    this.items.splice(itemIndex, 1)
  }
}
```

## 3. Caso de uso atualizado

```typescript
// fetch-question-comments.ts
export class FetchQuestionCommentsUseCase {
  constructor(private questionCommentsRepository: QuestionCommentsRepository) {}

  async execute({ questionId, page }: FetchQuestionCommentsRequest) {
    const comments =
      await this.questionCommentsRepository.findManyByQuestionIdWithAuthor(
        questionId,
        { page },
      )

    return right({ comments })
  }
}
```

## 4. Teste completo

```typescript
let studentsRepository: InMemoryStudentsRepository
let questionCommentsRepository: InMemoryQuestionCommentsRepository
let sut: FetchQuestionCommentsUseCase

beforeEach(() => {
  studentsRepository = new InMemoryStudentsRepository()
  questionCommentsRepository = new InMemoryQuestionCommentsRepository(studentsRepository)
  sut = new FetchQuestionCommentsUseCase(questionCommentsRepository)
})

it('should be able to fetch question comments with author', async () => {
  const student = makeStudent({ name: 'John Doe' })
  studentsRepository.items.push(student)

  const comment1 = makeQuestionComment({
    questionId: question.id,
    authorId: student.id,
  })
  const comment2 = makeQuestionComment({
    questionId: question.id,
    authorId: student.id,
  })
  const comment3 = makeQuestionComment({
    questionId: question.id,
    authorId: student.id,
  })

  questionCommentsRepository.items.push(comment1)
  questionCommentsRepository.items.push(comment2)
  questionCommentsRepository.items.push(comment3)

  const result = await sut.execute({
    questionId: question.id.toString(),
    page: 1,
  })

  expect(result.value.comments).toEqual([
    expect.objectContaining({ author: 'John Doe', commentId: comment1.id }),
    expect.objectContaining({ author: 'John Doe', commentId: comment2.id }),
    expect.objectContaining({ author: 'John Doe', commentId: comment3.id }),
  ])
})
```

## 5. Padrão para corrigir testes existentes que quebram

Quando o repositório InMemory ganha nova dependência, todo teste que o usa precisa ser atualizado:

```typescript
// ANTES (quebra)
let questionCommentsRepository: InMemoryQuestionCommentsRepository

beforeEach(() => {
  questionCommentsRepository = new InMemoryQuestionCommentsRepository()
})

// DEPOIS (funciona)
let studentsRepository: InMemoryStudentsRepository
let questionCommentsRepository: InMemoryQuestionCommentsRepository

beforeEach(() => {
  studentsRepository = new InMemoryStudentsRepository()
  questionCommentsRepository = new InMemoryQuestionCommentsRepository(studentsRepository)
})

// E todo comentário criado precisa ter um autor real:
const student = makeStudent()
studentsRepository.items.push(student)

const comment = makeQuestionComment({ authorId: student.id })
questionCommentsRepository.items.push(comment)
```

## 6. Convenção de nomes para métodos compostos

```typescript
// 1 relacionamento → nome específico
findManyByQuestionIdWithAuthor()

// Múltiplos relacionamentos → nome genérico
findManyByQuestionIdWithDetails()

// Nunca encadear
findManyByQuestionIdWithAuthorAndLikesAndReplies() // ❌
```