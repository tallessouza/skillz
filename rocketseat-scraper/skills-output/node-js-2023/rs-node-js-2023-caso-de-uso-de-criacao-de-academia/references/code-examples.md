# Code Examples: Caso de Uso de Criacao de Academia

## 1. Interface do GymsRepository (adicionando metodo create)

```typescript
// src/repositories/gyms-repository.ts
import { Gym, Prisma } from '@prisma/client'

export interface GymsRepository {
  findById(id: string): Promise<Gym | null>
  create(data: Prisma.GymCreateInput): Promise<Gym>
}
```

## 2. InMemoryGymsRepository (implementacao completa do create)

```typescript
// src/repositories/in-memory/in-memory-gyms-repository.ts
import { Gym, Prisma } from '@prisma/client'
import { randomUUID } from 'node:crypto'
import { GymsRepository } from '../gyms-repository'

export class InMemoryGymsRepository implements GymsRepository {
  public items: Gym[] = []

  async findById(id: string) {
    const gym = this.items.find((item) => item.id === id)
    return gym ?? null
  }

  async create(data: Prisma.GymCreateInput) {
    const gym: Gym = {
      id: data.id ?? randomUUID(),
      title: data.title,
      description: data.description ?? null,
      phone: data.phone ?? null,
      latitude: new Prisma.Decimal(data.latitude.toString()),
      longitude: new Prisma.Decimal(data.longitude.toString()),
    }

    this.items.push(gym)

    return gym
  }
}
```

**Pontos-chave:**
- `data.id ?? randomUUID()` — permite testes com ID fixo
- `data.description ?? null` — Prisma nao aceita undefined, entao converte para null
- `new Prisma.Decimal(value.toString())` — converte number para o tipo Decimal do Prisma

## 3. CreateGymUseCase

```typescript
// src/use-cases/create-gym.ts
import { Gym } from '@prisma/client'
import { GymsRepository } from '@/repositories/gyms-repository'

interface CreateGymUseCaseRequest {
  title: string
  description: string | null
  phone: string | null
  latitude: number
  longitude: number
}

interface CreateGymUseCaseResponse {
  gym: Gym
}

export class CreateGymUseCase {
  constructor(private gymsRepository: GymsRepository) {}

  async execute({
    title,
    description,
    phone,
    latitude,
    longitude,
  }: CreateGymUseCaseRequest): Promise<CreateGymUseCaseResponse> {
    const gym = await this.gymsRepository.create({
      title,
      description,
      phone,
      latitude,
      longitude,
    })

    return { gym }
  }
}
```

## 4. Teste unitario do CreateGymUseCase

```typescript
// src/use-cases/create-gym.spec.ts
import { describe, it, expect, beforeEach } from 'vitest'
import { CreateGymUseCase } from './create-gym'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'

let gymsRepository: InMemoryGymsRepository
let sut: CreateGymUseCase

describe('Create Gym Use Case', () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository()
    sut = new CreateGymUseCase(gymsRepository)
  })

  it('should be able to create gym', async () => {
    const { gym } = await sut.execute({
      title: 'JavaScript Gym',
      description: null,
      phone: null,
      latitude: -27.2092052,
      longitude: -49.6401091,
    })

    expect(gym.id).toEqual(expect.any(String))
  })
})
```

## 5. Erros customizados

```typescript
// src/use-cases/errors/max-distance-error.ts
export class MaxDistanceError extends Error {
  constructor() {
    super('Max distance reached.')
  }
}

// src/use-cases/errors/max-number-of-check-ins-error.ts
export class MaxNumberOfCheckInsError extends Error {
  constructor() {
    super('Max number of check-ins reached.')
  }
}
```

## 6. Refatoracao do teste de check-in (antes e depois)

### Antes — push direto no array:
```typescript
beforeEach(() => {
  gymsRepository.items.push({
    id: 'gym-01',
    title: 'JavaScript Gym',
    description: '',
    phone: '',
    latitude: new Decimal(-27.2092052),
    longitude: new Decimal(-49.6401091),
  })
})
```

### Depois — usando metodo create do repositorio:
```typescript
beforeEach(async () => {
  await gymsRepository.create({
    id: 'gym-01',
    title: 'JavaScript Gym',
    description: null,
    phone: null,
    latitude: -27.2092052,
    longitude: -49.6401091,
  })
})
```

**Vantagem:** o teste usa o mesmo caminho que o codigo de producao, a conversao de Decimal e o fallback de null ficam encapsulados no repositorio.

## 7. Uso dos erros customizados no check-in use case

```typescript
// Dentro do CheckInUseCase.execute()

// Verificar distancia
if (distance > MAX_DISTANCE_IN_KILOMETERS) {
  throw new MaxDistanceError()
}

// Verificar check-ins no mesmo dia
const checkInOnSameDay = await this.checkInsRepository.findByUserIdOnDate(
  userId,
  new Date(),
)

if (checkInOnSameDay) {
  throw new MaxNumberOfCheckInsError()
}
```

## 8. Teste validando erros customizados

```typescript
it('should not be able to check in on distant gym', async () => {
  await expect(() =>
    sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
    }),
  ).rejects.toBeInstanceOf(MaxDistanceError)
})

it('should not be able to check in twice in the same day', async () => {
  await expect(() =>
    sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
    }),
  ).rejects.toBeInstanceOf(MaxNumberOfCheckInsError)
})
```