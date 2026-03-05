# Code Examples: Cache Repository em Clean Architecture

## 1. Cache Repository abstrato completo

```typescript
// src/infra/cache/cache-repository.ts
export abstract class CacheRepository {
  // Salva uma informacao no cache (key-value)
  abstract set(key: string, value: string): Promise<void>

  // Busca uma informacao do cache pela chave
  abstract get(key: string): Promise<string | null>

  // Invalida (remove) uma informacao do cache
  abstract delete(key: string): Promise<void>
}
```

**Por que esses 3 metodos?**
- `set`: salvar dados processados para evitar reprocessamento
- `get`: recuperar dados sem bater no banco
- `delete`: invalidar quando dado original muda (ex: usuario editou titulo)

## 2. Padrao de chave para cache

```typescript
// Formato: recurso:identificador:detalhe
const cacheKey = `question:${questionId}:details`

// Exemplos reais:
// "question:abc-123:details" → detalhes completos da pergunta
// "user:def-456:profile" → perfil do usuario
// "question:abc-123:recent-answers" → respostas recentes
```

## 3. Integracao no repositorio Prisma (padrao completo)

```typescript
// src/infra/database/prisma/repositories/prisma-questions-repository.ts
import { CacheRepository } from '@/infra/cache/cache-repository'

export class PrismaQuestionsRepository implements QuestionsRepository {
  constructor(
    private prisma: PrismaService,
    private cache: CacheRepository,
  ) {}

  async findDetailsBySlug(slug: string): Promise<QuestionDetails | null> {
    const cacheKey = `question:${slug}:details`

    // 1. Tenta buscar do cache primeiro
    const cached = await this.cache.get(cacheKey)
    if (cached) {
      return JSON.parse(cached)
    }

    // 2. Se nao tem cache, busca do banco (com todos os joins)
    const question = await this.prisma.question.findUnique({
      where: { slug },
      include: {
        author: true,
        answers: { orderBy: { createdAt: 'desc' }, take: 3 },
        comments: { orderBy: { createdAt: 'desc' }, take: 5 },
      },
    })

    if (!question) {
      return null
    }

    // 3. Salva no cache para proximas requisicoes
    await this.cache.set(cacheKey, JSON.stringify(question))

    return question
  }

  // Exemplo de invalidacao ao editar pergunta
  async save(question: Question): Promise<void> {
    await this.prisma.question.update({
      where: { id: question.id.toString() },
      data: { /* ... */ },
    })

    // Invalida o cache apos mutacao
    await this.cache.delete(`question:${question.slug.value}:details`)
  }
}
```

## 4. O que o use-case NAO deve conter

```typescript
// ERRADO — use-case com logica de cache
export class GetQuestionBySlugUseCase {
  constructor(
    private questionsRepository: QuestionsRepository,
    private cacheService: CacheService, // ← NAO PERTENCE AQUI
  ) {}

  async execute({ slug }: GetQuestionBySlugRequest) {
    // ← Este if e logica de infra, nao de negocio
    const cached = await this.cacheService.get(`question:${slug}`)
    if (cached) {
      return { question: JSON.parse(cached) }
    }

    const question = await this.questionsRepository.findDetailsBySlug(slug)

    if (!question) {
      return left(new ResourceNotFoundError())
    }

    // ← Mais logica de infra no use-case
    await this.cacheService.set(`question:${slug}`, JSON.stringify(question))

    return right({ question })
  }
}
```

```typescript
// CORRETO — use-case limpo, sem mencao a cache
export class GetQuestionBySlugUseCase {
  constructor(private questionsRepository: QuestionsRepository) {}

  async execute({ slug }: GetQuestionBySlugRequest) {
    // O repositorio decide internamente se usa cache ou banco
    const question = await this.questionsRepository.findDetailsBySlug(slug)

    if (!question) {
      return left(new ResourceNotFoundError())
    }

    return right({ question })
  }
}
```

## 5. Estrutura de pastas

```
src/
├── domain/
│   └── forum/
│       └── application/
│           └── use-cases/
│               └── get-question-by-slug.ts  # SEM cache
├── infra/
│   ├── cache/
│   │   └── cache-repository.ts              # Classe abstrata
│   └── database/
│       └── prisma/
│           └── repositories/
│               └── prisma-questions-repository.ts  # COM cache
```