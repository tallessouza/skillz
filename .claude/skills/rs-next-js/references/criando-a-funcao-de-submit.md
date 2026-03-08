---
name: rs-next-js-criando-a-funcao-de-submit
description: "Applies form submit pattern with date/time manipulation and toast notifications in Next.js. Use when user asks to 'create a submit function', 'handle form submission', 'format date and time for database', 'add toast notifications', or 'prepare data for server action'. Ensures correct DateTime construction from separate date and time fields using setHours, and configures Sonner toasts with Toaster provider. Make sure to use this skill whenever building form submissions that combine date and time inputs into a single DateTime field. Not for server actions, database operations, or form validation logic."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: next-js
  module: form-submission
  tags: [next-js, form-submit, date-time, setHours, sonner, toast, react-hook-form]
---

# Criando a Funcao de Submit

> Ao submeter formularios com campos separados de data e hora, construa um unico DateTime antes de enviar ao backend.

## Rules

1. **Desestruture o time com split** — `time.split(':')` para extrair hours e minutes, porque o input de horario retorna string no formato "HH:00:00"
2. **Use setHours para compor o DateTime** — combine date e time num unico campo `scheduleAt`, porque o Prisma espera um DateTime unico, nao campos separados
3. **Converta strings para Number** — `Number(hour)` e `Number(minutes)` antes de passar para setHours, porque o split retorna strings
4. **Zero segundos e milissegundos** — sempre passe `0, 0` nos ultimos parametros do setHours, porque agendamentos nao precisam dessa precisao
5. **Configure o Toaster no layout** — adicione o provider `<Toaster />` no layout raiz, porque toasts precisam de um provider global
6. **Toast de sucesso apos submit** — use `toast.success()` do Sonner para feedback imediato ao usuario

## How to write

### Desestruturacao e composicao do DateTime

```typescript
const [hour, minutes] = data.time.split(':')

const scheduleAt = new Date(data.scheduleAt)
scheduleAt.setHours(Number(hour), Number(minutes), 0, 0)
```

### Toaster provider no layout

```tsx
// app/layout.tsx
import { Toaster } from 'sonner'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Toaster position="top-right" />
      </body>
    </html>
  )
}
```

### Toast no submit

```typescript
import { toast } from 'sonner'

async function onSubmit(data: FormData) {
  const [hour, minutes] = data.time.split(':')
  const scheduleAt = new Date(data.scheduleAt)
  scheduleAt.setHours(Number(hour), Number(minutes), 0, 0)

  // chamar server action aqui
  toast.success('Agendamento criado com sucesso')
}
```

## Example

**Before (campos separados, sem tratamento):**
```typescript
async function onSubmit(data) {
  console.log(data)
  // data.time = "10:00:00" (string)
  // data.scheduleAt = Date object
  // Enviando separado pro banco — ERRADO
  await save({ date: data.scheduleAt, time: data.time })
}
```

**After (DateTime unificado + toast):**
```typescript
async function onSubmit(data) {
  const [hour, minutes] = data.time.split(':')
  const scheduleAt = new Date(data.scheduleAt)
  scheduleAt.setHours(Number(hour), Number(minutes), 0, 0)

  await createSchedule({ ...data, scheduleAt })
  toast.success('Agendamento criado com sucesso')
}
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Input de time retorna string "HH:MM" | Split no `:` e desestruture [hour, minutes] |
| Schema do banco tem campo DateTime unico | Combine date + time com setHours |
| Precisa de feedback visual no submit | Instale Sonner (`pnpm add sonner`) e use toast.success() |
| Toasts nao aparecem | Verifique se `<Toaster />` esta no layout raiz |
| Valores vem como string do split | Converta com `Number()` antes de usar |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `scheduleAt.setHours(hour, minutes)` (strings) | `scheduleAt.setHours(Number(hour), Number(minutes), 0, 0)` |
| Salvar date e time como campos separados no banco | Unificar num unico DateTime com setHours |
| `alert('Sucesso!')` para feedback | `toast.success('Agendamento criado com sucesso')` |
| Toaster dentro de um componente filho | Toaster no layout raiz (provider global) |

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

- [deep-explanation.md](../../../data/skills/next-js/rs-next-js-criando-a-funcao-de-submit/references/deep-explanation.md) — O instrutor explica que no schema do Prisma existe apenas um campo `scheduleAt` do tipo `DateTime`. 
- [code-examples.md](../../../data/skills/next-js/rs-next-js-criando-a-funcao-de-submit/references/code-examples.md) — // Dentro do componente do formulario
