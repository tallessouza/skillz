# Code Examples: SSR, SSG e ISR

## Setup do projeto para testar

Para testar as tres estrategias, gere o build e inicie em modo producao:

```bash
pnpm build
pnpm start
```

O `pnpm dev` usa modo de desenvolvimento e nao reflete o comportamento real de SSG/ISR.

## Exemplo completo: SSR

```typescript
// pages/ssr.tsx
import { GetServerSideProps } from 'next'

interface SSRPageProps {
  currentTime: string
}

export const getServerSideProps: GetServerSideProps<SSRPageProps> = async () => {
  const currentTime = new Date().toISOString()

  return {
    props: {
      currentTime,
    },
  }
}

export default function SSRPage({ currentTime }: SSRPageProps) {
  return (
    <div>
      <h1>Server-Side Rendering</h1>
      <p>{currentTime}</p>
    </div>
  )
}
```

**Comportamento:** A cada F5, `currentTime` atualiza porque `getServerSideProps` executa a cada request.

## Exemplo completo: SSG

```typescript
// pages/ssg.tsx
import { GetStaticProps } from 'next'

interface SSGPageProps {
  buildTime: string
}

export const getStaticProps: GetStaticProps<SSGPageProps> = async () => {
  const buildTime = new Date().toISOString()

  return {
    props: {
      buildTime,
    },
  }
}

export default function SSGPage({ buildTime }: SSGPageProps) {
  return (
    <div>
      <h1>Static Site Generation</h1>
      <p>{buildTime}</p>
    </div>
  )
}
```

**Comportamento:** `buildTime` NUNCA muda apos o build. F5 infinitos, mesmo valor. So atualiza com novo `pnpm build`.

## Exemplo completo: ISR

```typescript
// pages/isr.tsx
import { GetStaticProps } from 'next'

interface ISRPageProps {
  regeneratedAt: string
}

export const getStaticProps: GetStaticProps<ISRPageProps> = async () => {
  const regeneratedAt = new Date().toISOString()

  return {
    props: {
      regeneratedAt,
    },
    revalidate: 10, // regenera a cada 10 segundos
  }
}

export default function ISRPage({ regeneratedAt }: ISRPageProps) {
  return (
    <div>
      <h1>Incremental Static Regeneration</h1>
      <p>{regeneratedAt}</p>
    </div>
  )
}
```

**Comportamento:** Valor congelado por 10 segundos. Apos 10s, proxima requisicao regenera. Entre regeneracoes, cache estatico.

## Contra-exemplo: Client-Side Fetch (sem SEO)

```typescript
// pages/client-side.tsx
import { useEffect, useState } from 'react'

export default function ClientSidePage() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('https://api.example.com/posts')
      .then(r => r.json())
      .then(posts => {
        setData(posts)
        setLoading(false)
      })
  }, [])

  if (loading) return <p>Carregando...</p>

  return (
    <div>
      <h1>Client-Side Fetch</h1>
      {data.map((post: any) => (
        <p key={post.id}>{post.title}</p>
      ))}
    </div>
  )
}
```

**Problema:** Com JavaScript desabilitado no browser (como crawlers fazem), essa pagina fica em branco. Zero SEO.

**Teste:** No Chrome DevTools > Sources > desabilitar JavaScript. A pagina nao renderiza nada.

## ISR com fetch real (cenario de blog)

```typescript
// pages/blog.tsx
import { GetStaticProps } from 'next'

interface Post {
  id: string
  title: string
  excerpt: string
}

export const getStaticProps: GetStaticProps = async () => {
  const response = await fetch('https://api.example.com/posts')
  const posts: Post[] = await response.json()

  return {
    props: { posts },
    revalidate: 60, // regenera a cada 60 segundos
  }
}

export default function BlogPage({ posts }: { posts: Post[] }) {
  return (
    <div>
      <h1>Blog</h1>
      {posts.map(post => (
        <article key={post.id}>
          <h2>{post.title}</h2>
          <p>{post.excerpt}</p>
        </article>
      ))}
    </div>
  )
}
```

**Cenario real:** Blog com posts que podem ser atualizados. ISR com 60s significa que no maximo 1 minuto apos publicar um post, a pagina ja reflete. Sem precisar de rebuild.

## Verificacao no build output

Apos `pnpm build`, o Next exibe:

```
Route (pages)                              Size     First Load JS
┌ ● /ssg                                   350 B    75 kB
├ ƒ /ssr                                   350 B    75 kB
├ ● /isr (ISR: 10 Seconds)                 350 B    75 kB
└ ○ /client-side                           400 B    80 kB

○  (Static)   prerendered as static content
●  (SSG)      prerendered as static HTML (uses getStaticProps)
ƒ  (Dynamic)  server-rendered on demand
```

- `ƒ` = SSR (dinamico, servidor sob demanda)
- `●` = SSG ou ISR (estatico, com ou sem revalidate)
- `○` = Estatico puro (sem data fetching)