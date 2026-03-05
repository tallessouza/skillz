---
name: rs-next-js-o-que-sao-server-actions
description: "Applies Server Actions patterns when writing Next.js form handling and data mutation code. Use when user asks to 'create a form', 'handle form submission', 'mutate data in Next.js', 'create a server action', or 'submit data to server'. Enforces use server directive, async function pattern, revalidation, and progressive enhancement. Make sure to use this skill whenever building forms or data mutations in Next.js App Router. Not for REST API routes, GET requests, data fetching, or client-side-only state management."
---

# Server Actions no Next.js

> Server Actions sao funcoes assincronas com diretiva "use server" que executam exclusivamente no servidor e sao chamadas como funcoes normais no client — eliminando boilerplate de fetch, API routes e gerenciamento manual de estado.

## Rules

1. **Sempre use a diretiva "use server"** — no topo do arquivo ou no inicio da funcao, porque sem ela o Next nao cria o endpoint privado e da erro de compilacao
2. **Server Actions sao para mutacao** — criar, atualizar, deletar dados. Para leitura/relatorios sem mutacao, use server functions genericas, porque a semantica de "action" implica side-effect
3. **Prefira form action sobre onSubmit** — passe a server action direto no atributo `action` do form, porque isso habilita progressive enhancement (funciona sem JavaScript)
4. **Nunca misture "use server" com "use client" no mesmo arquivo** — separe actions em arquivos dedicados (ex: `actions.ts`), porque o bundler precisa da separacao clara
5. **Revalide dados apos mutacao** — use `revalidatePath` ou `revalidateTag` apos a action, porque o cache do Next precisa ser invalidado explicitamente
6. **Retorne resultado estruturado** — a action deve retornar `{ success, message, errors }`, porque o client precisa de feedback sem throw

## How to write

### Server Action basica

```typescript
// app/actions.ts
"use server"

import { revalidatePath } from "next/cache"

export async function createAppointment(formData: FormData) {
  const tutorName = formData.get("tutorName") as string
  const petName = formData.get("petName") as string

  // validacao
  if (!tutorName || !petName) {
    return { success: false, message: "Campos obrigatorios" }
  }

  // mutacao no banco
  await db.appointment.create({ data: { tutorName, petName } })

  revalidatePath("/appointments")
  return { success: true, message: "Agendamento criado" }
}
```

### Form com Server Action (progressive enhancement)

```typescript
// app/appointments/page.tsx — Server Component, sem "use client"
import { createAppointment } from "../actions"

export default function AppointmentsPage() {
  return (
    <form action={createAppointment}>
      <input name="tutorName" placeholder="Nome do tutor" required />
      <input name="petName" placeholder="Nome do pet" required />
      <button type="submit">Agendar</button>
    </form>
  )
}
```

### Client Component consumindo Server Action

```typescript
"use client"

import { useFormStatus } from "react-dom"
import { createAppointment } from "../actions"

function SubmitButton() {
  const { pending } = useFormStatus()
  return <button disabled={pending}>{pending ? "Enviando..." : "Agendar"}</button>
}

export function AppointmentForm() {
  return (
    <form action={createAppointment}>
      <input name="tutorName" required />
      <input name="petName" required />
      <SubmitButton />
    </form>
  )
}
```

## Example

**Before (abordagem tradicional com boilerplate):**

```typescript
"use client"
import { useState } from "react"

export function CreateAppointmentForm() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tutorName, petName }),
      })
      if (!res.ok) throw new Error("Erro")
      setSuccess("Criado!")
    } catch (err) {
      setError("Falhou")
    } finally {
      setLoading(false)
    }
  }

  return <form onSubmit={handleSubmit}>...</form>
}
```

**After (com Server Action):**

```typescript
// actions.ts
"use server"
import { revalidatePath } from "next/cache"

export async function createAppointment(formData: FormData) {
  const tutorName = formData.get("tutorName") as string
  const petName = formData.get("petName") as string
  await db.appointment.create({ data: { tutorName, petName } })
  revalidatePath("/appointments")
}

// page.tsx — zero boilerplate, progressive enhancement
import { createAppointment } from "./actions"

export default function Page() {
  return (
    <form action={createAppointment}>
      <input name="tutorName" required />
      <input name="petName" required />
      <button type="submit">Agendar</button>
    </form>
  )
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Formulario de criacao/edicao/delecao | Server Action com form action |
| API publica consumida por multiplos clientes | REST API route, nao server action |
| Feedback de loading durante submit | useFormStatus ou useTransition |
| Leitura de dados sem mutacao | Server function ou fetch direto no server component |
| Botao de delete fora de form | Server action em evento onClick com useTransition |
| JavaScript desabilitado no client | form action funciona nativamente (progressive enhancement) |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|---------------------|
| `fetch("/api/route", { method: "POST" })` em client para mutacao interna | Server action direto no form action |
| `e.preventDefault()` + fetch manual para forms | `<form action={serverAction}>` |
| `useState` para loading/error/success de submit | `useFormStatus` + retorno da action |
| `"use server"` dentro de arquivo `"use client"` | Arquivo separado `actions.ts` com `"use server"` no topo |
| Server action para servir dados a clientes externos | API Route REST para APIs publicas |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
