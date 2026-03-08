---
name: rs-node-js-2023-testando-cache
description: "Applies cache testing patterns when writing NestJS e2e tests for Redis cache layers. Use when user asks to 'test cache', 'write cache tests', 'test Redis persistence', 'e2e test repository', or 'verify cache invalidation'. Covers cache hit verification, cached response on subsequent calls, and cache reset on save. Make sure to use this skill whenever creating tests for any caching layer in NestJS repositories. Not for unit tests, controller-only tests, or Redis configuration setup."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: node-js-2023
  module: nestjs-clean-architecture
  tags: [cache, redis, e2e-testing, cache-invalidation, repository-testing]
---

# Testando Persistencia em Cache

> Testes de cache validam tres comportamentos: dados sao cacheados, chamadas subsequentes retornam do cache, e operacoes de escrita invalidam o cache.

## Rules

1. **Teste no repositorio, nao no controller** — cache e comportamento do repositorio, nao da rota HTTP, porque o metodo cacheado pode ser chamado por qualquer consumer
2. **Use banco Redis separado para testes** — configure `REDIS_DB=1` no `.env.test` para isolar dados de teste dos dados de desenvolvimento
3. **Limpe o banco antes de cada suite** — `redis.flushDB()` no `beforeAll` garante estado limpo sem afetar outros bancos (nao use `flushAll`)
4. **Valide o conteudo do cache diretamente** — apos chamar o metodo cacheado, busque a chave no `CacheRepository` e compare com `JSON.stringify` do resultado
5. **Teste cache hit com dados falsos** — pre-popule o cache com dados arbitrarios antes de chamar o metodo; se retornar os dados falsos, prova que leu do cache
6. **Teste invalidacao apos save** — apos chamar `save()`, busque a chave no cache e espere `null`

## How to write

### Estrutura do teste de cache no repositorio

```typescript
// prisma-questions-repository.e2e-spec.ts
describe('PrismaQuestionsRepository (E2E)', () => {
  let questionsRepository: QuestionsRepository
  let cacheRepository: CacheRepository
  let studentFactory: StudentFactory
  let questionFactory: QuestionFactory
  let attachmentFactory: AttachmentFactory
  let questionAttachmentFactory: QuestionAttachmentFactory

  beforeAll(async () => {
    // importar CachingModule junto com DatabaseModule
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule, CachingModule],
      providers: [StudentFactory, QuestionFactory, AttachmentFactory, QuestionAttachmentFactory],
    }).compile()

    questionsRepository = moduleRef.get(QuestionsRepository)
    cacheRepository = moduleRef.get(CacheRepository)
    // ... demais factories
  })
})
```

### Teste 1: Verifica que dados sao cacheados

```typescript
it('should cache question details', async () => {
  const user = await studentFactory.makePrismaStudent()
  const question = await questionFactory.makePrismaQuestion({ authorId: user.id })
  const attachment = await attachmentFactory.makePrismaAttachment()
  await questionAttachmentFactory.makePrismaQuestionAttachment({
    attachmentId: attachment.id,
    questionId: question.id,
  })

  const slug = question.slug.value
  const questionDetails = await questionsRepository.findDetailsBySlug(slug)

  const cached = await cacheRepository.get(`question:${slug}:details`)
  expect(cached).toEqual(JSON.stringify(questionDetails))
})
```

### Teste 2: Chamadas subsequentes retornam do cache

```typescript
it('should return cached question details on subsequent calls', async () => {
  // ... criar factories ...
  const slug = question.slug.value

  // Pre-popular cache com dados falsos
  await cacheRepository.set(
    `question:${slug}:details`,
    JSON.stringify({ empty: true }),
  )

  const questionDetails = await questionsRepository.findDetailsBySlug(slug)

  // Se retornou os dados falsos, prova que leu do cache
  expect(questionDetails).toEqual({ empty: true })
})
```

### Teste 3: Save invalida o cache

```typescript
it('should reset question details cache when saving the question', async () => {
  // ... criar factories ...
  const slug = question.slug.value

  await cacheRepository.set(
    `question:${slug}:details`,
    JSON.stringify({ empty: true }),
  )

  await questionsRepository.save(question)

  const cached = await cacheRepository.get(`question:${slug}:details`)
  expect(cached).toBeNull()
})
```

### Setup E2E com Redis isolado

```typescript
// setup-e2e.ts
import { Redis } from 'ioredis'
import { envSchema } from '@/infra/env/env'

const env = envSchema.parse(process.env)

const redis = new Redis({
  host: env.REDIS_HOST,
  port: env.REDIS_PORT,
  db: env.REDIS_DB,
})

beforeAll(async () => {
  await redis.flushDB() // limpa apenas o DB selecionado
})
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Metodo cacheado usado por multiplos consumers | Teste no repositorio, nao no controller |
| Precisa provar que cache hit funciona | Pre-popule com dados falsos e verifique retorno |
| Precisa provar invalidacao | Chame save, depois busque a chave e espere null |
| Ambiente de teste compartilha Redis | Use `REDIS_DB` diferente e `flushDB` (nao `flushAll`) |
| Variavel ambiente tipada | Use `envSchema.parse(process.env)` para autocomplete |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| `redis.flushAll()` nos testes | `redis.flushDB()` — limpa apenas o DB de teste |
| Usar mesmo REDIS_DB para dev e teste | `REDIS_DB=0` em dev, `REDIS_DB=1` em teste |
| Testar cache apenas via controller HTTP | Testar direto no repositorio com `findDetailsBySlug` |
| Validar cache comparando objetos | Comparar com `JSON.stringify(questionDetails)` |
| Verificar cache hit com dados reais | Usar dados falsos (`{ empty: true }`) para provar leitura do cache |

## Troubleshooting

### Teste de cache interfere em dados de desenvolvimento
**Symptom:** Dados de desenvolvimento somem apos rodar os testes
**Cause:** Testes e desenvolvimento compartilham o mesmo REDIS_DB
**Fix:** Configure `REDIS_DB=1` no .env.test e use `redis.flushDB()` (nao `flushAll`) no beforeAll

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
