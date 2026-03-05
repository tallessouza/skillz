---
name: rs-node-js-2023-tdd-and-mocking
description: "Applies TDD (Test Driven Development) Red-Green-Refactor cycle when implementing business rules in Node.js. Use when user asks to 'implement a business rule', 'write tests first', 'use TDD', 'validate check-in', or 'mock dates in tests'. Enforces writing failing test first, minimal implementation to pass, then refactor. Includes Vitest date mocking with useFakeTimers/setSystemTime. Make sure to use this skill whenever implementing complex business rules that benefit from test-first approach. Not for simple CRUD operations, documentation, or frontend component testing."
---

# TDD & Mocking com Vitest

> Escreva o teste antes do codigo: Red (teste falha) → Green (minimo para passar) → Refactor (melhorar).

## Rules

1. **Red primeiro** — escreva o teste que DEVE falhar antes de qualquer implementacao, porque o teste falhando prova que a regra ainda nao existe
2. **Green com codigo minimo** — implemente apenas o suficiente para o teste passar, mesmo que a implementacao seja "burra", porque mais testes vao guiar o refinamento
3. **Refactor so depois do green** — nunca refatore codigo que ainda nao faz o teste passar, porque voce precisa de seguranca antes de mudar
4. **Testes pequenos e especificos** — prefira muitos testes que testam uma coisa cada do que um teste que valida varios cenarios, porque testes granulares guiam melhor o desenvolvimento
5. **Mock datas sempre** — use `vi.useFakeTimers()` e `vi.setSystemTime()` para controlar datas nos testes, porque `new Date()` e temporal e quebra testes no futuro
6. **Resete mocks no afterEach** — chame `vi.useRealTimers()` apos cada teste, porque mocks vazados corrompem testes subsequentes

## How to write

### Setup de mocking de datas (Vitest)

```typescript
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

describe('Check-in Use Case', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should not allow check-in twice on the same day', async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))

    await sut.execute({ userId: 'user-01', gymId: 'gym-01' })

    await expect(() =>
      sut.execute({ userId: 'user-01', gymId: 'gym-01' }),
    ).rejects.toBeInstanceOf(Error)
  })
})
```

### Ciclo Red-Green-Refactor na pratica

```typescript
// RED: teste que falha (regra ainda nao implementada)
it('should not allow check-in twice on the same day', async () => {
  vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))
  await sut.execute({ userId: 'user-01', gymId: 'gym-01' })
  await expect(() =>
    sut.execute({ userId: 'user-01', gymId: 'gym-01' }),
  ).rejects.toBeInstanceOf(Error)
})

// GREEN: implementacao minima (ate sem validar data!)
async findByUserIdOnDate(userId: string, date: Date) {
  const checkIn = this.items.find(item => item.user_id === userId)
  return checkIn || null
}

// Novo teste expoe a falha da implementacao minima:
it('should allow check-in on different days', async () => {
  vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))
  await sut.execute({ userId: 'user-01', gymId: 'gym-01' })

  vi.setSystemTime(new Date(2022, 0, 21, 8, 0, 0))
  const { checkIn } = await sut.execute({ userId: 'user-01', gymId: 'gym-01' })
  expect(checkIn.id).toEqual(expect.any(String))
})

// REFACTOR: agora sim validar a data corretamente
```

## Example

**Before (teste depois do codigo, sem mock de data):**
```typescript
it('validates check-in', async () => {
  await sut.execute({ userId: 'user-01', gymId: 'gym-01' })
  await sut.execute({ userId: 'user-01', gymId: 'gym-01' })
  // Nao controla a data, pode quebrar no futuro
  // Nao testa o caso de erro
})
```

**After (TDD com mocking):**
```typescript
beforeEach(() => { vi.useFakeTimers() })
afterEach(() => { vi.useRealTimers() })

it('should not allow check-in twice on the same day', async () => {
  vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))
  await sut.execute({ userId: 'user-01', gymId: 'gym-01' })
  await expect(() =>
    sut.execute({ userId: 'user-01', gymId: 'gym-01' }),
  ).rejects.toBeInstanceOf(Error)
})

it('should allow check-in on different days', async () => {
  vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))
  await sut.execute({ userId: 'user-01', gymId: 'gym-01' })
  vi.setSystemTime(new Date(2022, 0, 21, 8, 0, 0))
  const { checkIn } = await sut.execute({ userId: 'user-01', gymId: 'gym-01' })
  expect(checkIn.id).toEqual(expect.any(String))
})
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Regra de negocio complexa | Use TDD — testes guiam a implementacao |
| CRUD simples | Escreva o teste depois, TDD nao agrega tanto valor |
| Logica que envolve datas | Sempre use `vi.useFakeTimers()` + `vi.setSystemTime()` |
| Teste passou com implementacao "burra" | Escreva mais testes para expor as lacunas |
| Multiplos cenarios para mesma regra | Um teste por cenario, nunca agrupe |
| JavaScript month em `new Date()` | Lembre: mes e zero-indexed (0 = janeiro) |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `new Date()` sem mock em testes | `vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))` |
| Implementacao completa no green | Codigo minimo para o teste passar |
| Um teste que valida 5 cenarios | 5 testes separados, um por cenario |
| `import { afterEach } from 'node:test'` | `import { afterEach } from 'vitest'` |
| `useFakeTimers` sem `useRealTimers` | Sempre resetar no `afterEach` |
| Refatorar antes do teste passar | Red → Green → so entao Refactor |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
