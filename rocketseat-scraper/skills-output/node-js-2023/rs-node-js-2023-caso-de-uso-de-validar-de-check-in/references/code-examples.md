# Code Examples: Caso de Uso de Validar Check-in

## Interface do repositorio (adicionando findById e save)

```typescript
// src/repositories/check-ins-repository.ts
import { CheckIn } from '@prisma/client'

export interface CheckInsRepository {
  create(data: Prisma.CheckInUncheckedCreateInput): Promise<CheckIn>
  findById(id: string): Promise<CheckIn | null>
  save(checkIn: CheckIn): Promise<CheckIn>
  findByUserIdOnDate(userId: string, date: Date): Promise<CheckIn | null>
  findManyByUserId(userId: string): Promise<CheckIn[]>
}
```

## In-memory repository completo (findById + save)

```typescript
// src/repositories/in-memory/in-memory-check-ins-repository.ts

async findById(id: string) {
  const checkIn = this.items.find((item) => item.id === id)

  if (!checkIn) {
    return null
  }

  return checkIn
}

async save(checkIn: CheckIn) {
  const checkInIndex = this.items.findIndex(
    (item) => item.id === checkIn.id,
  )

  if (checkInIndex >= 0) {
    this.items[checkInIndex] = checkIn
  }

  return checkIn
}
```

## Use case completo

```typescript
// src/use-cases/validate-check-in.ts
import { CheckIn } from '@prisma/client'
import { CheckInsRepository } from '@/repositories/check-ins-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

interface ValidateCheckInUseCaseRequest {
  checkInId: string
}

interface ValidateCheckInUseCaseResponse {
  checkIn: CheckIn
}

export class ValidateCheckInUseCase {
  constructor(private checkInsRepository: CheckInsRepository) {}

  async execute({
    checkInId,
  }: ValidateCheckInUseCaseRequest): Promise<ValidateCheckInUseCaseResponse> {
    const checkIn = await this.checkInsRepository.findById(checkInId)

    if (!checkIn) {
      throw new ResourceNotFoundError()
    }

    checkIn.validated_at = new Date()

    await this.checkInsRepository.save(checkIn)

    return { checkIn }
  }
}
```

## Teste completo

```typescript
// src/use-cases/validate-check-in.spec.ts
import { describe, it, expect, beforeEach } from 'vitest'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { ValidateCheckInUseCase } from './validate-check-in'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

let checkInsRepository: InMemoryCheckInsRepository
let sut: ValidateCheckInUseCase

describe('Validate Check-in Use Case', () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository()
    sut = new ValidateCheckInUseCase(checkInsRepository)
  })

  it('should be able to validate the check-in', async () => {
    const createdCheckIn = await checkInsRepository.create({
      gym_id: 'gym-01',
      user_id: 'user-01',
    })

    const { checkIn } = await sut.execute({
      checkInId: createdCheckIn.id,
    })

    expect(checkIn.validated_at).toEqual(expect.any(Date))
    expect(checkInsRepository.items[0].validated_at).toEqual(
      expect.any(Date),
    )
  })

  it('should not be able to validate an inexistent check-in', async () => {
    await expect(() =>
      sut.execute({
        checkInId: 'inexistent-check-in-id',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
```

## Padrao de setup do teste

```typescript
// Padrao: criar o recurso no repositorio ANTES de chamar o use case
const createdCheckIn = await checkInsRepository.create({
  gym_id: 'gym-01',
  user_id: 'user-01',
})

// Depois chamar o use case com o id do recurso criado
const { checkIn } = await sut.execute({
  checkInId: createdCheckIn.id,
})
```

## Padrao de teste de erro com async/await

```typescript
// O await ANTES do expect garante que a promise resolve/rejeita
// antes do Jest/Vitest avaliar o resultado
await expect(() =>
  sut.execute({ checkInId: 'inexistent-check-in-id' }),
).rejects.toBeInstanceOf(ResourceNotFoundError)
```

## Variacao: se o save precisasse lidar com item nao encontrado

```typescript
// Versao defensiva (nao usada na aula, mas util como referencia)
async save(checkIn: CheckIn) {
  const checkInIndex = this.items.findIndex(
    (item) => item.id === checkIn.id,
  )

  if (checkInIndex >= 0) {
    this.items[checkInIndex] = checkIn
  } else {
    // Opcao 1: inserir como novo (upsert)
    this.items.push(checkIn)
    // Opcao 2: lancar erro
    // throw new Error('Check-in not found in repository')
  }

  return checkIn
}
```