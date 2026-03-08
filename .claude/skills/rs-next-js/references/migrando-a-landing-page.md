---
name: rs-next-js-migrando-a-landing-page
description: "Applies Next.js App Router migration patterns when moving code from Pages Router to App Router. Use when user asks to 'migrate to app router', 'convert pages router', 'create app router route', 'add use client', or 'fix server component error'. Covers page.tsx routing, layout.tsx structure, usePathname hook, and use client directive. Make sure to use this skill whenever migrating Next.js projects from Pages Router to App Router. Not for creating new Next.js projects from scratch or API routes."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: next-js
  module: migracao-app-router
  tags: [app-router, migration, pages-router, use-client, usePathname, layout, server-components, next-js]
---

# Migrando de Pages Router para App Router

> Ao migrar para App Router, cada rota exige um arquivo `page.tsx`, componentes sao Server Components por default, e interatividade exige a diretiva `use client`.

## Rules

1. **Rotas usam `page.tsx`, nao `index.tsx`** — na App Router, o arquivo que gera rota no browser se chama `page.tsx` dentro da pasta da rota, porque o Next usa file conventions especificas (`page`, `layout`, `loading`, `error`)
2. **Pages Router e App Router coexistem** — o mesmo projeto pode ter ambas, mas a mesma rota nao pode existir nas duas, porque o Next nao sabe qual renderizar e gera erro de conflito
3. **Todo componente na pasta `app/` e Server Component por default** — incluindo componentes importados, porque o React Server Components e o comportamento padrao da App Router
4. **Interatividade exige `use client`** — se o componente usa eventos, hooks de browser ou APIs do client, adicione `"use client"` no topo do arquivo, porque Server Components nao tem hydration
5. **`layout.tsx` substitui `_app.tsx` + `_document.tsx`** — o layout da App Router e uma combinacao dos dois arquivos especiais da Pages Router, porque unifica configuracao de HTML wrapper e providers
6. **Use `usePathname` no lugar de `useRouter().asPath`** — na App Router, hooks de roteamento mudaram; `usePathname` retorna o path atual e so funciona em Client Components

## How to write

### Estrutura de rota na App Router

```
app/
├── layout.tsx    # Substitui _app.tsx + _document.tsx
├── page.tsx      # Rota raiz (/)
└── blog/
    └── page.tsx  # Rota /blog
```

### Layout raiz

```tsx
// app/layout.tsx
import { Layout } from '@/components/Layout'
import '@/styles/globals.css'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <Layout>{children}</Layout>
      </body>
    </html>
  )
}
```

### Client Component com usePathname

```tsx
"use client"

import { usePathname } from 'next/navigation'
import Link from 'next/link'

export function ActiveLink({ href, children }: ActiveLinkProps) {
  const pathName = usePathname()
  const linkPath = typeof href === 'string' ? href : href.pathname ?? ''

  const isActive = pathName === linkPath || pathName.startsWith(`${linkPath}/`)

  return (
    <Link href={href} className={isActive ? 'active' : ''}>
      {children}
    </Link>
  )
}
```

## Example

**Before (Pages Router):**
```
pages/
├── _app.tsx        # Provider/layout wrapper
├── _document.tsx   # HTML/body customization
├── index.tsx       # Rota /
└── blog/
    └── index.tsx   # Rota /blog
```

```tsx
// components/ActiveLink.tsx (Pages Router)
import { useRouter } from 'next/router'

export function ActiveLink({ href, children }) {
  const { asPath } = useRouter()
  const isActive = asPath === href
  return <Link href={href} className={isActive ? 'active' : ''}>{children}</Link>
}
```

**After (App Router):**
```
app/
├── layout.tsx      # _app + _document unificados
├── page.tsx        # Rota /
└── blog/
    └── page.tsx    # Rota /blog
```

```tsx
// components/ActiveLink.tsx (App Router)
"use client"

import { usePathname } from 'next/navigation'

export function ActiveLink({ href, children }) {
  const pathName = usePathname()
  const linkPath = typeof href === 'string' ? href : href.pathname ?? ''
  const isActive = pathName === linkPath || pathName.startsWith(`${linkPath}/`)
  return <Link href={href} className={isActive ? 'active' : ''}>{children}</Link>
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Componente usa useState, useEffect, onClick | Adicione `"use client"` no topo |
| Componente so renderiza HTML/dados | Mantenha como Server Component |
| Migrando rota que existe em ambos os routers | Remova da Pages Router antes de criar na App Router |
| Importando estilos globais | Importe no `layout.tsx`, nao no `page.tsx` |
| Precisa do path atual no componente | Use `usePathname()` de `next/navigation` |
| Componente usa `useRouter` de `next/router` | Migre para hooks de `next/navigation` |

## Anti-patterns

| Nunca faca | Faca assim |
|------------|------------|
| Mesma rota em `pages/` e `app/` simultaneamente | Renomeie ou remova da Pages Router antes |
| `import { useRouter } from 'next/router'` na App Router | `import { usePathname } from 'next/navigation'` |
| Usar hooks de browser em Server Component | Adicione `"use client"` ou extraia para Client Component |
| Criar `index.tsx` dentro de `app/` | Crie `page.tsx` (convencao da App Router) |
| Importar CSS global no `page.tsx` | Importe no `layout.tsx` |
| Esquecer `export default` no page.tsx | Sempre exporte a funcao como default |

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

- [deep-explanation.md](../../../data/skills/next-js/rs-next-js-migrando-a-landing-page/references/deep-explanation.md) — O Next.js permite que Pages Router e App Router coexistam no mesmo projeto. Isso é um facilitador en
- [code-examples.md](../../../data/skills/next-js/rs-next-js-migrando-a-landing-page/references/code-examples.md) — src/
