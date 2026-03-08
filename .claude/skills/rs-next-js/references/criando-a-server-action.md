---
name: rs-next-js-criando-a-server-action
description: "Enforces Server Action patterns when writing Next.js server actions with Zod validation, business rules, and Prisma persistence. Use when user asks to 'create a server action', 'validate form data on server', 'add business rules to API', 'persist form data', or 'create appointment/booking logic'. Applies: 'use server' directive, Zod schema validation as last line of defense, business rule guards before DB writes, conflict checking. Make sure to use this skill whenever creating server-side form handlers in Next.js. Not for client-side validation, API routes, or React Server Components without mutations."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: next-js
  module: server-actions
  tags: [next-js, server-actions, zod, prisma, validation, business-rules, use-server]
---

# Criando Server Actions no Next.js

> Server actions sao a ultima linha de defesa entre os dados do cliente e o banco de dados — sempre valide com Zod e aplique regras de negocio antes de persistir.

## Rules

1. **Sempre adicione `"use server"` no topo do arquivo** — sem essa diretiva, a funcao nao executa no servidor e o Next.js lanca erro silencioso
2. **Valide com Zod no servidor mesmo tendo validacao no client** — o schema do client protege UX, o schema do servidor protege o banco, porque qualquer pessoa pode burlar validacao client-side
3. **Use `schema.parse()` dentro de try/catch** — diferente de `safeParse()`, o `parse()` lanca erro quando falha, entao precisa de tratamento
4. **Aplique regras de negocio ANTES do `prisma.create()`** — validacoes como horarios permitidos e conflitos de agendamento devem bloquear a persistencia
5. **Verifique conflitos no banco antes de inserir** — use `findFirst` com os campos unicos para evitar duplicatas
6. **Nomeie variaveis de regra de negocio descritivamente** — `isMorning`, `isAfternoon`, `isEvening` em vez de comparacoes numericas soltas

## How to write

### Estrutura basica de uma Server Action

```typescript
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

    // Regras de negocio aqui

    // Verificacao de conflitos aqui

    // Persistencia por ultimo
    await prisma.appointments.create({ data: parsedData })
  } catch (error) {
    console.error(error)
  }
}
```

### Regras de negocio com guards descritivos

```typescript
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
```

### Verificacao de conflito antes de persistir

```typescript
const existingAppointment = await prisma.appointments.findFirst({
  where: { scheduledAt },
})

if (existingAppointment) {
  throw new Error("Este horario ja esta reservado")
}

await prisma.appointments.create({ data: parsedData })
```

## Example

**Before (server action sem validacao):**
```typescript
export async function createAppointment(data: any) {
  await prisma.appointments.create({ data })
}
```

**After (com validacao, regras de negocio e conflito):**
```typescript
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
      throw new Error("Agendamentos so podem ser feitos entre 9-12, 13-18 ou 19-21")
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

## Heuristics

| Situation | Do |
|-----------|-----|
| Formulario com dados do usuario | Criar schema Zod especifico para o servidor, mesmo que client ja tenha |
| Recurso com horarios restritos | Extrair regras em variaveis booleanas nomeadas (isMorning, etc) |
| Recurso unico (sem duplicata) | `findFirst` antes de `create` |
| `parse()` vs `safeParse()` | Use `parse()` + try/catch quando quer interromper fluxo; `safeParse()` quando quer tratar erros granularmente |
| Arquivo de server actions | Um arquivo `actions.ts` na pasta `app/` com `"use server"` no topo |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `export async function create(data: any)` | `export async function create(data: TypedData)` com Zod schema |
| Server action sem `"use server"` | Sempre `"use server"` no topo do arquivo |
| `prisma.create()` direto sem validacao | `schema.parse(data)` antes de qualquer `prisma.create()` |
| Numeros magicos em regras de horario | Variaveis descritivas: `isMorning`, `isAfternoon`, `isEvening` |
| Confiar apenas na validacao do client | Duplicar validacao no servidor — ultima linha de defesa |

## Troubleshooting

### Server Action nao executa ao submeter formulario
**Symptom:** Formulario submete mas nada acontece, sem erros no console
**Cause:** Action nao esta sendo passada corretamente ao form, ou falta "use server" no topo do arquivo de action
**Fix:** Garantir que a funcao de action tem `"use server"` no topo. Passar a action via atributo `action` do form: `<form action={minhaAction}>`

### Validacao de formulario nao mostra erros
**Symptom:** Dados invalidos sao submetidos sem feedback ao usuario
**Cause:** Validacao esta no servidor mas o retorno nao e tratado no cliente
**Fix:** Usar `useActionState` (React 19) para capturar o retorno da server action e exibir erros. Adicionar validacao client-side com Zod para feedback instantaneo

## Deep reference library

- [deep-explanation.md](../../../data/skills/next-js/rs-next-js-criando-a-server-action/references/deep-explanation.md) — O instrutor enfatiza que a server action e a **ultima linha de defesa** entre os dados do cliente e 
- [code-examples.md](../../../data/skills/next-js/rs-next-js-criando-a-server-action/references/code-examples.md) — // app/actions.ts
