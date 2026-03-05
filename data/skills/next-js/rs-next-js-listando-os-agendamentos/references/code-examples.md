# Code Examples: Listando Agendamentos e Tratativa de Erros

## 1. Page server component passando appointments

```typescript
// app/page.tsx
export default async function Home() {
  const appointments = await getAppointments()

  return (
    <main>
      {/* Outros componentes */}
      <AppointmentList appointments={appointments} />
    </main>
  )
}
```

## 2. Estilizacao do estado vazio (PeriodSection)

```tsx
// Dentro do PeriodSection, quando nao ha agendamentos
<p className="text-sm text-content-secondary px-5 py-5">
  Nenhum agendamento
</p>
```

## 3. Tratativa completa no formulario

```typescript
// appointment-form.tsx
"use client"

import { toast } from "sonner" // ou biblioteca de toast usada

export function AppointmentForm() {
  async function handleSubmit(formData: FormData) {
    const result = await createAppointment(formData)

    if (result?.error) {
      toast.error(result.error)
      return
    }

    toast.success("Agendamento criado com sucesso!")
    form.reset()
  }

  return (
    <form action={handleSubmit}>
      {/* campos do formulario */}
    </form>
  )
}
```

## 4. Exemplos de erros retornados pela server action

```typescript
// Cenario 1: horario ja reservado
// Retorno: { error: "Esse horário já está reservado" }

// Cenario 2: fora do horario de atendimento
// Retorno: { error: "Agendamento só pode ser feitos entre 8h e 18h, de segunda a sexta" }
```

## 5. Server action com retorno estruturado

```typescript
// actions/create-appointment.ts
"use server"

export async function createAppointment(formData: FormData) {
  const date = formData.get("date") as string
  const time = formData.get("time") as string

  // Validacao de horario de atendimento
  const hour = parseInt(time.split(":")[0])
  if (hour < 8 || hour >= 18) {
    return { error: "Agendamento só pode ser feitos entre 8h e 18h" }
  }

  // Validacao de horario ja reservado
  const existing = await db.appointment.findFirst({
    where: { date, time }
  })

  if (existing) {
    return { error: "Esse horário já está reservado" }
  }

  // Criacao do agendamento
  await db.appointment.create({
    data: { /* ... */ }
  })

  // Retorno undefined = sucesso
}
```