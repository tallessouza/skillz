---
name: rs-next-js-autenticacao-com-better-auth
description: "Applies BetterAuth authentication patterns when building Next.js apps with social login, session management, and auth state UI. Use when user asks to 'add authentication', 'implement login', 'add social login', 'setup BetterAuth', or 'handle user session' in Next.js projects. Covers auth client setup, sign-in/sign-out flows, session hooks, and conditional UI rendering. Make sure to use this skill whenever implementing auth in Next.js with BetterAuth. Not for backend BetterAuth configuration, database schema design, or non-BetterAuth auth libraries."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: next-js
  module: autenticacao
  tags: [better-auth, authentication, social-login, session, next-js, github-oauth, useSession]
---

# Autenticacao com BetterAuth no Next.js

> Configure o auth client no front-end, use social login com um provider, e controle o estado de sessao para renderizar UI condicional.

## Rules

1. **Crie o auth client em `lib/auth-client.ts`** — separado da config do backend, porque o client roda no browser e precisa apenas da baseURL da API
2. **Use `createAuthClient` de `better-auth/react`** — ele fornece hooks React como `useSession` alem das funcoes de sign-in/sign-out
3. **Valide a URL da API com schema de env** — crie um `ClientEnvSchema` separado do server env, porque variaveis client-side usam prefixo `NEXT_PUBLIC_`
4. **Use `signIn.social()` para login com provider** — passe `provider` e `callbackURL` para controlar o redirecionamento pos-autenticacao
5. **Use `useSession()` para estado de autenticacao** — retorna `data` (session) e `isPending` (loading), porque a sessao precisa ser buscada da API via `getSession`
6. **Trate tres estados de UI** — loading (isPending), logado (session.user existe), e deslogado, porque o F5 dispara uma requisicao async para buscar a sessao

## How to write

### Auth Client setup

```typescript
// lib/auth-client.ts
import { createAuthClient } from 'better-auth/react'
import { clientEnv } from './env'

export const authClient = createAuthClient({
  baseURL: clientEnv.NEXT_PUBLIC_API_URL,
})
```

### Client env validation

```typescript
// lib/env.ts (client-side)
import { z } from 'zod'

const clientEnvSchema = z.object({
  NEXT_PUBLIC_API_URL: z.string().url().optional().default('http://localhost:3000'),
})

export const clientEnv = clientEnvSchema.parse({
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
})
```

### Sign-in e sign-out

```typescript
async function handleSignIn() {
  await authClient.signIn.social({
    provider: 'github',
    callbackURL: '/',
  })
}

async function handleSignOut() {
  await authClient.signOut()
}
```

### Session hook com UI condicional

```typescript
const { data: session, isPending } = authClient.useSession()

// No JSX: tres estados
{isPending ? (
  <div className="size-8 rounded-full bg-zinc-800 flex items-center justify-center">
    <Loader2 className="size-3.5 text-zinc-200 animate-spin" />
  </div>
) : session?.user ? (
  <button onClick={handleSignOut} className="size-8 rounded-full overflow-hidden cursor-pointer">
    <img
      src={session.user.image ?? ''}
      alt={session.user.name ?? ''}
      className="size-8 rounded-full"
    />
  </button>
) : (
  <button onClick={handleSignIn}>Login</button>
)}
```

## Example

**Before (sem autenticacao):**
```typescript
// Header com botao estatico
export function Header() {
  return (
    <header>
      <button>Login</button>
    </header>
  )
}
```

**After (com BetterAuth):**
```typescript
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
    <header>
      {isPending ? (
        <div className="size-8 rounded-full bg-zinc-800 flex items-center justify-center">
          <Loader2 className="size-3.5 text-zinc-200 animate-spin" />
        </div>
      ) : session?.user ? (
        <button onClick={handleSignOut} className="size-8 rounded-full overflow-hidden cursor-pointer">
          <img src={session.user.image ?? ''} alt={session.user.name ?? ''} className="size-8 rounded-full" />
        </button>
      ) : (
        <button onClick={handleSignIn}>Login</button>
      )}
    </header>
  )
}
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Apenas login social (GitHub, Google) | Use `signIn.social({ provider, callbackURL })` |
| Login com email/senha | Use `signIn.email({ email, password })` |
| Verificar auth no client | Use `authClient.useSession()` hook |
| Imagem do usuario pode ser null | Fallback com string vazia `image ?? ''` |
| Variavel de ambiente no client | Prefixo `NEXT_PUBLIC_` obrigatorio |
| Mostrar loading enquanto busca sessao | Use `isPending` do `useSession()` |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `fetch('/api/auth/session')` manual | `authClient.useSession()` |
| Guardar token no localStorage | BetterAuth usa cookies automaticamente (SessionToken + State) |
| Verificar auth apenas com boolean | Tratar 3 estados: loading, logado, deslogado |
| Env client-side sem `NEXT_PUBLIC_` | `NEXT_PUBLIC_API_URL` com prefixo |
| Auth client e server config no mesmo arquivo | Separar `auth-client.ts` (client) de `auth.ts` (server) |

## Troubleshooting

### Session undefined em Server Component
**Symptom:** `getServerSession()` retorna null mesmo com usuario logado
**Cause:** AuthOptions nao esta configurado corretamente ou cookies nao estao sendo passados
**Fix:** Verificar que `authOptions` esta exportado e importado corretamente. Em App Router, usar `cookies()` do next/headers para acessar session

### Redirect loop apos login
**Symptom:** Apos fazer login, pagina redireciona infinitamente
**Cause:** Middleware de autenticacao redireciona para login, e login redireciona de volta
**Fix:** Adicionar excecao no middleware para a rota de login/callback. Verificar a logica de redirect apos autenticacao bem-sucedida

## Deep reference library

- [deep-explanation.md](../../../data/skills/next-js/rs-next-js-autenticacao-com-better-auth/references/deep-explanation.md) — O BetterAuth integra com o Drizzle ORM e o banco de dados da aplicacao. Ele cria automaticamente uma
- [code-examples.md](../../../data/skills/next-js/rs-next-js-autenticacao-com-better-auth/references/code-examples.md) — // src/lib/auth-client.ts
