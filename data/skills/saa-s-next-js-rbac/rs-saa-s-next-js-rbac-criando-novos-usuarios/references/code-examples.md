# Code Examples: Criando Novos Usuarios

## Estrutura de arquivos

```
app/auth/sign-up/
├── page.tsx              # Server Component (layout, metadata)
├── sign-up-form.tsx      # Client Component ('use client')
└── actions.ts            # Server action para signup

http/
└── sign-up.ts            # Funcao HTTP pura
```

## Schema Zod completo

```typescript
import { z } from 'zod'

export const signUpSchema = z
  .object({
    name: z.string().refine(
      (value) => value.split(' ').length > 1,
      { message: 'Please enter your full name.' }
    ),
    email: z.string()
      .email({ message: 'Please provide a valid e-mail.' }),
    password: z.string()
      .min(6, { message: 'Password should have at least 6 characters.' }),
    password_confirmation: z.string(),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.password_confirmation) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Password confirmation does not match.',
        path: ['password_confirmation'],
      })
    }
  })

export type SignUpSchema = z.infer<typeof signUpSchema>
```

## Funcao HTTP (http/sign-up.ts)

```typescript
import { api } from './api-client'

interface SignUpRequest {
  name: string
  email: string
  password: string
}

export async function signUp({ name, email, password }: SignUpRequest) {
  // POST para /users — sem retorno util, sem .json()
  await api('users', {
    method: 'POST',
    body: JSON.stringify({ name, email, password }),
  })
}
```

## Server Action (actions.ts)

```typescript
'use server'

import { signUp } from '@/http/sign-up'
import { signUpSchema } from './sign-up-schema'

export async function signUpAction(data: FormData) {
  const result = signUpSchema.safeParse(Object.fromEntries(data))

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors
    return { success: false, message: null, errors }
  }

  const { name, email, password } = result.data

  try {
    await signUp({ name, email, password })
  } catch (err) {
    return {
      success: false,
      message: 'Unexpected error, try again in a few minutes.',
      errors: null,
    }
  }

  return { success: true, message: null, errors: null }
}
```

## Componente SignUpForm completo

```typescript
'use client'

import { useRouter } from 'next/navigation'
import { Loader2, AlertTriangle } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { useFormState } from '@/hooks/use-form-state'
import { signUpAction } from './actions'
import { signInWithGithub } from '../actions'

export function SignUpForm() {
  const router = useRouter()

  const [{ success, message, errors }, handleSubmit, isPending] =
    useFormState(signUpAction, () => {
      router.push('/auth/sign-in')
    })

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        {success === false && message && (
          <Alert variant="destructive">
            <AlertTriangle className="size-4" />
            <AlertTitle>Sign up failed!</AlertTitle>
            <AlertDescription>
              <p>{message}</p>
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-1">
          <Label htmlFor="name">Name</Label>
          <Input name="name" id="name" />
          {errors?.name && (
            <p className="text-xs font-medium text-red-500 dark:text-red-400">
              {errors.name[0]}
            </p>
          )}
        </div>

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

        <div className="space-y-1">
          <Label htmlFor="password_confirmation">Confirm your password</Label>
          <Input
            name="password_confirmation"
            type="password"
            id="password_confirmation"
          />
          {errors?.password_confirmation && (
            <p className="text-xs font-medium text-red-500 dark:text-red-400">
              {errors.password_confirmation[0]}
            </p>
          )}
        </div>

        <Button className="w-full" type="submit" disabled={isPending}>
          {isPending ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            'Create account'
          )}
        </Button>

        <Button className="w-full" variant="link" size="sm" asChild>
          <a href="/auth/sign-in">Already registered? Sign in</a>
        </Button>
      </form>

      <Separator />

      <form action={signInWithGithub}>
        <Button className="w-full" variant="outline" type="submit">
          Sign up with GitHub
        </Button>
      </form>
    </div>
  )
}
```

## Pagina (page.tsx)

```typescript
import { SignUpForm } from './sign-up-form'

export default function SignUpPage() {
  return (
    <SignUpForm />
  )
}
```

## Validacao de nome completo — variacao

```typescript
// Abordagem basica (usada na aula)
name: z.string().refine(
  (value) => value.split(' ').length > 1,
  { message: 'Please enter your full name.' }
)

// Abordagem mais robusta (trim para evitar espacos extras)
name: z.string()
  .min(1, { message: 'Name is required.' })
  .refine(
    (value) => value.trim().split(/\s+/).length > 1,
    { message: 'Please enter your full name.' }
  )
```