---
name: rs-saas-nextjs-rbac-use-action-state
description: "Applies the useActionState hook pattern when building forms with Next.js Server Actions. Use when user asks to 'create a form', 'handle form submission', 'show loading state', 'return errors from server action', or 'use server actions with feedback'. Enforces correct signature (previousState + formData), loading states with isPending, and client component extraction. Make sure to use this skill whenever implementing forms that call server actions and need to display results. Not for client-side-only forms, React Query mutations, or API route handlers."
---

# useActionState com Server Actions

> Ao conectar formularios a server actions, use useActionState para retornar dados da action e controlar estados de loading na interface.

## Rules

1. **Extraia o formulario para um client component** — a pagina deve permanecer server component, o formulario vai para um componente separado com `'use client'`, porque hooks so funcionam em client components e o Next recomenda nunca converter paginas inteiras
2. **Use formAction do useActionState, nunca a action direta** — `const [state, formAction, isPending] = useActionState(myAction, null)`, porque o hook precisa interceptar a execucao para gerenciar estado
3. **Adapte a assinatura da server action** — primeiro parametro vira `previousState`, segundo vira `formData`, porque o useActionState injeta o estado anterior automaticamente
4. **Sempre retorne algo da server action** — o retorno vira o proximo `state`, sem return o tipo e `void` e voce nao consegue mostrar feedback ao usuario
5. **Use isPending para loading** — desabilite o botao e mostre spinner enquanto a action executa, porque em producao ha latencia real entre cliente e servidor
6. **initialState define o tipo** — se iniciar como `null`, o state sera `ReturnType | null`, planeje o tipo do retorno de acordo

## How to write

### Estrutura do client component com useActionState

```typescript
'use client'

import { useActionState } from 'react'
import { myServerAction } from './actions'

export function MyForm() {
  const [state, formAction, isPending] = useActionState(myServerAction, null)

  return (
    <form action={formAction}>
      {/* campos */}
      <button type="submit" disabled={isPending}>
        {isPending ? <Loader2 className="size-4 animate-spin" /> : 'Submit'}
      </button>
      {state?.success === false && <p>{state.message}</p>}
    </form>
  )
}
```

### Assinatura da server action com useActionState

```typescript
'use server'

export async function myServerAction(
  previousState: unknown,
  data: FormData,
) {
  const email = data.get('email')?.toString()
  // logica...
  return { success: true, message: null }
}
```

### Pagina permanece server component

```typescript
// app/sign-in/page.tsx — SEM 'use client'
import { SignInForm } from './sign-in-form'

export default function SignInPage() {
  return <SignInForm />
}
```

## Example

**Before (server action sem feedback):**
```typescript
// page.tsx (server component)
import { signIn } from './actions'

export default function SignInPage() {
  return (
    <form action={signIn}>
      <input name="email" />
      <input name="password" type="password" />
      <button>Sign in</button>
    </form>
  )
}

// actions.ts
'use server'
export async function signIn(data: FormData) {
  await api.post('/sessions', { email: data.get('email') })
  // sem retorno, sem feedback, sem loading
}
```

**After (com useActionState):**
```typescript
// sign-in-form.tsx (client component)
'use client'
import { useActionState } from 'react'
import { Loader2 } from 'lucide-react'
import { signIn } from './actions'

export function SignInForm() {
  const [state, formAction, isPending] = useActionState(signIn, null)

  return (
    <form action={formAction}>
      <input name="email" />
      <input name="password" type="password" />
      <button disabled={isPending}>
        {isPending ? <Loader2 className="size-4 animate-spin" /> : 'Sign in'}
      </button>
      {state?.success === false && <p>{state.message}</p>}
      {state?.success === true && <p>Autenticado!</p>}
    </form>
  )
}

// actions.ts
'use server'
export async function signIn(previousState: unknown, data: FormData) {
  const email = data.get('email')?.toString()
  await api.post('/sessions', { email })
  return { success: true, message: null }
}
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Formulario precisa mostrar erros de validacao | useActionState para retornar erros da server action |
| Pagina tem formulario + conteudo estatico | Extraia so o formulario para client component |
| Action pode ser chamada multiplas vezes | Use previousState se o resultado depende da execucao anterior |
| Loading durante submit | Use isPending, terceiro valor do array |
| Action nao precisa de feedback nenhum | Pode usar action direto no form sem useActionState |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `'use client'` na pagina | Extrair formulario para componente separado |
| `action={signIn}` quando precisa de feedback | `action={formAction}` via useActionState |
| `async function signIn(data: FormData)` com useActionState | `async function signIn(previousState: unknown, data: FormData)` |
| `useState` + `onClick` + `fetch` para chamar server action | `useActionState` com form action nativo |
| Sem loading visual durante submit | `isPending` para desabilitar botao e mostrar spinner |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
