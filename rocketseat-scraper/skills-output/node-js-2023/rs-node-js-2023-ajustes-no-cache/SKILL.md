---
name: rs-node-js-2023-ajustes-no-cache
description: "Enforces correct cache storage strategy in NestJS when using domain classes and raw database data. Use when user asks to 'implement cache', 'fix cache', 'save to Redis', 'cache query results', or works with Prisma toDomain conversions and caching layers. Applies rule: always cache raw database data, never domain class instances, and convert toDomain only on cache hit. Make sure to use this skill whenever implementing or debugging cache in NestJS repositories. Not for HTTP caching, CDN config, or browser cache headers."
---

# Ajustes no Cache — NestJS com Domain Classes

> Salve dados raw do banco no cache, nunca instancias de classes de dominio — converta para dominio somente no momento do cache hit.

## Rules

1. **Salve dados raw antes do toDomain** — `await cache.set(key, rawData)` antes de converter para dominio, porque JSON.stringify em classes perde metadados da classe e JSON.parse nao reconstroi a instancia
2. **Converta toDomain no cache hit** — quando o cache retorna dados, execute `toDomain(cachedData)` naquele momento, porque os dados raw preservam toda informacao necessaria para conversao
3. **Nunca salve classes de dominio no cache** — classes com `props`, `UniqueEntityID` e metodos nao sobrevivem ao ciclo JSON.stringify/JSON.parse, porque JSON so preserva dados primitivos e objetos planos
4. **Teste o formato salvo no cache** — verifique que o cache contem o objeto raw com `expect(JSON.parse(cached)).toEqual(expect.objectContaining({ id: ... }))`, porque garante que o formato correto esta sendo persistido
5. **Teste o ciclo completo: vazio → salvo → recuperado** — primeiro verifique cache null, execute a query, depois verifique cache not null com dados corretos, porque isso prova que o cache funciona end-to-end

## How to write

### Repositorio com cache (padrao correto)

```typescript
// NO REPOSITORIO: salve raw ANTES de converter
async findDetailsBySlug(slug: string): Promise<QuestionDetails | null> {
  const cacheHit = await this.cache.get(`question:${slug}:details`)

  if (cacheHit) {
    // Converte para dominio SOMENTE no cache hit
    return QuestionDetailsMapper.toDomain(JSON.parse(cacheHit))
  }

  const questionRaw = await this.prisma.question.findUnique({
    where: { slug },
    include: { attachments: true, author: true },
  })

  if (!questionRaw) return null

  // Salva dados RAW no cache (antes do toDomain)
  await this.cache.set(`question:${slug}:details`, JSON.stringify(questionRaw))

  return QuestionDetailsMapper.toDomain(questionRaw)
}
```

### Teste: verifica formato salvo no cache

```typescript
it('should cache question details in raw format', async () => {
  // Setup: criar entidades necessarias
  const user = await studentFactory.make()
  const question = await questionFactory.make({ authorId: user.id })
  const attachment = await attachmentFactory.make()
  await questionAttachmentFactory.make({
    questionId: question.id,
    attachmentId: attachment.id,
  })

  // Executa query (popula cache)
  const questionDetails = await sut.findDetailsBySlug(question.slug)

  // Verifica formato raw no cache
  const cached = await cacheRepository.get(`question:${question.slug}:details`)

  if (!cached) throw new Error('Cache should not be empty')

  expect(JSON.parse(cached)).toEqual(
    expect.objectContaining({
      id: question.id.toString(),
    }),
  )
})
```

### Teste: ciclo completo vazio → salvo → recuperado

```typescript
it('should return cached data on subsequent calls', async () => {
  const user = await studentFactory.make()
  const question = await questionFactory.make({ authorId: user.id })

  // Antes: cache vazio
  let cached = await cacheRepository.get(`question:${question.slug}:details`)
  expect(cached).toBeNull()

  // Primeira chamada: popula cache
  await sut.findDetailsBySlug(question.slug)

  // Depois: cache preenchido
  cached = await cacheRepository.get(`question:${question.slug}:details`)
  expect(cached).not.toBeNull()

  expect(JSON.parse(cached!)).toEqual(
    expect.objectContaining({
      id: question.id.toString(),
    }),
  )
})
```

## Example

**Before (classe no cache — quebra no parse):**
```typescript
async findDetailsBySlug(slug: string) {
  const cacheHit = await this.cache.get(key)
  if (cacheHit) return JSON.parse(cacheHit) // Retorna objeto plano, NAO a classe

  const raw = await this.prisma.question.findUnique({ ... })
  const questionDetails = QuestionDetailsMapper.toDomain(raw)

  // ERRO: salva classe no cache — JSON.stringify perde metadados
  await this.cache.set(key, JSON.stringify(questionDetails))

  return questionDetails
}
```

**After (raw no cache — funciona corretamente):**
```typescript
async findDetailsBySlug(slug: string) {
  const cacheHit = await this.cache.get(key)
  if (cacheHit) {
    // Converte raw -> dominio no momento do hit
    return QuestionDetailsMapper.toDomain(JSON.parse(cacheHit))
  }

  const raw = await this.prisma.question.findUnique({ ... })

  // Salva dados RAW antes de converter
  await this.cache.set(key, JSON.stringify(raw))

  return QuestionDetailsMapper.toDomain(raw)
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Dados vem do Prisma/ORM com include/join | Salve o resultado raw no cache, converta depois |
| Cache retorna dados | Execute toDomain/toEntity no retorno do cache |
| Classe tem props, UniqueEntityID, Value Objects | Nunca serialize diretamente — use dados raw |
| Teste de cache | Verifique formato raw com objectContaining, nao a classe |
| Multiplos testes falhando | Use `.only` para isolar e resolver um por vez |

## Anti-patterns

| Nunca faca | Faca isto |
|------------|-----------|
| `cache.set(key, JSON.stringify(domainEntity))` | `cache.set(key, JSON.stringify(rawPrismaData))` |
| `return JSON.parse(cacheHit)` sem toDomain | `return Mapper.toDomain(JSON.parse(cacheHit))` |
| `cache.set(key, { empty: true })` como mock | Execute a query real para popular o cache no teste |
| Testar todos os campos do cache | Teste com `objectContaining` nos campos chave |
| Rodar todos os testes de uma vez quando varios falham | Use `it.only` para resolver um por vez |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
