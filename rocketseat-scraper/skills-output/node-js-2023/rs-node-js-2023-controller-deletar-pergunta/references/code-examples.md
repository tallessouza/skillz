# Code Examples: Controller Deletar Pergunta

## Controller completo

```typescript
// src/infra/http/controllers/delete-question.controller.ts
import { Controller, Delete, HttpCode, Param } from '@nestjs/common'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { DeleteQuestionUseCase } from '@/domain/forum/application/use-cases/delete-question'

@Controller('/questions/:id')
export class DeleteQuestionController {
  constructor(private deleteQuestion: DeleteQuestionUseCase) {}

  @Delete()
  @HttpCode(204)
  async handle(
    @CurrentUser() user: UserPayload,
    @Param('id') questionId: string,
  ) {
    const userId = user.sub

    await this.deleteQuestion.execute({
      questionId,
      authorId: userId,
    })
  }
}
```

## Registro no Module

```typescript
// src/infra/http/http.module.ts
@Module({
  controllers: [
    // ... outros controllers
    DeleteQuestionController, // <-- NAO ESQUECA
  ],
  providers: [
    // ... outros providers
    DeleteQuestionUseCase, // <-- NAO ESQUECA (com @Injectable())
  ],
})
export class HttpModule {}
```

## Teste E2E completo

```typescript
// src/infra/http/controllers/delete-question.controller.e2e-spec.ts
import { AppModule } from '@/infra/app.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'

describe('Delete question (E2E)', () => {
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

  test('[DELETE] /questions/:id', async () => {
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

    await request(app.getHttpServer())
      .delete(`/questions/${question.id}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(204)

    const questionOnDatabase = await prisma.question.findUnique({
      where: {
        id: question.id,
      },
    })

    expect(questionOnDatabase).toBeNull()
  })
})
```

## Comparacao: Edit vs Delete (o que muda)

```typescript
// EDIT — tem body, validacao, retorno 204
@Put()
@HttpCode(204)
async handle(
  @Body(bodyValidationPipe) body: EditQuestionBodySchema,
  @CurrentUser() user: UserPayload,
  @Param('id') questionId: string,
) {
  const { title, content } = body
  const userId = user.sub

  await this.editQuestion.execute({
    title,
    content,
    authorId: userId,
    questionId,
  })
}

// DELETE — sem body, sem validacao, retorno 204
@Delete()
@HttpCode(204)
async handle(
  @CurrentUser() user: UserPayload,
  @Param('id') questionId: string,
) {
  const userId = user.sub

  await this.deleteQuestion.execute({
    questionId,
    authorId: userId,
  })
}
```

## Padrao de teste: validar ausencia vs presenca

```typescript
// Teste de CREATE/EDIT — valida que existe com dados corretos
const questionOnDatabase = await prisma.question.findFirst({
  where: { title: 'New title' },
})
expect(questionOnDatabase).toBeTruthy()

// Teste de DELETE — valida que NAO existe
const questionOnDatabase = await prisma.question.findUnique({
  where: { id: question.id },
})
expect(questionOnDatabase).toBeNull()
```