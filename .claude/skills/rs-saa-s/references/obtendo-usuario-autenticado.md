---
name: rs-saas-nextjs-rbac-obtendo-usuario-autenticado
description: "Applies authenticated request patterns in Next.js when building auth flows with cookies and API clients. Use when user asks to 'get logged user', 'add auth token to requests', 'handle cookies in Next.js server and client', 'create auth function', or 'intercept API requests with token'. Ensures correct cookie handling across server components and client components using dynamic imports. Make sure to use this skill whenever implementing authentication flows in Next.js with separate API backends. Not for OAuth provider setup, JWT creation, or database session management."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: saa-s-next-js-rbac
  module: autenticacao
  tags: [saas, nextjs, jwt, oauth, github, server-actions]
---

# Obtendo Usuario Autenticado no Next.js

> Requisicoes autenticadas no Next.js exigem tratamento diferenciado de cookies entre server-side e client-side, usando dynamic imports para evitar erros de compilacao.

## Rules

1. **Funcao `auth` so roda em server components** — use `redirect` do `next/navigation` porque server components suportam redirecionamento direto
2. **Nunca use `redirect` dentro de try/catch** — o Next.js lanca excecoes internas no redirect que seriam capturadas pelo catch, quebrando o fluxo
3. **Delete cookies via route handler, nao em funcoes comuns** — cookies so podem ser modificados em server actions ou route handlers, nunca em funcoes utilitarias
4. **Use dynamic import para `next/headers`** — importar `cookies` de `next/headers` estaticamente em arquivo usado por client components causa erro de compilacao
5. **Detecte server-side com `typeof window === 'undefined'`** — unica forma confiavel de distinguir execucao servidor vs cliente no Next.js
6. **Use interceptors (hooks) no API client para injetar token** — centraliza a logica de autenticacao em um unico lugar ao inves de passar token em cada requisicao

## How to write

### Funcao auth (server component only)

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

### Route handler para sign-out (limpar cookies)

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

### Interceptor com cookies dual-side (server + client)

```typescript
import { getCookie } from 'cookies-next'
import type { CookiesFn } from 'cookies-next/lib/types'
import { api } from './api-client'

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

## Example

**Before (token nao enviado, requisicao sempre falha):**
```typescript
// API client sem interceptor — token nunca eh enviado
const { user } = await getProfile() // 401 sempre
```

**After (interceptor injeta token automaticamente):**
```typescript
// Interceptor configurado uma vez no api-client
// Toda requisicao recebe o token dos cookies automaticamente
const { user } = await getProfile() // funciona em server e client
```

## Heuristics

| Situacao | Acao |
|----------|------|
| Funcao chamada apenas em server components | Use `cookies()` de `next/headers` direto |
| Arquivo compartilhado entre server e client | Use `cookies-next` com dynamic import |
| Precisa deletar cookie | Crie um route handler dedicado (`/api/auth/sign-out`) |
| Redirect apos erro de autenticacao | Coloque o redirect FORA do try/catch |
| Token expirado ou invalido | Delete cookie e redirecione para sign-in |

## Anti-patterns

| Nunca faca | Faca isso |
|------------|-----------|
| `redirect()` dentro de `try/catch` | `redirect()` apos o bloco try/catch |
| `cookies().delete()` em funcao comum | Route handler `/api/auth/sign-out` |
| Import estatico de `next/headers` em arquivo client | `await import('next/headers')` dinamico |
| Passar token manualmente em cada requisicao | Interceptor centralizado no API client |
| Importar `cookies-next` sem instalar | `npm i cookies-next` antes de usar |

## Troubleshooting

### Token invalido ou expirado
**Symptom:** Requisicao autenticada retorna 401
**Cause:** Token JWT expirou ou foi assinado com secret diferente
**Fix:** Verifique que o JWT_SECRET e o mesmo entre geracao e verificacao, e que o token nao expirou

### Server action nao executa
**Symptom:** Formulario submete mas nada acontece
**Cause:** A funcao nao tem a diretiva 'use server' ou o componente nao esta usando 'use client'
**Fix:** Adicione 'use server' no topo do arquivo da action e 'use client' no componente do formulario

### Cookie nao persiste entre requisicoes
**Symptom:** Token desaparece apos refresh da pagina
**Cause:** Cookie configurado sem `path: '/'` ou com `httpOnly` incorreto
**Fix:** Configure o cookie com `path: '/'` e verifique que `httpOnly` esta correto para o caso de uso

### Componente server/client mismatch
**Symptom:** Erro de hydration ou hooks nao funcionam
**Cause:** Componente que usa hooks (useState, useEffect) nao tem 'use client'
**Fix:** Adicione 'use client' no topo do arquivo do componente que usa hooks ou event handlers

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
