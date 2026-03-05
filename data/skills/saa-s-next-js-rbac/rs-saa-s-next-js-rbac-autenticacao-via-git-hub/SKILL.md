---
name: rs-saas-nextjs-rbac-auth-github
description: "Applies GitHub OAuth login flow in Next.js App Router when user asks to 'implement GitHub login', 'add OAuth authentication', 'sign in with GitHub', 'social login', or 'GitHub callback route'. Generates server action for redirect, API route handler for callback, and cookie-based token storage. Make sure to use this skill whenever implementing OAuth with GitHub in Next.js projects. Not for credential-based login, JWT generation, or backend OAuth logic."
---

# Autenticacao via GitHub (Next.js App Router)

> Implementar login com GitHub requer tres partes: server action de redirecionamento, route handler de callback, e chamada HTTP ao backend para trocar code por token.

## Rules

1. **Server action de redirect fica na raiz do grupo auth** — porque o botao de GitHub login aparece em multiplas paginas (sign-in e sign-up), a action deve ser compartilhada, nao duplicada por pagina
2. **Use o construtor `new URL()` para montar a URL do GitHub** — porque permite manipular search params de forma segura sem concatenacao manual de strings
3. **Scope minimo necessario** — solicite apenas `user:email` ou `user`, porque pedir permissoes excessivas reduz taxa de conversao do OAuth
4. **Route handler GET para o callback** — porque o GitHub redireciona via GET com o `code` como query param
5. **Clone `request.nextUrl` para redirect** — porque Next.js exige URL completa (com host) no redirect, e clonar preserva o origin correto
6. **Limpe search params antes do redirect final** — porque o `code` do OAuth nao deve aparecer na URL do usuario logado
7. **Salve o token nos cookies imediatamente** — porque server actions e route handlers tem acesso direto a `cookies()` do `next/headers`

## Steps

### Step 1: Criar server action compartilhada

Criar `app/auth/actions.ts` (na raiz do grupo auth, nao dentro de sign-in ou sign-up):

```typescript
'use server'

import { redirect } from 'next/navigation'

export async function signInWithGitHub() {
  const githubSignInUrl = new URL(
    'login/oauth/authorize',
    'https://github.com',
  )

  githubSignInUrl.searchParams.set('client_id', env.GITHUB_OAUTH_CLIENT_ID)
  githubSignInUrl.searchParams.set('redirect_uri', env.GITHUB_OAUTH_REDIRECT_URI)
  githubSignInUrl.searchParams.set('scope', 'user')

  redirect(githubSignInUrl.toString())
}
```

### Step 2: Conectar botao ao form separado

Envolver o botao GitHub em seu proprio `<form>` com a action apontando para a server action, porque um botao dentro de outro form dispara o submit do form pai:

```tsx
<form action={signInWithGitHub}>
  <Button type="submit" variant="outline" className="w-full">
    Sign in with GitHub
  </Button>
</form>
```

### Step 3: Criar route handler de callback

Criar `app/api/auth/callback/route.ts`:

```typescript
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { signInWithGitHub } from '@/http/sign-in-with-github'

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const code = searchParams.get('code')

  if (!code) {
    return NextResponse.json(
      { message: 'GitHub OAuth code was not found.' },
      { status: 400 },
    )
  }

  const { token } = await signInWithGitHub({ code })

  cookies().set('token', token, {
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  })

  const redirectUrl = request.nextUrl.clone()
  redirectUrl.pathname = '/'
  redirectUrl.search = ''

  return NextResponse.redirect(redirectUrl)
}
```

### Step 4: Criar funcao HTTP para trocar code por token

```typescript
import { api } from './api-client'

interface SignInWithGitHubRequest {
  code: string
}

interface SignInWithGitHubResponse {
  token: string
}

export async function signInWithGitHub({ code }: SignInWithGitHubRequest) {
  const result = await api.post('sessions/github', { json: { code } })
    .json<SignInWithGitHubResponse>()

  return result
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Botao OAuth dentro de form existente | Extraia para form proprio com `action={serverAction}` |
| Multiplas paginas usam mesmo botao OAuth | Coloque a server action no nivel compartilhado mais proximo |
| Redirect apos login | Clone `request.nextUrl`, mude pathname, limpe search params |
| Token retornado do backend | Salve em cookie via `cookies().set()` no route handler |

## Anti-patterns

| Nunca faca | Faca assim |
|------------|------------|
| Concatenar URL do GitHub manualmente | Use `new URL()` + `searchParams.set()` |
| `redirect('/')` no route handler | `NextResponse.redirect(redirectUrl)` com URL completa |
| Deixar `code` na URL apos login | `redirectUrl.search = ''` antes do redirect |
| Duplicar action em sign-in e sign-up | Uma action em `auth/actions.ts` compartilhada |
| `onClick` para chamar server action | `<form action={fn}>` com `type="submit"` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
