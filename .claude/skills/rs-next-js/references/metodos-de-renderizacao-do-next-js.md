---
name: rs-next-js-metodos-de-renderizacao
description: "Applies correct Next.js rendering method (CSR, SSR, SSG, ISR) when building pages with Pages Router. Use when user asks to 'create a page', 'add a route', 'improve SEO', 'optimize performance', 'setup static generation', or 'configure revalidation' in Next.js. Guides selection based on content dynamism, SEO needs, and server load. Make sure to use this skill whenever creating or modifying Next.js pages to pick the right rendering strategy. Not for App Router server components, React Server Components, or non-Next.js frameworks."
---

# Métodos de Renderização do Next.js (Pages Router)

> Cada página do Next.js deve usar o método de renderização que melhor equilibra performance, SEO e dinamismo do conteúdo.

## Decision Framework

| Cenário | Método | Motivo |
|---------|--------|--------|
| Página com alto dinamismo, interações ricas (dashboards, SPAs internas) | **CSR** | Transições fluidas, sem reload, experiência app-like |
| Página que precisa de SEO + dados atualizados a cada request (e-commerce, perfis) | **SSR** | HTML pré-renderizado no servidor, indexação rápida |
| Página com conteúdo que raramente muda (blog, docs, landing pages) | **SSG** | Performance máxima, cacheável em CDN, sem servidor dedicado |
| Página estática que precisa atualizar periodicamente (catálogo, notícias moderadas) | **ISR** | Combina performance do SSG com atualização incremental |

## Como funciona cada método

### CSR (Client-Side Rendering)
```typescript
// Página CSR — fetch acontece no browser
import { useEffect, useState } from 'react'

export default function UsersPage() {
  const [users, setUsers] = useState([])

  useEffect(() => {
    fetch('/api/users').then(res => res.json()).then(setUsers)
  }, [])

  return <UserList users={users} />
}
```

### SSR (Server-Side Rendering)
```typescript
// Página SSR — executada no servidor a cada request
export const getServerSideProps: GetServerSideProps = async () => {
  const users = await fetchUsersFromDB()
  return { props: { users } }
}

export default function UsersPage({ users }: Props) {
  return <UserList users={users} />
}
```

### SSG (Static Site Generation)
```typescript
// Página SSG — gerada uma vez no build
export const getStaticProps: GetStaticProps = async () => {
  const posts = await fetchAllPosts()
  return { props: { posts } }
}

export default function BlogPage({ posts }: Props) {
  return <PostList posts={posts} />
}
```

### ISR (Incremental Static Regeneration)
```typescript
// Página ISR — estática com revalidação periódica
export const getStaticProps: GetStaticProps = async () => {
  const products = await fetchProducts()
  return {
    props: { products },
    revalidate: 60, // re-renderiza a cada 60 segundos
  }
}
```

## Heuristics

| Situação | Decisão |
|----------|---------|
| Precisa de `window` ou `document` | CSR, ou checar `typeof window !== 'undefined'` em SSR |
| Conteúdo personalizado por usuário (auth) | SSR (cookies/session no servidor) |
| Site inteiro pode ser estático | SSG + deploy em CDN (GitHub Pages, Vercel) |
| Conteúdo estático mas atualiza 1x por hora | ISR com `revalidate` adequado |
| Dados sensíveis (API keys, tokens) | SSR — chamadas ficam no servidor |
| Site de notícias com alta frequência | SSR ou ISR com revalidate curto — SSG puro exige rebuild total |

## Anti-patterns

| Nunca faça | Faça isto |
|------------|-----------|
| SSG para painel admin autenticado | SSR com verificação de session no servidor |
| SSR para landing page que nunca muda | SSG — performance máxima sem carga no servidor |
| CSR para páginas que precisam de SEO | SSR ou SSG — HTML chega pronto para indexação |
| SSG para conteúdo que muda a cada minuto | ISR com `revalidate` curto ou SSR |
| Acessar `window`/`document` direto em SSR | Checar `typeof window !== 'undefined'` antes |
| Rebuild total do site para mudar uma página | ISR — rebuilda apenas a página específica |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/next-js/rs-next-js-metodos-de-renderizacao-do-next-js/references/deep-explanation.md)
- [Code examples](../../../data/skills/next-js/rs-next-js-metodos-de-renderizacao-do-next-js/references/code-examples.md)
