# Code Examples: Value Object Detalhes da Pergunta

## 1. Estrutura completa do Value Object QuestionDetails

```typescript
// enterprise/entities/value-objects/question-details.ts
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ValueObject } from '@/core/entities/value-object'
import { Slug } from './slug'
import { Attachment } from '../attachment'

export interface QuestionDetailsProps {
  questionId: UniqueEntityID
  authorId: UniqueEntityID
  author: string
  title: string
  slug: Slug
  content: string
  attachments: Attachment[]
  bestAnswerId?: UniqueEntityID | null
  createdAt: Date
  updatedAt?: Date | null
}

export class QuestionDetails extends ValueObject<QuestionDetailsProps> {
  get questionId() {
    return this.props.questionId
  }

  get authorId() {
    return this.props.authorId
  }

  get author() {
    return this.props.author
  }

  get title() {
    return this.props.title
  }

  get slug() {
    return this.props.slug
  }

  get content() {
    return this.props.content
  }

  get attachments() {
    return this.props.attachments
  }

  get bestAnswerId() {
    return this.props.bestAnswerId
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  static create(props: QuestionDetailsProps) {
    return new QuestionDetails(props)
  }
}
```

## 2. Contrato do repositorio atualizado

```typescript
// domain/forum/application/repositories/questions-repository.ts
export abstract class QuestionsRepository {
  abstract findBySlug(slug: string): Promise<Question | null>
  abstract findDetailsBySlug(slug: string): Promise<QuestionDetails | null>
  abstract findById(id: string): Promise<Question | null>
  abstract findManyRecent(params: PaginationParams): Promise<Question[]>
  abstract create(question: Question): Promise<void>
  abstract save(question: Question): Promise<void>
  abstract delete(question: Question): Promise<void>
}
```

## 3. Caso de uso GetQuestionBySlug atualizado

```typescript
// domain/forum/application/use-cases/get-question-by-slug.ts
interface GetQuestionBySlugResponse {
  question: QuestionDetails // Retorna VO, nao entidade
}

export class GetQuestionBySlugUseCase {
  constructor(private questionsRepository: QuestionsRepository) {}

  async execute({ slug }: GetQuestionBySlugRequest): Promise<Either<ResourceNotFoundError, GetQuestionBySlugResponse>> {
    const question = await this.questionsRepository.findDetailsBySlug(slug)

    if (!question) {
      return left(new ResourceNotFoundError())
    }

    return right({ question })
  }
}
```

## 4. In-Memory Repository completo

```typescript
// test/repositories/in-memory-questions-repository.ts
export class InMemoryQuestionsRepository extends QuestionsRepository {
  public items: Question[] = []

  constructor(
    private questionAttachmentsRepository: InMemoryQuestionAttachmentsRepository,
    private attachmentsRepository: InMemoryAttachmentsRepository,
    private studentsRepository: InMemoryStudentsRepository,
  ) {
    super()
  }

  // Metodo existente — NAO removido
  async findBySlug(slug: string): Promise<Question | null> {
    const question = this.items.find((item) => item.slug.value === slug)
    if (!question) return null
    return question
  }

  // Novo metodo — coexiste com findBySlug
  async findDetailsBySlug(slug: string): Promise<QuestionDetails | null> {
    const question = this.items.find((item) => item.slug.value === slug)

    if (!question) {
      return null
    }

    // Buscar autor
    const author = this.studentsRepository.items.find((student) =>
      student.id.equals(question.authorId),
    )

    if (!author) {
      throw new Error(
        `Author with ID "${question.authorId.toString()}" does not exist.`,
      )
    }

    // Buscar relacionamentos pergunta-anexo
    const questionAttachments =
      this.questionAttachmentsRepository.items.filter((qa) =>
        qa.questionId.equals(question.id),
      )

    // Buscar dados completos dos anexos (two-hop pattern)
    const attachments = questionAttachments.map((questionAttachment) => {
      const attachment = this.attachmentsRepository.items.find((a) =>
        a.id.equals(questionAttachment.attachmentId),
      )

      if (!attachment) {
        throw new Error(
          `Attachment with ID "${questionAttachment.attachmentId.toString()}" does not exist.`,
        )
      }

      return attachment
    })

    // Montar Value Object
    return QuestionDetails.create({
      questionId: question.id,
      authorId: question.authorId,
      author: author.name,
      title: question.title,
      slug: question.slug,
      content: question.content,
      bestAnswerId: question.bestAnswerId,
      attachments,
      createdAt: question.createdAt,
      updatedAt: question.updatedAt,
    })
  }
}
```

## 5. Comparacao: WithAuthor (1 relacionamento) vs Details (2+ relacionamentos)

```typescript
// 1 relacionamento → nome composto
export class CommentWithAuthor extends ValueObject<CommentWithAuthorProps> {
  // commentId, authorId, author, content, createdAt, updatedAt
}

// 2+ relacionamentos → sufixo Details
export class QuestionDetails extends ValueObject<QuestionDetailsProps> {
  // questionId, authorId, author, title, slug, content,
  // attachments (2o relacionamento), bestAnswerId, createdAt, updatedAt
}
```

## 6. Padrao two-hop para buscar dados de relacionamento many-to-many

```typescript
// Hop 1: Descobre QUAIS anexos pertencem a pergunta
const questionAttachments = this.questionAttachmentsRepository.items
  .filter((qa) => qa.questionId.equals(question.id))
// Resultado: [{questionId, attachmentId}, {questionId, attachmentId}]

// Hop 2: Busca OS DADOS de cada anexo
const attachments = questionAttachments.map((qa) => {
  const attachment = this.attachmentsRepository.items
    .find((a) => a.id.equals(qa.attachmentId))
  return attachment // {id, title, url}
})
// Resultado: [{id, title, url}, {id, title, url}]
```