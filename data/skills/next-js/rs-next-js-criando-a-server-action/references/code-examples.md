# Code Examples: Criando Server Actions no Next.js

## 1. Arquivo actions.ts completo

```typescript
// app/actions.ts
"use server"

import { z } from "zod"
import { prisma } from "@/lib/prisma"

const appointmentSchema = z.object({
  tutorName: z.string(),
  petName: z.string(),
  phone: z.string(),
  description: z.string(),
  scheduledAt: z.date(),
})

type AppointmentData = z.infer<typeof appointmentSchema>

export async function createAppointment(data: AppointmentData) {
  try {
    const parsedData = appointmentSchema.parse(data)

    const { scheduledAt } = parsedData
    const hour = scheduledAt.getHours()

    const isMorning = hour >= 9 && hour < 12
    const isAfternoon = hour >= 13 && hour < 18
    const isEvening = hour >= 19 && hour < 21

    if (!isMorning && !isAfternoon && !isEvening) {
      throw new Error(
        "Agendamentos so podem ser feitos entre 9-12, 13-18 ou 19-21"
      )
    }

    const existingAppointment = await prisma.appointments.findFirst({
      where: { scheduledAt },
    })

    if (existingAppointment) {
      throw new Error("Este horario ja esta reservado")
    }

    await prisma.appointments.create({ data: parsedData })
  } catch (error) {
    console.error(error)
  }
}
```

## 2. Chamando a server action no formulario

```typescript
// Dentro do appointment-form.tsx (client component)
import { createAppointment } from "./actions"

// No handler do formulario:
async function onSubmit(data: FormData) {
  await createAppointment({
    ...data,
    scheduledAt: selectedDate, // Date object combinado com horario selecionado
  })
}
```

## 3. Buscando dados na page (server component)

```typescript
// app/page.tsx (server component)
import { prisma } from "@/lib/prisma"

export default async function Home() {
  const appointments = await prisma.appointments.findMany()

  return (
    <>
      {/* Passa appointments para componentes */}
      <PeriodSection appointments={appointments} />
    </>
  )
}
```

## 4. Variacao: usando safeParse em vez de parse

```typescript
export async function createAppointment(data: AppointmentData) {
  const result = appointmentSchema.safeParse(data)

  if (!result.success) {
    return { error: result.error.flatten().fieldErrors }
  }

  const { scheduledAt } = result.data
  // ... resto da logica
}
```

## 5. Variacao: extraindo regras de horario para funcao reutilizavel

```typescript
function isWithinBusinessHours(date: Date): boolean {
  const hour = date.getHours()

  const isMorning = hour >= 9 && hour < 12
  const isAfternoon = hour >= 13 && hour < 18
  const isEvening = hour >= 19 && hour < 21

  return isMorning || isAfternoon || isEvening
}

// Uso:
if (!isWithinBusinessHours(scheduledAt)) {
  throw new Error("Horario fora do expediente")
}
```