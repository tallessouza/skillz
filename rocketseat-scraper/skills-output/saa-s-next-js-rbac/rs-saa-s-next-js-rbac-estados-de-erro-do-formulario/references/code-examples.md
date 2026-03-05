# Code Examples: Estados de Erro do Formulário

## Schema de validação completo

```typescript
import { z } from 'zod'

const signInSchema = z.object({
  email: z.string().email('Please provide a valid e-mail address.'),
  password: z.string().min(1, 'Please provide your password.'),
})
```

O `.min(1)` no password serve como validação de obrigatoriedade — strings vazias têm length 0.

## Server Action completa

```typescript
'use server'

import { HTTPError } from 'ky'
import { z } from 'zod'

const signInSchema = z.object({
  email: z.string().email('Please provide a valid e-mail address.'),
  password: z.string().min(1, 'Please provide your password.'),
})

export async function signInAction(_: unknown, data: FormData) {
  const result = signInSchema.safeParse(Object.fromEntries(data))

  if (!result.success) {
    return {
      success: false,
      message: null,
      errors: result.error.flatten().fieldErrors,
    }
  }

  const { email, password } = result.data

  try {
    const { token } = await api
      .post('sessions', {
        json: { email, password },
      })
      .json<{ token: string }>()

    // salvar token em cookies, redirect, etc.
  } catch (error) {
    if (error instanceof HTTPError) {
      const { message } = await error.response.json<{ message: string }>()

      return {
        success: false,
        message,
        errors: null,
      }
    }

    console.error(error)

    return {
      success: false,
      message: 'Unexpected error, try again in a few minutes.',
      errors: null,
    }
  }

  return {
    success: true,
    message: null,
    errors: null,
  }
}
```

Nota: o parâmetro `previousState` é renomeado para `_` quando não utilizado, para não ocupar espaço visual.

## Componente de formulário completo

```tsx
'use client'

import { useActionState } from 'react'
import { AlertTriangle } from 'lucide-react'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

import { signInAction } from './actions'

export function SignInForm() {
  const [{ success, message, errors }, formAction, isPending] = useActionState(
    signInAction,
    { success: false, message: null, errors: null },
  )

  return (
    <form action={formAction} className="space-y-4">
      {success === false && message && (
        <Alert variant="destructive">
          <AlertTriangle className="size-4" />
          <AlertTitle>Sign in failed!</AlertTitle>
          <AlertDescription>
            <p>{message}</p>
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-1">
        <Label htmlFor="email">E-mail</Label>
        <Input name="email" type="email" id="email" />
        {errors?.email && (
          <p className="text-xs font-medium text-red-500 dark:text-red-400">
            {errors.email[0]}
          </p>
        )}
      </div>

      <div className="space-y-1">
        <Label htmlFor="password">Password</Label>
        <Input name="password" type="password" id="password" />
        {errors?.password && (
          <p className="text-xs font-medium text-red-500 dark:text-red-400">
            {errors.password[0]}
          </p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={isPending}>
        Sign in with e-mail
      </Button>
    </form>
  )
}
```

## flatten().fieldErrors — o que retorna

```typescript
// Dado um ZodError com erros em email e password:
result.error.flatten().fieldErrors
// Retorna:
// {
//   email: ['Please provide a valid e-mail address.'],
//   password: ['Please provide your password.'],
// }
```

Cada campo é uma key com um array de strings (pode haver múltiplos erros por campo). No componente, usa-se `[0]` para exibir apenas o primeiro.

## Customização do Alert destructive para dark mode

```tsx
<Alert
  variant="destructive"
  className="dark:border-red-400 dark:text-red-400 [&>svg]:dark:text-red-400"
>
```

O tema padrão do ShadCN usa uma cor "destructive" que pode não ficar ideal no dark mode. A customização inline troca para tons de red-400 (dark) e red-500 (light).