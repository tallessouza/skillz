---
name: rs-saas-nextjs-rbac-hook-use-form-state
description: "Applies custom useFormState hook pattern when building forms with Server Actions in Next.js/React. Use when user asks to 'create a form', 'handle form submission', 'use server actions with forms', 'build a login form', or 'manage form state'. Wraps useState + useTransition into a reusable hook with typed state, action handler, and pending status. Make sure to use this skill whenever creating forms that call server actions. Not for server-side validation logic, API routes, or non-form state management."
---

# Custom useFormState Hook para Server Actions

> Encapsule useState + useTransition em um hook reutilizavel que padroniza o estado de formularios com server actions.

## Rules

1. **Nao use useActionState do React diretamente** — crie um hook customizado `useFormState` que replica o comportamento, porque isso da controle total sobre o fluxo e evita breaking changes do React
2. **Cuidado com conflito de nomes** — o React possui um hook `useFormState` (deprecated) e `useActionState`, nunca importe o do React quando usar o customizado
3. **Retorne sempre na ordem: state, handler, isPending** — mantenha a mesma interface do useActionState para consistencia, porque quem conhece a API do React vai reconhecer o padrao
4. **Use `as const` no retorno de arrays** — sem `as const`, TypeScript infere o retorno como `(FormState | Function | boolean)[]` ao inves de uma tupla tipada
5. **O initialState deve ser opcional** — forneça um default vazio `{ success: null, message: null, errors: null }` para evitar boilerplate em cada formulario
6. **O generic do hook deve inferir o tipo** — use um generic `<TState>` que conecta action, initialState e retorno, porque garante consistencia de tipos

## How to write

### Interface do FormState

```typescript
interface FormState {
  success: boolean | null
  message: string | null
  errors: Record<string, string[]> | null
}
```

### O hook useFormState

```typescript
import { useState, useTransition, FormEvent } from 'react'

export function useFormState<TState = FormState>(
  action: (data: FormData) => Promise<TState>,
  initialState?: TState,
) {
  const [isPending, startTransition] = useTransition()

  const [formState, setFormState] = useState<TState>(
    initialState ?? ({ success: null, message: null, errors: null } as TState),
  )

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const data = new FormData(form)

    startTransition(async () => {
      const result = await action(data)
      setFormState(result)
    })
  }

  return [formState, handleSubmit, isPending] as const
}
```

### Uso no componente

```typescript
const [formState, handleSubmit, isPending] = useFormState(signInAction)

return (
  <form onSubmit={handleSubmit}>
    {formState.success === false && <p>{formState.message}</p>}
    <input name="email" />
    <input name="password" type="password" />
    <button disabled={isPending}>
      {isPending ? 'Entrando...' : 'Entrar'}
    </button>
  </form>
)
```

## Example

**Before (logica inline no componente):**
```typescript
export function SignInForm() {
  const [isPending, startTransition] = useTransition()
  const [formState, setFormState] = useState({
    success: null, message: null, errors: null,
  })

  async function handleSignIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    startTransition(async () => {
      const result = await signInAction(data)
      setFormState(result)
    })
  }

  return <form onSubmit={handleSignIn}>...</form>
}
```

**After (com useFormState):**
```typescript
export function SignInForm() {
  const [formState, handleSubmit, isPending] = useFormState(signInAction)

  return <form onSubmit={handleSubmit}>...</form>
}
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Formulario com server action | Use useFormState customizado |
| Todos os formularios do projeto | Mesmo hook, sem initialState (use default) |
| Formulario precisa de estado extra | Passe initialState customizado via generic |
| Retorno do hook perde tipagem | Adicione `as const` no return |
| Import autocomplete sugere useFormState do React | Importe explicitamente do seu arquivo de hooks |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `import { useFormState } from 'react'` | `import { useFormState } from '@/hooks/use-form-state'` |
| `return [formState, handleSubmit, isPending]` (sem as const) | `return [formState, handleSubmit, isPending] as const` |
| useState + useTransition repetidos em cada form | Um unico useFormState reutilizado |
| `handleSignIn` (nome especifico no hook) | `handleSubmit` (nome generico no hook) |
| initialState obrigatorio em todo form | initialState opcional com default sensato |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
