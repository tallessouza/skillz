---
name: rs-testes-e-criando-os-testes-do-prisma-prompt-repository
description: "Enforces patterns for testing Prisma repositories with Jest mocks in clean architecture. Use when user asks to 'test a repository', 'mock Prisma', 'write unit tests for database layer', 'test infrastructure layer', or 'create repository tests'. Applies rules: mock Prisma client with typed factory function, test underlying Prisma calls not abstractions, verify with mockResolvedValue, check false positives by breaking assertions. Make sure to use this skill whenever testing any Prisma-based repository or data access layer. Not for testing API routes, UI components, or end-to-end database tests."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: testes-e-arquitetura-no-frontend
  module: unit-testing
  tags: [testing, next-js, react, jest, prisma, mock]
---

# Testes do Prisma Repository

> Teste cada camada da arquitetura isoladamente — o repository de infraestrutura testa que o Prisma e chamado corretamente por baixo dos panos, nao a logica de negocio.

## Rules

1. **Crie uma factory `createMockPrisma`** — centraliza a criacao do mock tipado do Prisma, porque permite reutilizar em todos os testes de repository
2. **Use `jest.fn()` para cada metodo do Prisma** — `findMany`, `create`, `delete`, porque permite verificar chamadas e retornos individualmente
3. **Teste o metodo real do Prisma, nao a abstracao** — se `searchMany` usa `findMany` internamente, verifique que `prisma.prompt.findMany` foi chamado, porque a abstracao e sua, o Prisma so tem `findMany`
4. **Verifique falsos positivos** — apos o teste passar, quebre a assertion propositalmente (ex: troque `desc` por `asc`) para confirmar que o teste realmente valida, porque testes que sempre passam nao testam nada
5. **Use `beforeEach` para instanciar mock e repository** — garante isolamento entre testes, porque estado compartilhado entre testes causa falhas intermitentes
6. **Tipagem do mock e opcional mas recomendada** — crie types como `PrismaMock` e `PromptDelegateMock` para autocomplete e seguranca, mas `as any` e aceitavel em testes quando a tipagem completa nao agrega

## How to write

### Factory de mock do Prisma

```typescript
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

### Estrutura do teste

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

### Testando searchMany (abstracao sobre findMany)

```typescript
describe('searchMany', () => {
  it('deve buscar por termo vazio sem where', async () => {
    const now = new Date()
    const input = [{ id: '1', title: 'title01', content: 'content01', createdAt: now, updatedAt: now }]

    prisma.prompt.findMany.mockResolvedValue(input)

    const result = await repository.searchMany('  ')

    expect(prisma.prompt.findMany).toHaveBeenCalledWith({
      where: undefined,
      orderBy: { createdAt: 'desc' },
    })
    expect(result).toMatchObject(input)
  })

  it('deve popular OR no WHERE quando termo informado', async () => {
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
})
```

## Example

**Before (mock sem tipagem, sem verificacao de chamada):**
```typescript
it('should find prompts', async () => {
  const repo = new PrismaPromptRepository(prismaMock as any)
  const result = await repo.findMany()
  expect(result).toBeDefined() // nao verifica COMO o Prisma foi chamado
})
```

**After (com this skill applied):**
```typescript
it('deve ordenar por createdAt desc e mapear resultados', async () => {
  prisma.prompt.findMany.mockResolvedValue(input)
  const results = await repository.findMany()

  expect(prisma.prompt.findMany).toHaveBeenCalledWith({
    orderBy: { createdAt: 'desc' },
  })
  expect(results).toMatchObject(input)
})
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Metodo do repository usa Prisma internamente | Verifique `toHaveBeenCalledWith` com os parametros exatos do Prisma |
| Termo de busca e vazio/espacos | Espere `where: undefined` |
| Termo de busca tem conteudo | Espere `OR` com `contains` e `mode: 'insensitive'` |
| Tipagem do mock esta muito complexa | Use `as any` nos testes — nao e critico tipar mocks |
| Teste passou de primeira | Quebre propositalmente para confirmar que nao e falso positivo |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| `expect(result).toBeDefined()` | `expect(result).toMatchObject(expected)` |
| Testar `searchMany` sem verificar `findMany` do Prisma | `expect(prisma.prompt.findMany).toHaveBeenCalledWith(...)` |
| Criar instancia do Prisma real em teste unitario | Usar `createMockPrisma()` com `jest.fn()` |
| Compartilhar estado entre testes | `beforeEach` para reiniciar mock e repository |
| Confiar que o teste passou sem verificar | Quebrar assertion para confirmar que nao e falso positivo |


## Troubleshooting

### Teste falha inesperadamente
**Symptom:** Teste que funcionava comeca a falhar sem mudancas no codigo
**Cause:** Mock de teste anterior vazando estado ou dependencia externa mudou
**Fix:** Adicionar mockReset/mockClear no beforeEach e isolar dependencias

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
