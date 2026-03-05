# Code Examples: React Server Components no Next.js

## 1. Server Component basico (default na App Router)

```typescript
// app/page.tsx
// Nenhuma diretiva necessaria — ja e server component por default
export default async function HomePage() {
  // Fetch direto no componente, sem useEffect, sem estado
  const posts = await fetch('https://api.example.com/posts', {
    next: { revalidate: 3600 } // ISR: revalida a cada hora
  }).then(r => r.json())

  return (
    <main>
      <h1>Blog</h1>
      {posts.map(post => (
        <article key={post.id}>
          <h2>{post.title}</h2>
          <p>{post.excerpt}</p>
        </article>
      ))}
    </main>
  )
}
```

**Por que funciona:** Server components podem ser `async` — algo impossivel em client components. O fetch acontece no servidor, zero JavaScript enviado ao browser.

## 2. Client Component com interatividade

```typescript
// components/like-button.tsx
"use client" // Diretiva obrigatoria para usar hooks

import { useState } from 'react'

export function LikeButton({ postId }: { postId: string }) {
  const [liked, setLiked] = useState(false)
  const [count, setCount] = useState(0)

  async function handleLike() {
    setLiked(!liked)
    setCount(prev => liked ? prev - 1 : prev + 1)
    await fetch(`/api/posts/${postId}/like`, { method: 'POST' })
  }

  return (
    <button onClick={handleLike}>
      {liked ? '❤️' : '🤍'} {count}
    </button>
  )
}
```

**Por que precisa ser client:** Usa `useState` e `onClick` — ambos requerem hydration.

## 3. Composition Pattern — server dentro de client

```typescript
// components/interactive-sidebar.tsx
"use client"

import { useState } from 'react'

// Recebe children (que pode ser server component) via props
export function InteractiveSidebar({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(true)

  return (
    <aside style={{ display: isOpen ? 'block' : 'none' }}>
      <button onClick={() => setIsOpen(!isOpen)}>Toggle</button>
      {/* children e renderizado no servidor, passado como prop */}
      {children}
    </aside>
  )
}
```

```typescript
// app/layout.tsx (server component)
import { InteractiveSidebar } from '@/components/interactive-sidebar'
import { NavigationLinks } from '@/components/navigation-links' // server component

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
      <InteractiveSidebar>
        {/* NavigationLinks e server component passado como children */}
        <NavigationLinks />
      </InteractiveSidebar>
      <main>{children}</main>
    </div>
  )
}
```

**Ponto critico:** Se `NavigationLinks` fosse importado **dentro** de `InteractiveSidebar`, ele se tornaria client component. Passando como `children`, ele continua sendo server component.

## 4. Dados sensiveis seguros no server component

```typescript
// app/dashboard/page.tsx (server component)
export default async function DashboardPage() {
  // API key segura — nunca vai para o client
  const analytics = await fetch('https://api.analytics.com/data', {
    headers: {
      Authorization: `Bearer ${process.env.ANALYTICS_SECRET_KEY}`
    }
  }).then(r => r.json())

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Visitantes hoje: {analytics.visitors}</p>
      <p>Pageviews: {analytics.pageviews}</p>
    </div>
  )
}
```

**Seguranca:** `ANALYTICS_SECRET_KEY` existe apenas no servidor. Nenhum trace dela chega ao browser.

## 5. Dependencia pesada no servidor

```typescript
// app/docs/[slug]/page.tsx (server component)
import { marked } from 'marked'           // ~50KB
import hljs from 'highlight.js'           // ~300KB
import sanitizeHtml from 'sanitize-html'  // ~150KB

// Total: ~500KB que NAO vai para o browser
export default async function DocPage({ params }: { params: { slug: string } }) {
  const markdown = await fetch(`https://api.example.com/docs/${params.slug}`).then(r => r.text())

  const html = sanitizeHtml(marked(markdown, {
    highlight: (code, lang) => hljs.highlight(code, { language: lang }).value
  }))

  return <article dangerouslySetInnerHTML={{ __html: html }} />
}
```

**Bundle size:** 500KB de dependencias que ficam no servidor. Client recebe apenas o HTML renderizado.

## 6. Tabela de decisao na pratica

```typescript
// app/products/page.tsx — SERVER (fetch de dados)
export default async function ProductsPage() {
  const products = await getProducts()
  return (
    <div>
      <SearchFilter />        {/* CLIENT: tem input interativo */}
      <ProductGrid products={products} />  {/* SERVER: so exibe dados */}
      <Pagination />           {/* CLIENT: tem onClick para navegar */}
    </div>
  )
}

// components/product-grid.tsx — SERVER (sem diretiva, so renderiza)
export function ProductGrid({ products }: { products: Product[] }) {
  return (
    <div className="grid grid-cols-3 gap-4">
      {products.map(product => (
        <div key={product.id}>
          <h3>{product.name}</h3>
          <p>{product.price}</p>
          <AddToCartButton productId={product.id} /> {/* CLIENT: onClick */}
        </div>
      ))}
    </div>
  )
}

// components/search-filter.tsx — CLIENT (input interativo)
"use client"
import { useState } from 'react'

export function SearchFilter() {
  const [query, setQuery] = useState('')
  return <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Buscar..." />
}
```

**Composicao real:** A pagina e server component. Dentro dela, componentes interativos sao client e componentes de exibicao continuam server.