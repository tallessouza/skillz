# Code Examples: Pet Shop Dashboard — Conhecendo o Projeto

## Nota

Esta aula e introdutoria e nao contem exemplos de codigo diretos do instrutor. Os exemplos abaixo sao derivados da stack e arquitetura descritas, representando o ponto de partida esperado para o projeto.

## Setup inicial esperado

### Docker Compose para Postgres

```yaml
# docker-compose.yml
version: '3.8'
services:
  postgres:
    image: postgres:16
    environment:
      POSTGRES_USER: docker
      POSTGRES_PASSWORD: docker
      POSTGRES_DB: petshop
    ports:
      - '5432:5432'
    volumes:
      - pgdata:/var/lib/postgresql/data

volumes:
  pgdata:
```

### Prisma Schema conceitual

```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Appointment {
  id        String   @id @default(uuid())
  date      DateTime
  time      String
  // campos adicionais do dominio do pet shop
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  @@map("appointments")
}
```

### Estrutura de pastas App Router

```
src/
├── app/
│   ├── layout.tsx          # Layout raiz com providers
│   ├── page.tsx            # Dashboard principal (agendamentos)
│   ├── appointments/
│   │   ├── new/
│   │   │   └── page.tsx    # Criacao de agendamento
│   │   └── [id]/
│   │       └── edit/
│   │           └── page.tsx # Edicao de agendamento
│   └── globals.css         # Tailwind imports
├── components/
│   ├── ui/                 # Componentes ShadCN
│   └── appointments/       # Componentes customizados
├── lib/
│   ├── prisma.ts           # Prisma client singleton
│   └── utils.ts            # Utilitarios
└── actions/
    └── appointments.ts     # Server Actions para CRUD
```

### Classificacao de sessao por horario

```typescript
// lib/session.ts
type Session = 'morning' | 'afternoon' | 'evening'

function getSessionFromTime(time: string): Session {
  const hour = parseInt(time.split(':')[0], 10)

  if (hour < 12) return 'morning'
  if (hour < 18) return 'afternoon'
  return 'evening'
}
```

### Server Action basica (ponto de partida simples)

```typescript
// actions/appointments.ts
'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function createAppointment(formData: FormData) {
  const date = formData.get('date') as string
  const time = formData.get('time') as string

  await prisma.appointment.create({
    data: {
      date: new Date(date),
      time,
    },
  })

  revalidatePath('/')
}
```

### Componente de filtro por data

```tsx
// components/appointments/date-filter.tsx
'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Calendar } from '@/components/ui/calendar'

export function DateFilter() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const selectedDate = searchParams.get('date')
    ? new Date(searchParams.get('date')!)
    : new Date()

  function handleDateSelect(date: Date | undefined) {
    if (!date) return
    const formatted = date.toISOString().split('T')[0]
    router.push(`/?date=${formatted}`)
  }

  return (
    <Calendar
      mode="single"
      selected={selectedDate}
      onSelect={handleDateSelect}
    />
  )
}
```

### Agrupamento por sessao no dashboard

```tsx
// app/page.tsx
import { prisma } from '@/lib/prisma'
import { getSessionFromTime } from '@/lib/session'

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: { date?: string }
}) {
  const date = searchParams.date ? new Date(searchParams.date) : new Date()

  const appointments = await prisma.appointment.findMany({
    where: {
      date: {
        gte: new Date(date.setHours(0, 0, 0, 0)),
        lt: new Date(date.setHours(23, 59, 59, 999)),
      },
    },
    orderBy: { time: 'asc' },
  })

  const morning = appointments.filter(a => getSessionFromTime(a.time) === 'morning')
  const afternoon = appointments.filter(a => getSessionFromTime(a.time) === 'afternoon')
  const evening = appointments.filter(a => getSessionFromTime(a.time) === 'evening')

  return (
    <main>
      <section>
        <h2>Manha</h2>
        {/* render morning appointments */}
      </section>
      <section>
        <h2>Tarde</h2>
        {/* render afternoon appointments */}
      </section>
      <section>
        <h2>Noite</h2>
        {/* render evening appointments */}
      </section>
    </main>
  )
}
```