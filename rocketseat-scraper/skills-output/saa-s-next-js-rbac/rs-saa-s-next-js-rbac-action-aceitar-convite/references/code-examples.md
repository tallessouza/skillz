# Code Examples: Action Aceitar Convite

## Pagina de convite completa — verificacao de autenticacao

```typescript
// app/invite/[id]/page.tsx

import { isAuthenticated } from '@/auth'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export default async function InvitePage({ params }: { params: { id: string } }) {
  const inviteId = params.id
  const invite = await getInvite(inviteId) // fetch invite details

  const isUserAuthenticated = isAuthenticated() // sync — apenas checa cookies

  // Cenario 1: nao autenticado
  if (!isUserAuthenticated) {
    async function signInToAcceptTheInvite() {
      'use server'
      cookies().set('inviteId', inviteId)
      redirect(`/auth/sign-in?email=${invite.email}`)
    }

    return (
      <form action={signInToAcceptTheInvite}>
        <Button type="submit" variant="secondary" className="w-full">
          <LogIn className="size-4 mr-2" />
          Sign in to accept the invite
        </Button>
      </form>
    )
  }

  // Pegar email do usuario autenticado
  let currentUserEmail: string | null = null

  if (isUserAuthenticated) {
    const user = await auth()
    currentUserEmail = user.email
  }

  const isAuthenticatedWithSameEmail = currentUserEmail === invite.email

  // Cenario 2: autenticado com mesmo email
  if (isAuthenticatedWithSameEmail) {
    async function acceptInviteAction() {
      'use server'
      await acceptInvite(inviteId)
      redirect(`/org/${invite.organization.slug}`)
    }

    return (
      <form action={acceptInviteAction}>
        <Button type="submit" variant="secondary" className="w-full">
          <CheckCircle className="size-4 mr-2" />
          Join {invite.organization.name}
        </Button>
      </form>
    )
  }

  // Cenario 3: autenticado com email diferente
  // ... tratamento para email incorreto
}
```

## Funcao acceptInvite no HTTP client

```typescript
// http/accept-invite.ts

export async function acceptInvite(inviteId: string) {
  await api.post(`invite/${inviteId}/accept`)
}
```

## Aceitar convite no sign-in action

```typescript
// app/auth/sign-in/actions.ts

import { cookies } from 'next/headers'
import { acceptInvite } from '@/http/accept-invite'

export async function signInWithEmailAndPassword(data: SignInFormData) {
  // ... logica de autenticacao ...

  const inviteId = cookies().get('inviteId')?.value

  if (inviteId) {
    try {
      await acceptInvite(inviteId)
    } catch {
      // silencioso — pode ser email incorreto
    }

    cookies().delete('inviteId')
  }

  // ... redirect ...
}
```

## Aceitar convite no OAuth callback

```typescript
// app/api/auth/callback/route.ts

import { cookies } from 'next/headers'
import { acceptInvite } from '@/http/accept-invite'

export async function GET(request: Request) {
  // ... OAuth callback logic ...
  // ... set auth token ...

  const inviteId = cookies().get('inviteId')?.value

  if (inviteId) {
    try {
      await acceptInvite(inviteId)
    } catch {
      // silencioso
    }

    cookies().delete('inviteId')
  }

  redirect('/')
}
```

## Pre-preenchimento do email no sign-in form

```typescript
// app/auth/sign-in/sign-in-form.tsx
'use client'

import { useSearchParams } from 'next/navigation'

export function SignInForm() {
  const searchParams = useSearchParams()

  return (
    <form>
      <Input
        name="email"
        type="email"
        defaultValue={searchParams.get('email') ?? ''}
      />
      {/* ... */}
    </form>
  )
}
```

## Padrao completo: cookie lifecycle

```
1. Usuario clica "Sign in to accept" na pagina de convite
2. Server action seta cookie: cookies().set('inviteId', inviteId)
3. Redirect para /auth/sign-in?email=convite@email.com
4. Formulario pre-preenche email via searchParams
5. Usuario loga (email/senha ou OAuth)
6. Action de login le cookie: cookies().get('inviteId')?.value
7. Se existe, chama acceptInvite(inviteId) dentro de try/catch
8. Deleta cookie: cookies().delete('inviteId')
9. Redirect para dashboard
```