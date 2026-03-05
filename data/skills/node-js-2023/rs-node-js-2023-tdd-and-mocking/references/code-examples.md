# Code Examples: TDD & Mocking

## Setup completo do teste com mocking de datas

```typescript
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { CheckInUseCase } from './check-in'

describe('Check In Use Case', () => {
  let checkInsRepository: InMemoryCheckInsRepository
  let sut: CheckInUseCase

  beforeEach(() => {
    checkInsRepository = new InMemoryCheckInsRepository()
    sut = new CheckInUseCase(checkInsRepository)

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  // ... testes aqui
})
```

## Teste basico de check-in (teste escrito ANTES do TDD)

```typescript
it('should be able to check in', async () => {
  const { checkIn } = await sut.execute({
    userId: 'user-01',
    gymId: 'gym-01',
  })

  expect(checkIn.id).toEqual(expect.any(String))
})
```

## Teste TDD — Red: nao pode check-in 2x no mesmo dia

```typescript
it('should not be able to check in twice in the same day', async () => {
  vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))

  await sut.execute({
    userId: 'user-01',
    gymId: 'gym-01',
  })

  await expect(() =>
    sut.execute({
      userId: 'user-01',
      gymId: 'gym-01',
    }),
  ).rejects.toBeInstanceOf(Error)
})
```

## Teste TDD — Segundo teste que expoe a implementacao "burra"

```typescript
it('should be able to check in twice but in different days', async () => {
  vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))

  await sut.execute({
    userId: 'user-01',
    gymId: 'gym-01',
  })

  vi.setSystemTime(new Date(2022, 0, 21, 8, 0, 0))

  const { checkIn } = await sut.execute({
    userId: 'user-01',
    gymId: 'gym-01',
  })

  expect(checkIn.id).toEqual(expect.any(String))
})
```

## Interface do repository com novo metodo

```typescript
export interface CheckInsRepository {
  create(data: Prisma.CheckInUncheckedCreateInput): Promise<CheckIn>
  findByUserIdOnDate(userId: string, date: Date): Promise<CheckIn | null>
}
```

## Implementacao Green (minima, "burra") no in-memory repository

```typescript
async findByUserIdOnDate(userId: string, date: Date) {
  // GREEN: implementacao minima — ignora a data propositalmente
  const checkIn = this.items.find(
    (item) => item.user_id === userId,
  )

  if (!checkIn) {
    return null
  }

  return checkIn
}
```

## Uso no caso de uso (check-in)

```typescript
async execute({ userId, gymId }: CheckInUseCaseRequest) {
  const checkInOnSameDay = await this.checkInsRepository.findByUserIdOnDate(
    userId,
    new Date(),
  )

  if (checkInOnSameDay) {
    throw new Error()
  }

  const checkIn = await this.checkInsRepository.create({
    user_id: userId,
    gym_id: gymId,
  })

  return { checkIn }
}
```

## Demonstracao de como setSystemTime afeta new Date()

```typescript
// Sem fake timers:
console.log(new Date()) // 2023-02-28T20:47:00.000Z (data real)

// Com fake timers:
vi.useFakeTimers()
vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))
console.log(new Date()) // 2022-01-20T11:00:00.000Z (data ficticia, +3h UTC)
```

## Armadilha: import errado do afterEach

```typescript
// ERRADO — afterEach de node:test nao funciona com Vitest
import { afterEach } from 'node:test'

// CORRETO — sempre importar do vitest
import { afterEach } from 'vitest'
```