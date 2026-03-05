# Code Examples: Testes do Prisma Repository

## Exemplo 1: Factory createMockPrisma (versao simples)

```typescript
function createMockPrisma() {
  const mock = {
    prompt: {
      findMany: jest.fn(),
      create: jest.fn(),
      delete: jest.fn(),
    },
  }
  return mock
}
```

Versao minima, sem tipagem. Funciona para testes simples.

## Exemplo 2: Factory createMockPrisma (versao tipada completa)

```typescript
import { PrismaClient } from '@prisma/client'
import { Prompt } from '@/core/entities/prompt'

type PromptDelegateMock = {
  findMany: jest.MockedFunction<(args: {
    orderBy?: { createdAt: 'asc' | 'desc' }
    where?: {
      OR?: Array<{
        title?: { contains: string; mode: 'insensitive' }
        content?: { contains: string; mode: 'insensitive' }
      }>
    }
  }) => Promise<Prompt[]>>
}

type PrismaMock = {
  prompt: PromptDelegateMock
}

function createMockPrisma() {
  const mock: PrismaMock = {
    prompt: {
      findMany: jest.fn(),
    },
  }
  return mock as unknown as PrismaClient & PrismaMock
}
```

## Exemplo 3: Teste findMany completo

```typescript
describe('PrismaPromptRepository', () => {
  let prisma: ReturnType<typeof createMockPrisma>
  let repository: PrismaPromptRepository

  beforeEach(() => {
    prisma = createMockPrisma()
    repository = new PrismaPromptRepository(prisma)
  })

  describe('findMany', () => {
    it('deve ordenar por createdAt descendente e mapear resultados', async () => {
      const now = new Date()
      const input = [
        { id: '1', title: 'title01', content: 'content01', createdAt: now, updatedAt: now },
        { id: '2', title: 'title02', content: 'content02', createdAt: now, updatedAt: now },
      ]

      prisma.prompt.findMany.mockResolvedValue(input)

      const results = await repository.findMany()

      expect(prisma.prompt.findMany).toHaveBeenCalledWith({
        orderBy: { createdAt: 'desc' },
      })
      expect(results).toMatchObject(input)
    })
  })
})
```

## Exemplo 4: Teste searchMany com termo vazio

```typescript
describe('searchMany', () => {
  it('deve buscar por termo vazio sem where', async () => {
    const now = new Date()
    const input = [
      { id: '1', title: 'title01', content: 'content01', createdAt: now, updatedAt: now },
    ]

    prisma.prompt.findMany.mockResolvedValue(input)

    const result = await repository.searchMany('  ')

    expect(prisma.prompt.findMany).toHaveBeenCalledWith({
      where: undefined,
      orderBy: { createdAt: 'desc' },
    })
    expect(result).toMatchObject(input)
  })
})
```

## Exemplo 5: Teste searchMany com termo preenchido (OR no WHERE)

```typescript
it('deve buscar por termo e popular OR no WHERE', async () => {
  const now = new Date()
  const input = [
    { id: '1', title: 'title01', content: 'content01', createdAt: now, updatedAt: now },
  ]

  prisma.prompt.findMany.mockResolvedValue(input)

  await repository.searchMany('title01')

  expect(prisma.prompt.findMany).toHaveBeenCalledWith({
    where: {
      OR: [
        { title: { contains: 'title01', mode: 'insensitive' } },
        { content: { contains: 'title01', mode: 'insensitive' } },
      ],
    },
    orderBy: { createdAt: 'desc' },
  })
})
```

## Exemplo 6: Verificacao de falso positivo

```typescript
// Apos o teste passar, quebre propositalmente:

// Troque 'desc' por 'asc' na assertion:
expect(prisma.prompt.findMany).toHaveBeenCalledWith({
  orderBy: { createdAt: 'asc' }, // <-- deve FALHAR se o teste e real
})

// Troque undefined por um valor no where:
expect(prisma.prompt.findMany).toHaveBeenCalledWith({
  where: { something: true }, // <-- deve FALHAR
  orderBy: { createdAt: 'desc' },
})

// Se o teste continua passando, ha um problema no setup
```

## Exemplo 7: Estrutura de pastas (espelhamento)

```
src/
  infra/
    repository/
      prisma-prompt-repository.ts

test/
  infra/
    repository/
      prisma-prompt-repository.spec.ts
```