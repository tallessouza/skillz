# Code Examples: Organizacao de Codigo e Estilos Condicionais

## Exemplo 1: Extracao de funcoes para utils/

### Antes — tudo em page.tsx

```typescript
// app/page.tsx
import { Appointment } from "@/types"

function getPeriod(hour: number): string {
  if (hour < 12) return "morning"
  if (hour < 18) return "afternoon"
  return "evening"
}

function groupAppointmentsByPeriod(appointments: Appointment[]) {
  return appointments.reduce((groups, appointment) => {
    const period = getPeriod(new Date(appointment.dateTime).getHours())
    if (!groups[period]) groups[period] = []
    groups[period].push(appointment)
    return groups
  }, {} as Record<string, Appointment[]>)
}

const mockAppointments: Appointment[] = [
  // ... dados inline
]

export default function Page() {
  const grouped = groupAppointmentsByPeriod(mockAppointments)
  // ...
}
```

### Depois — separado em utils/

```typescript
// utils/appointment-utils.ts
import { Appointment } from "@/types"

export function getPeriod(hour: number): string {
  if (hour < 12) return "morning"
  if (hour < 18) return "afternoon"
  return "evening"
}

export function groupAppointmentsByPeriod(appointments: Appointment[]) {
  return appointments.reduce((groups, appointment) => {
    const period = getPeriod(new Date(appointment.dateTime).getHours())
    if (!groups[period]) groups[period] = []
    groups[period].push(appointment)
    return groups
  }, {} as Record<string, Appointment[]>)
}
```

```typescript
// utils/mock-data.ts
import { Appointment } from "@/types"

export const MOCK_APPOINTMENTS: Appointment[] = [
  // ... dados mock
]
```

```typescript
// utils/index.ts
export * from "./appointment-utils"
export * from "./mock-data"
```

```typescript
// app/page.tsx (limpo)
import { groupAppointmentsByPeriod, MOCK_APPOINTMENTS } from "@/utils"

export default function Page() {
  const grouped = groupAppointmentsByPeriod(MOCK_APPOINTMENTS)
  // ...
}
```

## Exemplo 2: Appointment Card com estilos condicionais

```typescript
// components/appointment-card.tsx
import { cn } from "@/lib/utils"

interface AppointmentCardProps {
  id: string
  petName: string
  ownerName: string
  service: string
  time: string
  isFirstInSection?: boolean
}

export function AppointmentCard({
  id,
  petName,
  ownerName,
  service,
  time,
  isFirstInSection = false,
}: AppointmentCardProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-2 md:grid-cols-[15%_35%_30%_20%] items-center py-3",
        !isFirstInSection && "border-t border-[#353339]"
      )}
    >
      <span>{time}</span>
      <span>{petName}</span>
      <span>{service}</span>
      <span>{ownerName}</span>
    </div>
  )
}
```

## Exemplo 3: Usando isFirstInSection no map

```typescript
// components/period-section.tsx
import { AppointmentCard } from "./appointment-card"
import { Appointment } from "@/types"

interface PeriodSectionProps {
  title: string
  appointments: Appointment[]
}

export function PeriodSection({ title, appointments }: PeriodSectionProps) {
  return (
    <section>
      <h2>{title}</h2>
      {appointments.map((appointment, index) => (
        <AppointmentCard
          key={appointment.id}
          isFirstInSection={index === 0}
          petName={appointment.petName}
          ownerName={appointment.ownerName}
          service={appointment.service}
          time={appointment.time}
        />
      ))}
    </section>
  )
}
```

## Exemplo 4: Estrutura de pastas lib/ vs utils/

```
src/
├── lib/
│   ├── utils.ts          # cn() + twinmerge (shadcn default)
│   └── prisma.ts         # Prisma client (futuro)
│
├── utils/
│   ├── appointment-utils.ts  # getPeriod, groupAppointmentsByPeriod
│   ├── mock-data.ts          # MOCK_APPOINTMENTS
│   └── index.ts              # barrel exports
│
└── app/
    └── page.tsx              # importa de @/utils
```

## Exemplo 5: Funcao cn() em acao — variantes

```typescript
// Condicional simples (boolean)
className={cn("base-classes", condition && "conditional-classes")}

// Condicional com else
className={cn("base", isActive ? "bg-green-500" : "bg-gray-500")}

// Multiplas condicionais
className={cn(
  "grid items-center py-3",
  !isFirstInSection && "border-t border-[#353339]",
  isSelected && "bg-purple-900/20",
  isDisabled && "opacity-50 pointer-events-none"
)}
```