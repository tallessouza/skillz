# Code Examples: Integrando Cache no Prisma

## Exemplo completo do repositorio com cache

```typescript
// prisma-questions-repository.ts
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { CacheRepository } from '@/infra/cache/cache-repository'
import { QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository'
import { PrismaQuestionMapper } from '../mappers/prisma-question-mapper'
import { PrismaQuestionDetailsMapper } from '../mappers/prisma-question-details-mapper'

@Injectable()
export class PrismaQuestionsRepository implements QuestionsRepository {
  constructor(
    private prisma: PrismaService,
    private cache: CacheRepository,
  ) {}

  async findDetailsBySlug(slug: string) {
    // 1. Verificar cache primeiro
    const cacheHit = await this.cache.get(`question:${slug}:details`)

    if (cacheHit) {
      // 2. Cache encontrado: parse e retorno imediato
      return JSON.parse(cacheHit)
    }

    // 3. Cache miss: buscar no banco
    const question = await this.prisma.question.findUnique({
      where: { slug },
      include: {
        author: true,
        attachments: true,
      },
    })

    if (!question) {
      return null
    }

    // 4. Mapear para dominio
    const questionDetails = PrismaQuestionDetailsMapper.toDomain(question)

    // 5. Salvar no cache para proximas requisicoes
    await this.cache.set(
      `question:${slug}:details`,
      JSON.stringify(questionDetails),
    )

    return questionDetails
  }

  async save(question: Question) {
    const data = PrismaQuestionMapper.toPrisma(question)

    // Update no banco E invalidacao do cache em paralelo
    await Promise.all([
      this.prisma.question.update({
        where: { id: data.id },
        data,
      }),
      // Invalidar cache ao modificar dados
      this.cache.delete(`question:${data.slug}:details`),
    ])
  }
}
```

## Interface do CacheRepository

```typescript
// cache-repository.ts
export abstract class CacheRepository {
  abstract set(key: string, value: string): Promise<void>
  abstract get(key: string): Promise<string | null>
  abstract delete(key: string): Promise<void>
}
```

## Variacao: deletar por prefixo

```typescript
// Quando a entidade tem multiplos caches
async save(question: Question) {
  const data = PrismaQuestionMapper.toPrisma(question)

  await Promise.all([
    this.prisma.question.update({
      where: { id: data.id },
      data,
    }),
    // Asterisco deleta todos os caches que comecam com esse prefixo
    this.cache.delete(`question:${data.slug}:*`),
  ])
}
```

## Variacao: aplicando o mesmo padrao para outro repositorio

```typescript
// prisma-users-repository.ts
async findByEmail(email: string) {
  const cacheHit = await this.cache.get(`user:${email}:profile`)

  if (cacheHit) {
    return JSON.parse(cacheHit)
  }

  const user = await this.prisma.user.findUnique({
    where: { email },
  })

  if (!user) return null

  const userProfile = PrismaUserMapper.toDomain(user)

  await this.cache.set(
    `user:${email}:profile`,
    JSON.stringify(userProfile),
  )

  return userProfile
}
```

## Estrutura de chaves Redis — exemplos praticos

```
# Padrao: entidade:identificador:tipo

question:como-usar-nestjs:details      # details da pergunta pelo slug
question:abc123:reputation              # reputacao da pergunta pelo id
user:joao@email.com:profile             # perfil do usuario pelo email
user:xyz789:notifications               # notificacoes pelo id
answer:def456:votes                     # votos de uma resposta pelo id
```