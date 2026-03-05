---
name: rs-node-js-2023-integrando-cache-prisma
description: "Applies Redis caching patterns when implementing cache in Prisma repositories with NestJS. Use when user asks to 'add cache to repository', 'integrate Redis', 'cache database queries', 'optimize with cache', or 'implement caching layer'. Enforces colon-separated cache keys, slug/id identifiers in keys, JSON serialization, cache-hit-early-return pattern, and cache invalidation on writes. Make sure to use this skill whenever adding caching to any database repository. Not for HTTP caching, CDN configuration, or browser cache headers."
---

# Integrando Cache no Prisma

> Ao adicionar cache em repositorios, use chaves com dois pontos como separador, retorne cedo no cache hit, e invalide no write.

## Rules

1. **Separe chaves de cache com dois pontos (`:`)** — `question:{slug}:details` nao `questionDetails_{slug}`, porque o Redis permite deletar por prefixo usando o separador `:`
2. **Inclua identificadores unicos na chave** — use slug, id, ou outro valor que diferencie um cache do outro, porque sem identificador voce sobrescreve caches de entidades diferentes
3. **Use early return no cache hit** — verifique o cache ANTES da query ao banco, retorne imediatamente se encontrou, porque o restante do codigo nem precisa executar
4. **Serialize com JSON.stringify ao salvar, JSON.parse ao ler** — o Redis armazena strings, entao objetos complexos precisam de serializacao
5. **Invalide o cache no metodo de escrita** — ao salvar/atualizar, delete o cache relacionado dentro do mesmo fluxo, porque dados stale sao piores que cache miss
6. **Delete por prefixo quando houver multiplos caches** — use `question:{id}:*` para limpar todos os caches de uma entidade de uma vez

## How to write

### Cache key structure

```typescript
// Padrao: entidade:identificador:tipo-de-dado
`question:${slug}:details`
`question:${id}:reputation`
`user:${userId}:profile`
```

### Cache hit com early return

```typescript
async findDetailsBySlug(slug: string) {
  const cacheHit = await this.cache.get(`question:${slug}:details`)

  if (cacheHit) {
    return JSON.parse(cacheHit)
  }

  // Query ao banco so executa se nao encontrou no cache
  const question = await this.prisma.question.findUnique({
    where: { slug },
  })

  if (!question) return null

  const questionDetails = PrismaQuestionDetailsMapper.toDomain(question)

  await this.cache.set(
    `question:${slug}:details`,
    JSON.stringify(questionDetails),
  )

  return questionDetails
}
```

### Invalidacao no write

```typescript
async save(question: Question) {
  const data = PrismaQuestionMapper.toPrisma(question)

  await Promise.all([
    this.prisma.question.update({
      where: { id: data.id },
      data,
    }),
    this.cache.delete(`question:${data.slug}:details`),
  ])
}
```

## Example

**Before (sem cache):**
```typescript
async findDetailsBySlug(slug: string) {
  const question = await this.prisma.question.findUnique({
    where: { slug },
    include: { author: true, attachments: true },
  })

  if (!question) return null

  return PrismaQuestionDetailsMapper.toDomain(question)
}
```

**After (com cache integrado):**
```typescript
async findDetailsBySlug(slug: string) {
  const cacheHit = await this.cache.get(`question:${slug}:details`)

  if (cacheHit) {
    return JSON.parse(cacheHit)
  }

  const question = await this.prisma.question.findUnique({
    where: { slug },
    include: { author: true, attachments: true },
  })

  if (!question) return null

  const questionDetails = PrismaQuestionDetailsMapper.toDomain(question)

  await this.cache.set(
    `question:${slug}:details`,
    JSON.stringify(questionDetails),
  )

  return questionDetails
}
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Read method com dados que mudam pouco | Adicione cache com early return |
| Write method (save/update/delete) | Invalide o cache relacionado |
| Entidade tem multiplos caches | Delete por prefixo com `*` |
| Dados sao criticos e mudam frequentemente | Nao use cache ou use TTL curto |
| Cache key precisa de identificador | Use slug se disponivel, senao id |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `cache.set('questionDetails', ...)` | `cache.set('question:${slug}:details', ...)` |
| `cache.set(slug, ...)` | `cache.set('question:${slug}:details', ...)` |
| Retornar do banco sem verificar cache | Verificar cache ANTES da query |
| Salvar no banco sem invalidar cache | Invalidar cache dentro do mesmo Promise.all |
| `cache.set(key, questionDetails)` | `cache.set(key, JSON.stringify(questionDetails))` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
