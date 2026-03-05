---
name: rs-saas-nextjs-rbac-evitando-reset-formulario
description: "Applies React 19 form reset prevention patterns when building forms with server actions in Next.js. Use when user asks to 'create a form', 'handle form submission', 'prevent form reset', 'use server actions with forms', or 'fix form losing data on submit'. Replaces useActionState with useState + useTransition + onSubmit to keep form data on error. Make sure to use this skill whenever building forms that call server actions in React 19 / Next.js App Router. Not for simple forms without server actions, nor for React 18 projects."
---

# Evitando Reset do Formulário (React 19)

> Em React 19, formularios com server actions resetam automaticamente no submit — controle o estado manualmente com useState + useTransition para preservar os dados.

## Rules

1. **Use onSubmit ao inves de action no form** — `<form onSubmit={handleSubmit}>` nao `<form action={serverAction}>`, porque o atributo action dispara o reset automatico do React 19
2. **Substitua useActionState por useState** — controle o formState manualmente, porque useActionState depende do action e causa o reset
3. **Use useTransition para isPending** — `const [isPending, startTransition] = useTransition()`, porque elimina o padrao manual de setIsLoading(true/false)
4. **Envolva a chamada da action em startTransition** — tudo dentro do startTransition fica com isPending=true automaticamente, porque o React gerencia o estado de carregamento
5. **Use requestFormReset para reset manual** — importe de `react-dom` e chame `requestFormReset(formElement)` quando quiser resetar explicitamente, porque o reset automatico foi removido do fluxo
6. **Faca event.preventDefault no onSubmit** — impede o comportamento padrao do navegador, porque sem isso o formulario faz submit tradicional

## How to write

### Form com controle manual de estado

```typescript
'use client'

import { useState } from 'react'
import { useTransition } from 'react'
import { requestFormReset } from 'react-dom'

type FormState = {
  success: boolean
  message: string | null
  errors: Record<string, string[]> | null
}

export function MyForm() {
  const [formState, setFormState] = useState<FormState>({
    success: false,
    message: null,
    errors: null,
  })
  const [isPending, startTransition] = useTransition()

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const data = new FormData(form)

    startTransition(async () => {
      const result = await myServerAction(data)
      setFormState(result)

      if (result.success) {
        requestFormReset(form)
      }
    })
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* inputs */}
      <button type="submit" disabled={isPending}>
        {isPending ? 'Enviando...' : 'Enviar'}
      </button>
      {formState.message && <p>{formState.message}</p>}
    </form>
  )
}
```

### Server action sem useActionState

```typescript
// Antes (com useActionState): recebia previousState como primeiro param
export async function myAction(previousState: FormState, data: FormData) { ... }

// Depois (sem useActionState): recebe apenas formData
export async function myAction(data: FormData) {
  // validacao e logica
  return { success: false, message: 'Erro', errors: null }
}
```

## Example

**Before (useActionState — form reseta no erro):**
```typescript
const [formState, formAction, isPending] = useActionState(signInAction, {
  success: false, message: null, errors: null
})

return <form action={formAction}>...</form>
```

**After (useState + useTransition — form preserva dados):**
```typescript
const [formState, setFormState] = useState({ success: false, message: null, errors: null })
const [isPending, startTransition] = useTransition()

async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
  event.preventDefault()
  const form = event.currentTarget
  const data = new FormData(form)

  startTransition(async () => {
    const result = await signInWithEmailAndPassword(data)
    setFormState(result)
  })
}

return <form onSubmit={handleSubmit}>...</form>
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Form com server action que pode dar erro | useState + useTransition (preserva dados) |
| Form que deve limpar apos sucesso | requestFormReset(form) dentro do startTransition |
| Form simples sem erros possiveis | useActionState e aceitar o reset |
| Precisa de isPending sem useState manual | useTransition (nunca setIsLoading manual) |
| Redirect apos sucesso (ex: login) | Nao precisa resetar — usuario sera redirecionado |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `<form action={serverAction}>` quando precisa preservar dados | `<form onSubmit={handleSubmit}>` |
| `const [isLoading, setIsLoading] = useState(false)` | `const [isPending, startTransition] = useTransition()` |
| `setIsLoading(true); await action(); setIsLoading(false)` | `startTransition(async () => { await action() })` |
| `useActionState` em forms que nao podem resetar | `useState` + `useTransition` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
