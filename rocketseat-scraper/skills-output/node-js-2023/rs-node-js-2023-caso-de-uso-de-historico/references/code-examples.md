# Code Examples: Caso de Uso de Historico com Paginacao

## 1. Interface do repositorio — adicionando findManyByUserId

```typescript
// src/repositories/check-ins-repository.ts
import { CheckIn, Prisma } from '@prisma/client'

export interface CheckInsRepository {
  create(data: Prisma.CheckInUncheckedCreateInput): Promise<CheckIn>
  findByUserIdOnDate(userId: string, date: Date): Promise<CheckIn | null>
  findManyByUserId(userId: string, page: number): Promise<CheckIn[]>
}
```

Note a convencao: `findBy` retorna `CheckIn | null` (unico), `findMany` retorna `CheckIn[]` (lista).

## 2. Implementacao in-memory do repositorio

```typescript
// src/repositories/in-memory/in-memory-check-ins-repository.ts
async findManyByUserId(userId: string, page: number) {
  return this.items
    .filter((item) => item.user_id === userId)
    .slice((page - 1) * 20, page * 20)
}
```

O `filter` seleciona todos os check-ins do usuario. O `slice` aplica a paginacao.

## 3. Use Case completo

```typescript
// src/use-cases/fetch-user-check-ins-history.ts
import { CheckIn } from '@prisma/client'
import { CheckInsRepository } from '@/repositories/check-ins-repository'

interface FetchUserCheckInsHistoryUseCaseRequest {
  userId: string
  page: number
}

interface FetchUserCheckInsHistoryUseCaseResponse {
  checkIns: CheckIn[]
}

export class FetchUserCheckInsHistoryUseCase {
  constructor(private checkInsRepository: CheckInsRepository) {}

  async execute({
    userId,
    page,
  }: FetchUserCheckInsHistoryUseCaseRequest): Promise<FetchUserCheckInsHistoryUseCaseResponse> {
    const checkIns = await this.checkInsRepository.findManyByUserId(userId, page)

    return { checkIns }
  }
}
```

Sem validacao adicional — o use case e direto. A responsabilidade de filtrar e paginar e do repositorio.

## 4. Teste completo

```typescript
// src/use-cases/fetch-user-check-ins-history.spec.ts
import { describe, it, expect, beforeEach } from 'vitest'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { FetchUserCheckInsHistoryUseCase } from './fetch-user-check-ins-history'

let checkInsRepository: InMemoryCheckInsRepository
let sut: FetchUserCheckInsHistoryUseCase

describe('Fetch User Check-in History Use Case', () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository()
    sut = new FetchUserCheckInsHistoryUseCase(checkInsRepository)
  })

  it('should be able to fetch check-in history', async () => {
    await checkInsRepository.create({
      gym_id: 'gym-01',
      user_id: 'user-01',
    })

    await checkInsRepository.create({
      gym_id: 'gym-02',
      user_id: 'user-01',
    })

    const { checkIns } = await sut.execute({
      userId: 'user-01',
      page: 1,
    })

    expect(checkIns).toHaveLength(2)
    expect(checkIns).toEqual([
      expect.objectContaining({ gym_id: 'gym-01' }),
      expect.objectContaining({ gym_id: 'gym-02' }),
    ])
  })

  it('should be able to fetch paginated check-in history', async () => {
    for (let i = 1; i <= 22; i++) {
      await checkInsRepository.create({
        gym_id: `gym-${i}`,
        user_id: 'user-01',
      })
    }

    const { checkIns } = await sut.execute({
      userId: 'user-01',
      page: 2,
    })

    expect(checkIns).toHaveLength(2)
    expect(checkIns).toEqual([
      expect.objectContaining({ gym_id: 'gym-21' }),
      expect.objectContaining({ gym_id: 'gym-22' }),
    ])
  })
})
```

## 5. Matematica do slice — tabela de referencia

```
Pagina 1: slice((1-1)*20, 1*20) = slice(0, 20)   → itens 1-20
Pagina 2: slice((2-1)*20, 2*20) = slice(20, 40)   → itens 21-40
Pagina 3: slice((3-1)*20, 3*20) = slice(40, 60)   → itens 41-60
```

Formula generica para qualquer `perPage`:
```typescript
.slice((page - 1) * perPage, page * perPage)
```