# Code Examples: Criando Pergunta com Anexos

## 1. QuestionProps com attachments

```typescript
// question.ts
import { QuestionAttachment } from './question-attachment'

interface QuestionProps {
  authorId: UniqueEntityId
  title: string
  content: string
  attachments: QuestionAttachment[]
  createdAt: Date
  updatedAt?: Date
}
```

## 2. Metodo create com default vazio

```typescript
static create(
  props: Optional<QuestionProps, 'attachments' | 'createdAt'>,
  id?: UniqueEntityId,
) {
  const question = new Question(
    {
      ...props,
      attachments: props.attachments ?? [],
      createdAt: props.createdAt ?? new Date(),
    },
    id,
  )

  return question
}
```

## 3. Getter e Setter

```typescript
get attachments() {
  return this.props.attachments
}

set attachments(attachments: QuestionAttachment[]) {
  this.props.attachments = attachments
}
```

## 4. Use case completo

```typescript
// create-question.ts
interface CreateQuestionUseCaseRequest {
  authorId: string
  title: string
  content: string
  attachmentIds: string[]
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
    attachmentIds,
  }: CreateQuestionUseCaseRequest): Promise<CreateQuestionUseCaseResponse> {
    const question = Question.create({
      authorId: new UniqueEntityId(authorId),
      title,
      content,
    })

    const questionAttachments = attachmentIds.map((attachmentId) => {
      return QuestionAttachment.create({
        attachmentId: new UniqueEntityId(attachmentId),
        questionId: question.id,
      })
    })

    question.attachments = questionAttachments

    await this.questionsRepository.create(question)

    return { question }
  }
}
```

## 5. Teste unitario

```typescript
// create-question.spec.ts
it('should be able to create a question with attachments', async () => {
  const result = await sut.execute({
    authorId: '1',
    title: 'Nova pergunta',
    content: 'Conteudo da pergunta',
    attachmentIds: ['1', '2'],
  })

  expect(result.isRight()).toBe(true)
  expect(inMemoryQuestionsRepository.items[0].attachments).toHaveLength(2)
  expect(inMemoryQuestionsRepository.items[0].attachments).toEqual([
    expect.objectContaining({
      attachmentId: new UniqueEntityId('1'),
    }),
    expect.objectContaining({
      attachmentId: new UniqueEntityId('2'),
    }),
  ])
})
```

## 6. Fluxo visual

```
Frontend:
  1. Usuario seleciona arquivo
  2. POST /attachments (MultipartFormData) → retorna { attachmentId: "abc123" }
  3. Usuario seleciona outro arquivo
  4. POST /attachments (MultipartFormData) → retorna { attachmentId: "def456" }
  5. Usuario submete formulario
  6. POST /questions (JSON) → { title, content, attachmentIds: ["abc123", "def456"] }

Backend (use case):
  1. Recebe attachmentIds: ["abc123", "def456"]
  2. Cria Question (sem attachments, gera ID)
  3. Mapeia IDs → QuestionAttachment[] (usando question.id)
  4. Injeta via setter: question.attachments = [...]
  5. questionsRepository.create(question) — persiste tudo
```