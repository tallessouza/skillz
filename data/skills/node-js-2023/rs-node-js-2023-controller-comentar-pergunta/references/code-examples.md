# Code Examples: Controller Comentar Pergunta

## Controller completo

```typescript
// src/infra/http/controllers/create-comment-on-question.controller.ts
import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { CommentOnQuestionUseCase } from '@/domain/forum/application/use-cases/comment-on-question'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { z } from 'zod'

const commentOnQuestionBodySchema = z.object({
  content: z.string(),
})

type CommentOnQuestionBody = z.infer<typeof commentOnQuestionBodySchema>

@Controller('/questions/:questionId/comments')
@UseGuards(JwtAuthGuard)
export class CommentOnQuestionController {
  constructor(private commentOnQuestion: CommentOnQuestionUseCase) {}

  @Post()
  async handle(
    @CurrentUser() user: UserPayload,
    @Param('questionId') questionId: string,
    @Body(new ZodValidationPipe(commentOnQuestionBodySchema))
    body: CommentOnQuestionBody,
  ) {
    const { content } = body
    const userId = user.sub

    await this.commentOnQuestion.execute({
      authorId: userId,
      questionId,
      content,
    })
  }
}
```

## Teste E2E completo

```typescript
// src/infra/http/controllers/create-comment-on-question.controller.e2e-spec.ts
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { JwtService } from '@nestjs/jwt'
import { AppModule } from '@/infra/app.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import request from 'supertest'

describe('Comment on question (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleRef.createNestApplication()
    prisma = moduleRef.get(PrismaService)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[POST] /questions/:questionId/comments', async () => {
    const user = await prisma.user.create({
      data: {
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: '123456',
      },
    })

    const accessToken = jwt.sign({ sub: user.id })

    const question = await prisma.question.create({
      data: {
        title: 'Question 01',
        slug: 'question-01',
        content: 'Question content',
        authorId: user.id,
      },
    })

    const response = await request(app.getHttpServer())
      .post(`/questions/${question.id}/comments`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        content: 'New comment',
      })

    expect(response.statusCode).toBe(201)

    const commentOnDatabase = await prisma.comment.findFirst({
      where: {
        content: 'New comment',
      },
    })

    expect(commentOnDatabase).toBeTruthy()
  })
})
```

## Registro no HTTP Module

```typescript
// src/infra/http/http.module.ts (trecho relevante)
import { CommentOnQuestionController } from './controllers/create-comment-on-question.controller'
import { CommentOnQuestionUseCase } from '@/domain/forum/application/use-cases/comment-on-question'

@Module({
  controllers: [
    // ... outros controllers
    CommentOnQuestionController,
  ],
  providers: [
    // ... outros providers
    CommentOnQuestionUseCase,
  ],
})
export class HttpModule {}
```

## Use case com @Injectable()

```typescript
// src/domain/forum/application/use-cases/comment-on-question.ts
import { Injectable } from '@nestjs/common'

@Injectable()
export class CommentOnQuestionUseCase {
  constructor(private questionCommentsRepository: QuestionCommentsRepository) {}

  async execute({ authorId, questionId, content }: CommentOnQuestionRequest) {
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

## Comparacao: Answer vs Comment (o que muda)

```typescript
// ANSWER (original)
@Controller('/questions/:questionId/answers')
// Body: { content, attachments }  ← tem attachments
// Use case: AnswerQuestionUseCase
// Tabela: answers

// COMMENT (adaptado)
@Controller('/questions/:questionId/comments')
// Body: { content }               ← sem attachments
// Use case: CommentOnQuestionUseCase
// Tabela: comments
```