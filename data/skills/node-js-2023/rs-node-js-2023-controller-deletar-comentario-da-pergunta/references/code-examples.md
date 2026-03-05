# Code Examples: Controller Deletar Comentario da Pergunta

## Exemplo Completo do Controller

```typescript
import {
  BadRequestException,
  Controller,
  Delete,
  HttpCode,
  Param,
} from '@nestjs/common'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { DeleteQuestionCommentUseCase } from '@/domain/forum/application/use-cases/delete-question-comment'

@Controller('/questions/comments/:commentId')
export class DeleteQuestionCommentController {
  constructor(
    private deleteQuestionComment: DeleteQuestionCommentUseCase,
  ) {}

  @Delete()
  @HttpCode(204)
  async handle(
    @CurrentUser() user: UserPayload,
    @Param('commentId') questionCommentId: string,
  ) {
    const result = await this.deleteQuestionComment.execute({
      questionCommentId,
      authorId: user.sub,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
```

## Registro no HttpModule

```typescript
import { DeleteQuestionCommentController } from './controllers/delete-question-comment.controller'
import { DeleteQuestionCommentUseCase } from '@/domain/forum/application/use-cases/delete-question-comment'

@Module({
  controllers: [
    // ... outros controllers
    DeleteQuestionCommentController,
  ],
  providers: [
    // ... outros providers
    DeleteQuestionCommentUseCase,
  ],
})
export class HttpModule {}
```

## Use Case com Injectable

```typescript
import { Injectable } from '@nestjs/common'

@Injectable()
export class DeleteQuestionCommentUseCase {
  constructor(
    private questionCommentsRepository: QuestionCommentsRepository,
  ) {}

  async execute({ questionCommentId, authorId }: DeleteQuestionCommentUseCaseRequest) {
    const questionComment = await this.questionCommentsRepository.findById(questionCommentId)

    if (!questionComment) {
      return left(new ResourceNotFoundError())
    }

    if (questionComment.authorId.toString() !== authorId) {
      return left(new NotAllowedError())
    }

    await this.questionCommentsRepository.delete(questionComment)

    return right({})
  }
}
```

## Teste E2E Completo

```typescript
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { JwtService } from '@nestjs/jwt'
import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { StudentFactory } from 'test/factories/make-student'
import { QuestionFactory } from 'test/factories/make-question'
import { QuestionCommentFactory } from 'test/factories/make-question-comment'

describe('Delete question comment (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let jwt: JwtService
  let studentFactory: StudentFactory
  let questionFactory: QuestionFactory
  let questionCommentFactory: QuestionCommentFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, QuestionFactory, QuestionCommentFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    prisma = moduleRef.get(PrismaService)
    jwt = moduleRef.get(JwtService)
    studentFactory = moduleRef.get(StudentFactory)
    questionFactory = moduleRef.get(QuestionFactory)
    questionCommentFactory = moduleRef.get(QuestionCommentFactory)

    await app.init()
  })

  test('[DELETE] /questions/comments/:commentId', async () => {
    const user = await studentFactory.makePrismaStudent()
    const accessToken = jwt.sign({ sub: user.id.toString() })

    const question = await questionFactory.makePrismaQuestion({
      authorId: user.id,
    })

    const comment = await questionCommentFactory.makePrismaQuestionComment({
      authorId: user.id,
      questionId: question.id,
    })

    const commentId = comment.id.toString()

    const response = await request(app.getHttpServer())
      .delete(`/questions/comments/${commentId}`)
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.statusCode).toBe(204)

    const commentOnDatabase = await prisma.comment.findUnique({
      where: { id: commentId },
    })

    expect(commentOnDatabase).toBeNull()
  })
})
```

## Bug Classico: Objeto vs String na URL

```typescript
// ERRADO — passa o objeto inteiro, URL recebe [object Object]
const response = await request(app.getHttpServer())
  .delete(`/questions/comments/${comment}`)  // comment = objeto!

// CORRETO — extrai o ID como string
const commentId = comment.id.toString()
const response = await request(app.getHttpServer())
  .delete(`/questions/comments/${commentId}`)
```

## Tecnica de Debug: console.log no result

```typescript
// Quando o controller retorna 400 inesperado:
if (result.isLeft()) {
  console.log(result.value)  // Mostra o erro exato do use case
  throw new BadRequestException()
}
// Output: ResourceNotFoundError → problema no param, nao no banco
```