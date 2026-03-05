# Code Examples: Ajustes no Cache — NestJS com Domain Classes

## Exemplo 1: Repositorio antes da correcao

```typescript
// PROBLEMA: salva classe de dominio no cache
async findDetailsBySlug(slug: string): Promise<QuestionDetails | null> {
  const cacheHit = await this.cacheRepository.get(`question:${slug}:details`)

  if (cacheHit) {
    // JSON.parse retorna objeto plano, NAO QuestionDetails
    return JSON.parse(cacheHit)
  }

  const question = await this.prisma.question.findUnique({
    where: { slug },
    include: {
      author: true,
      attachments: true,
    },
  })

  if (!question) return null

  // Converte para dominio ANTES de salvar no cache
  const questionDetails = PrismaQuestionDetailsMapper.toDomain(question)

  // ERRO: JSON.stringify na classe perde metadados
  await this.cacheRepository.set(
    `question:${slug}:details`,
    JSON.stringify(questionDetails),
  )

  return questionDetails
}
```

## Exemplo 2: Repositorio apos a correcao

```typescript
// CORRETO: salva dados raw no cache
async findDetailsBySlug(slug: string): Promise<QuestionDetails | null> {
  const cacheHit = await this.cacheRepository.get(`question:${slug}:details`)

  if (cacheHit) {
    // Converte para dominio NO MOMENTO do cache hit
    const cachedData = JSON.parse(cacheHit)
    return PrismaQuestionDetailsMapper.toDomain(cachedData)
  }

  const question = await this.prisma.question.findUnique({
    where: { slug },
    include: {
      author: true,
      attachments: true,
    },
  })

  if (!question) return null

  // Salva dados RAW (antes do toDomain)
  await this.cacheRepository.set(
    `question:${slug}:details`,
    JSON.stringify(question),
  )

  return PrismaQuestionDetailsMapper.toDomain(question)
}
```

## Exemplo 3: Teste — verifica formato salvo no cache

```typescript
it('should cache question details on first call', async () => {
  const user = await studentFactory.make()
  const question = await questionFactory.make({ authorId: user.id })
  const attachment = await attachmentFactory.make()
  await questionAttachmentFactory.make({
    questionId: question.id,
    attachmentId: attachment.id,
  })

  // Primeira chamada — popula o cache
  const questionDetails = await sut.findDetailsBySlug(question.slug)

  // Verifica o que foi salvo no cache
  const cached = await cacheRepository.get(
    `question:${question.slug}:details`,
  )

  if (!cached) {
    throw new Error('Cache should not be empty after first call')
  }

  // Cache deve conter dados RAW, nao a classe
  expect(JSON.parse(cached)).toEqual(
    expect.objectContaining({
      id: question.id.toString(), // toString() porque no raw e string
    }),
  )
})
```

## Exemplo 4: Teste — ciclo completo vazio → preenchido

```typescript
it('should return cached question details on subsequent calls', async () => {
  const user = await studentFactory.make()
  const question = await questionFactory.make({ authorId: user.id })
  const attachment = await attachmentFactory.make()
  await questionAttachmentFactory.make({
    questionId: question.id,
    attachmentId: attachment.id,
  })

  // Antes: cache VAZIO
  let cached = await cacheRepository.get(
    `question:${question.slug}:details`,
  )
  expect(cached).toBeNull()

  // Primeira chamada
  await sut.findDetailsBySlug(question.slug)

  // Depois: cache PREENCHIDO
  cached = await cacheRepository.get(
    `question:${question.slug}:details`,
  )
  expect(cached).not.toBeNull()

  if (!cached) {
    throw new Error('Cache should be populated after first call')
  }

  expect(JSON.parse(cached)).toEqual(
    expect.objectContaining({
      id: question.id.toString(),
    }),
  )
})
```

## Exemplo 5: Teste — invalidacao do cache

```typescript
it('should reset question details cache when saving the question', async () => {
  const user = await studentFactory.make()
  const question = await questionFactory.make({ authorId: user.id })

  // Popula cache
  await sut.findDetailsBySlug(question.slug)

  // Salva a question (deve invalidar cache)
  await sut.save(question)

  // Cache deve estar vazio apos save
  const cached = await cacheRepository.get(
    `question:${question.slug}:details`,
  )
  expect(cached).toBeNull()
})
```

## Exemplo 6: Usando it.only para debug isolado

```typescript
describe('PrismaQuestionsRepository', () => {
  // Quando multiplos testes falham, isole com .only
  it.only('should cache question details on first call', async () => {
    // ... teste isolado
  })

  it('should return cached on subsequent calls', async () => {
    // Este sera pulado (skipped) enquanto .only esta ativo
  })

  it('should reset cache on save', async () => {
    // Este tambem sera pulado
  })
})
```

## Variacao: mesmo padrao com outros repositories

```typescript
// O padrao se aplica a qualquer repositorio com cache + domain mapping
async findById(id: string): Promise<Answer | null> {
  const cacheHit = await this.cache.get(`answer:${id}`)

  if (cacheHit) {
    return PrismaAnswerMapper.toDomain(JSON.parse(cacheHit))
  }

  const answer = await this.prisma.answer.findUnique({
    where: { id },
  })

  if (!answer) return null

  // Sempre salve o raw
  await this.cache.set(`answer:${id}`, JSON.stringify(answer))

  return PrismaAnswerMapper.toDomain(answer)
}
```