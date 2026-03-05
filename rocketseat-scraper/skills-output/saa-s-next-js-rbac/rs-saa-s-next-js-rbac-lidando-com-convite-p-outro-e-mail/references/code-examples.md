# Code Examples: Lidando com Convite para Outro E-mail

## Estrutura da pagina de convite completa

```tsx
// app/invite/[id]/page.tsx
import { auth } from '@/lib/auth'
import { getInvite } from '@/http/get-invite'
import { Button } from '@/components/ui/button'
import { LogOut } from 'lucide-react'

export default async function InvitePage({
  params,
}: {
  params: { id: string }
}) {
  const { id } = params
  const { invite } = await getInvite(id)
  const session = await auth()

  const isAuthenticated = !!session?.user
  const currentUserEmail = session?.user?.email

  // Caso 1: logado mas e-mail diferente
  if (isAuthenticated && currentUserEmail !== invite.email) {
    return (
      <div className="space-y-4">
        <p className="text-balance text-center text-sm leading-relaxed text-muted-foreground">
          This invite was sent to{' '}
          <span className="text-foreground font-medium">{invite.email}</span>
          {' '}but you are authenticated as{' '}
          <span className="text-foreground font-medium">
            {currentUserEmail}
          </span>
        </p>

        <div className="space-y-2">
          <Button variant="secondary" className="w-full" asChild>
            <a href="/api/auth/sign-out">
              <LogOut className="mr-2 size-4" />
              Sign out from {currentUserEmail}
            </a>
          </Button>

          <Button variant="outline" className="w-full" asChild>
            <a href="/">Back to dashboard</a>
          </Button>
        </div>
      </div>
    )
  }

  // Caso 2: logado com e-mail correto
  if (isAuthenticated) {
    return (
      <div>
        <p>You were invited to join {invite.organization.name}</p>
        <Button onClick={acceptInvite}>Accept Invite</Button>
      </div>
    )
  }

  // Caso 3: nao logado
  return (
    <div>
      <p>Sign in to accept this invite</p>
      <Button asChild>
        <a href="/auth/sign-in">Sign In</a>
      </Button>
    </div>
  )
}
```

## Por que `<a>` em vez de `<Link>` para sign-out

```tsx
// ERRADO: Next.js faz prefetch e desliga o usuario antes de clicar
import Link from 'next/link'

<Button asChild>
  <Link href="/api/auth/sign-out">Sign out</Link>
</Button>

// CORRETO: ancora nativa nao faz prefetch
<Button asChild>
  <a href="/api/auth/sign-out">Sign out</a>
</Button>
```

## Rota de sign-out referenciada

```ts
// app/api/auth/sign-out/route.ts
import { NextResponse } from 'next/server'

export async function GET() {
  // Limpa cookies de sessao
  const response = NextResponse.redirect(new URL('/auth/sign-in', process.env.NEXT_PUBLIC_URL))
  response.cookies.delete('token')
  return response
}
```

## Listando convites pendentes no dashboard

```tsx
// Componente para exibir convites pendentes
async function PendingInvites() {
  const { user } = await auth()
  const { invites } = await getPendingInvites(user.email)

  if (invites.length === 0) return null

  return (
    <div>
      <h2>Pending Invites</h2>
      {invites.map((invite) => (
        <div key={invite.id}>
          <p>
            You were invited to join {invite.organization.name}
          </p>
          <div className="space-x-2">
            <Button onClick={() => acceptInvite(invite.id)}>Accept</Button>
            <Button variant="outline" onClick={() => rejectInvite(invite.id)}>
              Reject
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}
```