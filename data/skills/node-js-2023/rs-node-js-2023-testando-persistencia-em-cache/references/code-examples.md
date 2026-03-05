# Code Examples: Testando Persistencia em Cache

## Arquivo completo: prisma-questions-repository.e2e-spec.ts

```typescript
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { CachingModule } from '@/infra/cache/caching.module'
import { QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository'
import { CacheRepository } from '@/infra/cache/cache-repository'
import { StudentFactory } from 'test/factories/make-student'
import { QuestionFactory } from 'test/factories/make-question'
import { AttachmentFactory } from 'test/factories/make-attachment'
import { QuestionAttachmentFactory } from 'test/factories/make-question-attachment'

describe('PrismaQuestionsRepository (E2E)', () => {
  let app: INestApplication
  let studentFactory: StudentFactory
  let questionFactory: QuestionFactory
  let attachmentFactory: AttachmentFactory
  let questionAttachmentFactory: QuestionAttachmentFactory
  let cacheRepository: CacheRepository
  let questionsRepository: QuestionsRepository

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule, CachingModule],
      providers: [
        StudentFactory,
        QuestionFactory,
        AttachmentFactory,
        QuestionAttachmentFactory,
      ],
    }).compile()

    app = moduleRef.createNestApplication()
    studentFactory = moduleRef.get(StudentFactory)
    questionFactory = moduleRef.get(QuestionFactory)
    attachmentFactory = moduleRef.get(AttachmentFactory)
    questionAttachmentFactory = moduleRef.get(QuestionAttachmentFactory)
    cacheRepository = moduleRef.get(CacheRepository)
    questionsRepository = moduleRef.get(QuestionsRepository)

    await app.init()
  })

  it('should cache question details', async () => {
    const user = await studentFactory.makePrismaStudent()

    const question = await questionFactory.makePrismaQuestion({
      authorId: user.id,
    })

    const attachment = await attachmentFactory.makePrismaAttachment()

    await questionAttachmentFactory.makePrismaQuestionAttachment({
      attachmentId: attachment.id,
      questionId: question.id,
    })

    const slug = question.slug.value

    const questionDetails =
      await questionsRepository.findDetailsBySlug(slug)

    const cached = await cacheRepository.get(
      `question:${slug}:details`,
    )

    expect(cached).toEqual(JSON.stringify(questionDetails))
  })

  it('should return cached question details on subsequent calls', async () => {
    const user = await studentFactory.makePrismaStudent()

    const question = await questionFactory.makePrismaQuestion({
      authorId: user.id,
    })

    const attachment = await attachmentFactory.makePrismaAttachment()

    await questionAttachmentFactory.makePrismaQuestionAttachment({
      attachmentId: attachment.id,
      questionId: question.id,
    })

    const slug = question.slug.value

    // Pre-popular cache com dados falsos
    await cacheRepository.set(
      `question:${slug}:details`,
      JSON.stringify({ empty: true }),
    )

    const questionDetails =
      await questionsRepository.findDetailsBySlug(slug)

    // Prova que leu do cache (dados falsos retornados)
    expect(questionDetails).toEqual({ empty: true })
  })

  it('should reset question details cache when saving the question', async () => {
    const user = await studentFactory.makePrismaStudent()

    const question = await questionFactory.makePrismaQuestion({
      authorId: user.id,
    })

    const attachment = await attachmentFactory.makePrismaAttachment()

    await questionAttachmentFactory.makePrismaQuestionAttachment({
      attachmentId: attachment.id,
      questionId: question.id,
    })

    const slug = question.slug.value

    await cacheRepository.set(
      `question:${slug}:details`,
      JSON.stringify({ empty: true }),
    )

    // save() deve invalidar o cache
    await questionsRepository.save(question)

    const cached = await cacheRepository.get(
      `question:${slug}:details`,
    )

    // Cache deve estar vazio apos save
    expect(cached).toBeNull()
  })
})
```

## Arquivo: setup-e2e.ts (trecho Redis)

```typescript
import { Redis } from 'ioredis'
import { envSchema } from '@/infra/env/env'

const env = envSchema.parse(process.env)

const redis = new Redis({
  host: env.REDIS_HOST,
  port: env.REDIS_PORT,
  db: env.REDIS_DB,
})

beforeAll(async () => {
  // Limpa apenas o banco de teste, nao todos os bancos
  await redis.flushDB()
})
```

## Arquivo: .env.test (trecho relevante)

```env
# Usar banco Redis separado para testes
REDIS_DB=1
```

## Padrao de chave de cache

```
question:{slug}:details
```

Formato: `{entidade}:{identificador}:{tipo-de-dado}`

## Comparacao: flushDB vs flushAll

```typescript
// CORRETO: limpa apenas o DB selecionado (ex: DB 1 de teste)
await redis.flushDB()

// PERIGOSO: limpa TODOS os DBs do Redis (0-15)
await redis.flushAll()
```

## Variante: usando process.env vs envSchema

```typescript
// SEM tipagem (sem autocomplete, propenso a typos)
const redis = new Redis({
  host: process.env.REDIS_HOST,  // string | undefined
  port: Number(process.env.REDIS_PORT),
  db: Number(process.env.REDIS_DB),
})

// COM tipagem (autocomplete, validacao em runtime)
const env = envSchema.parse(process.env)
const redis = new Redis({
  host: env.REDIS_HOST,   // string (validado)
  port: env.REDIS_PORT,   // number (validado)
  db: env.REDIS_DB,       // number (validado)
})
```