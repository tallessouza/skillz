---
name: rs-node-js-2023-repositorios-do-prisma
description: "Applies Prisma repository implementation patterns when creating database repositories that follow interface contracts. Use when user asks to 'implement repository', 'create prisma repository', 'implement database layer', 'connect use cases to database', or 'implement persistence'. Enforces patterns: findFirst vs findUnique selection, date range filtering, pagination with skip/take, count queries, and proper Prisma Client usage. Make sure to use this skill whenever implementing repository classes that use Prisma ORM. Not for schema design, migrations, or Prisma configuration."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: node-js-2023
  module: prisma-repository-implementation
  tags: [prisma, repository, findFirst, findUnique, pagination, count, date-range, dayjs]
---

# Repositórios do Prisma

> Implemente repositórios do Prisma seguindo interfaces de contrato já definidas, usando o Prisma Client para cada operação.

## Rules

1. **Implemente a interface, nunca invente métodos** — o repositório Prisma implementa exatamente a interface definida no contrato, porque a interface é o contrato entre caso de uso e persistência
2. **Use `findFirst` quando o campo de busca não é unique** — `findUnique` só funciona com campos marcados como `@unique` ou `@id` no schema, porque o Prisma exige isso na tipagem
3. **Use `findUnique` apenas com campos `@id` ou `@unique`** — campos como `email` com `@unique` ou `id` com `@id` permitem `findUnique`, porque o Prisma garante tipo seguro
4. **Filtre datas por range (gte/lte), não por igualdade** — bancos armazenam datetime com hora/minuto/segundo, então compare entre startOfDay e endOfDay para cobrir o dia inteiro
5. **Converta dayjs para Date nativo com `.toDate()`** — o Prisma só aceita o tipo primitivo `Date` do JavaScript, não objetos de bibliotecas como dayjs
6. **Paginação usa `skip` e `take`** — `take` é o limit (itens por página), `skip` é o offset calculado como `(page - 1) * take`

## How to write

### Repository implementando interface

```typescript
import { prisma } from '@/lib/prisma'
import { CheckIn, Prisma } from '@prisma/client'
import { CheckInsRepository } from '../check-ins-repository'

export class PrismaCheckInsRepository implements CheckInsRepository {
  async findById(id: string) {
    const checkIn = await prisma.checkIn.findUnique({ where: { id } })
    return checkIn
  }

  async create(data: Prisma.CheckInUncheckedCreateInput) {
    const checkIn = await prisma.checkIn.create({ data })
    return checkIn
  }
}
```

### Busca por campo não-unique (findFirst com date range)

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

### Paginação com skip/take

```typescript
async findManyByUserId(userId: string, page: number) {
  const checkIns = await prisma.checkIn.findMany({
    where: { userId },
    take: 20,
    skip: (page - 1) * 20,
  })

  return checkIns
}
```

### Count query

```typescript
async countByUserId(userId: string) {
  const count = await prisma.checkIn.count({
    where: { userId },
  })

  return count
}
```

### Save/Update

```typescript
async save(data: CheckIn) {
  const checkIn = await prisma.checkIn.update({
    where: { id: data.id },
    data,
  })

  return checkIn
}
```

## Example

**Before (interface sem implementação):**
```typescript
export class PrismaUsersRepository implements UsersRepository {
  async findById(id: string) {
    // não implementado
    throw new Error('Not implemented')
  }
}
```

**After (com implementação Prisma):**
```typescript
export class PrismaUsersRepository implements UsersRepository {
  async findById(id: string) {
    const user = await prisma.user.findUnique({ where: { id } })
    return user
  }
}
```

## Heuristics

| Situação | Faça |
|----------|------|
| Campo tem `@id` ou `@unique` | Use `findUnique` |
| Campo NÃO tem unique index | Use `findFirst` |
| Precisa comparar apenas a data (sem hora) | Use range gte/lte com startOfDay/endOfDay |
| Precisa de paginação | Use `take: N` e `skip: (page - 1) * N` |
| Precisa contar registros | Use `.count()` com where |
| Precisa atualizar registro existente | Use `.update()` com where por id |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `findUnique({ where: { createdAt } })` (campo não unique) | `findFirst({ where: { createdAt: { gte, lte } } })` |
| `createdAt: { equals: date }` (perde hora/min/seg) | `createdAt: { gte: startOfDay, lte: endOfDay }` |
| `prisma.checkIn.findMany({ where: { userId } })` sem paginação | Adicione `take: 20, skip: (page - 1) * 20` |
| Passar objeto dayjs direto ao Prisma | Use `.toDate()` para converter para Date nativo |
| Criar métodos que não existem na interface | Implemente apenas o contrato definido |

## Troubleshooting

### findUnique falha com "Argument where of type requires at least one unique field"
**Symptom:** TypeScript erro ao usar `findUnique` com um campo que nao e `@id` nem `@unique`
**Cause:** `findUnique` so aceita campos marcados como unique no schema Prisma — campos normais nao sao aceitos
**Fix:** Use `findFirst` em vez de `findUnique` para campos sem constraint unique. `findFirst` aceita qualquer campo no `where`

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
