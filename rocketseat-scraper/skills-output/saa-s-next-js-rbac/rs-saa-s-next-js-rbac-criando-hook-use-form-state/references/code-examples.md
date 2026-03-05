# Code Examples: Custom useFormState Hook

## Exemplo completo do hook

```typescript
// src/hooks/use-form-state.ts
import { FormEvent, useState, useTransition } from 'react'

interface FormState {
  success: boolean | null
  message: string | null
  errors: Record<string, string[]> | null
}

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

## Uso no formulario de sign-in (antes)

```typescript
'use client'

import { useState, useTransition, FormEvent } from 'react'
import { signInAction } from './actions'

export function SignInForm() {
  const [isPending, startTransition] = useTransition()
  const [formState, setFormState] = useState({
    success: null as boolean | null,
    message: null as string | null,
    errors: null as Record<string, string[]> | null,
  })

  async function handleSignIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const data = new FormData(form)

    startTransition(async () => {
      const result = await signInAction(data)
      setFormState(result)
    })
  }

  return (
    <form onSubmit={handleSignIn}>
      {formState.success === false && (
        <p className="text-red-500">{formState.message}</p>
      )}

      {formState.errors?.email && (
        <p className="text-red-500">{formState.errors.email[0]}</p>
      )}

      <input name="email" type="email" />
      <input name="password" type="password" />

      <button type="submit" disabled={isPending}>
        {isPending ? 'Entrando...' : 'Entrar'}
      </button>
    </form>
  )
}
```

## Uso no formulario de sign-in (depois, com hook)

```typescript
'use client'

import { useFormState } from '@/hooks/use-form-state'
import { signInAction } from './actions'

export function SignInForm() {
  const [formState, handleSubmit, isPending] = useFormState(signInAction)

  return (
    <form onSubmit={handleSubmit}>
      {formState.success === false && (
        <p className="text-red-500">{formState.message}</p>
      )}

      {formState.errors?.email && (
        <p className="text-red-500">{formState.errors.email[0]}</p>
      )}

      <input name="email" type="email" />
      <input name="password" type="password" />

      <button type="submit" disabled={isPending}>
        {isPending ? 'Entrando...' : 'Entrar'}
      </button>
    </form>
  )
}
```

## Demonstracao do problema sem `as const`

```typescript
// SEM as const — TypeScript infere array generico
function useFormState(action, initialState) {
  // ...
  return [formState, handleSubmit, isPending]
  // Tipo inferido: (FormState | Function | boolean)[]
}

// Resultado: desestruturacao perde tipos
const [formState, handleSubmit, isPending] = useFormState(action)
// formState: FormState | Function | boolean  ← ERRADO
// handleSubmit: FormState | Function | boolean  ← ERRADO

// COM as const — TypeScript infere tupla
function useFormState(action, initialState) {
  // ...
  return [formState, handleSubmit, isPending] as const
  // Tipo inferido: readonly [FormState, Function, boolean]
}

// Resultado: cada posicao tem seu tipo correto
const [formState, handleSubmit, isPending] = useFormState(action)
// formState: FormState  ← CORRETO
// handleSubmit: Function  ← CORRETO
// isPending: boolean  ← CORRETO
```

## Uso com initialState customizado

```typescript
// Quando voce precisa de um estado inicial diferente do padrao
const [formState, handleSubmit, isPending] = useFormState(
  createOrgAction,
  {
    success: null,
    message: null,
    errors: null,
    orgSlug: null, // campo extra especifico deste form
  },
)
```

## Server action compativel

```typescript
// src/app/(auth)/sign-in/actions.ts
'use server'

import { z } from 'zod'

const signInSchema = z.object({
  email: z.string().email('E-mail invalido'),
  password: z.string().min(6, 'Minimo 6 caracteres'),
})

export async function signInAction(data: FormData) {
  const parsed = signInSchema.safeParse(Object.fromEntries(data))

  if (!parsed.success) {
    return {
      success: false,
      message: null,
      errors: parsed.error.flatten().fieldErrors,
    }
  }

  // ... autenticacao

  return {
    success: true,
    message: 'Login realizado com sucesso',
    errors: null,
  }
}
```