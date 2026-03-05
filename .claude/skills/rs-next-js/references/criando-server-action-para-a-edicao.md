---
name: rs-next-js-server-action-edicao
description: "Applies Next.js Server Action update patterns when implementing edit/update functionality. Use when user asks to 'create an update action', 'edit server action', 'implement update endpoint', 'add edit functionality', or 'update with validation'. Enforces duplicate-check before update, Zod parsing, revalidation, and create-vs-update branching in forms. Make sure to use this skill whenever building CRUD update operations in Next.js App Router. Not for delete operations, client-side state management, or API routes."
---

# Server Action para Edicao (Update)

> Toda Server Action de update segue o mesmo padrao: validar dados, checar duplicatas, atualizar, revalidar cache.

## Rules

1. **Receba id + data separados** — `updateAppointment(id, data)`, porque o id identifica O QUE atualizar e data contem OS NOVOS VALORES
2. **Parse com Zod antes de qualquer operacao** — `schema.parse(data)` em try/catch, porque dados invalidos nunca devem chegar ao banco
3. **Cheque duplicatas tambem no update** — mesma regra do create se aplica, porque mudar um horario pode conflitar com registro existente
4. **Exclua o proprio registro da checagem** — use `id: { not: id }` no where, porque o registro atual nao e duplicata de si mesmo
5. **Revalide o path apos update** — `revalidatePath('/')`, porque o cache do Next.js precisa refletir a alteracao
6. **Diferencie create/update pela presenca do id** — `appointment.id ? update() : create()`, porque a mesma UI pode servir ambos fluxos

## How to write

### Server Action de Update

```typescript
"use server"

export async function updateAppointment(id: string, data: AppointmentData) {
  const parsedData = appointmentSchema.parse(data)

  // Checar conflito excluindo o proprio registro
  const existing = await prisma.appointments.findFirst({
    where: {
      scheduledAt: parsedData.scheduledAt,
      id: { not: id },
    },
  })

  if (existing) {
    return { error: "Horario ja reservado" }
  }

  await prisma.appointments.update({
    where: { id },
    data: parsedData,
  })

  revalidatePath("/")
}
```

### Branching create/update no form

```typescript
const isEdit = !!appointment.id

if (isEdit) {
  await updateAppointment(appointment.id, { data, scheduledAt })
} else {
  await createAppointment({ data, scheduledAt })
}

toast.success(`Agendamento ${isEdit ? "atualizado" : "criado"} com sucesso!`)
```

## Example

**Before (update sem checagem de duplicata):**
```typescript
export async function updateAppointment(id: string, data: AppointmentData) {
  const parsedData = appointmentSchema.parse(data)
  await prisma.appointments.update({ where: { id }, data: parsedData })
  revalidatePath("/")
}
```

**After (com checagem de conflito):**
```typescript
export async function updateAppointment(id: string, data: AppointmentData) {
  const parsedData = appointmentSchema.parse(data)

  const existing = await prisma.appointments.findFirst({
    where: {
      scheduledAt: parsedData.scheduledAt,
      id: { not: id },
    },
  })

  if (existing) {
    return { error: "Horario ja reservado" }
  }

  await prisma.appointments.update({ where: { id }, data: parsedData })
  revalidatePath("/")
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Campo unico deve ser unico (horario, email) | Cheque duplicata com `not: id` no update |
| Mesma UI para create e edit | Use presenca do `id` como flag |
| Logica duplicada entre create e update | Extraia regras de negocio para funcao separada |
| Mensagem de sucesso no form | Use ternario baseado em `isEdit` |
| Update concluido | Sempre `revalidatePath` para limpar cache |

## Anti-patterns

| Nunca faca | Faca assim |
|------------|------------|
| Update sem validar dados com Zod | `schema.parse(data)` antes de tudo |
| Checar duplicata incluindo o proprio registro | `id: { not: id }` no where |
| Criar action separada sem revalidatePath | Sempre revalidar apos mutacao |
| Duplicar toda logica create/update no form | Branch com `isEdit` ternario |
| Ignorar erro de parse silenciosamente | try/catch com retorno de erro |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/next-js/rs-next-js-criando-server-action-para-a-edicao/references/deep-explanation.md)
- [Code examples](../../../data/skills/next-js/rs-next-js-criando-server-action-para-a-edicao/references/code-examples.md)
