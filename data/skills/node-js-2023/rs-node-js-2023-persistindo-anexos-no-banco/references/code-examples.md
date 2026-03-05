# Code Examples: Persistindo Anexos no Banco

## 1. PrismaQuestionsRepository completo

```typescript
// src/infra/database/prisma/repositories/prisma-questions-repository.ts
import { QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository'
import { QuestionAttachmentsRepository } from '@/domain/forum/application/repositories/question-attachments-repository'
import { Question } from '@/domain/forum/enterprise/entities/question'
import { PrismaQuestionMapper } from '../mappers/prisma-question-mapper'
import { PrismaService } from '../prisma.service'

export class PrismaQuestionsRepository implements QuestionsRepository {
  constructor(
    private prisma: PrismaService,
    private questionAttachmentsRepository: QuestionAttachmentsRepository,
  ) {}

  async create(question: Question): Promise<void> {
    const data = PrismaQuestionMapper.toPrisma(question)

    // Sequencial: FK precisa existir
    await this.prisma.question.create({ data })

    await this.questionAttachmentsRepository.createMany(
      question.attachments.getItems(),
    )
  }

  async save(question: Question): Promise<void> {
    const data = PrismaQuestionMapper.toPrisma(question)

    // Paralelo: operacoes independentes
    await Promise.all([
      this.prisma.question.update({
        where: { id: data.id },
        data,
      }),
      this.questionAttachmentsRepository.createMany(
        question.attachments.getNewItems(),
      ),
      this.questionAttachmentsRepository.deleteMany(
        question.attachments.getRemovedItems(),
      ),
    ])
  }
}
```

## 2. PrismaQuestionAttachmentsRepository completo

```typescript
// src/infra/database/prisma/repositories/prisma-question-attachments-repository.ts
import { QuestionAttachmentsRepository } from '@/domain/forum/application/repositories/question-attachments-repository'
import { QuestionAttachment } from '@/domain/forum/enterprise/entities/question-attachment'
import { PrismaQuestionAttachmentMapper } from '../mappers/prisma-question-attachment-mapper'
import { PrismaService } from '../prisma.service'

export class PrismaQuestionAttachmentsRepository
  implements QuestionAttachmentsRepository
{
  constructor(private prisma: PrismaService) {}

  async createMany(attachments: QuestionAttachment[]): Promise<void> {
    if (attachments.length === 0) return

    const data =
      PrismaQuestionAttachmentMapper.toPrismaUpdateMany(attachments)

    await this.prisma.attachment.updateMany(data)
  }

  async deleteMany(attachments: QuestionAttachment[]): Promise<void> {
    if (attachments.length === 0) return

    const attachmentIds = attachments.map((a) => a.attachmentId.toString())

    await this.prisma.attachment.deleteMany({
      where: {
        id: {
          in: attachmentIds,
        },
      },
    })
  }
}
```

## 3. Mapper com toPrismaUpdateMany

```typescript
// src/infra/database/prisma/mappers/prisma-question-attachment-mapper.ts
import { Prisma } from '@prisma/client'
import { QuestionAttachment } from '@/domain/forum/enterprise/entities/question-attachment'

export class PrismaQuestionAttachmentMapper {
  static toPrismaUpdateMany(
    attachments: QuestionAttachment[],
  ): Prisma.AttachmentUpdateManyArgs {
    const attachmentIds = attachments.map((a) => a.attachmentId.toString())

    return {
      where: {
        id: {
          in: attachmentIds,
        },
      },
      data: {
        questionId: attachments[0].questionId.toString(),
      },
    }
  }
}
```

## 4. Controller recebendo attachments

```typescript
// No create-question.controller.ts
const bodySchema = z.object({
  title: z.string(),
  content: z.string(),
  attachments: z.array(z.string().uuid()),
})

// Dentro do handler:
const { title, content, attachments } = body

await this.createQuestion.execute({
  title,
  content,
  authorId: userId,
  attachmentsIds: attachments,
})
```

## 5. Teste E2E com attachments

```typescript
// create-question.controller.e2e-spec.ts
it('should create a question with attachments', async () => {
  // Criar attachments no banco ANTES
  const attachment1 = await prisma.attachment.create({
    data: { title: 'Attachment 1', url: 'http://example.com/1' },
  })
  const attachment2 = await prisma.attachment.create({
    data: { title: 'Attachment 2', url: 'http://example.com/2' },
  })

  const response = await request(app.getHttpServer())
    .post('/questions')
    .set('Authorization', `Bearer ${accessToken}`)
    .send({
      title: 'New question',
      content: 'Question content',
      attachments: [attachment1.id, attachment2.id],
    })

  expect(response.statusCode).toBe(201)

  // Verificar que os attachments foram associados
  const attachmentsOnDb = await prisma.attachment.findMany({
    where: { questionId: { not: null } },
  })

  expect(attachmentsOnDb).toHaveLength(2)
})
```

## 6. Comparacao: sequencial vs paralelo

```typescript
// SEQUENCIAL (create) — necessario por causa da FK
async create(question: Question) {
  await this.prisma.question.create({ data })     // 1o: cria pai
  await this.attachmentsRepo.createMany(items)     // 2o: associa filhos
}

// PARALELO (save/update) — operacoes independentes
async save(question: Question) {
  await Promise.all([
    this.prisma.question.update({ where, data }),  // atualiza pai
    this.attachmentsRepo.createMany(newItems),     // novos filhos
    this.attachmentsRepo.deleteMany(removedItems), // remove filhos
  ])
}
```