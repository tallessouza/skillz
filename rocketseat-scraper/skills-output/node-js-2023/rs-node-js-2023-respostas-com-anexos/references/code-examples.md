# Code Examples: Respostas com Anexos

## 1. Repositório abstrato — AnswerAttachmentsRepository

```typescript
// src/domain/forum/application/repositories/answer-attachments-repository.ts
export abstract class AnswerAttachmentsRepository {
  abstract findManyByAnswerId(answerId: string): Promise<AnswerAttachment[]>
  abstract deleteManyByAnswerId(answerId: string): Promise<void>
  abstract createMany(attachments: AnswerAttachment[]): Promise<void>
  abstract deleteMany(attachments: AnswerAttachment[]): Promise<void>
}
```

## 2. In-Memory implementation

```typescript
// test/repositories/in-memory-answer-attachments-repository.ts
async createMany(attachments: AnswerAttachment[]) {
  this.items.push(...attachments)
}

async deleteMany(attachments: AnswerAttachment[]) {
  this.items = this.items.filter((item) => {
    return !attachments.some((attachment) => attachment.equals(item))
  })
}
```

## 3. In-Memory Answers Repository (com dependência)

```typescript
// test/repositories/in-memory-answers-repository.ts
constructor(
  private answerAttachmentsRepository: InMemoryAnswerAttachmentsRepository,
) {}

async create(answer: Answer) {
  this.items.push(answer)
  await this.answerAttachmentsRepository.createMany(
    answer.attachments.getItems(),
  )
  DomainEvents.dispatchEventsForAggregate(answer.id)
}

async save(answer: Answer) {
  const itemIndex = this.items.findIndex((item) => item.id.equals(answer.id))
  this.items[itemIndex] = answer

  await this.answerAttachmentsRepository.createMany(
    answer.attachments.getNewItems(),
  )
  await this.answerAttachmentsRepository.deleteMany(
    answer.attachments.getRemovedItems(),
  )

  DomainEvents.dispatchEventsForAggregate(answer.id)
}
```

## 4. Prisma Mapper — toPrismaUpdateMany

```typescript
// src/infra/database/prisma/mappers/prisma-answer-attachment-mapper.ts
static toPrismaUpdateMany(attachments: AnswerAttachment[]) {
  return {
    where: {
      id: {
        in: attachments.map((attachment) => attachment.attachmentId.toString()),
      },
    },
    data: {
      answerId: attachments[0].answerId.toString(),
    },
  }
}
```

## 5. Prisma Answers Repository

```typescript
// src/infra/database/prisma/repositories/prisma-answers-repository.ts
constructor(
  private prisma: PrismaService,
  private answerAttachmentsRepository: PrismaAnswerAttachmentsRepository,
) {}

async create(answer: Answer) {
  const data = PrismaAnswerMapper.toPrisma(answer)
  await this.prisma.answer.create({ data })

  await this.answerAttachmentsRepository.createMany(
    answer.attachments.getItems(),
  )
}

async save(answer: Answer) {
  const data = PrismaAnswerMapper.toPrisma(answer)

  await Promise.all([
    this.prisma.answer.update({
      where: { id: data.id },
      data,
    }),
    this.answerAttachmentsRepository.createMany(
      answer.attachments.getNewItems(),
    ),
    this.answerAttachmentsRepository.deleteMany(
      answer.attachments.getRemovedItems(),
    ),
  ])
}
```

## 6. Prisma Answer Attachments Repository

```typescript
// src/infra/database/prisma/repositories/prisma-answer-attachments-repository.ts
async createMany(attachments: AnswerAttachment[]) {
  if (attachments.length === 0) return

  const data = PrismaAnswerAttachmentMapper.toPrismaUpdateMany(attachments)
  await this.prisma.attachment.updateMany(data)
}

async deleteMany(attachments: AnswerAttachment[]) {
  if (attachments.length === 0) return

  const attachmentIds = attachments.map((attachment) =>
    attachment.id.toString(),
  )

  await this.prisma.attachment.deleteMany({
    where: { id: { in: attachmentIds } },
  })
}
```

## 7. Controller com Zod schema

```typescript
// answer-question.controller.ts
const bodySchema = z.object({
  content: z.string(),
  attachments: z.array(z.string().uuid()),
})

// edit-answer.controller.ts
const bodySchema = z.object({
  content: z.string(),
  attachments: z.array(z.string().uuid()).default([]),
})
```

## 8. Teste unitário — persist attachments on create

```typescript
it('should persist attachments when creating a new answer', async () => {
  const result = await sut.execute({
    authorId: '1',
    questionId: '1',
    content: 'Conteudo da resposta',
    attachmentsIds: ['1', '2'],
  })

  expect(result.isRight()).toBe(true)
  expect(inMemoryAnswerAttachmentsRepository.items).toHaveLength(2)
  expect(inMemoryAnswerAttachmentsRepository.items).toEqual(
    expect.arrayContaining([
      expect.objectContaining({ attachmentId: new UniqueEntityID('1') }),
      expect.objectContaining({ attachmentId: new UniqueEntityID('2') }),
    ]),
  )
})
```

## 9. Teste unitário — sync on edit

```typescript
it('should sync new and removed attachments when editing an answer', async () => {
  const newAnswer = makeAnswer()
  await inMemoryAnswersRepository.create(newAnswer)

  inMemoryAnswerAttachmentsRepository.items.push(
    makeAnswerAttachment({ answerId: newAnswer.id, attachmentId: new UniqueEntityID('1') }),
    makeAnswerAttachment({ answerId: newAnswer.id, attachmentId: new UniqueEntityID('2') }),
  )

  const result = await sut.execute({
    answerId: newAnswer.id.toString(),
    authorId: newAnswer.authorId.toString(),
    content: 'Conteudo teste',
    attachmentsIds: ['1', '3'],
  })

  expect(result.isRight()).toBe(true)
  expect(inMemoryAnswerAttachmentsRepository.items).toHaveLength(2)
  expect(inMemoryAnswerAttachmentsRepository.items).toEqual(
    expect.arrayContaining([
      expect.objectContaining({ attachmentId: new UniqueEntityID('1') }),
      expect.objectContaining({ attachmentId: new UniqueEntityID('3') }),
    ]),
  )
})
```

## 10. Factory para testes e2e

```typescript
// test/factories/make-answer-attachment.ts
@Injectable()
export class AnswerAttachmentFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaAnswerAttachment(
    data: Partial<AnswerAttachmentProps> = {},
  ): Promise<AnswerAttachment> {
    const answerAttachment = makeAnswerAttachment(data)

    await this.prisma.attachment.update({
      where: { id: answerAttachment.attachmentId.toString() },
      data: { answerId: answerAttachment.answerId.toString() },
    })

    return answerAttachment
  }
}
```

## 11. Teste e2e — create answer with attachments

```typescript
it('[POST] /questions/:questionId/answers (with attachments)', async () => {
  const user = await studentFactory.makePrismaStudent()
  const accessToken = jwt.sign({ sub: user.id.toString() })
  const question = await questionFactory.makePrismaQuestion({ authorId: user.id })

  const attachment1 = await attachmentFactory.makePrismaAttachment()
  const attachment2 = await attachmentFactory.makePrismaAttachment()

  const response = await request(app.getHttpServer())
    .post(`/questions/${question.id.toString()}/answers`)
    .set('Authorization', `Bearer ${accessToken}`)
    .send({
      content: 'New answer content',
      attachments: [attachment1.id.toString(), attachment2.id.toString()],
    })

  expect(response.statusCode).toBe(201)

  const answerOnDatabase = await prisma.answer.findFirst({
    where: { content: 'New answer content' },
  })

  const attachmentsOnDatabase = await prisma.attachment.findMany({
    where: { answerId: answerOnDatabase?.id },
  })

  expect(attachmentsOnDatabase).toHaveLength(2)
})
```