# Code Examples: Validando Horario do Check-in

## Exemplo completo do teste

```typescript
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { ValidateCheckInUseCase } from './validate-check-in'
import { LateCheckInValidationError } from './errors/late-check-in-validation-error'

let checkInsRepository: InMemoryCheckInsRepository
let sut: ValidateCheckInUseCase

describe('Validate Check-in Use Case', () => {
  beforeEach(() => {
    checkInsRepository = new InMemoryCheckInsRepository()
    sut = new ValidateCheckInUseCase(checkInsRepository)

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
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
  })

  it('should not be able to validate the check-in after 20 minutes of its creation', async () => {
    vi.setSystemTime(new Date(2023, 0, 1, 13, 40))

    const createdCheckIn = await checkInsRepository.create({
      gym_id: 'gym-01',
      user_id: 'user-01',
    })

    const TWENTY_ONE_MINUTES_IN_MS = 1000 * 60 * 21
    vi.advanceTimersByTime(TWENTY_ONE_MINUTES_IN_MS)

    await expect(() =>
      sut.execute({
        checkInId: createdCheckIn.id,
      }),
    ).rejects.toBeInstanceOf(LateCheckInValidationError)
  })
})
```

## Use case completo com validacao temporal

```typescript
import { CheckIn } from '@prisma/client'
import { CheckInsRepository } from '@/repositories/check-ins-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { LateCheckInValidationError } from './errors/late-check-in-validation-error'
import dayjs from 'dayjs'

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

    const distanceInMinutesFromCheckInCreation = dayjs(new Date()).diff(
      checkIn.created_at,
      'minutes',
    )

    if (distanceInMinutesFromCheckInCreation > 20) {
      throw new LateCheckInValidationError()
    }

    checkIn.validated_at = new Date()

    await this.checkInsRepository.save(checkIn)

    return {
      checkIn,
    }
  }
}
```

## Classe de erro especifico

```typescript
export class LateCheckInValidationError extends Error {
  constructor() {
    super('The check-in can only be validated until 20 minutes of its creation.')
  }
}
```

## In-memory repository (contexto de como `created_at` e setado)

```typescript
// No InMemoryCheckInsRepository, o create usa new Date():
async create(data: Prisma.CheckInUncheckedCreateInput) {
  const checkIn = {
    id: randomUUID(),
    user_id: data.user_id,
    gym_id: data.gym_id,
    validated_at: data.validated_at ? new Date(data.validated_at) : null,
    created_at: new Date(), // <-- interceptado pelo vi.useFakeTimers()
  }

  this.items.push(checkIn)
  return checkIn
}
```

## Variacao: testando exatamente no limite (20 minutos)

```typescript
it('should be able to validate the check-in at exactly 20 minutes', async () => {
  vi.setSystemTime(new Date(2023, 0, 1, 13, 40))

  const createdCheckIn = await checkInsRepository.create({
    gym_id: 'gym-01',
    user_id: 'user-01',
  })

  const TWENTY_MINUTES_IN_MS = 1000 * 60 * 20
  vi.advanceTimersByTime(TWENTY_MINUTES_IN_MS)

  // Exatamente 20 minutos — ainda deve ser valido (> 20, nao >= 20)
  const { checkIn } = await sut.execute({
    checkInId: createdCheckIn.id,
  })

  expect(checkIn.validated_at).toEqual(expect.any(Date))
})
```

## Variacao: usando a mesma tecnica para outras regras temporais

```typescript
// Exemplo: cupom expira em 48 horas
it('should not apply coupon after 48 hours', async () => {
  vi.setSystemTime(new Date(2023, 0, 1, 10, 0))

  const coupon = await couponsRepository.create({
    code: 'WELCOME10',
    discount_percent: 10,
  })

  const FORTY_NINE_HOURS_IN_MS = 1000 * 60 * 60 * 49
  vi.advanceTimersByTime(FORTY_NINE_HOURS_IN_MS)

  await expect(() =>
    sut.execute({ couponCode: coupon.code }),
  ).rejects.toBeInstanceOf(ExpiredCouponError)
})
```