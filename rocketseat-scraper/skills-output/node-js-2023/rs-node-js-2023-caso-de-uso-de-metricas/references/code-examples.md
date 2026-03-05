# Code Examples: Caso de Uso de Metricas

## Interface do CheckInsRepository (adicao do metodo)

```typescript
export interface CheckInsRepository {
  findById(id: string): Promise<CheckIn | null>
  findByUserIdOnDate(userId: string, date: Date): Promise<CheckIn | null>
  findManyByUserId(userId: string, page: number): Promise<CheckIn[]>
  countByUserId(userId: string): Promise<number>
  create(data: Prisma.CheckInUncheckedCreateInput): Promise<CheckIn>
  save(checkIn: CheckIn): Promise<CheckIn>
}
```

## InMemoryCheckInsRepository — implementacao do count

```typescript
async countByUserId(userId: string): Promise<number> {
  return this.items.filter((checkIn) => checkIn.user_id === userId).length
}
```

Nota: sem paginacao, sem slice. Apenas filter + length.

## GetUserMetricsUseCase completo

```typescript
import { CheckInsRepository } from '@/repositories/check-ins-repository'

interface GetUserMetricsUseCaseRequest {
  userId: string
}

interface GetUserMetricsUseCaseResponse {
  checkInsCount: number
}

export class GetUserMetricsUseCase {
  constructor(private checkInsRepository: CheckInsRepository) {}

  async execute({
    userId,
  }: GetUserMetricsUseCaseRequest): Promise<GetUserMetricsUseCaseResponse> {
    const checkInsCount = await this.checkInsRepository.countByUserId(userId)

    return {
      checkInsCount,
    }
  }
}
```

## Teste unitario completo

```typescript
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { GetUserMetricsUseCase } from './get-user-metrics'
import { describe, it, expect, beforeEach } from 'vitest'

let checkInsRepository: InMemoryCheckInsRepository
let sut: GetUserMetricsUseCase

describe('Get User Metrics Use Case', () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository()
    sut = new GetUserMetricsUseCase(checkInsRepository)
  })

  it('should be able to get check-ins count from metrics', async () => {
    await checkInsRepository.create({
      gym_id: 'gym-01',
      user_id: 'user-01',
    })

    await checkInsRepository.create({
      gym_id: 'gym-02',
      user_id: 'user-01',
    })

    const { checkInsCount } = await sut.execute({
      userId: 'user-01',
    })

    expect(checkInsCount).toEqual(2)
  })
})
```

## Comparacao: History vs Metrics

### FetchUserCheckInsHistory (lista paginada)
```typescript
interface Request {
  userId: string
  page: number          // tem paginacao
}

interface Response {
  checkIns: CheckIn[]   // retorna array
}

// No repositorio:
findManyByUserId(userId: string, page: number): Promise<CheckIn[]>
```

### GetUserMetrics (contagem simples)
```typescript
interface Request {
  userId: string        // sem paginacao
}

interface Response {
  checkInsCount: number // retorna numero
}

// No repositorio:
countByUserId(userId: string): Promise<number>
```

## Evolucao futura — multiplas metricas

```typescript
// Quando novas metricas forem necessarias, o objeto de retorno cresce:
interface GetUserMetricsUseCaseResponse {
  checkInsCount: number
  checkInsThisWeek: number    // futuro
  checkInsThisMonth: number   // futuro
  currentStreak: number       // futuro
}
```