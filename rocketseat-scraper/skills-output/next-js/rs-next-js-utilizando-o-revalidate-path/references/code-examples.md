# Code Examples: RevalidatePath em Server Actions

## Exemplo 1: Server Action completa com revalidatePath

Baseado diretamente no codigo da aula (pet shop scheduling):

```typescript
// app/actions/create-appointment.ts
"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"

interface CreateAppointmentInput {
  petName: string
  ownerName: string
  phone: string
  service: string
  date: Date
  time: string
}

export async function createAppointment(data: CreateAppointmentInput) {
  try {
    await prisma.appointment.create({
      data: {
        petName: data.petName,
        ownerName: data.ownerName,
        phone: data.phone,
        service: data.service,
        date: data.date,
        time: data.time,
      },
    })

    // Apos criar, invalida o cache da home que lista agendamentos
    revalidatePath("/")
  } catch (error) {
    console.error("Failed to create appointment:", error)
    throw new Error("Failed to create appointment")
  }
}
```

## Exemplo 2: AppointmentForm com Dialog controlado

Componente completo com estado de dialog e reset:

```typescript
// components/appointment-form.tsx
"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { createAppointment } from "@/app/actions/create-appointment"

export function AppointmentForm() {
  const [isOpen, setIsOpen] = useState(false)
  const form = useForm<AppointmentFormData>()

  async function onSubmit(data: AppointmentFormData) {
    try {
      await createAppointment(data)
      setIsOpen(false) // fecha dialog apos sucesso
      form.reset()     // limpa formulario
    } catch (error) {
      // mostra erro, dialog permanece aberto
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button>Novo Agendamento</button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          {/* campos do formulario */}
          <button type="submit">Agendar</button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
```

## Exemplo 3: Variacao — revalidatePath para multiplas rotas

Quando a mutacao afeta dados exibidos em mais de uma pagina:

```typescript
export async function deleteAppointment(id: string) {
  await prisma.appointment.delete({ where: { id } })

  revalidatePath("/")           // home com lista
  revalidatePath("/dashboard")  // dashboard com metricas
}
```

## Exemplo 4: Variacao — revalidatePath com layout

Para revalidar todas as paginas de um layout:

```typescript
revalidatePath("/", "layout") // revalida tudo que usa o root layout
```

## Exemplo 5: Antes vs Depois (fluxo completo)

### Antes (problema original da aula):
1. Usuario preenche formulario
2. Clica "Agendar"
3. Dados salvos no banco
4. Pagina NAO atualiza — lista stale
5. Usuario fecha dialog manualmente
6. Usuario da F5 manualmente
7. Agendamento aparece

### Depois (com revalidatePath + dialog controlado):
1. Usuario preenche formulario
2. Clica "Agendar"
3. Dados salvos no banco
4. `revalidatePath("/")` — Next busca dados novos
5. `setIsOpen(false)` — dialog fecha automaticamente
6. `form.reset()` — formulario limpo
7. Lista ja mostra o novo agendamento — sem F5