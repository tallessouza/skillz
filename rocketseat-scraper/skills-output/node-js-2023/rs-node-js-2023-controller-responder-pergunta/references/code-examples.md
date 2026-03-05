# Code Examples: Controller Responder Pergunta

## Exemplo completo do controller

```typescript
// src/infra/http/controllers/answer-question.controller.ts
import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { AnswerQuestionUseCase } from '@/domain/forum/application/use-cases/answer-question'
import { z } from 'zod'

const answerQuestionBodySchema = z.object({
  content: z.string(),
})

const bodyValidationPipe = new ZodValidationPipe(answerQuestionBodySchema)

type AnswerQuestionBodySchema = z.infer<typeof answerQuestionBodySchema>

@Controller('/questions/:questionId/answers')
@UseGuards(JwtAuthGuard)
export class AnswerQuestionController {
  constructor(private answerQuestion: AnswerQuestionUseCase) {}

  @Post()
  async handle(
    @CurrentUser() user: UserPayload,
    @Param('questionId') questionId: string,
    @Body(bodyValidationPipe) body: AnswerQuestionBodySchema,
  ) {
    const { content } = body
    const userId = user.sub

    await this.answerQuestion.execute({
      questionId,
      authorId: userId,
      content,
    })
  }
}
```

## Comparacao: schema de pergunta vs schema de resposta

```typescript
// Pergunta: precisa de titulo e conteudo
const createQuestionBodySchema = z.object({
  title: z.string(),
  content: z.string(),
})

// Resposta: precisa apenas de conteudo
const answerQuestionBodySchema = z.object({
  content: z.string(),
})
```

## Teste E2E completo

```typescript
// src/infra/http/controllers/answer-question.controller.e2e-spec.ts
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { AppModule } from '@/infra/app.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { JwtService } from '@nestjs/jwt'
import { StudentFactory } from 'test/factories/make-student'
import { QuestionFactory } from 'test/factories/make-question'
import request from 'supertest'

describe('Answer question (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let jwt: JwtService
  let studentFactory: StudentFactory
  let questionFactory: QuestionFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
      providers: [StudentFactory, QuestionFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    prisma = moduleRef.get(PrismaService)
    jwt = moduleRef.get(JwtService)
    studentFactory = moduleRef.get(StudentFactory)
    questionFactory = moduleRef.get(QuestionFactory)

    await app.init()
  })

  test('[POST] /questions/:questionId/answers', async () => {
    const user = await studentFactory.makePrismaStudent()
    const accessToken = jwt.sign({ sub: user.id.toString() })

    const question = await questionFactory.makePrismaQuestion({
      authorId: user.id,
    })
    const questionId = question.id.toString()

    const response = await request(app.getHttpServer())
      .post(`/questions/${questionId}/answers`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        content: 'New answer',
      })

    expect(response.statusCode).toBe(201)

    const answerOnDatabase = await prisma.answer.findFirst({
      where: {
        content: 'New answer',
      },
    })

    expect(answerOnDatabase).toBeTruthy()
  })
})
```

## Registro no HttpModule

```typescript
// src/infra/http/http.module.ts
@Module({
  controllers: [
    CreateQuestionController,
    AnswerQuestionController,  // Novo controller registrado
    // ...outros controllers
  ],
  providers: [
    CreateQuestionUseCase,
    AnswerQuestionUseCase,     // Novo use case registrado
    // ...outros use cases
  ],
})
export class HttpModule {}
```

## Use case com @Injectable

```typescript
// No use case, adicionar o decorator
import { Injectable } from '@nestjs/common'

@Injectable()
export class AnswerQuestionUseCase {
  constructor(private answersRepository: AnswersRepository) {}

  async execute({ questionId, authorId, content }: AnswerQuestionUseCaseRequest) {
    const answer = Answer.create({
      questionId: new UniqueEntityID(questionId),
      authorId: new UniqueEntityID(authorId),
      content,
    })

    await this.answersRepository.create(answer)

    return { answer }
  }
}
```

## Padrao de rotas aninhadas — outros exemplos

```typescript
// Comentarios em uma resposta
@Controller('/answers/:answerId/comments')
export class CommentOnAnswerController {}

// Comentarios em uma pergunta
@Controller('/questions/:questionId/comments')
export class CommentOnQuestionController {}

// Anexos em uma resposta
@Controller('/answers/:answerId/attachments')
export class AddAnswerAttachmentController {}
```