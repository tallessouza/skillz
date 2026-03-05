# Code Examples: Caso de Uso de Academias Próximas

## Estrutura completa do Use Case

```typescript
// src/use-cases/fetch-nearby-gyms.ts
import { Gym } from '@prisma/client'
import { GymsRepository } from '@/repositories/gyms-repository'

interface FetchNearbyGymsUseCaseRequest {
  userLatitude: number
  userLongitude: number
}

interface FetchNearbyGymsUseCaseResponse {
  gyms: Gym[]
}

export class FetchNearbyGymsUseCase {
  constructor(private gymsRepository: GymsRepository) {}

  async execute({
    userLatitude,
    userLongitude,
  }: FetchNearbyGymsUseCaseRequest): Promise<FetchNearbyGymsUseCaseResponse> {
    const gyms = await this.gymsRepository.findManyNearby({
      latitude: userLatitude,
      longitude: userLongitude,
    })

    return { gyms }
  }
}
```

## Interface do repositorio com params exportados

```typescript
// src/repositories/gyms-repository.ts
import { Gym, Prisma } from '@prisma/client'

export interface FindManyNearbyParams {
  latitude: number
  longitude: number
}

export interface GymsRepository {
  findById(id: string): Promise<Gym | null>
  findManyNearby(params: FindManyNearbyParams): Promise<Gym[]>
  searchMany(query: string, page: number): Promise<Gym[]>
  create(data: Prisma.GymCreateInput): Promise<Gym>
}
```

## Implementacao In-Memory do findManyNearby

```typescript
// src/repositories/in-memory/in-memory-gyms-repository.ts
import { getDistanceBetweenCoordinates } from '@/utils/get-distance-between-coordinates'
import { FindManyNearbyParams } from '../gyms-repository'

// Dentro da classe InMemoryGymsRepository:
async findManyNearby(params: FindManyNearbyParams) {
  return this.items.filter((item) => {
    const distance = getDistanceBetweenCoordinates(
      { latitude: params.latitude, longitude: params.longitude },
      {
        latitude: item.latitude.toNumber(),
        longitude: item.longitude.toNumber(),
      },
    )

    return distance <= 10
  })
}
```

## Teste unitario completo

```typescript
// src/use-cases/fetch-nearby-gyms.spec.ts
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { FetchNearbyGymsUseCase } from './fetch-nearby-gyms'
import { describe, it, expect, beforeEach } from 'vitest'

let gymsRepository: InMemoryGymsRepository
let sut: FetchNearbyGymsUseCase

describe('Fetch Nearby Gyms Use Case', () => {
  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepository()
    sut = new FetchNearbyGymsUseCase(gymsRepository)
  })

  it('should be able to fetch nearby gyms', async () => {
    await gymsRepository.create({
      title: 'Near Gym',
      description: null,
      phone: null,
      latitude: -27.2092052,
      longitude: -49.6401091,
    })

    await gymsRepository.create({
      title: 'Far Gym',
      description: null,
      phone: null,
      latitude: -27.0610928,
      longitude: -49.5229501,
    })

    const { gyms } = await sut.execute({
      userLatitude: -27.2092052,
      userLongitude: -49.6401091,
    })

    expect(gyms).toHaveLength(1)
    expect(gyms).toEqual([expect.objectContaining({ title: 'Near Gym' })])
  })
})
```

## Padrao de debug com console.log na distancia

```typescript
// Util para verificar se o calculo esta correto durante desenvolvimento
async findManyNearby(params: FindManyNearbyParams) {
  return this.items.filter((item) => {
    const distance = getDistanceBetweenCoordinates(
      { latitude: params.latitude, longitude: params.longitude },
      {
        latitude: item.latitude.toNumber(),
        longitude: item.longitude.toNumber(),
      },
    )

    console.log(distance) // Near Gym: 0, Far Gym: ~20

    return distance <= 10
  })
}
```

## Variacao: se o raio fosse configuravel

```typescript
// Se no futuro o raio precisar ser dinamico:
const MAX_DISTANCE_IN_KILOMETERS = 10

interface FindManyNearbyParams {
  latitude: number
  longitude: number
  maxDistanceInKm?: number
}

async findManyNearby(params: FindManyNearbyParams) {
  const maxDistance = params.maxDistanceInKm ?? MAX_DISTANCE_IN_KILOMETERS

  return this.items.filter((item) => {
    const distance = getDistanceBetweenCoordinates(
      { latitude: params.latitude, longitude: params.longitude },
      {
        latitude: item.latitude.toNumber(),
        longitude: item.longitude.toNumber(),
      },
    )

    return distance <= maxDistance
  })
}
```