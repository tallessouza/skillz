# Code Examples: Repositórios do Prisma

## Exemplo completo: PrismaUsersRepository

```typescript
import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'
import { UsersRepository } from '../users-repository'

export class PrismaUsersRepository implements UsersRepository {
  async findById(id: string) {
    const user = await prisma.user.findUnique({
      where: { id },
    })

    return user
  }

  async findByEmail(email: string) {
    const user = await prisma.user.findUnique({
      where: { email },
    })

    return user
  }

  async create(data: Prisma.UserCreateInput) {
    const user = await prisma.user.create({
      data,
    })

    return user
  }
}
```

Nota: `findById` é essencialmente idêntico ao `findByEmail`, trocando apenas o campo no `where`. Ambos usam `findUnique` porque `id` tem `@id` e `email` tem `@unique`.

## Exemplo completo: PrismaCheckInsRepository

```typescript
import dayjs from 'dayjs'
import { prisma } from '@/lib/prisma'
import { CheckIn, Prisma } from '@prisma/client'
import { CheckInsRepository } from '../check-ins-repository'

export class PrismaCheckInsRepository implements CheckInsRepository {
  async findById(id: string) {
    const checkIn = await prisma.checkIn.findUnique({
      where: { id },
    })

    return checkIn
  }

  async findByUserIdOnDate(userId: string, date: Date) {
    const startOfDay = dayjs(date).startOf('date')
    const endOfDay = dayjs(date).endOf('date')

    const checkIn = await prisma.checkIn.findFirst({
      where: {
        userId,
        createdAt: {
          gte: startOfDay.toDate(),
          lte: endOfDay.toDate(),
        },
      },
    })

    return checkIn
  }

  async findManyByUserId(userId: string, page: number) {
    const checkIns = await prisma.checkIn.findMany({
      where: { userId },
      take: 20,
      skip: (page - 1) * 20,
    })

    return checkIns
  }

  async countByUserId(userId: string) {
    const count = await prisma.checkIn.count({
      where: { userId },
    })

    return count
  }

  async create(data: Prisma.CheckInUncheckedCreateInput) {
    const checkIn = await prisma.checkIn.create({
      data,
    })

    return checkIn
  }

  async save(data: CheckIn) {
    const checkIn = await prisma.checkIn.update({
      where: { id: data.id },
      data,
    })

    return checkIn
  }
}
```

## Workflow: Implementando um repositório Prisma do zero

### Passo 1: Crie o arquivo e exporte a classe implementando a interface

```typescript
import { prisma } from '@/lib/prisma'
import { CheckInsRepository } from '../check-ins-repository'

export class PrismaCheckInsRepository implements CheckInsRepository {
  // ...
}
```

### Passo 2: Use "implement interface" da IDE

No VS Code, clique na lâmpada (ou Ctrl+.) sobre o nome da interface e selecione "Implement interface". Isso gera todos os métodos com `throw new Error('Not implemented')`.

### Passo 3: Converta os métodos para async

Selecione todos os `Promise<...>` retornados, remova o retorno placeholder, e adicione `async` antes de cada método.

### Passo 4: Implemente cada método usando prisma client

Comece pelos mais simples (findById, create, count) e deixe os mais complexos (findByUserIdOnDate) por último.

## Comparação: InMemory vs Prisma

### findByUserIdOnDate — InMemory

```typescript
async findByUserIdOnDate(userId: string, date: Date) {
  const startOfDay = dayjs(date).startOf('date')
  const endOfDay = dayjs(date).endOf('date')

  const checkOnSameDate = this.items.find((checkIn) => {
    const checkInDate = dayjs(checkIn.created_at)
    const isOnSameDate =
      checkInDate.isAfter(startOfDay) && checkInDate.isBefore(endOfDay)

    return checkIn.user_id === userId && isOnSameDate
  })

  if (!checkOnSameDate) {
    return null
  }

  return checkOnSameDate
}
```

### findByUserIdOnDate — Prisma

```typescript
async findByUserIdOnDate(userId: string, date: Date) {
  const startOfDay = dayjs(date).startOf('date')
  const endOfDay = dayjs(date).endOf('date')

  const checkIn = await prisma.checkIn.findFirst({
    where: {
      userId,
      createdAt: {
        gte: startOfDay.toDate(),
        lte: endOfDay.toDate(),
      },
    },
  })

  return checkIn
}
```

Mesma lógica, traduzida de array manipulation para query Prisma. A lógica de startOfDay/endOfDay é reutilizada exatamente igual.