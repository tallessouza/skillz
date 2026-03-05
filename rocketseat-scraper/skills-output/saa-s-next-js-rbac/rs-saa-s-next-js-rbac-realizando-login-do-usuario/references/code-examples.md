# Code Examples: Autenticacao com Cookies e Redirect no Next.js

## 1. Server action completa de login

```typescript
'use server'

import { cookies } from 'next/headers'

interface SignInResult {
  success: boolean
  message: string | null
}

export async function signInWithCredentials(data: FormData): Promise<SignInResult> {
  const email = data.get('email') as string
  const password = data.get('password') as string

  try {
    const response = await fetch('http://localhost:3333/sessions/password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })

    if (!response.ok) {
      const error = await response.json()
      return { success: false, message: error.message }
    }

    const { token } = await response.json()

    cookies().set('token', token, {
      maxAge: 60 * 60 * 24 * 7, // 7 dias
      path: '/',
    })
  } catch (error) {
    return { success: false, message: 'Erro ao fazer login.' }
  }

  // redirect() iria aqui se fosse chamado via form action
  // Como usamos await, retornamos success e redirecionamos no client
  return { success: true, message: null }
}
```

## 2. Hook useFormState com callback onSuccess

```typescript
'use client'

import { useRouter } from 'next/navigation'
import { FormEvent, useState } from 'react'

interface ActionResult {
  success: boolean
  message: string | null
}

interface UseFormStateOptions {
  action: (data: FormData) => Promise<ActionResult>
  onSuccess?: () => void | Promise<void>
}

function useFormState({ action, onSuccess }: UseFormStateOptions) {
  const [state, setState] = useState<ActionResult>({ success: false, message: null })
  const [isPending, setIsPending] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsPending(true)

    const formData = new FormData(event.currentTarget)
    const result = await action(formData)
    setState(result)

    if (result.success && onSuccess) {
      await onSuccess()
    }

    setIsPending(false)
  }

  return { state, handleSubmit, isPending }
}
```

## 3. Componente de login usando o hook

```typescript
'use client'

import { useRouter } from 'next/navigation'
import { signInWithCredentials } from './actions'

export function SignInForm() {
  const router = useRouter()

  const { state, handleSubmit, isPending } = useFormState({
    action: signInWithCredentials,
    onSuccess: () => router.push('/'),
  })

  return (
    <form onSubmit={handleSubmit}>
      <input type="email" name="email" placeholder="E-mail" />
      <input type="password" name="password" placeholder="Senha" />

      {state.message && <p className="text-red-500">{state.message}</p>}

      <button type="submit" disabled={isPending}>
        {isPending ? 'Carregando...' : 'Sign In'}
      </button>
    </form>
  )
}
```

## 4. Funcao isAuthenticated

```typescript
// src/auth/auth.ts
import { cookies } from 'next/headers'

export function isAuthenticated() {
  return !!cookies().get('token')?.value
}
```

O `?.value` e necessario porque `cookies().get('token')` retorna um objeto `{ name: string, value: string }` ou `undefined`. Sem o optional chaining, daria erro se o cookie nao existisse.

## 5. Layout protegendo rotas de auth

```typescript
// app/(auth)/layout.tsx
import { isAuthenticated } from '@/auth/auth'
import { redirect } from 'next/navigation'

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  if (isAuthenticated()) {
    redirect('/')
  }

  return <>{children}</>
}
```

Nota: o layout NAO precisa de `await` antes de `isAuthenticated()` porque a funcao nao e async — `cookies()` e sincrono em server components.

## 6. Configuracao de cookie — variacoes de maxAge

```typescript
// 7 dias (padrao usado na aula)
cookies().set('token', token, {
  maxAge: 60 * 60 * 24 * 7,
  path: '/',
})

// 30 dias
cookies().set('token', token, {
  maxAge: 60 * 60 * 24 * 30,
  path: '/',
})

// Cookie restrito a rotas /app/*
cookies().set('token', token, {
  maxAge: 60 * 60 * 24 * 7,
  path: '/app',
})
```