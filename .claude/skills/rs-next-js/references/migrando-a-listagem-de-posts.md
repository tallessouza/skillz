---
name: rs-next-js-migrando-listagem-posts
description: "Applies Next.js App Router migration patterns when converting Pages Router components to App Router. Use when user asks to 'migrate to app router', 'convert pages to app router', 'use server components', 'move from pages to app directory', or 'use useSearchParams'. Enforces server-first data fetching, correct use-client boundaries, and useSearchParams over useRouter query. Make sure to use this skill whenever migrating Next.js pages or refactoring router usage. Not for creating new App Router projects from scratch or API route migration."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: next-js
  module: migracao-app-router
  tags: [app-router, migration, useSearchParams, server-components, use-client, data-fetching, next-js]
---

# Migrando Pages Router para App Router

> Mova logica de dados para server components e preserve interatividade apenas onde necessario com use client.

## Rules

1. **Crie `page.tsx` como entry point** — substitui `index.tsx` da pasta pages, porque App Router usa file conventions diferentes
2. **Server components por default** — todo componente dentro de `app/` e server component ate receber `'use client'`, porque isso permite data fetching no servidor sem useEffect
3. **Mova data fetching para o server component pai** — corte getServerSideProps/getStaticProps e coloque a logica direto no corpo do component, porque server components executam no servidor
4. **Use `'use client'` apenas quando houver interatividade** — useState, useEffect, event handlers exigem client component, porque hooks de estado nao funcionam no servidor
5. **Substitua `useRouter().query` por `useSearchParams()`** — importado de `next/navigation`, porque na App Router o useRouter nao expoe query params
6. **useRouter vem de `next/navigation`** — nao mais de `next/router`, porque a API mudou e o import antigo causa erro

## How to write

### Server component com data fetching

```typescript
// app/blog/page.tsx — server component por default
import { allPosts } from 'contentlayer/generated'
import { BlogList } from './blog-list'

export default function BlogPage() {
  // Executa no servidor — substitui getServerSideProps
  const sortedPosts = allPosts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )

  return <BlogList posts={sortedPosts} />
}
```

### Client component com useSearchParams

```typescript
// app/blog/blog-list.tsx
'use client'

import { useSearchParams } from 'next/navigation'

export function BlogList({ posts }: BlogListProps) {
  const searchParams = useSearchParams()
  const query = searchParams.get('q') ?? ''

  // Filtragem e interatividade no cliente
}
```

### useRouter na App Router

```typescript
'use client'

import { useRouter, useSearchParams } from 'next/navigation'

function Search() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const query = searchParams.get('q') ?? ''

  function handleSearch(term: string) {
    // push so aceita path e options (scroll) — sem shallow
    router.push(`/blog?q=${term}`, { scroll: false })
  }
}
```

## Example

**Before (Pages Router):**
```typescript
// pages/blog/index.tsx
import { useRouter } from 'next/router'

export default function BlogList({ posts }) {
  const router = useRouter()
  const query = (router.query.q as string) ?? ''

  router.push({ pathname: '/blog', query: { q: term } }, undefined, { shallow: true })
}

export const getServerSideProps = async () => {
  const sorted = allPosts.sort(...)
  return { props: { posts: sorted } }
}
```

**After (App Router):**
```typescript
// app/blog/page.tsx (server component)
import { allPosts } from 'contentlayer/generated'
import { BlogList } from './blog-list'

export default function BlogPage() {
  const sortedPosts = allPosts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )
  return <BlogList posts={sortedPosts} />
}

// app/blog/blog-list.tsx (client component)
'use client'
import { useSearchParams, useRouter } from 'next/navigation'

export function BlogList({ posts }: BlogListProps) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const query = searchParams.get('q') ?? ''

  function handleSearch(term: string) {
    router.push(`/blog?q=${term}`, { scroll: false })
  }
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Componente so exibe dados | Mantenha como server component |
| Componente usa useState/useEffect | Adicione `'use client'` |
| Hook customizado usa useEffect internamente | Marque o arquivo do hook com `'use client'` |
| Precisa de query params da URL | Use `useSearchParams()` de `next/navigation` |
| Precisa navegar programaticamente | Use `useRouter()` de `next/navigation` |
| Data fetching que era em getServerSideProps | Mova para o corpo do server component |

## Anti-patterns

| Nunca escreva | Escreva no lugar |
|---------------|-----------------|
| `import { useRouter } from 'next/router'` | `import { useRouter } from 'next/navigation'` |
| `router.query.q` | `searchParams.get('q')` |
| `router.push(url, undefined, { shallow: true })` | `router.push(url, { scroll: false })` |
| `'use client'` na page.tsx que so faz fetch | Server component puro + client component filho |
| `useEffect` para buscar dados no client | Data fetching direto no server component |
| Pagina inteira como client component | Isole interatividade no menor componente possivel |

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

- [deep-explanation.md](../../../data/skills/next-js/rs-next-js-migrando-a-listagem-de-posts/references/deep-explanation.md) — O instrutor enfatiza que a migracao nao e simplesmente mover arquivos — e repensar onde cada respons
- [code-examples.md](../../../data/skills/next-js/rs-next-js-migrando-a-listagem-de-posts/references/code-examples.md) — // app/blog/page.tsx
