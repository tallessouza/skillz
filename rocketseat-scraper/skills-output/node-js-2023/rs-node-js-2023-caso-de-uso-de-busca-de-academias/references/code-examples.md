# Code Examples: Caso de Uso de Busca de Academias

## Arquivo: search-gyms.ts (Use Case completo)

```typescript
import { Gym } from '@prisma/client'
import { GymsRepository } from '@/repositories/gyms-repository'

interface SearchGymsUseCaseRequest {
  query: string
  page: number
}

interface SearchGymsUseCaseResponse {
  gyms: Gym[]
}

export class SearchGymsUseCase {
  constructor(private gymsRepository: GymsRepository) {}

  async execute({
    query,
    page,
  }: SearchGymsUseCaseRequest): Promise<SearchGymsUseCaseResponse> {
    const gyms = await this.gymsRepository.searchMany(query, page)

    return {
      gyms,
    }
  }
}
```

## Arquivo: gyms-repository.ts (Interface atualizada)

```typescript
export interface GymsRepository {
  findById(id: string): Promise<Gym | null>
  create(data: Prisma.GymCreateInput): Promise<Gym>
  searchMany(query: string, page: number): Promise<Gym[]>
}
```

## Arquivo: in-memory-gyms-repository.ts (Implementacao do metodo)

```typescript
async searchMany(query: string, page: number) {
  return this.items
    .filter((item) => item.title.includes(query))
    .slice((page - 1) * 20, page * 20)
}
```

## Arquivo: search-gyms.spec.ts (Testes completos)

```typescript
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { SearchGymsUseCase } from './search-gyms'
import { beforeEach, describe, expect, it } from 'vitest'

let gymsRepository: InMemoryGymsRepository
let sut: SearchGymsUseCase

describe('Search Gyms Use Case', () => {
  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepository()
    sut = new SearchGymsUseCase(gymsRepository)
  })

  it('should be able to search for gyms', async () => {
    await gymsRepository.create({
      title: 'JavaScript Gym',
      description: null,
      phone: null,
      latitude: -27.2092052,
      longitude: -49.6401091,
    })

    await gymsRepository.create({
      title: 'TypeScript Gym',
      description: null,
      phone: null,
      latitude: -27.2092052,
      longitude: -49.6401091,
    })

    const { gyms } = await sut.execute({
      query: 'JavaScript',
      page: 1,
    })

    expect(gyms).toHaveLength(1)
    expect(gyms).toEqual([
      expect.objectContaining({ title: 'JavaScript Gym' }),
    ])
  })

  it('should be able to fetch paginated gym search', async () => {
    for (let i = 1; i <= 22; i++) {
      await gymsRepository.create({
        title: `JavaScript Gym ${i}`,
        description: null,
        phone: null,
        latitude: -27.2092052,
        longitude: -49.6401091,
      })
    }

    const { gyms } = await sut.execute({
      query: 'JavaScript',
      page: 2,
    })

    expect(gyms).toHaveLength(2)
    expect(gyms).toEqual([
      expect.objectContaining({ title: 'JavaScript Gym 21' }),
      expect.objectContaining({ title: 'JavaScript Gym 22' }),
    ])
  })
})
```

## Variacao: Busca em multiplos campos (evolucao futura)

Quando o repositorio evoluir para buscar em titulo E descricao, apenas a implementacao muda:

```typescript
// No repositorio in-memory
async searchMany(query: string, page: number) {
  return this.items
    .filter((item) =>
      item.title.includes(query) ||
      (item.description && item.description.includes(query))
    )
    .slice((page - 1) * 20, page * 20)
}
```

O use case e os testes existentes continuam funcionando sem alteracao — essa e a vantagem de usar `query` generico e `searchMany` sem sufixo de campo.

## Variacao: Implementacao Prisma (producao)

```typescript
// No repositorio Prisma
async searchMany(query: string, page: number) {
  const gyms = await prisma.gym.findMany({
    where: {
      title: {
        contains: query,
      },
    },
    take: 20,
    skip: (page - 1) * 20,
  })

  return gyms
}
```