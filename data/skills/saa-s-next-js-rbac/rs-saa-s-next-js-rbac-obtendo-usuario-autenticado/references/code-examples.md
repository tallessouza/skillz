# Code Examples: Obtendo Usuario Autenticado

## Estrutura de arquivos

```
src/
├── app/
│   ├── api/
│   │   └── auth/
│   │       ├── callback/
│   │       │   └── route.ts        # OAuth callback (ja existente)
│   │       └── sign-out/
│   │           └── route.ts        # Novo: limpa cookies e redireciona
│   ├── auth/
│   │   └── sign-in/
│   │       └── page.tsx
│   └── page.tsx                    # Home — usa auth()
├── auth.ts                         # Funcao auth()
└── http/
    ├── api-client.ts               # Ky client com interceptor
    └── get-profile.ts              # GET /profile
```

## auth.ts completo

```typescript
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { getProfile } from '@/http/get-profile'

export async function auth() {
  const token = cookies().get('token')?.value

  if (!token) {
    redirect('/auth/sign-in')
  }

  try {
    const { user } = await getProfile()
    return { user }
  } catch {}

  redirect('/api/auth/sign-out')
}
```

## Route handler sign-out

```typescript
// app/api/auth/sign-out/route.ts
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const redirectUrl = request.nextUrl.clone()
  redirectUrl.pathname = '/auth/sign-in'

  cookies().delete('token')

  return NextResponse.redirect(redirectUrl)
}
```

## API client com interceptor de autenticacao

```typescript
// http/api-client.ts
import ky from 'ky'
import { getCookie } from 'cookies-next'
import type { CookiesFn } from 'cookies-next/lib/types'

export const api = ky.create({
  prefixUrl: 'http://localhost:3333',
})

api.interceptors.request.use(async (request) => {
  let cookieStore: CookiesFn | undefined

  if (typeof window === 'undefined') {
    const { cookies: serverCookies } = await import('next/headers')
    cookieStore = serverCookies
  }

  const token = getCookie('token', { cookies: cookieStore })

  if (token) {
    request.headers.set('Authorization', `Bearer ${token}`)
  }

  return request
})
```

## Funcao HTTP get-profile

```typescript
// http/get-profile.ts
import { api } from './api-client'

interface GetProfileResponse {
  user: {
    id: string
    name: string | null
    email: string
    avatarUrl: string | null
  }
}

export async function getProfile() {
  const result = await api.get('profile').json<GetProfileResponse>()
  return result
}
```

## Usando auth() em server component

```typescript
// app/page.tsx
import { auth } from '@/auth'

export default async function Home() {
  const { user } = await auth()

  return (
    <pre>{JSON.stringify(user, null, 2)}</pre>
  )
}
```

## Pacotes necessarios

```bash
npm i cookies-next
# cookies-next permite trabalhar com cookies tanto no server quanto no client
# sem precisar importar next/headers estaticamente
```

## Alternativa: sem cookies-next (so server-side)

Se a funcao auth so roda em server components e o API client so eh usado no servidor, nao precisa do `cookies-next`:

```typescript
// Versao simplificada — so funciona server-side
import { cookies } from 'next/headers'

api.interceptors.request.use(async (request) => {
  const token = cookies().get('token')?.value

  if (token) {
    request.headers.set('Authorization', `Bearer ${token}`)
  }

  return request
})
```

Porem, se qualquer client component usar o API client, essa abordagem quebra. A versao com `cookies-next` + dynamic import eh mais segura para projetos reais.