# Code Examples: Factories nos Testes E2E

## Estrutura completa: StudentFactory

```typescript
// test/factories/make-student.ts
import { Injectable } from '@nestjs/common'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { PrismaStudentMapper } from '@/infra/database/prisma/mappers/prisma-student-mapper'
import { Student, StudentProps } from '@/domain/forum/enterprise/entities/student'
import { faker } from '@faker-js/faker'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'

// Factory de dominio (ja existente)
export function makeStudent(
  override: Partial<StudentProps> = {},
  id?: UniqueEntityId,
) {
  const student = Student.create(
    {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      ...override,
    },
    id,
  )

  return student
}

// Factory de persistencia (nova)
@Injectable()
export class StudentFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaStudent(
    data: Partial<StudentProps> = {},
  ): Promise<Student> {
    const student = makeStudent(data)

    await this.prisma.user.create({
      data: PrismaStudentMapper.toPrisma(student),
    })

    return student
  }
}
```

## Estrutura completa: QuestionFactory

```typescript
// test/factories/make-question.ts
import { Injectable } from '@nestjs/common'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { PrismaQuestionMapper } from '@/infra/database/prisma/mappers/prisma-question-mapper'
import { Question, QuestionProps } from '@/domain/forum/enterprise/entities/question'
import { faker } from '@faker-js/faker'
import { Slug } from '@/domain/forum/enterprise/entities/value-objects/slug'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'

export function makeQuestion(
  override: Partial<QuestionProps> = {},
  id?: UniqueEntityId,
) {
  const question = Question.create(
    {
      authorId: new UniqueEntityId(),
      title: faker.lorem.sentence(),
      slug: Slug.create('example-question'),
      content: faker.lorem.text(),
      ...override,
    },
    id,
  )

  return question
}

@Injectable()
export class QuestionFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaQuestion(
    data: Partial<QuestionProps> = {},
  ): Promise<Question> {
    const question = makeQuestion(data)

    await this.prisma.question.create({
      data: PrismaQuestionMapper.toPrisma(question),
    })

    return question
  }
}
```

## Setup completo do teste E2E

```typescript
// src/infra/http/controllers/get-question-by-slug.controller.e2e-spec.ts
import { Test } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { StudentFactory } from 'test/factories/make-student'
import { QuestionFactory } from 'test/factories/make-question'
import { JwtService } from '@nestjs/jwt'
import request from 'supertest'

describe('Get question by slug (E2E)', () => {
  let app: INestApplication
  let studentFactory: StudentFactory
  let questionFactory: QuestionFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule], // DatabaseModule obrigatorio!
      providers: [StudentFactory, QuestionFactory], // Registrar factories
    }).compile()

    app = moduleRef.createNestApplication()
    studentFactory = moduleRef.get(StudentFactory)
    questionFactory = moduleRef.get(QuestionFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[GET] /questions/:slug', async () => {
    const user = await studentFactory.makePrismaStudent()

    await questionFactory.makePrismaQuestion({
      authorId: user.id,
      title: 'Question 01',
      slug: Slug.create('question-01'),
    })

    const accessToken = jwt.sign({ sub: user.id.toString() })

    const response = await request(app.getHttpServer())
      .get('/questions/question-01')
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({
      question: expect.objectContaining({ title: 'Question 01' }),
    })
  })
})
```

## Erro comum: PrismaService not part of RootTestModule

```typescript
// ERRADO — PrismaService nao acessivel
const moduleRef = await Test.createTestingModule({
  imports: [AppModule],
  providers: [StudentFactory],
}).compile()
// Error: PrismaService is not part of the RootTestModule

// CORRETO — importar DatabaseModule explicitamente
const moduleRef = await Test.createTestingModule({
  imports: [AppModule, DatabaseModule],
  providers: [StudentFactory],
}).compile()
```

## Padrao para qualquer nova factory

```typescript
@Injectable()
export class XxxFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaXxx(
    data: Partial<XxxProps> = {},
  ): Promise<Xxx> {
    const xxx = makeXxx(data)

    await this.prisma.tableName.create({
      data: PrismaXxxMapper.toPrisma(xxx),
    })

    return xxx
  }
}
```