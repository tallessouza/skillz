# Code Examples: Server Actions no Next.js

## Exemplo 1: Abordagem Tradicional (O Problema)

Este e o codigo que o instrutor mostrou como exemplo do boilerplate excessivo:

```typescript
"use client"

import { useState } from "react"

export function CreateAppointmentForm() {
  // Gerenciamento manual de estados — muito boilerplate
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault() // Necessario para evitar reload da pagina
    setLoading(true)
    setError("")

    try {
      // Captura manual dos dados
      const formData = new FormData(e.currentTarget)
      const tutorName = formData.get("tutorName")
      const petName = formData.get("petName")

      // Fetch manual com JSON.stringify
      const response = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tutorName, petName }),
      })

      if (!response.ok) {
        throw new Error("Erro ao criar agendamento")
      }

      setSuccess("Agendamento criado com sucesso!")
    } catch (err) {
      setError("Falha ao criar agendamento")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input name="tutorName" placeholder="Nome do tutor" />
      <input name="petName" placeholder="Nome do pet" />
      <button type="submit" disabled={loading}>
        {loading ? "Enviando..." : "Agendar"}
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}
    </form>
  )
}
```

**Problemas identificados pelo instrutor:**
- `"use client"` obrigatorio
- 3 estados manuais (loading, error, success)
- `e.preventDefault()` manual
- `fetch` + `JSON.stringify` + headers
- `try/catch/finally` manual
- API Route separada necessaria
- Nao funciona sem JavaScript

## Exemplo 2: Esqueleto de Server Action (Solucao)

Modelo basico apresentado pelo instrutor:

```typescript
// app/actions.ts
"use server"

import { revalidatePath } from "next/cache"

export async function createAppointment(formData: FormData) {
  // Validacao (simplificada no exemplo da aula)
  const tutorName = formData.get("tutorName") as string
  const petName = formData.get("petName") as string

  if (!tutorName || !petName) {
    return { success: false, message: "Preencha todos os campos" }
  }

  // Mutacao no banco de dados
  await db.appointment.create({
    data: { tutorName, petName },
  })

  // Revalidacao do cache — crucial apos mutacao
  revalidatePath("/appointments")

  return { success: true, message: "Agendamento criado" }
}
```

**Pontos-chave:**
- `"use server"` no topo do arquivo — cria endpoint privado automaticamente
- Funcao assincrona — obrigatorio para server actions
- Recebe `FormData` — integra nativamente com `<form action={...}>`
- `revalidatePath` — invalida cache para que dados atualizados aparecam

## Exemplo 3: Consumo em Server Component

```typescript
// app/appointments/page.tsx
// SEM "use client" — e um Server Component
import { createAppointment } from "./actions"

export default function AppointmentsPage() {
  return (
    <form action={createAppointment}>
      <label>
        Nome do tutor
        <input name="tutorName" required />
      </label>
      <label>
        Nome do pet
        <input name="petName" required />
      </label>
      <button type="submit">Agendar</button>
    </form>
  )
}
```

**Nota**: Este formulario funciona mesmo com JavaScript desabilitado (progressive enhancement).

## Exemplo 4: Consumo em Client Component com Feedback

```typescript
"use client"

import { useFormStatus } from "react-dom"
import { useActionState } from "react"
import { createAppointment } from "./actions"

// Componente separado para acessar useFormStatus
function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button type="submit" disabled={pending}>
      {pending ? "Criando agendamento..." : "Agendar"}
    </button>
  )
}

export function AppointmentForm() {
  const [state, formAction] = useActionState(createAppointment, null)

  return (
    <form action={formAction}>
      <input name="tutorName" required />
      <input name="petName" required />
      <SubmitButton />
      {state?.success === false && <p className="error">{state.message}</p>}
      {state?.success === true && <p className="success">{state.message}</p>}
    </form>
  )
}
```

## Exemplo 5: Server Action em Evento de Click (Caso Avancado)

```typescript
"use client"

import { useTransition } from "react"
import { deleteAppointment } from "./actions"

export function DeleteButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition()

  function handleDelete() {
    startTransition(() => {
      deleteAppointment(id)
    })
  }

  return (
    <button onClick={handleDelete} disabled={isPending}>
      {isPending ? "Deletando..." : "Deletar"}
    </button>
  )
}
```

## Comparacao Visual: Antes vs Depois

| Aspecto | Tradicional | Server Action |
|---------|-------------|---------------|
| Diretiva | `"use client"` obrigatorio | Pode ser Server Component |
| Estados | 3+ useState manuais | useFormStatus / useActionState |
| Submit | `onSubmit` + `preventDefault` | `action={serverAction}` |
| Rede | `fetch` + JSON.stringify | Transparente (RPC) |
| API | API Route separada | Endpoint privado automatico |
| Sem JS | Quebra completamente | Funciona (progressive enhancement) |
| Linhas | ~40-50 para form simples | ~15-20 para form simples |