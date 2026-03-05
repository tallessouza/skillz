# Code Examples: Criando Pergunta com Anexos

## Teste E2E completo do CreateQuestionController

```typescript
// create-question.controller.e2e-spec.ts
describe('CreateQuestionController (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let studentFactory: StudentFactory
  let attachmentFactory: AttachmentFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, AttachmentFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    prisma = moduleRef.get(PrismaService)
    studentFactory = moduleRef.get(StudentFactory)
    attachmentFactory = moduleRef.get(AttachmentFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[POST] /questions (with attachments)', async () => {
    const user = await studentFactory.makePrismaStudent()
    const accessToken = jwt.sign({ sub: user.id.toString() })

    // Criar anexos ANTES da pergunta
    const attachment1 = await attachmentFactory.makePrismaAttachment()
    const attachment2 = await attachmentFactory.makePrismaAttachment()

    const response = await request(app.getHttpServer())
      .post('/questions')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        title: 'New question',
        content: 'Question content',
        attachments: [
          attachment1.id.toString(),
          attachment2.id.toString(),
        ],
      })

    expect(response.statusCode).toBe(201)

    // Verificar que a pergunta foi criada
    const questionOnDatabase = await prisma.question.findFirst({
      where: { title: 'New question' },
    })
    expect(questionOnDatabase).toBeTruthy()

    // Verificar que os anexos foram ASSOCIADOS a pergunta
    const attachmentsOnDatabase = await prisma.attachment.findMany({
      where: { questionId: questionOnDatabase?.id },
    })
    expect(attachmentsOnDatabase).toHaveLength(2)
  })
})
```

## Factory de Attachment (completa)

```typescript
// test/factories/make-attachment.ts
import { faker } from '@faker-js/faker'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  Attachment,
  AttachmentProps,
} from '@/domain/forum/enterprise/entities/attachment'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { PrismaAttachmentMapper } from '@/infra/database/prisma/mappers/prisma-attachment-mapper'

export function makeAttachment(
  override: Partial<AttachmentProps> = {},
  id?: UniqueEntityID,
) {
  const attachment = Attachment.create(
    {
      title: faker.lorem.slug(),
      url: faker.lorem.slug(),
      ...override,
    },
    id,
  )

  return attachment
}

@Injectable()
export class AttachmentFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaAttachment(
    data: Partial<AttachmentProps> = {},
  ): Promise<Attachment> {
    const attachment = makeAttachment(data)

    await this.prisma.attachment.create({
      data: PrismaAttachmentMapper.toPrisma(attachment),
    })

    return attachment
  }
}
```

## Caso de uso CreateQuestion (trecho relevante)

```typescript
// create-question.use-case.ts
export class CreateQuestionUseCase {
  async execute({ authorId, title, content, attachmentsIds }: Request) {
    const question = Question.create({
      authorId: new UniqueEntityID(authorId),
      title,
      content,
    })

    // Cria os QuestionAttachments a partir dos IDs recebidos
    const questionAttachments = attachmentsIds.map((attachmentId) => {
      return QuestionAttachment.create({
        attachmentId: new UniqueEntityID(attachmentId),
        questionId: question.id,
      })
      // NOTA: o segundo parametro (id da pivot) NAO e passado aqui
      // entao o id e gerado automaticamente — diferente do attachmentId
    })

    question.attachments = new QuestionAttachmentList(questionAttachments)

    await this.questionsRepository.create(question)

    return { question }
  }
}
```

## Bug no mapper (antes vs depois)

```typescript
// ANTES (bugado) — prisma-question-attachment-mapper.ts
export class PrismaQuestionAttachmentMapper {
  static toPrismaUpdateMany(
    attachments: QuestionAttachment[],
  ): Prisma.AttachmentUpdateManyArgs {
    const attachmentIds = attachments.map((attachment) => {
      return attachment.id.toString() // BUG: id da pivot, nao do anexo
    })

    return {
      where: { id: { in: attachmentIds } },
      data: { questionId: attachments[0].questionId.toString() },
    }
  }
}

// DEPOIS (corrigido)
export class PrismaQuestionAttachmentMapper {
  static toPrismaUpdateMany(
    attachments: QuestionAttachment[],
  ): Prisma.AttachmentUpdateManyArgs {
    const attachmentIds = attachments.map((attachment) => {
      return attachment.attachmentId.toString() // CORRETO: id do anexo real
    })

    return {
      where: { id: { in: attachmentIds } },
      data: { questionId: attachments[0].questionId.toString() },
    }
  }
}
```

## Tecnica de debugging por camadas

```typescript
// 1. Console.log no controller
console.log('attachments', attachments) // Chegam os IDs? ✅

// 2. Console.log no repository
console.log('question.attachments', question.attachments) // CurrentItems populado? ✅

// 3. Console.log no createMany do pivot repository
console.log('attachments', attachments) // Chega vazio? ❌ (era vazio antes do fix)

// 4. Conclusao: o problema esta entre o repository e o createMany
// → Mapper usa campo errado (id ao inves de attachmentId)
```