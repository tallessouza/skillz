---
name: 2023-criando-repositorio-de-cache
description: "Implements a cache repository in clean architecture where cache logic lives exclusively in the infrastructure layer, never in domain or use cases. Use when user asks to 'add caching', 'create cache repository', 'implement Redis cache pattern', 'optimize database reads', or 'cache API responses'. Enforces: abstract CacheRepository class in infra, cache-through pattern inside Prisma repositories, JSON serialization, structured cache keys, invalidation on mutations. Make sure to use this skill whenever adding caching to a clean architecture Node.js/NestJS application. Not for frontend caching, CDN configuration, or in-memory caching without Redis."
category: coding-lens
tags: [cache, nestjs, prisma, redis, repository, typescript]
mind_lenses: [LT_01, LT_02, MF_01, GB_01, TH_04]
metadata:
  author: Rocketseat
  version: 2.0.0
  course: node-js-2023
  module: cache-architecture
  tags: [cache, redis, clean-architecture, repository-pattern, nestjs, prisma]
---

# Cache Repository em Clean Architecture

> Cache pertence exclusivamente a camada de infra — nunca polua domain ou use-cases com logica de cache.

## Rules

1. **Cache so existe na camada de infra** — nunca importe cache service ou cache repository dentro de use-cases ou domain, porque cache e uma otimizacao de persistencia, nao regra de negocio
2. **Use classe abstrata, nao interface** — `abstract class CacheRepository` com metodos `set`, `get`, `delete`, porque interfaces em NestJS nao funcionam bem com DI
3. **Armazene como string (JSON serializado)** — use `JSON.stringify` para salvar e `JSON.parse` para ler, porque cache key-value nao precisa de queries relacionais
4. **Chave segue padrao `recurso:id:detalhe`** — ex: `question:abc123:details`, porque permite invalidacao granular
5. **Cache apenas dados que mudam raramente** — se 15 usuarios acessarem em 10 minutos e verao a mesma coisa, cachear e valido; listagens paginadas com filtros geralmente nao sao boas candidatas
6. **Invalide cache em mutacoes criticas** — ao alterar titulo, deletar resposta, ou qualquer dado crucial, remova a entrada do cache para forcar reload do banco

## How to write

### Cache Repository abstrato

```typescript
// src/infra/cache/cache-repository.ts
export abstract class CacheRepository {
  abstract set(key: string, value: string): Promise<void>
  abstract get(key: string): Promise<string | null>
  abstract delete(key: string): Promise<void>
}
```

### Integracao no repositorio Prisma (infra layer)

```typescript
// A logica de "se tem cache retorna, senao busca no banco" fica NO REPOSITORIO PRISMA
// NUNCA no use-case
export class PrismaQuestionsRepository implements QuestionsRepository {
  constructor(
    private prisma: PrismaService,
    private cache: CacheRepository,
  ) {}

  async findDetailsBySlug(slug: string): Promise<QuestionDetails | null> {
    const cacheKey = `question:${slug}:details`

    const cached = await this.cache.get(cacheKey)
    if (cached) {
      return JSON.parse(cached)
    }

    const question = await this.prisma.question.findUnique({
      where: { slug },
      // ... includes
    })

    if (question) {
      await this.cache.set(cacheKey, JSON.stringify(question))
    }

    return question
  }
}
```

## Example

**Before (cache no use-case — ERRADO):**
```typescript
// src/domain/forum/application/use-cases/get-question-by-slug.ts
export class GetQuestionBySlugUseCase {
  constructor(
    private questionsRepository: QuestionsRepository,
    private cacheService: CacheService, // ERRADO: cache no domain
  ) {}

  async execute({ slug }) {
    const cached = await this.cacheService.get(`question:${slug}`)
    if (cached) return JSON.parse(cached) // ERRADO: if de infra no use-case

    const question = await this.questionsRepository.findDetailsBySlug(slug)
    await this.cacheService.set(`question:${slug}`, JSON.stringify(question))
    return question
  }
}
```

**After (cache na infra — CORRETO):**
```typescript
// src/domain/forum/application/use-cases/get-question-by-slug.ts
export class GetQuestionBySlugUseCase {
  constructor(private questionsRepository: QuestionsRepository) {}

  async execute({ slug }) {
    // Use-case nao sabe se cache existe ou nao
    const question = await this.questionsRepository.findDetailsBySlug(slug)
    return question
  }
}
// Cache fica DENTRO do PrismaQuestionsRepository (infra layer)
```

## Heuristics

| Situacao | Acao |
|----------|------|
| Recurso acessado por muitos users, muda raramente | Cachear (ex: detalhes de pergunta) |
| Listagem paginada com filtros dinamicos | Nao cachear — complexidade de chaves explode |
| Dado alterado pelo usuario (titulo, foto) | Invalidar cache imediatamente apos mutacao |
| API externa lenta | Cachear com TTL adequado |
| Dado que muda a cada minuto | Nao cachear — cache ficara desatualizado demais |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| Importar cache service no use-case | Integrar cache dentro do repositorio Prisma |
| `if (cached) return cached` no domain | Mover essa logica para o repositorio de infra |
| Cachear listagens paginadas com filtros | Cachear apenas recursos individuais estaveis |
| Salvar objetos complexos sem serializar | `JSON.stringify` antes de salvar, `JSON.parse` ao ler |
| Cachear tudo na aplicacao | Cachear apenas dados que raramente mudam |
| Deixar cache desatualizado para sempre | Implementar invalidacao em mutacoes criticas |

## Troubleshooting

### Resultado inesperado ao aplicar o padrao
**Symptom:** Comportamento nao corresponde ao esperado apos seguir os passos
**Cause:** Dependencias ou configuracoes previas podem estar faltando
**Fix:** Verifique os prerequisites e confirme que todas as versoes estao compativeis

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes
