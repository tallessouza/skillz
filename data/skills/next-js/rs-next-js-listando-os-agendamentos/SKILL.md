---
name: rs-next-js-listando-os-agendamentos
description: "Applies Next.js server action error handling and appointment listing patterns when building forms with server actions. Use when user asks to 'handle server action errors', 'list data from server', 'show form validation errors', 'create appointment system', or 'use toast notifications with server actions'. Make sure to use this skill whenever implementing server actions that return errors or listing server data in Next.js pages. Not for client-side-only validation, REST API routes, or database schema design."
---

# Listando Agendamentos e Tratativa de Erros em Server Actions

> Toda server action que pode falhar deve retornar erros estruturados, e o formulario deve tratar esses erros com feedback visual imediato ao usuario.

## Rules

1. **Passe dados do servidor direto para o componente** — busque no server component e passe via props, porque elimina a necessidade de estado client-side e dados mockados
2. **Trate o retorno da server action** — armazene em `result` e verifique `result.error` antes de prosseguir, porque erros silenciosos confundem o usuario
3. **Use early return apos erro** — `if (result?.error) { toast.error(result.error); return; }`, porque evita que o fluxo de sucesso execute em cenario de falha
4. **Limpe o formulario apenas no sucesso** — chame `form.reset()` somente apos confirmar que nao houve erro, porque resetar campos apos erro frustra o usuario
5. **Mostre mensagens de erro do backend diretamente** — use a mensagem retornada pela server action no toast, porque o backend ja tem validacoes especificas (horario reservado, fora do expediente)
6. **Remova dados mockados assim que o backend funcionar** — substitua mocks por dados reais via props, porque dados mockados mascaram bugs de integracao

## How to write

### Server component passando dados para client component

```typescript
// page.tsx (server component)
export default async function Page() {
  const appointments = await getAppointments()

  return <AppointmentForm appointments={appointments} />
}
```

### Tratativa de erro no submit do formulario

```typescript
// appointment-form.tsx (client component)
async function handleSubmit(formData: FormData) {
  const result = await createAppointment(formData)

  if (result?.error) {
    toast.error(result.error)
    return
  }

  toast.success("Agendamento criado com sucesso!")
  form.reset()
}
```

## Example

**Before (sem tratativa de erro):**
```typescript
async function handleSubmit(formData: FormData) {
  await createAppointment(formData)
  toast.success("Agendamento criado!")
}
```

**After (com tratativa completa):**
```typescript
async function handleSubmit(formData: FormData) {
  const result = await createAppointment(formData)

  if (result?.error) {
    toast.error(result.error)
    return
  }

  toast.success("Agendamento criado com sucesso!")
  form.reset()
}
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Server action pode falhar por regra de negocio | Retorne `{ error: string }` e trate no client |
| Formulario enviado com sucesso | `form.reset()` + toast de sucesso |
| Dados vem do banco | Passe via props do server component, nao use mock |
| Pagina nao atualiza apos criar registro | Investigate revalidation (revalidatePath/revalidateTag) |
| Multiplas validacoes no backend | Retorne mensagem especifica para cada caso |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `await createAppointment(formData)` sem capturar retorno | `const result = await createAppointment(formData)` |
| `toast.success()` sem verificar erro antes | `if (result?.error) { toast.error(...); return }` antes do sucesso |
| Dados mockados quando backend ja funciona | Props vindas do server component |
| `form.reset()` antes de verificar erro | `form.reset()` apenas no caminho de sucesso |
| Ignorar mensagem de erro do backend | `toast.error(result.error)` mostrando a mensagem real |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
