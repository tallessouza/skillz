# Code Examples: Autenticacao com BetterAuth

## 1. Auth Client completo

```typescript
// src/lib/auth-client.ts
import { createAuthClient } from 'better-auth/react'
import { clientEnv } from './env'

export const authClient = createAuthClient({
  baseURL: clientEnv.NEXT_PUBLIC_API_URL,
})
```

## 2. Client env schema com Zod

```typescript
// src/lib/env.ts
import { z } from 'zod'

// Schema separado para variaveis client-side
const clientEnvSchema = z.object({
  NEXT_PUBLIC_API_URL: z
    .string()
    .url()
    .optional()
    .default('http://localhost:3000'),
})

export const clientEnv = clientEnvSchema.parse({
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
})
```

## 3. .env.local

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

## 4. Header completo com auth

```typescript
// src/components/header.tsx
'use client'

import { authClient } from '@/lib/auth-client'
import { Loader2 } from 'lucide-react'

export function Header() {
  const { data: session, isPending } = authClient.useSession()

  async function handleSignIn() {
    await authClient.signIn.social({
      provider: 'github',
      callbackURL: '/',
    })
  }

  async function handleSignOut() {
    await authClient.signOut()
  }

  return (
    <header className="flex items-center justify-between p-4">
      <h1>Board App</h1>

      {isPending ? (
        // Estado: carregando sessao
        <div className="size-8 rounded-full bg-zinc-800 flex items-center justify-center">
          <Loader2 className="size-3.5 text-zinc-200 animate-spin" />
        </div>
      ) : session?.user ? (
        // Estado: usuario logado — mostra avatar, clique para logout
        <button
          onClick={handleSignOut}
          className="size-8 rounded-full overflow-hidden cursor-pointer"
        >
          <img
            src={session.user.image ?? ''}
            alt={session.user.name ?? ''}
            className="size-8 rounded-full"
          />
        </button>
      ) : (
        // Estado: deslogado — botao de login
        <button
          onClick={handleSignIn}
          className="size-8 rounded-full bg-zinc-800 flex items-center justify-center cursor-pointer"
        >
          Login
        </button>
      )}
    </header>
  )
}
```

## 5. Cookies gerados pelo BetterAuth

Apos login bem-sucedido, o BetterAuth seta automaticamente dois cookies:

| Cookie | Proposito |
|--------|-----------|
| `better-auth.session_token` | Token da sessao ativa |
| `better-auth.state` | Estado do OAuth flow |

Voce nao precisa gerenciar esses cookies manualmente — o `authClient` os envia automaticamente em cada requisicao.

## 6. Backend reference (como o BetterAuth esta configurado)

```typescript
// api/auth.ts (backend — apenas referencia, nao faz parte do front-end)
import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { db } from './db'

export const auth = betterAuth({
  database: drizzleAdapter(db),
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    },
  },
})

// Rotas automaticas
app.on(['POST', 'GET'], '/auth/*', (c) => auth.handler(c.req.raw))
```

## 7. Middleware de protecao de rotas (backend)

```typescript
// Hook que busca sessao e bloqueia se nao autenticado
const requireAuth = async (c, next) => {
  const session = await auth.api.getSession({ headers: c.req.raw.headers })
  if (!session) {
    return c.json({ error: 'Unauthorized' }, 401)
  }
  c.set('user', session.user)
  await next()
}

// Uso: rota protegida
app.use('/comments/*', requireAuth)
app.post('/comments', async (c) => {
  const user = c.get('user') // garantido pelo requireAuth
  // ...
})
```

## 8. Variacao: login com email/senha

```typescript
// Se voce quiser adicionar email/senha alem de social login
async function handleEmailSignIn(email: string, password: string) {
  await authClient.signIn.email({
    email,
    password,
  })
}

async function handleEmailSignUp(name: string, email: string, password: string) {
  await authClient.signUp.email({
    name,
    email,
    password,
  })
}
```