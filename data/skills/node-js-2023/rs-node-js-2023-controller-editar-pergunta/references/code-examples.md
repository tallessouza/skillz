# Code Examples: Controller Editar Pergunta

## Controller completo de edicao

```typescript
// src/infra/http/controllers/edit-question.controller.ts
import { Controller, Put, HttpCode, Body, Param, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { EditQuestionUseCase } from '@/domain/forum/application/use-cases/edit-question'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { z } from 'zod'

const editQuestionBodySchema = z.object({
  title: z.string(),
  content: z.string(),
})

type EditQuestionBodySchema = z.infer<typeof editQuestionBodySchema>

@Controller('/questions/:id')
@UseGuards(AuthGuard('jwt'))
export class EditQuestionController {
  constructor(private editQuestion: EditQuestionUseCase) {}

  @Put()
  @HttpCode(204)
  async handle(
    @CurrentUser() user: UserPayload,
    @Param('id') questionId: string,
    @Body(new ZodValidationPipe(editQuestionBodySchema)) body: EditQuestionBodySchema,
  ) {
    const { title, content } = body
    const userId = user.sub

    await this.editQuestion.execute({
      questionId,
      authorId: userId,
      title,
      content,
      attachmentsIds: [],
    })
  }
}
```

## Use case com @Injectable

```typescript
// src/domain/forum/application/use-cases/edit-question.ts
import { Injectable } from '@nestjs/common'

@Injectable()
export class EditQuestionUseCase {
  constructor(private questionsRepository: QuestionsRepository) {}

  async execute({ questionId, authorId, title, content, attachmentsIds }: EditQuestionRequest) {
    const question = await this.questionsRepository.findById(questionId)

    if (!question) {
      return left(new ResourceNotFoundError())
    }

    if (question.authorId.toString() !== authorId) {
      return left(new NotAllowedError())
    }

    question.title = title
    question.content = content

    await this.questionsRepository.save(question)

    return right({})
  }
}
```

## Repositorio: interface → classe abstrata

```typescript
// ANTES (interface — eliminada na compilacao)
export interface QuestionsRepository {
  findById(id: string): Promise<Question | null>
  findBySlug(slug: string): Promise<Question | null>
  findManyRecent(params: PaginationParams): Promise<Question[]>
  save(question: Question): Promise<void>
  create(question: Question): Promise<void>
  delete(question: Question): Promise<void>
}

// DEPOIS (classe abstrata — sobrevive compilacao)
export abstract class QuestionsRepository {
  abstract findById(id: string): Promise<Question | null>
  abstract findBySlug(slug: string): Promise<Question | null>
  abstract findManyRecent(params: PaginationParams): Promise<Question[]>
  abstract save(question: Question): Promise<void>
  abstract create(question: Question): Promise<void>
  abstract delete(question: Question): Promise<void>
}
```

## DatabaseModule com todos os providers

```typescript
@Module({
  imports: [PrismaModule],
  providers: [
    {
      provide: QuestionsRepository,
      useClass: PrismaQuestionsRepository,
    },
    {
      provide: AnswersRepository,
      useClass: PrismaAnswersRepository,
    },
    {
      provide: QuestionCommentsRepository,
      useClass: PrismaQuestionCommentsRepository,
    },
    {
      provide: AnswerCommentsRepository,
      useClass: PrismaAnswerCommentsRepository,
    },
    {
      provide: AnswerAttachmentsRepository,
      useClass: PrismaAnswerAttachmentsRepository,
    },
    {
      provide: QuestionAttachmentsRepository,
      useClass: PrismaQuestionAttachmentsRepository,
    },
  ],
  exports: [
    QuestionsRepository,
    AnswersRepository,
    QuestionCommentsRepository,
    AnswerCommentsRepository,
    AnswerAttachmentsRepository,
    QuestionAttachmentsRepository,
  ],
})
export class DatabaseModule {}
```

## HttpModule registrando controller e use case

```typescript
@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [
    // ... outros controllers
    EditQuestionController,
  ],
  providers: [
    // ... outros use cases
    EditQuestionUseCase,
  ],
})
export class HttpModule {}
```

## Teste E2E completo

```typescript
// src/infra/http/controllers/edit-question.controller.e2e-spec.ts
describe('Edit Question (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let studentFactory: StudentFactory
  let questionFactory: QuestionFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, QuestionFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    prisma = moduleRef.get(PrismaService)
    studentFactory = moduleRef.get(StudentFactory)
    questionFactory = moduleRef.get(QuestionFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[PUT] /questions/:id', async () => {
    const user = await studentFactory.makePrismaStudent()

    const accessToken = jwt.sign({ sub: user.id.toString() })

    const question = await questionFactory.makePrismaQuestion({
      authorId: user.id,
    })

    const questionId = question.id.toString()

    const response = await request(app.getHttpServer())
      .put(`/questions/${questionId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        title: 'New title',
        content: 'New content',
      })

    expect(response.statusCode).toBe(204)

    const questionOnDatabase = await prisma.question.findFirst({
      where: {
        title: 'New title',
        content: 'New content',
      },
    })

    expect(questionOnDatabase).toBeTruthy()
  })
})
```

## Fix: teste com Promise.all e ordenacao nao-deterministica

```typescript
// ANTES (falha intermitente por causa da ordem)
const [question1, question2] = await Promise.all([
  questionFactory.makePrismaQuestion({ title: 'Question 01', authorId: user.id }),
  questionFactory.makePrismaQuestion({ title: 'Question 02', authorId: user.id }),
])

expect(body.questions).toEqual([
  expect.objectContaining({ title: 'Question 02' }),
  expect.objectContaining({ title: 'Question 01' }),
])

// DEPOIS (funciona independente da ordem de insercao)
expect(body.questions).toEqual(
  expect.arrayContaining([
    expect.objectContaining({ title: 'Question 01' }),
    expect.objectContaining({ title: 'Question 02' }),
  ])
)
```