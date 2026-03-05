# Code Examples: Ajustes Visuais

## Appointment Card — Layout Grid Responsivo

### Estrutura completa do card com ajustes

```tsx
// components/AppointmentCard.tsx
export function AppointmentCard({ appointment }: AppointmentCardProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      {/* Descricao com padding responsivo */}
      <div className="pr-4 md:pr-0">
        <p className="text-sm">{appointment.description}</p>
      </div>

      {/* Elemento com col-span responsivo */}
      <div className="mt-1 md:mt-0 col-span-2 md:col-span-1">
        <p className="text-sm">{appointment.service}</p>
      </div>

      {/* Espaco para botoes futuros (edicao/remocao) */}
      <div className="col-span-1">
        {/* Sera implementado posteriormente */}
      </div>
    </div>
  )
}
```

### Antes do ajuste (layout quebrado)

```tsx
// O card estava com elementos desorganizados
<div className="m-4">  {/* margin nos 4 lados */}
  <div className="text-left">
    <p className="text-sm">{appointment.time}</p>
    <p className="text-sm">{appointment.patient}</p>
    <p className="text-sm">{appointment.description}</p>
  </div>
</div>
```

### Depois do ajuste

```tsx
// Margin direcional, sem info desnecessaria
<div className="mb-8">
  <div className="col-span-2 md:col-span-1 text-left">
    <p className="text-sm">{appointment.description}</p>
  </div>
</div>
```

## Pagina principal — Espacamento consistente

### Antes (margin generico)

```tsx
// app/page.tsx
export default function Home() {
  return (
    <main>
      <section className="m-8">  {/* Aplica em todos os lados */}
        <h2>Today's Appointments</h2>
      </section>
      <section>
        {appointments.map(apt => (
          <AppointmentCard key={apt.id} appointment={apt} />
        ))}
      </section>
    </main>
  )
}
```

### Depois (margin bottom consistente)

```tsx
// app/page.tsx
export default function Home() {
  return (
    <main>
      <section className="mb-8">  {/* Apenas embaixo */}
        <h2>Today's Appointments</h2>
      </section>
      <section className="mb-8">
        {appointments.map(apt => (
          <AppointmentCard key={apt.id} appointment={apt} />
        ))}
      </section>
    </main>
  )
}
```

## Prisma Client — Setup Singleton

### lib/prisma.ts

```typescript
import { PrismaClient } from '@prisma/client'

export const prisma = new PrismaClient()
```

### Uso em Server Component (Next.js App Router)

```typescript
// app/page.tsx
import { prisma } from '@/lib/prisma'

export default async function Home() {
  // Funcao deve ser async para usar await
  const appointments = await prisma.appointment.findMany()

  // Console log aparece no terminal do servidor (Server Component)
  console.log(appointments) // [] quando nao ha dados

  return (
    <main>
      {appointments.map(apt => (
        <AppointmentCard key={apt.id} appointment={apt} />
      ))}
    </main>
  )
}
```

### Nota sobre ambiente

```bash
# Se usando OrbStack/Docker para banco de dados,
# certifique-se que o container esta rodando antes de conectar
orb start  # ou abrir o OrbStack

# Verificar se o banco esta acessivel
npx prisma db push  # sincroniza schema
npx prisma studio   # interface visual para verificar dados
```

## Padrao: Consultar Figma para espacamento

```
Figma mostra: 32px de distancia entre secoes
Tailwind equivalente: mb-8 (8 * 4px = 32px)

Figma mostra: 16px de padding interno
Tailwind equivalente: p-4 (4 * 4px = 16px)

Figma mostra: 24px de gap entre cards
Tailwind equivalente: gap-6 (6 * 4px = 24px)
```

Sempre converter o valor do Figma dividindo por 4 para obter a classe Tailwind correta.