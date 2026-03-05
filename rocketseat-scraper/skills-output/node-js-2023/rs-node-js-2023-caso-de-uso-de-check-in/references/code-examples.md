# Code Examples: Caso de Uso de Check-in

## Exemplo completo: Check-in Use Case

```typescript
// src/use-cases/check-in.ts
import { CheckIn } from '@prisma/client'
import { CheckInsRepository } from '@/repositories/check-ins-repository'

interface CheckInUseCaseRequest {
  userId: string
  gymId: string
}

interface CheckInUseCaseResponse {
  checkIn: CheckIn
}

export class CheckInUseCase {
  constructor(private checkInsRepository: CheckInsRepository) {}

  async execute({
    userId,
    gymId,
  }: CheckInUseCaseRequest): Promise<CheckInUseCaseResponse> {
    const checkIn = await this.checkInsRepository.create({
      gym_id: gymId,
      user_id: userId,
    })

    return { checkIn }
  }
}
```

## Exemplo completo: Repository Interface

```typescript
// src/repositories/check-ins-repository.ts
import { Prisma, CheckIn } from '@prisma/client'

export interface CheckInsRepository {
  create(data: Prisma.CheckInUncheckedCreateInput): Promise<CheckIn>
}
```

## Exemplo completo: In-Memory Repository

```typescript
// src/repositories/in-memory/in-memory-check-ins-repository.ts
import { randomUUID } from 'node:crypto'
import { CheckIn, Prisma } from '@prisma/client'
import { CheckInsRepository } from '../check-ins-repository'

export class InMemoryCheckInsRepository implements CheckInsRepository {
  public items: CheckIn[] = []

  async create(data: Prisma.CheckInUncheckedCreateInput) {
    const checkIn: CheckIn = {
      id: randomUUID(),
      user_id: data.user_id,
      gym_id: data.gym_id,
      validated_at: data.validated_at
        ? new Date(data.validated_at as string)
        : null,
      created_at: new Date(),
    }

    this.items.push(checkIn)

    return checkIn
  }
}
```

## Exemplo completo: Teste unitario

```typescript
// src/use-cases/check-in.spec.ts
import { describe, it, expect, beforeEach } from 'vitest'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { CheckInUseCase } from './check-in'

let checkInsRepository: InMemoryCheckInsRepository
let sut: CheckInUseCase

describe('Check-in Use Case', () => {
  beforeEach(() => {
    checkInsRepository = new InMemoryCheckInsRepository()
    sut = new CheckInUseCase(checkInsRepository)
  })

  it('should be able to check in', async () => {
    const { checkIn } = await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })
})
```

## Correcao do await em testes existentes

```typescript
// ANTES (em authenticate.spec.ts, get-user-profile.spec.ts, etc.)
expect(authenticateUseCase.execute({
  email: 'wrong@example.com',
  password: '123456',
})).rejects.toBeInstanceOf(InvalidCredentialsError)

// DEPOIS (com await)
await expect(authenticateUseCase.execute({
  email: 'wrong@example.com',
  password: '123456',
})).rejects.toBeInstanceOf(InvalidCredentialsError)
```

## In-Memory Users Repository atualizado

```typescript
// Mudanca: randomUUID ao inves de ID fixo
import { randomUUID } from 'node:crypto'

export class InMemoryUsersRepository implements UsersRepository {
  public items: User[] = []

  async create(data: Prisma.UserCreateInput) {
    const user: User = {
      id: randomUUID(), // antes era 'user-1'
      name: data.name,
      email: data.email,
      password_hash: data.password_hash,
      created_at: new Date(),
    }

    this.items.push(user)
    return user
  }
}
```

## Schema Prisma de referencia

```prisma
model CheckIn {
  id           String    @id @default(uuid())
  created_at   DateTime  @default(now())
  validated_at DateTime?

  user    User   @relation(fields: [user_id], references: [id])
  user_id String

  gym    Gym    @relation(fields: [gym_id], references: [id])
  gym_id String

  @@map("check_ins")
}
```