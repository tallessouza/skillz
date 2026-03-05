# Code Examples: Server Action para Edicao

## 1. Server Action completa de update

```typescript
// app/actions/appointments.ts
"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"
import { appointmentSchema, type AppointmentData } from "@/lib/schemas"

export async function updateAppointment(id: string, data: AppointmentData) {
  let parsedData

  try {
    parsedData = appointmentSchema.parse(data)
  } catch (error) {
    console.log(error)
    return { error: "Dados invalidos" }
  }

  // Checar se horario ja esta ocupado por OUTRO agendamento
  const existing = await prisma.appointments.findFirst({
    where: {
      scheduledAt: parsedData.scheduledAt,
      id: { not: id },
    },
  })

  if (existing) {
    return { error: "Esse horario ja esta reservado" }
  }

  await prisma.appointments.update({
    where: { id },
    data: parsedData,
  })

  revalidatePath("/")
}
```

## 2. Form com branching create/update

```typescript
// components/appointment-form.tsx
"use client"

import { createAppointment } from "@/actions/appointments"
import { updateAppointment } from "@/actions/appointments"

export function AppointmentForm({ appointment }) {
  async function handleSubmit(formData: FormData) {
    const data = {
      petName: formData.get("petName") as string,
      ownerName: formData.get("ownerName") as string,
      scheduledAt: new Date(formData.get("scheduledAt") as string),
    }

    const isEdit = !!appointment?.id

    if (isEdit) {
      await updateAppointment(appointment.id, data)
    } else {
      await createAppointment(data)
    }

    toast.success(
      `Agendamento ${isEdit ? "atualizado" : "criado"} com sucesso!`
    )
  }

  return <form action={handleSubmit}>{/* campos */}</form>
}
```

## 3. Comparacao create vs update — diferencas chave

```typescript
// CREATE - nao precisa de id, busca simples de duplicata
export async function createAppointment(data: AppointmentData) {
  const parsedData = appointmentSchema.parse(data)

  const existing = await prisma.appointments.findFirst({
    where: { scheduledAt: parsedData.scheduledAt },
    //       ^^^^^^^^^ busca simples
  })

  if (existing) return { error: "Horario reservado" }

  await prisma.appointments.create({ data: parsedData })
  //                         ^^^^^^ create
  revalidatePath("/")
}

// UPDATE - precisa de id, exclui proprio registro da busca
export async function updateAppointment(id: string, data: AppointmentData) {
  const parsedData = appointmentSchema.parse(data)

  const existing = await prisma.appointments.findFirst({
    where: {
      scheduledAt: parsedData.scheduledAt,
      id: { not: id },
      // ^^^^^^^^^^^^^^ exclui o proprio registro
    },
  })

  if (existing) return { error: "Horario reservado" }

  await prisma.appointments.update({ where: { id }, data: parsedData })
  //                         ^^^^^^ update com where
  revalidatePath("/")
}
```

## 4. Prisma `not` filter — sintaxe detalhada

```typescript
// Excluir um id especifico da busca
where: {
  id: { not: "abc123" }
}

// Equivalente SQL:
// WHERE id != 'abc123'

// Combinado com outro filtro:
where: {
  scheduledAt: new Date("2024-03-15T10:00:00"),
  id: { not: "abc123" },
}
// SQL: WHERE scheduled_at = '2024-03-15T10:00:00' AND id != 'abc123'
```

## 5. Detectando modo edit pelo id

```typescript
// A presenca do id indica que o registro ja existe no banco
const isEdit = !!appointment.id
// appointment.id = "abc123" → isEdit = true  (edicao)
// appointment.id = undefined → isEdit = false (criacao)
// appointment.id = null      → isEdit = false (criacao)
// appointment.id = ""        → isEdit = false (criacao)
```