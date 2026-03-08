---
name: rs-next-js-encerramento-91
description: "Enforces proper post-logout redirect in Next.js server-rendered pages using useRouter. Use when user asks to 'implement logout', 'fix auth state after signout', 'handle SSR auth redirect', or 'server component not updating after logout'. Ensures stale server-rendered auth state is cleared by navigating after logout. Make sure to use this skill whenever implementing authentication flows in Next.js App Router. Not for client-side-only auth state management or API route logic."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: next-js
  module: autenticacao
  tags: [logout, redirect, useRouter, server-components, auth, next-js, ssr]
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

## Troubleshooting

### Erro ao usar hooks em Server Component
**Symptom:** Erro "useState/useEffect is not a function" ou "Hooks can only be called inside a Client Component"
**Cause:** Tentativa de usar hooks React (useState, useEffect, useSession) em um componente sem a diretiva "use client"
**Fix:** Adicionar `"use client"` no topo do arquivo OU extrair a parte interativa para um componente-folha separado com "use client"

### Server Component nao consegue ser async apos adicionar "use client"
**Symptom:** Erro ao usar `async function Component()` com `"use client"`
**Cause:** Client Components nao suportam async/await — essa e uma restricao fundamental do React
**Fix:** Remover "use client" e usar async/await direto (Server Component), ou manter "use client" e buscar dados via hooks (useEffect, React Query)

## Deep reference library

- [deep-explanation.md](../../../data/skills/next-js/rs-next-js-encerramento-91/references/deep-explanation.md) — O instrutor demonstra um cenario comum: o usuario esta logado, navega ate uma pagina de detalhes (qu
- [code-examples.md](../../../data/skills/next-js/rs-next-js-encerramento-91/references/code-examples.md) — O instrutor mostra o fluxo exato do bug e da correcao:
