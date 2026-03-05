# Code Examples: Repositorio de Academias com Prisma

## Exemplo completo do PrismaGymsRepository

```typescript
import { Gym, Prisma } from '@prisma/client'
import { FindManyNearbyParams, GymsRepository } from '../gyms-repository'
import { prisma } from '@/lib/prisma'

export class PrismaGymsRepository implements GymsRepository {
  async findById(id: string) {
    const gym = await prisma.gym.findUnique({
      where: { id },
    })

    return gym
  }

  async create(data: Prisma.GymCreateInput) {
    const gym = await prisma.gym.create({
      data,
    })

    return gym
  }

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

  async findManyNearby({ latitude, longitude }: FindManyNearbyParams) {
    const gyms = await prisma.$queryRaw<Gym[]>`
      SELECT * from gyms
      WHERE ( 6371 * acos( cos( radians(${latitude}) ) * cos( radians( latitude ) ) * cos( radians( longitude ) - radians(${longitude}) ) + sin( radians(${latitude}) ) * sin( radians( latitude ) ) ) ) <= 10
    `

    return gyms
  }
}
```

## Comparacao: In-Memory vs Prisma

### In-Memory (testes unitarios)
```typescript
async findManyNearby(params: FindManyNearbyParams) {
  return this.items.filter((item) => {
    const distance = getDistanceBetweenCoordinates(
      { latitude: params.latitude, longitude: params.longitude },
      {
        latitude: item.latitude.toNumber(),
        longitude: item.longitude.toNumber(),
      },
    )

    return distance < 10
  })
}
```

### Prisma (producao)
```typescript
async findManyNearby({ latitude, longitude }: FindManyNearbyParams) {
  const gyms = await prisma.$queryRaw<Gym[]>`
    SELECT * from gyms
    WHERE ( 6371 * acos(
      cos( radians(${latitude}) ) * cos( radians( latitude ) ) *
      cos( radians( longitude ) - radians(${longitude}) ) +
      sin( radians(${latitude}) ) * sin( radians( latitude ) )
    ) ) <= 10
  `
  return gyms
}
```

**Ponto chave:** mesma interface (`GymsRepository`), implementacoes completamente diferentes. O contrato garante que ambos se comportam igual.

## Opcoes do where no Prisma (busca textual)

```typescript
// Igualdade exata — raramente o que voce quer
where: { title: query }

// Contem a string (case-sensitive por padrao)
where: { title: { contains: query } }

// Comeca com
where: { title: { startsWith: query } }

// Termina com
where: { title: { endsWith: query } }

// Case-insensitive (adicione mode)
where: { title: { contains: query, mode: 'insensitive' } }
```

## Formula de Haversine — explicacao da query

```sql
SELECT * from gyms
WHERE (
  6371 * acos(                          -- 6371 = raio da Terra em km
    cos( radians(${latitude}) )         -- latitude do usuario em radianos
    * cos( radians( latitude ) )        -- latitude da academia em radianos
    * cos(
        radians( longitude )            -- longitude da academia
        - radians(${longitude})         -- menos longitude do usuario
      )
    + sin( radians(${latitude}) )       -- seno da lat do usuario
    * sin( radians( latitude ) )        -- seno da lat da academia
  )
) <= 10                                 -- distancia maxima em km
```

- `${latitude}` e `${longitude}` = parametros interpolados pelo Prisma (seguros contra SQL injection)
- `latitude` e `longitude` sem `${}` = colunas da tabela gyms
- Resultado: distancia em km entre o ponto do usuario e cada academia
- `<= 10`: filtra apenas academias dentro de 10km