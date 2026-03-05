# Code Examples: Testes E2E de Perguntas no NestJS

## Exemplo completo: create-question.controller.e2e-spec.ts

```typescript
import { AppModule } from '@/infra/app.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'

describe('CreateQuestionController (E2E)', () => {
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

  test('[POST] /questions', async () => {
    const user = await prisma.user.create({
      data: {
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: '123456',
      },
    })

    const accessToken = jwt.sign({ sub: user.id })

    const response = await request(app.getHttpServer())
      .post('/questions')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        title: 'New question',
        content: 'Question content',
      })

    expect(response.statusCode).toBe(201)

    const questionOnDatabase = await prisma.question.findFirst({
      where: {
        title: 'New question',
      },
    })

    expect(questionOnDatabase).toBeTruthy()
  })
})
```

## Exemplo completo: fetch-recent-questions.controller.e2e-spec.ts

```typescript
import { AppModule } from '@/infra/app.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'

describe('FetchRecentQuestionsController (E2E)', () => {
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

  test('[GET] /questions', async () => {
    const user = await prisma.user.create({
      data: {
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: '123456',
      },
    })

    const accessToken = jwt.sign({ sub: user.id })

    await prisma.question.createMany({
      data: [
        {
          title: 'Question 01',
          slug: 'question-01',
          content: 'Question content',
          authorId: user.id,
        },
        {
          title: 'Question 02',
          slug: 'question-02',
          content: 'Question content',
          authorId: user.id,
        },
      ],
    })

    const response = await request(app.getHttpServer())
      .get('/questions')
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({
      questions: expect.arrayContaining([
        expect.objectContaining({ title: 'Question 01' }),
        expect.objectContaining({ title: 'Question 02' }),
      ]),
    })
  })
})
```

## Padrao reutilizavel: setup de autenticacao em testes

```typescript
// Padrao extraido: funcao helper para autenticacao em testes
async function createAuthenticatedUser(
  prisma: PrismaService,
  jwt: JwtService,
) {
  const user = await prisma.user.create({
    data: {
      name: 'John Doe',
      email: `john-${Date.now()}@example.com`, // email unico por teste
      password: '123456',
    },
  })

  const accessToken = jwt.sign({ sub: user.id })

  return { user, accessToken }
}

// Uso:
const { user, accessToken } = await createAuthenticatedUser(prisma, jwt)
```

## Padrao: validacao parcial com Jest matchers

```typescript
// Validar que array contem objetos com propriedades especificas
expect(response.body).toEqual({
  questions: expect.arrayContaining([
    expect.objectContaining({ title: 'Question 01' }),
    expect.objectContaining({ title: 'Question 02' }),
  ]),
})

// Validar que objeto existe no banco
const questionOnDatabase = await prisma.question.findFirst({
  where: { title: 'New question' },
})
expect(questionOnDatabase).toBeTruthy()
```

## Comparacao: criar vs copiar teste existente

O instrutor mostra o workflow de criar testes copiando um existente similar e adaptando:

1. Copiar o teste mais parecido (ex: `create-account` para base de `create-question`)
2. Mudar o endpoint e o payload
3. Adicionar setup necessario (autenticacao, seed de dados)
4. Ajustar as assertions

Esse workflow e mais rapido e menos propenso a erros do que criar do zero, porque a estrutura (imports, beforeAll, moduleRef) ja esta correta.