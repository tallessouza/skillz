# Code Examples: Controller Editar Resposta

## Estrutura completa do controller

```typescript
// src/infra/http/controllers/edit-answer.controller.ts
import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Param,
  Put,
} from '@nestjs/common'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { EditAnswerUseCase } from '@/domain/forum/application/use-cases/edit-answer'
import { z } from 'zod'

const editAnswerBodySchema = z.object({
  content: z.string(),
})

type EditAnswerBodySchema = z.infer<typeof editAnswerBodySchema>

const bodyValidationPipe = new ZodValidationPipe(editAnswerBodySchema)

@Controller('/answers/:id')
export class EditAnswerController {
  constructor(private editAnswer: EditAnswerUseCase) {}

  @Put()
  @HttpCode(204)
  async handle(
    @Body(bodyValidationPipe) body: EditAnswerBodySchema,
    @CurrentUser() user: UserPayload,
    @Param('id') answerId: string,
  ) {
    const { content } = body
    const userId = user.sub

    const result = await this.editAnswer.execute({
      answerId,
      authorId: userId,
      content,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
```

## Teste e2e completo

```typescript
// src/infra/http/controllers/edit-answer.controller.e2e-spec.ts
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { JwtService } from '@nestjs/jwt'
import request from 'supertest'
import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { StudentFactory } from 'test/factories/make-student'
import { QuestionFactory } from 'test/factories/make-question'
import { AnswerFactory } from 'test/factories/make-answer'

describe('EditAnswerController (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let jwt: JwtService
  let studentFactory: StudentFactory
  let questionFactory: QuestionFactory
  let answerFactory: AnswerFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, QuestionFactory, AnswerFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    prisma = moduleRef.get(PrismaService)
    jwt = moduleRef.get(JwtService)
    studentFactory = moduleRef.get(StudentFactory)
    questionFactory = moduleRef.get(QuestionFactory)
    answerFactory = moduleRef.get(AnswerFactory)

    await app.init()
  })

  test('[PUT] /answers/:id', async () => {
    const user = await studentFactory.makePrismaStudent()
    const accessToken = jwt.sign({ sub: user.id.toString() })

    // Criar question primeiro — foreign key obrigatoria
    const question = await questionFactory.makePrismaQuestion({
      authorId: user.id,
    })

    // Criar answer com IDs reais — authorId e questionId validos
    const answer = await answerFactory.makePrismaAnswer({
      questionId: question.id,
      authorId: user.id,
    })

    const answerId = answer.id.toString()

    const response = await request(app.getHttpServer())
      .put(`/answers/${answerId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        content: 'New answer content',
      })

    expect(response.statusCode).toBe(204)

    const answerOnDatabase = await prisma.answer.findFirst({
      where: { id: answer.id.toString() },
    })

    expect(answerOnDatabase.content).toEqual('New answer content')
  })
})
```

## Registro no modulo NestJS

```typescript
// No app.module.ts ou http.module.ts
@Module({
  controllers: [
    // ... outros controllers
    EditAnswerController,
  ],
  providers: [
    // ... outros providers
    EditAnswerUseCase, // Deve ser Injectable()
  ],
})
```

## Comparacao: Edit Question vs Edit Answer

| Aspecto | EditQuestion | EditAnswer |
|---------|-------------|------------|
| Rota | `PUT /questions/:id` | `PUT /answers/:id` |
| Body | `{ title, content }` | `{ content }` |
| Params | `id` (questionId) | `id` (answerId) |
| Status | 204 | 204 |
| Erros tratados | BadRequestException generico | BadRequestException generico |

## Padrao de factory para testes com foreign keys

```typescript
// A ordem importa: pai antes de filho
const user = await studentFactory.makePrismaStudent()
const question = await questionFactory.makePrismaQuestion({
  authorId: user.id,  // FK valida
})
const answer = await answerFactory.makePrismaAnswer({
  questionId: question.id,  // FK valida
  authorId: user.id,         // FK valida
})
```

Se qualquer um desses IDs for gerado automaticamente (UUID aleatorio), o banco rejeita a insercao com erro de foreign key constraint violation.