# Code Examples: Caso de Uso Comentar na Resposta

## Fluxo completo de replicacao

### 1. Repositorio origem (QuestionCommentsRepository)

```typescript
// src/domain/forum/application/repositories/question-comments-repository.ts
export interface QuestionCommentsRepository {
  create(questionComment: QuestionComment): Promise<void>
}
```

### 2. Repositorio destino (AnswerCommentsRepository) — apos find-replace

```typescript
// src/domain/forum/application/repositories/answer-comments-repository.ts
export interface AnswerCommentsRepository {
  create(answerComment: AnswerComment): Promise<void>
}
```

### 3. Caso de uso origem (CommentOnQuestion)

```typescript
// src/domain/forum/application/use-cases/comment-on-question.ts
interface CommentOnQuestionUseCaseRequest {
  authorId: string
  questionId: string
  content: string
}

interface CommentOnQuestionUseCaseResponse {
  questionComment: QuestionComment
}

export class CommentOnQuestionUseCase {
  constructor(
    private questionCommentsRepository: QuestionCommentsRepository,
  ) {}

  async execute({
    authorId,
    questionId,
    content,
  }: CommentOnQuestionUseCaseRequest): Promise<CommentOnQuestionUseCaseResponse> {
    const questionComment = QuestionComment.create({
      authorId: new UniqueEntityID(authorId),
      questionId: new UniqueEntityID(questionId),
      content,
    })

    await this.questionCommentsRepository.create(questionComment)

    return { questionComment }
  }
}
```

### 4. Caso de uso destino (CommentOnAnswer) — apos find-replace

```typescript
// src/domain/forum/application/use-cases/comment-on-answer.ts
interface CommentOnAnswerUseCaseRequest {
  authorId: string
  answerId: string
  content: string
}

interface CommentOnAnswerUseCaseResponse {
  answerComment: AnswerComment
}

export class CommentOnAnswerUseCase {
  constructor(
    private answerCommentsRepository: AnswerCommentsRepository,
  ) {}

  async execute({
    authorId,
    answerId,
    content,
  }: CommentOnAnswerUseCaseRequest): Promise<CommentOnAnswerUseCaseResponse> {
    const answerComment = AnswerComment.create({
      authorId: new UniqueEntityID(authorId),
      answerId: new UniqueEntityID(answerId),
      content,
    })

    await this.answerCommentsRepository.create(answerComment)

    return { answerComment }
  }
}
```

### 5. In-memory repository para teste

```typescript
// test/repositories/in-memory-answer-comments-repository.ts
import { AnswerCommentsRepository } from '@/domain/forum/application/repositories/answer-comments-repository'
import { AnswerComment } from '@/domain/forum/enterprise/entities/answer-comment'

export class InMemoryAnswerCommentsRepository implements AnswerCommentsRepository {
  public items: AnswerComment[] = []

  async create(answerComment: AnswerComment) {
    this.items.push(answerComment)
  }
}
```

### 6. Teste unitario

```typescript
// src/domain/forum/application/use-cases/comment-on-answer.spec.ts
import { InMemoryAnswerCommentsRepository } from 'test/repositories/in-memory-answer-comments-repository'
import { CommentOnAnswerUseCase } from './comment-on-answer'

let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository
let sut: CommentOnAnswerUseCase

describe('Comment on Answer', () => {
  beforeEach(() => {
    inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository()
    sut = new CommentOnAnswerUseCase(inMemoryAnswerCommentsRepository)
  })

  it('should be able to comment on answer', async () => {
    const { answerComment } = await sut.execute({
      authorId: '1',
      answerId: '1',
      content: 'Comentario teste',
    })

    expect(answerComment.content).toEqual('Comentario teste')
    expect(inMemoryAnswerCommentsRepository.items[0].id).toEqual(answerComment.id)
  })
})
```

## Checklist de substituicao (find-replace)

Ao replicar de Question para Answer, todas estas ocorrencias devem ser substituidas:

| Token origem | Token destino |
|-------------|---------------|
| `Question` (PascalCase) | `Answer` |
| `question` (camelCase) | `answer` |
| `QUESTION` (UPPER_CASE) | `ANSWER` |
| `question-` (kebab-case em nomes de arquivo) | `answer-` |

## Verificacao final

```bash
# Executar todos os testes para confirmar que a replicacao foi completa
npm run test

# Saida esperada: todos os testes passando, incluindo "Comment on Answer"
```