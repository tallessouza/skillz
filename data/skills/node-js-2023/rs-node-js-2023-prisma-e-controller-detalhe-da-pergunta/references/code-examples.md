# Code Examples: Presenter e Mapper com Composicao

## 1. PrismaAttachmentMapper — mapper base reutilizavel

```typescript
// infra/database/prisma/mappers/prisma-attachment-mapper.ts
import { Attachment } from '@/domain/forum/enterprise/entities/attachment'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Prisma, Attachment as PrismaAttachment } from '@prisma/client'

export class PrismaAttachmentMapper {
  static toDomain(raw: PrismaAttachment): Attachment {
    return Attachment.create(
      {
        title: raw.title,
        url: raw.url,
      },
      new UniqueEntityID(raw.id),
    )
  }
}
```

**Nota:** Este mapper nao existia antes desta aula. Foi criado especificamente para ser reutilizado pelo `PrismaQuestionDetailsMapper`.

## 2. PrismaQuestionDetailsMapper — mapper composto

```typescript
// infra/database/prisma/mappers/prisma-question-details-mapper.ts
import { QuestionDetails } from '@/domain/forum/enterprise/entities/value-objects/question-details'
import { Slug } from '@/domain/forum/enterprise/entities/value-objects/slug'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  Question as PrismaQuestion,
  User as PrismaUser,
  Attachment as PrismaAttachment,
} from '@prisma/client'
import { PrismaAttachmentMapper } from './prisma-attachment-mapper'

type PrismaQuestionDetails = PrismaQuestion & {
  author: PrismaUser
  attachments: PrismaAttachment[]
}

export class PrismaQuestionDetailsMapper {
  static toDomain(raw: PrismaQuestionDetails): QuestionDetails {
    return QuestionDetails.create({
      questionId: new UniqueEntityID(raw.id),
      authorId: new UniqueEntityID(raw.authorId),
      author: raw.author.name,
      title: raw.title,
      content: raw.content,
      slug: Slug.create(raw.slug),
      bestAnswerId: raw.bestAnswerId
        ? new UniqueEntityID(raw.bestAnswerId)
        : null,
      attachments: raw.attachments.map(PrismaAttachmentMapper.toDomain),
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    })
  }
}
```

**Ponto chave:** `raw.attachments.map(PrismaAttachmentMapper.toDomain)` — composicao de mapper.

## 3. Repository com include

```typescript
// Dentro de PrismaQuestionsRepository
async findDetailsBySlug(slug: string): Promise<QuestionDetails | null> {
  const question = await this.prisma.question.findUnique({
    where: { slug },
    include: {
      author: true,
      attachments: true,
    },
  })

  if (!question) {
    return null
  }

  return PrismaQuestionDetailsMapper.toDomain(question)
}
```

**Sem o `include`, TypeScript acusa erro porque o mapper espera `author` e `attachments`.**

## 4. AttachmentPresenter

```typescript
// infra/http/presenters/attachment-presenter.ts
import { Attachment } from '@/domain/forum/enterprise/entities/attachment'

export class AttachmentPresenter {
  static toHTTP(attachment: Attachment) {
    return {
      id: attachment.id.toString(),
      title: attachment.title,
      url: attachment.url,
    }
  }
}
```

## 5. QuestionDetailsPresenter — presenter composto

```typescript
// infra/http/presenters/question-details-presenter.ts
import { QuestionDetails } from '@/domain/forum/enterprise/entities/value-objects/question-details'
import { AttachmentPresenter } from './attachment-presenter'

export class QuestionDetailsPresenter {
  static toHTTP(questionDetails: QuestionDetails) {
    return {
      questionId: questionDetails.questionId.toString(),
      authorId: questionDetails.authorId.toString(),
      author: questionDetails.author,
      title: questionDetails.title,
      slug: questionDetails.slug.value,
      content: questionDetails.content,
      bestAnswerId: questionDetails.bestAnswerId?.toString(),
      attachments: questionDetails.attachments.map(AttachmentPresenter.toHTTP),
      createdAt: questionDetails.createdAt,
      updatedAt: questionDetails.updatedAt,
    }
  }
}
```

## 6. Teste E2E com factories de relacoes

```typescript
// No teste do controller
let attachmentFactory: AttachmentFactory
let questionAttachmentFactory: QuestionAttachmentFactory

// Nos providers do modulo de teste
providers: [
  // ...existentes
  AttachmentFactory,
  QuestionAttachmentFactory,
]

// No teste
it('should return question details with attachments', async () => {
  const user = await studentFactory.makePrismaStudent({ name: 'John Doe' })

  const question = await questionFactory.makePrismaQuestion({
    authorId: user.id,
  })

  const attachment = await attachmentFactory.makePrismaAttachment({
    title: 'Some attachment',
  })

  await questionAttachmentFactory.makePrismaQuestionAttachment({
    attachmentId: attachment.id,
    questionId: question.id,
  })

  const response = await request(app.getHttpServer())
    .get(`/questions/${question.slug.value}`)
    .set('Authorization', `Bearer ${accessToken}`)

  expect(response.body).toEqual({
    question: expect.objectContaining({
      title: question.title,
      author: 'John Doe',
      attachments: [
        expect.objectContaining({
          title: 'Some attachment',
        }),
      ],
    }),
  })
})
```

## 7. Corrigindo testes afetados pela mudanca de interface

```typescript
// Quando InMemoryQuestionsRepository ganha novas dependencias,
// TODOS os arquivos que instanciam ele precisam ser atualizados:

const inMemoryAttachmentsRepository = new InMemoryAttachmentsRepository()
const inMemoryStudentsRepository = new InMemoryStudentsRepository()

const inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
  inMemoryQuestionAttachmentsRepository,
  inMemoryAttachmentsRepository, // nova dependencia
  inMemoryStudentsRepository,    // nova dependencia
)
```

**A ordem dos parametros importa — deve seguir a assinatura do construtor.**