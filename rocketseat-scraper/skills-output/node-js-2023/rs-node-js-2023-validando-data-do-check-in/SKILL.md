---
name: rs-node-js-2023-validando-data-do-check-in
description: "Applies date validation patterns using Day.js startOf/endOf in Node.js use cases and in-memory repositories. Use when user asks to 'validate dates', 'check same day', 'compare dates ignoring time', 'implement check-in', or 'date range validation'. Enforces startOfDay/endOfDay boundary pattern, Prisma Decimal handling, and multi-dependency use case injection. Make sure to use this skill whenever implementing date comparisons that ignore time components in Node.js. Not for frontend date pickers, date formatting for display, or timezone conversion logic."
---

# Validando Datas com Day.js em Use Cases Node.js

> Ao comparar datas ignorando horario, use o intervalo startOf('date') ate endOf('date') ao inves de comparacoes diretas.

## Rules

1. **Use `date` nao `day` no Day.js** — `dayjs().startOf('date')` retorna inicio do dia, `dayjs().startOf('day')` retorna dia da semana, porque no JavaScript `getDate()` = dia do mes, `getDay()` = dia da semana
2. **Valide datas por intervalo, nao por igualdade** — compare se a data esta entre startOfDay e endOfDay, porque comparacao direta falha quando hora/minuto/segundo diferem
3. **Use Prisma Decimal para latitude/longitude** — `new Decimal(0)` nao `0`, porque Prisma rejeita numeros primitivos em campos decimais
4. **Injete multiplas dependencias no use case** — quando o use case depende de mais de um repositorio, receba todos via construtor, porque SOLID exige inversao de dependencia
5. **Crie fixtures no beforeEach** — dados compartilhados entre testes (ex: academia) vao no beforeEach, porque evita duplicacao e garante estado limpo
6. **In-memory repos nao precisam de performance** — sao para testes, entao clareza > otimizacao

## How to write

### Validacao de mesma data (ignorando horario)

```typescript
import dayjs from 'dayjs'

const startOfTheDay = dayjs(date).startOf('date').toDate()
const endOfTheDay = dayjs(date).endOf('date').toDate()

const checkInDate = dayjs(checkin.createdAt)
const isOnSameDate = checkInDate.isAfter(startOfTheDay)
  && checkInDate.isBefore(endOfTheDay)
```

### Use case com multiplas dependencias

```typescript
export class CheckInUseCase {
  constructor(
    private checkInsRepository: CheckInsRepository,
    private gymsRepository: GymsRepository,
  ) {}

  async execute({ userId, gymId, userLatitude, userLongitude }: CheckInRequest) {
    const gym = await this.gymsRepository.findById(gymId)
    if (!gym) throw new ResourceNotFoundError()

    // validacao de distancia...
    // validacao de data duplicada...
  }
}
```

### Prisma Decimal em testes

```typescript
import { Decimal } from '@prisma/client'

gymsRepository.items.push({
  id: 'gym-01',
  title: 'JavaScript Gym',
  description: '',
  phone: '',
  latitude: new Decimal(-27.2092052),
  longitude: new Decimal(-49.6401091),
})
```

## Example

**Before (comparacao direta que falha):**
```typescript
// FALHA: datas com horarios diferentes nunca sao iguais
const existing = checkIns.find(c =>
  c.userId === userId && c.createdAt === date
)
```

**After (intervalo startOf/endOf):**
```typescript
const startOfTheDay = dayjs(date).startOf('date').toDate()
const endOfTheDay = dayjs(date).endOf('date').toDate()

const existing = checkIns.find(c => {
  const checkInDate = dayjs(c.createdAt)
  const isOnSameDate = checkInDate.isAfter(startOfTheDay)
    && checkInDate.isBefore(endOfTheDay)
  return c.userId === userId && isOnSameDate
})
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Comparar se duas datas sao do mesmo dia | Use startOf('date') e endOf('date') como intervalo |
| Use case precisa de dados de outra entidade | Injete o repositorio da entidade como dependencia |
| Campo decimal do Prisma no teste | Use `new Decimal(valor)` de `@prisma/client` |
| Dado reutilizado em varios testes | Crie no `beforeEach` |
| Latitude/longitude em testes nao relacionados a distancia | Passe zero como `new Decimal(0)` |

## Anti-patterns

| Nunca escreva | Escreva ao inves |
|---------------|------------------|
| `dayjs(date).startOf('day')` | `dayjs(date).startOf('date')` |
| `createdAt === date` (comparacao direta) | Intervalo com isAfter/isBefore |
| `latitude: 0` (primitivo no Prisma) | `latitude: new Decimal(0)` |
| `import { Decimal } from '@prisma/client/runtime'` | `import { Decimal } from '@prisma/client'` |
| Buscar academia dentro do repositorio de check-ins | Injetar gymsRepository separado no use case |
| Duplicar criacao de academia em cada teste | Mover para beforeEach |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
