# Code Examples: useActionState com Server Actions

## 1. Formulario extraido para client component

```typescript
// src/app/auth/sign-in/sign-in-form.tsx
'use client'

import { useActionState } from 'react'
import { Loader2 } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

import githubIcon from '@/assets/github-icon.svg'
import { signInWithEmailAndPassword } from './actions'

export function SignInForm() {
  const [state, formAction, isPending] = useActionState(
    signInWithEmailAndPassword,
    null,
  )

  return (
    <form action={formAction} className="space-y-4">
      <div className="space-y-1">
        <Label htmlFor="email">E-mail</Label>
        <Input name="email" type="email" id="email" />
      </div>

      <div className="space-y-1">
        <Label htmlFor="password">Password</Label>
        <Input name="password" type="password" id="password" />
      </div>

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          'Sign in with e-mail'
        )}
      </Button>

      {state && <h1>{state}</h1>}

      <Button variant="link" className="w-full" size="sm" asChild>
        <Link href="/auth/forgot-password">Forgot your password?</Link>
      </Button>

      <Separator />

      <Button type="submit" variant="outline" className="w-full">
        <Image src={githubIcon} className="mr-2 size-4 dark:invert" alt="" />
        Sign in with GitHub
      </Button>

      <Button variant="link" className="w-full" size="sm" asChild>
        <Link href="/auth/sign-up">Create new account</Link>
      </Button>
    </form>
  )
}
```

## 2. Pagina simplificada (server component)

```typescript
// src/app/auth/sign-in/page.tsx
// SEM 'use client' — permanece server component
import { SignInForm } from './sign-in-form'

export default function SignInPage() {
  return <SignInForm />
}
```

## 3. Server action adaptada para useActionState

```typescript
// src/app/auth/sign-in/actions.ts
'use server'

export async function signInWithEmailAndPassword(
  previousState: unknown,
  data: FormData,
) {
  console.log(previousState) // null na primeira execucao, depois o retorno anterior

  const email = data.get('email')
  const password = data.get('password')

  await new Promise(resolve => setTimeout(resolve, 2000)) // delay para teste

  console.log({ email, password })

  return 'sucesso'
}
```

## 4. Assinatura ANTES vs DEPOIS do useActionState

```typescript
// ANTES (sem useActionState, action direto no form)
export async function signIn(data: FormData) {
  const email = data.get('email')
  // ...
}

// DEPOIS (com useActionState, previousState adicionado)
export async function signIn(previousState: unknown, data: FormData) {
  const email = data.get('email')
  // ...
  return { success: true }
}
```

## 5. Pattern de delay para testar loading em dev

```typescript
// Adicione temporariamente na server action para testar isPending
await new Promise(resolve => setTimeout(resolve, 2000))
// Remova antes de ir para producao
```

## 6. Demonstracao do previousState (caso incremento)

```typescript
// Exemplo conceitual do React docs
// initialState = 0
'use server'
export async function increment(previousState: number, data: FormData) {
  return previousState + 1
  // Primeira chamada: previousState = 0, retorna 1
  // Segunda chamada: previousState = 1, retorna 2
  // Terceira chamada: previousState = 2, retorna 3
}

// No componente:
const [count, formAction, isPending] = useActionState(increment, 0)
// count exibe: 0 -> 1 -> 2 -> 3...
```