# Code Examples: Autenticacao via GitHub

## Exemplo 1: Server action completa

Arquivo: `app/auth/actions.ts`

```typescript
'use server'

import { redirect } from 'next/navigation'
import { env } from '@saas/env'

export async function signInWithGitHub() {
  const githubSignInUrl = new URL(
    'login/oauth/authorize',
    'https://github.com',
  )

  githubSignInUrl.searchParams.set('client_id', env.GITHUB_OAUTH_CLIENT_ID)
  githubSignInUrl.searchParams.set(
    'redirect_uri',
    env.GITHUB_OAUTH_REDIRECT_URI,
  )
  githubSignInUrl.searchParams.set('scope', 'user')

  redirect(githubSignInUrl.toString())
}
```

**Observacoes:**
- `'use server'` no topo marca como server action
- `env` vem de um modulo centralizado de variaveis de ambiente (padrao do projeto)
- `toString()` e necessario porque `redirect()` espera string, nao objeto URL

## Exemplo 2: Botao conectado via form separado

Arquivo: `app/auth/sign-in/sign-in-form.tsx` (trecho relevante)

```tsx
import { signInWithGitHub } from '../actions'

// ... dentro do componente, FORA do form principal de email/senha:

<form action={signInWithGitHub}>
  <Button type="submit" variant="outline" className="w-full">
    <Image src={githubIcon} alt="" className="mr-2 size-4 dark:invert" />
    Sign in with GitHub
  </Button>
</form>
```

**Observacoes:**
- Import vem de `../actions` (um nivel acima, na pasta auth)
- O mesmo padrao se aplica ao `sign-up-form.tsx`
- `type="submit"` e necessario para disparar a form action

## Exemplo 3: Route handler de callback completo

Arquivo: `app/api/auth/callback/route.ts`

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

**Passo a passo:**
1. Extrai `code` dos search params da URL
2. Valida presenca do code (400 se ausente)
3. Envia code para o backend via funcao HTTP tipada
4. Salva token retornado nos cookies
5. Clona URL atual, muda path para `/`, limpa search params
6. Redireciona usuario para URL limpa

## Exemplo 4: Funcao HTTP para comunicacao com backend

Arquivo: `http/sign-in-with-github.ts`

```typescript
import { api } from './api-client'

interface SignInWithGitHubRequest {
  code: string
}

interface SignInWithGitHubResponse {
  token: string
}

export async function signInWithGitHub({
  code,
}: SignInWithGitHubRequest): Promise<SignInWithGitHubResponse> {
  const result = await api
    .post('sessions/github', {
      json: { code },
    })
    .json<SignInWithGitHubResponse>()

  return result
}
```

**Observacoes:**
- Segue o mesmo padrao de `signInWithPassword` — interfaces de request/response + funcao async
- O endpoint `sessions/github` e o do backend que troca code por JWT
- `api` e um client HTTP pre-configurado (ky, axios, etc.)

## Exemplo 5: Variaveis de ambiente necessarias

Arquivo: `.env`

```env
GITHUB_OAUTH_CLIENT_ID=seu_client_id_aqui
GITHUB_OAUTH_CLIENT_SECRET=seu_client_secret_aqui
GITHUB_OAUTH_REDIRECT_URI=http://localhost:3000/api/auth/callback
```

**Observacoes:**
- `CLIENT_SECRET` e usado apenas no backend (troca de code por token)
- `REDIRECT_URI` deve corresponder exatamente ao configurado no GitHub OAuth App
- Em producao, trocar para URL do dominio real

## Estrutura de arquivos resultante

```
app/
├── auth/
│   ├── actions.ts              ← server action compartilhada (signInWithGitHub)
│   ├── sign-in/
│   │   ├── actions.ts          ← action especifica (signInWithEmailAndPassword)
│   │   └── sign-in-form.tsx    ← form com botao GitHub
│   └── sign-up/
│       └── sign-up-form.tsx    ← form com botao GitHub (mesmo import)
├── api/
│   └── auth/
│       └── callback/
│           └── route.ts        ← route handler GET para callback do GitHub
http/
├── sign-in-with-github.ts      ← funcao HTTP tipada
└── sign-in-with-password.ts    ← funcao HTTP existente (mesmo padrao)
```