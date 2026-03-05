---
name: rs-next-js-encerramento-91
description: "Enforces proper post-logout redirect in Next.js server-rendered pages using useRouter. Use when user asks to 'implement logout', 'fix auth state after signout', 'handle SSR auth redirect', or 'server component not updating after logout'. Ensures stale server-rendered auth state is cleared by navigating after logout. Make sure to use this skill whenever implementing authentication flows in Next.js App Router. Not for client-side-only auth state management or API route logic."
---

# Redirect Apos Logout em Paginas Server-Rendered

> Apos logout, force uma navegacao com `useRouter` para que o conteudo server-rendered seja recalculado do zero.

## Rules

1. **Sempre redirecione apos logout** — use `router.push('/')` no callback de sucesso do logout, porque paginas server-rendered nao atualizam automaticamente no cliente
2. **Use useRouter do Next.js** — `import { useRouter } from 'next/navigation'`, porque e o metodo correto no App Router para navegacao programatica
3. **Coloque o redirect no onSuccess** — nao no corpo principal do componente, porque o redirect so deve acontecer apos confirmar que o logout foi bem-sucedido

## How to write

### Logout com redirect

```typescript
'use client'

import { useRouter } from 'next/navigation'

function LogoutButton() {
  const router = useRouter()

  async function handleLogout() {
    await signOut({
      onSuccess: () => {
        router.push('/')
      }
    })
  }

  return <button onClick={handleLogout}>Logout</button>
}
```

## Example

**Before (bug: pagina server-rendered mostra estado autenticado apos logout):**
```typescript
async function handleLogout() {
  await signOut()
  // Nada acontece — pagina SSR continua mostrando conteudo autenticado
}
```

**After (com redirect que forca recalculo do server-side):**
```typescript
async function handleLogout() {
  await signOut({
    onSuccess: () => {
      router.push('/')
    }
  })
}
```

## Heuristics

| Situacao | Acao |
|----------|------|
| Logout em pagina com Server Components | Sempre redirecionar para forcar re-render server-side |
| Logout em pagina 100% Client Component | Redirect ainda recomendado, mas estado local tambem funciona |
| Conteudo autenticado nao atualiza apos acao | Verificar se e Server Component — provavelmente precisa de navegacao |

## Anti-patterns

| Nunca faca | Faca isso |
|------------|-----------|
| `signOut()` sem redirect em pagina SSR | `signOut({ onSuccess: () => router.push('/') })` |
| `window.location.reload()` apos logout | `router.push('/')` — navegacao Next.js preserva o framework |
| Esperar que Server Components reajam a mudanca de estado no cliente | Forcar nova navegacao para recalcular no servidor |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/next-js/rs-next-js-encerramento-91/references/deep-explanation.md)
- [Code examples](../../../data/skills/next-js/rs-next-js-encerramento-91/references/code-examples.md)
