# Code Examples: Busca Dinamica com searchParams

## Exemplo completo da aula (page.tsx)

```typescript
import { parseISO, startOfDay, endOfDay } from 'date-fns'
import { prisma } from '@/lib/prisma'

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>
}) {
  const { date } = await searchParams

  const selectedDate = date ? parseISO(date) : new Date()

  const appointments = await prisma.appointment.findMany({
    where: {
      scheduledAt: {
        gte: startOfDay(selectedDate),
        lte: endOfDay(selectedDate),
      },
    },
    orderBy: {
      scheduledAt: 'asc',
    },
  })

  return (
    <main>
      {/* Componente de DatePicker sera criado na proxima aula */}
      <AppointmentList appointments={appointments} />
    </main>
  )
}
```

## Tipagem de searchParams com multiplos parametros

```typescript
// Se precisar de mais filtros alem de date:
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{
    date?: string
    status?: string
    pet?: string
  }>
}) {
  const { date, status, pet } = await searchParams
  // ...
}
```

## Tipagem de params (slug de rota) — mesmo padrao

```typescript
// /app/[slug]/page.tsx
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  // ...
}
```

## Prisma: filtro por range de datas

```typescript
// Filtrar um mes inteiro (exemplo da documentacao Prisma)
const appointments = await prisma.appointment.findMany({
  where: {
    scheduledAt: {
      gte: new Date('2025-08-01'),
      lte: new Date('2025-08-31'),
    },
  },
})

// Filtrar um dia especifico (padrao da aula)
const appointments = await prisma.appointment.findMany({
  where: {
    scheduledAt: {
      gte: startOfDay(selectedDate),
      lte: endOfDay(selectedDate),
    },
  },
})
```

## Testando via URL

```bash
# Sem filtro — mostra agendamentos de hoje
http://localhost:3000

# Com filtro de data especifica
http://localhost:3000?date=2025-09-08

# O valor chega como string no searchParams
# { date: "2025-09-08" }
```

## Debug com console.log (Server Component)

```typescript
// Console aparece no terminal do servidor, nao no browser
const { date } = await searchParams
console.log(date)
// Sem searchParams: undefined
// Com ?date=2025-09-08: "2025-09-08"

const appointments = await prisma.appointment.findMany({ ... })
console.log(appointments)
// Mostra os registros filtrados no terminal
```