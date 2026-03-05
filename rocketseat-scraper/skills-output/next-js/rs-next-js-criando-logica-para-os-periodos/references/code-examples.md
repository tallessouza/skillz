# Code Examples: Logica de Agrupamento por Periodos

## Arquivo de tipos completo

```typescript
// src/types/appointment.ts

export type AppointmentPeriod = 'morning' | 'afternoon' | 'evening'

export type Appointment = {
  id: string
  time: string
  patientName: string
  tutorName: string
  phone: string
  description: string
  scheduleAt: Date
  service: string
  period: AppointmentPeriod
}

export type AppointmentPeriodDay = {
  title: string
  type: AppointmentPeriod
  timeRange: string
  appointments: Appointment[]
}
```

## Funcao getPeriod

```typescript
function getPeriod(hour: number): AppointmentPeriod {
  if (hour >= 9 && hour < 12) return 'morning'
  if (hour >= 13 && hour < 18) return 'afternoon'
  return 'evening'
}
```

## Funcao groupAppointmentsByPeriod completa

```typescript
import { Appointment as AppointmentPrisma } from '@prisma/client'
import { Appointment, AppointmentPeriod, AppointmentPeriodDay } from '@/types/appointment'

function getPeriod(hour: number): AppointmentPeriod {
  if (hour >= 9 && hour < 12) return 'morning'
  if (hour >= 13 && hour < 18) return 'afternoon'
  return 'evening'
}

function groupAppointmentsByPeriod(
  appointments: AppointmentPrisma[]
): AppointmentPeriodDay[] {
  const transformedAppointments: Appointment[] = appointments.map((apt) => ({
    ...apt,
    time: apt.schedule.scheduleAt.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    }),
    service: apt.description,
    period: getPeriod(apt.schedule.scheduleAt.getHours()),
  }))

  const morningAppointments = transformedAppointments.filter(
    (apt) => apt.period === 'morning'
  )
  const afternoonAppointments = transformedAppointments.filter(
    (apt) => apt.period === 'afternoon'
  )
  const eveningAppointments = transformedAppointments.filter(
    (apt) => apt.period === 'evening'
  )

  return [
    {
      title: 'Manhã',
      type: 'morning',
      timeRange: '09:00 - 12:00',
      appointments: morningAppointments,
    },
    {
      title: 'Tarde',
      type: 'afternoon',
      timeRange: '13:00 - 18:00',
      appointments: afternoonAppointments,
    },
    {
      title: 'Noite',
      type: 'evening',
      timeRange: '19:00 - 21:00',
      appointments: eveningAppointments,
    },
  ]
}
```

## Uso no componente (page)

```typescript
// Na page ou server component
const appointments = await prisma.appointment.findMany({
  include: { schedule: true },
})

const periods = groupAppointmentsByPeriod(appointments)
```

## Componente PeriodSection recebendo os dados

```tsx
// Tipagem da prop usando o union type
interface PeriodSectionProps {
  type: AppointmentPeriod
  title: string
  timeRange: string
  appointments: Appointment[]
}

function PeriodSection({ type, title, timeRange, appointments }: PeriodSectionProps) {
  return (
    <section>
      <div className="flex items-center gap-2">
        <h2>{title}</h2>
        <span className="text-label-large-size text-content-secondary">
          {timeRange}
        </span>
      </div>
      {/* Renderizar appointments */}
    </section>
  )
}
```

## Renderizacao com map sobre periodos

```tsx
<div className="p-6 mb-2 md:p-0">
  {periods.map((period, index) => (
    <PeriodSection
      key={index}
      type={period.type}
      title={period.title}
      timeRange={period.timeRange}
      appointments={period.appointments}
    />
  ))}
</div>
```

## Variacao: getPeriod com configuracao flexivel

```typescript
// Se as faixas de horario precisarem ser configuraveis
type PeriodConfig = {
  period: AppointmentPeriod
  startHour: number
  endHour: number
}

const PERIOD_CONFIGS: PeriodConfig[] = [
  { period: 'morning', startHour: 9, endHour: 12 },
  { period: 'afternoon', startHour: 13, endHour: 18 },
  { period: 'evening', startHour: 19, endHour: 21 },
]

function getPeriod(hour: number): AppointmentPeriod {
  const config = PERIOD_CONFIGS.find(
    (c) => hour >= c.startHour && hour < c.endHour
  )
  return config?.period ?? 'evening'
}
```