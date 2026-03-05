# Code Examples: Migrando a Listagem de Posts

## 1. Criando o entry point da pagina

```typescript
// app/blog/page.tsx
// Este arquivo substitui pages/blog/index.tsx
// Por default, e um server component

export default function BlogPage() {
  return <h1>Blog List</h1>
}
```

**Nota:** Na App Router, `page.tsx` e o equivalente ao `index.tsx` da Pages Router. Cada pasta dentro de `app/` que tenha um `page.tsx` se torna uma rota.

## 2. Movendo data fetching para server component

```typescript
// app/blog/page.tsx
import { allPosts } from 'contentlayer/generated'
import { BlogList } from '@/components/blog-list'

export default function BlogPage() {
  // Isso executa no servidor — sem useEffect, sem getServerSideProps
  const sortedPosts = allPosts.sort(
    (a, b) =>
      new Date(b.date).getTime() - new Date(a.date).getTime()
  )

  return <BlogList posts={sortedPosts} />
}
```

**Comparacao com Pages Router:**
```typescript
// pages/blog/index.tsx (ANTES)
export const getServerSideProps = async () => {
  const sortedPosts = allPosts.sort(
    (a, b) =>
      new Date(b.date).getTime() - new Date(a.date).getTime()
  )
  return { props: { posts: sortedPosts } }
}

export default function BlogPage({ posts }) {
  return <BlogList posts={posts} />
}
```

## 3. Convertendo BlogList para client component

```typescript
// components/blog-list.tsx
'use client'

import { useSearchParams } from 'next/navigation'

interface BlogListProps {
  posts: Post[]
}

export function BlogList({ posts }: BlogListProps) {
  const searchParams = useSearchParams()
  const query = searchParams.get('q') ?? ''

  const filteredPosts = posts.filter((post) =>
    post.title.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <div>
      <Search />
      {filteredPosts.map((post) => (
        <PostCard key={post.slug} post={post} />
      ))}
    </div>
  )
}
```

## 4. Migrando o componente Search

**Antes (Pages Router):**
```typescript
import { useRouter } from 'next/router'

export function Search() {
  const router = useRouter()
  const query = (router.query.q as string) ?? ''

  function handleSearch(term: string) {
    router.push(
      { pathname: '/blog', query: { q: term } },
      undefined,
      { shallow: true }
    )
  }

  return <input value={query} onChange={(e) => handleSearch(e.target.value)} />
}
```

**Depois (App Router):**
```typescript
'use client'

import { useRouter, useSearchParams } from 'next/navigation'

export function Search() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const query = searchParams.get('q') ?? ''

  function handleSearch(term: string) {
    router.push(`/blog?q=${term}`, { scroll: false })
  }

  return <input value={query} onChange={(e) => handleSearch(e.target.value)} />
}
```

**Diferencas chave:**
- Import muda de `next/router` para `next/navigation`
- `router.query.q` vira `searchParams.get('q')`
- `router.push` perde o segundo parametro (as) e `shallow` vira `scroll`
- `useSearchParams` e um hook separado, nao parte do router

## 5. Marcando hooks customizados como client

```typescript
// hooks/use-clipboard.ts
'use client'

import { useEffect, useState } from 'react'

export function useClipboard() {
  // useEffect so funciona em client components
  useEffect(() => {
    // ...
  }, [])
}
```

**Por que isso e necessario:** Se um hook usa `useEffect`, `useState`, ou qualquer API do browser, o arquivo do hook precisa ser marcado com `'use client'`. Nao basta marcar apenas o componente que o importa.

## 6. Estrategia de migracao — passo a passo

```bash
# 1. Desativar rota antiga renomeando
mv app/blog app/blog-page

# 2. Criar nova estrutura
mkdir app/blog
touch app/blog/page.tsx

# 3. Criar server component com data fetching
# (editar page.tsx)

# 4. Migrar componentes filhos adicionando 'use client'
# 5. Atualizar imports (next/router → next/navigation)
# 6. Atualizar APIs (router.query → searchParams.get)
# 7. Testar no browser
# 8. Remover pasta antiga quando tudo funcionar
```