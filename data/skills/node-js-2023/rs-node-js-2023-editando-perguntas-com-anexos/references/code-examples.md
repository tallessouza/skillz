# Code Examples: Editando Perguntas com Anexos

## 1. Controller completo com attachments

```typescript
// edit-question.controller.ts
@Controller('/questions/:id')
export class EditQuestionController {
  constructor(private editQuestion: EditQuestionUseCase) {}

  @Put()
  async handle(
    @Body() body: EditQuestionBody,
    @Param('id') questionId: string,
    @CurrentUser() user: UserPayload,
  ) {
    const { title, content, attachments } = body

    await this.editQuestion.execute({
      questionId,
      authorId: user.sub,
      title,
      content,
      attachmentsIds: attachments, // Array de UUIDs dos anexos desejados
    })
  }
}
```

## 2. QuestionAttachmentFactory completa

```typescript
import { Injectable } from '@nestjs/common'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import {
  QuestionAttachment,
  QuestionAttachmentProps,
} from '@/domain/forum/enterprise/entities/question-attachment'
import { makeQuestionAttachment } from 'test/factories/make-question-attachment'

@Injectable()
export class QuestionAttachmentFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaQuestionAttachment(
    data: Partial<QuestionAttachmentProps> = {},
  ): Promise<QuestionAttachment> {
    const questionAttachment = makeQuestionAttachment(data)

    // Relacionar = atualizar o questionId de um attachment existente
    await this.prisma.attachment.update({
      where: {
        id: questionAttachment.attachmentId.toString(),
      },
      data: {
        questionId: questionAttachment.questionId.toString(),
      },
    })

    return questionAttachment
  }
}
```

## 3. Teste E2E completo

```typescript
describe('[PUT] /questions/:id (with attachments)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let jwt: JwtService
  let studentFactory: StudentFactory
  let questionFactory: QuestionFactory
  let attachmentFactory: AttachmentFactory
  let questionAttachmentFactory: QuestionAttachmentFactory

  // ... setup com providers incluindo as factories

  test('should edit a question with attachments', async () => {
    const user = await studentFactory.makePrismaStudent()
    const accessToken = jwt.sign({ sub: user.id.toString() })

    // Cria a pergunta
    const question = await questionFactory.makePrismaQuestion({
      authorId: user.id,
    })

    // Cria 3 attachments (simula uploads)
    const attachment1 = await attachmentFactory.makePrismaAttachment()
    const attachment2 = await attachmentFactory.makePrismaAttachment()
    const attachment3 = await attachmentFactory.makePrismaAttachment()

    // Estado inicial: pergunta tem attachment 1 e 2
    await questionAttachmentFactory.makePrismaQuestionAttachment({
      attachmentId: attachment1.id,
      questionId: question.id,
    })
    await questionAttachmentFactory.makePrismaQuestionAttachment({
      attachmentId: attachment2.id,
      questionId: question.id,
    })

    // Edita: envia attachment 1 e 3 (remove 2, adiciona 3)
    const response = await request(app.getHttpServer())
      .put(`/questions/${question.id.toString()}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        title: 'New title',
        content: 'New content',
        attachments: [
          attachment1.id.toString(),
          attachment3.id.toString(),
        ],
      })

    expect(response.statusCode).toBe(204)

    // Verifica: banco tem apenas attachment 1 e 3
    const attachmentsOnDatabase = await prisma.attachment.findMany({
      where: {
        questionId: question.id.toString(),
      },
    })

    expect(attachmentsOnDatabase).toHaveLength(2)
    expect(attachmentsOnDatabase).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: attachment1.id.toString() }),
        expect.objectContaining({ id: attachment3.id.toString() }),
      ]),
    )
  })
})
```

## 4. Registrando factories nos providers do teste

```typescript
beforeAll(async () => {
  const moduleRef = await Test.createTestingModule({
    imports: [AppModule, DatabaseModule],
    providers: [
      StudentFactory,
      QuestionFactory,
      AttachmentFactory,           // Factory de criação de attachment
      QuestionAttachmentFactory,   // Factory de relacionamento
    ],
  }).compile()

  // Injeção
  attachmentFactory = moduleRef.get(AttachmentFactory)
  questionAttachmentFactory = moduleRef.get(QuestionAttachmentFactory)
  // ... demais injeções
})
```

## 5. Padrão de verificação com console.log (debug)

```typescript
// Para debug: verificar visualmente os IDs
console.log(attachmentsOnDatabase)
console.log(attachment1.id) // Comparar com o que está no banco
console.log(attachment3.id) // Confirmar que são os mesmos
```