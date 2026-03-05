---
name: rs-saas-nextjs-rbac-login-usuario
description: "Applies Next.js authentication patterns with cookies and redirect strategies when building login flows. Use when user asks to 'implement login', 'add authentication', 'handle cookies in Next.js', 'redirect after login', or 'protect routes'. Covers cookie storage via server actions, server-side vs client-side redirect, and route guards with isAuthenticated. Make sure to use this skill whenever implementing auth flows in Next.js App Router. Not for OAuth provider setup, JWT token generation, or backend API authentication logic."
---

# Autenticacao com Cookies e Redirect no Next.js

> Salve tokens em cookies via server actions, redirecione com a estrategia correta (server vs client), e proteja rotas verificando autenticacao.

## Rules

1. **Cookies so podem ser alterados em 3 lugares** — server actions, route handlers (pasta API), e middleware, porque o Next.js restringe acesso a cookies HTTP-only nesses contextos
2. **redirect() nao funciona dentro de try/catch** — use redirect() DEPOIS do bloco try/catch, porque internamente ele lanca um erro especial que o catch captura prematuramente
3. **Server actions chamadas via onSubmit nao propagam redirect** — quando a server action e chamada com await (nao via form action), o redirect interno nao funciona no cliente, use router.push no client-side como fallback
4. **Proteja rotas no layout server component** — verifique autenticacao no layout e use redirect() server-side para impedir acesso a paginas de auth quando ja logado
5. **Cookies precisam de path e maxAge** — sempre defina `path: '/'` para acesso global e `maxAge` em segundos para expiracao, porque sem path o cookie pode ficar restrito a rota atual

## How to write

### Salvando token no cookie (server action)

```typescript
import { cookies } from 'next/headers'

// Dentro da server action de login
cookies().set('token', token, {
  maxAge: 60 * 60 * 24 * 7, // 7 dias em segundos
  path: '/',
})
```

### Redirect server-side vs client-side

```typescript
// SERVER-SIDE: no layout ou page (server component)
import { redirect } from 'next/navigation'
// Usar FORA de try/catch
redirect('/')

// CLIENT-SIDE: quando server action e chamada via await
import { useRouter } from 'next/navigation'
const router = useRouter()
router.push('/')
```

### Callback onSuccess no form hook

```typescript
// No hook de formulario, aceitar callback opcional
interface UseFormOptions {
  action: (data: FormData) => Promise<ActionResult>
  onSuccess?: () => void | Promise<void>
}

// Apos state.success === true
if (state.success && onSuccess) {
  await onSuccess()
}

// No componente
const router = useRouter()
const { handleSubmit } = useFormState({
  action: signInAction,
  onSuccess: () => router.push('/'),
})
```

### Funcao isAuthenticated

```typescript
// src/auth/auth.ts
import { cookies } from 'next/headers'

export function isAuthenticated() {
  return !!cookies().get('token')?.value
}
```

### Protegendo rotas no layout

```typescript
// app/(auth)/layout.tsx
import { isAuthenticated } from '@/auth/auth'
import { redirect } from 'next/navigation'

export default async function AuthLayout({
  children,
}: { children: React.ReactNode }) {
  if (isAuthenticated()) {
    redirect('/')
  }
  return <>{children}</>
}
```

## Example

**Before (redirect dentro de try/catch, quebra):**
```typescript
async function signIn(data: FormData) {
  try {
    const { token } = await api.login(data)
    cookies().set('token', token)
    redirect('/') // BUG: redirect lanca erro que o catch captura
  } catch (error) {
    return { success: false, message: 'Erro' }
  }
}
```

**After (redirect fora do try/catch + client-side fallback):**
```typescript
async function signIn(data: FormData) {
  try {
    const { token } = await api.login(data)
    cookies().set('token', token, {
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    })
  } catch (error) {
    return { success: false, message: 'Credenciais invalidas.' }
  }
  return { success: true, message: null }
}

// No componente (client-side redirect)
const router = useRouter()
const { handleSubmit } = useFormState({
  action: signIn,
  onSuccess: () => router.push('/'),
})
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Server component precisa redirecionar | `redirect()` de `next/navigation` |
| Client component precisa redirecionar | `useRouter().push()` |
| Server action chamada via form action | `redirect()` funciona direto |
| Server action chamada via await/onSubmit | Retorne resultado, redirecione no client |
| Verificar se usuario esta logado | Cheque cookie `token` existe com valor |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `redirect()` dentro de `try/catch` | `redirect()` apos o bloco try/catch |
| `cookies().set('token', token)` sem path | `cookies().set('token', token, { path: '/', maxAge: ... })` |
| Verificar auth em cada page individualmente | Verificar auth no layout compartilhado |
| `useRouter` em server component | `redirect` de `next/navigation` |
| `redirect` em client component | `useRouter().push()` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/saa-s/rs-saa-s-next-js-rbac-realizando-login-do-usuario/references/deep-explanation.md)
- [Code examples](../../../data/skills/saa-s/rs-saa-s-next-js-rbac-realizando-login-do-usuario/references/code-examples.md)
