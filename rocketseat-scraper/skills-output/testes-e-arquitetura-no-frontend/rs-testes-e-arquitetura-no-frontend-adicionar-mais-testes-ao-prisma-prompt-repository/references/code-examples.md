# Code Examples: Testes de Repository Prisma — Update e FindById

## Setup completo do mock do Prisma

```typescript
const prisma = {
  prompt: {
    create: jest.fn() as jest.MockedFunction<(args: { data: CreatePromptDTO }) => Promise<void>>,
    findFirst: jest.fn() as jest.MockedFunction<(args: { where: { title: string } }) => Promise<Prompt | null>>,
    findUnique: jest.fn() as jest.MockedFunction<(args: { where: { id: string } }) => Promise<Prompt | null>>,
    update: jest.fn() as jest.MockedFunction<(args: { where: { id: string }, data: Partial<Prompt> }) => Promise<Prompt>>,
  }
}

const repository = new PrismaPromptRepository(prisma as any)
```

## Teste completo do update — todos os campos

```typescript
describe("update", () => {
  it("deve atualizar e retornar o prompt", async () => {
    const now = new Date()
    const input = {
      id: "1",
      title: "Title",
      content: "Content",
      createdAt: now,
      updatedAt: now,
    }

    prisma.prompt.update.mockResolvedValue(input)

    const result = await repository.update(input.id, {
      title: input.title,
      content: input.content,
    })

    expect(prisma.prompt.update).toHaveBeenCalledWith({
      where: { id: input.id },
      data: { title: input.title, content: input.content },
    })
    expect(result).toEqual(input)
  })
})
```

## Teste de campo parcial — somente title

```typescript
it("deve enviar apenas campos presentes (somente title)", async () => {
  const now = new Date()
  const input = {
    id: "1",
    title: "Title",
    content: "Content",
    createdAt: now,
    updatedAt: now,
  }

  prisma.prompt.update.mockResolvedValue(input)

  await repository.update(input.id, { title: input.title })

  const call = prisma.prompt.update.mock.calls[0][0]

  expect(call.where).toEqual({ id: input.id })
  expect(call.data).toEqual({ title: input.title })
  expect("content" in call.data).toBe(false)
})
```

## Teste de campo parcial — somente content

```typescript
it("deve enviar apenas campos presentes (somente content)", async () => {
  const now = new Date()
  const input = {
    id: "1",
    title: "Title",
    content: "Content",
    createdAt: now,
    updatedAt: now,
  }

  prisma.prompt.update.mockResolvedValue(input)

  await repository.update(input.id, { content: "new content" })

  const call = prisma.prompt.update.mock.calls[0][0]

  expect(call.where).toEqual({ id: input.id })
  expect(call.data).toEqual({ content: "new content" })
  expect("title" in call.data).toBe(false)
})
```

## Teste findById — prompt existe

```typescript
describe("findById", () => {
  it("deve retornar um prompt quando existir", async () => {
    const now = new Date()
    const input = {
      id: "1",
      title: "Title",
      content: "Content",
      createdAt: now,
      updatedAt: now,
    }

    prisma.prompt.findUnique.mockResolvedValue(input)

    const result = await repository.findById(input.id)

    expect(prisma.prompt.findUnique).toHaveBeenCalledWith({
      where: { id: input.id },
    })
    expect(result).toEqual(input)
  })
})
```

## Teste findById — prompt nao existe

```typescript
it("deve retornar null quando nao existir", async () => {
  prisma.prompt.findUnique.mockResolvedValue(null)

  const result = await repository.findById("nonexistent-id")

  expect(result).toBeNull()
})
```

## Tecnica: acessar mock.calls para assertions granulares

```typescript
// Em vez de usar toHaveBeenCalledWith (que valida o objeto inteiro),
// acesse mock.calls para verificar partes especificas:

const call = prisma.prompt.update.mock.calls[0][0]
// call.where -> { id: "1" }
// call.data  -> { title: "Title" }

// Verificar que um campo NAO foi enviado:
expect("content" in call.data).toBe(false)

// Isso e mais granular que toHaveBeenCalledWith,
// porque permite verificar AUSENCIA de propriedades
```

## Verificando falso positivo

```typescript
// O instrutor demonstra: se voce adiciona content ao update,
// o teste de "somente title" deve quebrar:

await repository.update(input.id, { title: input.title, content: "extra" })
// -> expect("content" in call.data).toBe(false) FALHA ✓

// Isso prova que o teste nao e um falso positivo
```