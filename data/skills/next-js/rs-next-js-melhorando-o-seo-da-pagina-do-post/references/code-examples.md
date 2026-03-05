# Code Examples: SEO Dinâmico com generateMetadata

## Exemplo 1: Layout com metadata padrao (fallback)

```typescript
// app/layout.tsx
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    default: 'Meu Blog',
    template: '%s | Meu Blog',
  },
  description: 'Blog sobre desenvolvimento web',
  openGraph: {
    images: ['/default-og-image.png'], // Fallback para paginas sem imagem propria
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  )
}
```

**Por que:** Sem essa imagem padrao no layout, qualquer pagina compartilhada sem metadata propria aparece sem preview visual nas redes sociais.

---

## Exemplo 2: generateMetadata completo na pagina de post

```typescript
// app/blog/[slug]/page.tsx
import { Metadata } from 'next'
import { posts } from '@/data/posts'

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params

  const post = posts.find((post) => post.slug === slug)

  if (!post) {
    return {}
  }

  return {
    title: post.title,
    description: post.description,
    authors: [{ name: post.author.name }],
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      images: [post.image],
    },
  }
}

export default async function BlogPost({ params }: Props) {
  const { slug } = await params

  const post = posts.find((post) => post.slug === slug)

  if (!post) {
    return <p>Post nao encontrado</p>
  }

  return (
    <article>
      <h1>{post.title}</h1>
      <p>{post.description}</p>
      <div>{post.content}</div>
    </article>
  )
}
```

**Pontos chave:**
- `Props` eh compartilhado entre `generateMetadata` e o componente
- `params` eh await-ado nos dois lugares
- Se post nao existe, retorna `{}` no metadata (herda do layout)

---

## Exemplo 3: generateMetadata com dados de API externa

```typescript
// Variacao: quando os dados vem de uma API, nao de arquivo local
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params

  // Next.js deduplica automaticamente — se o componente tambem chama essa URL,
  // a requisicao eh feita apenas uma vez
  const response = await fetch(`https://api.meublog.com/posts/${slug}`)

  if (!response.ok) {
    return {}
  }

  const post = await response.json()

  return {
    title: post.title,
    description: post.excerpt,
    authors: [{ name: post.author.name }],
    robots: { index: true, follow: true },
    openGraph: {
      images: [post.coverImage],
      type: 'article',
      publishedTime: post.publishedAt,
    },
  }
}
```

---

## Exemplo 4: Campos adicionais de openGraph para artigos

```typescript
// Expandindo o openGraph com campos especificos para artigos
return {
  title: post.title,
  description: post.description,
  authors: [{ name: post.author.name }],
  robots: { index: true, follow: true },
  openGraph: {
    title: post.title,
    description: post.description,
    type: 'article',
    publishedTime: post.publishedAt,
    authors: [post.author.name],
    images: [
      {
        url: post.image,
        width: 1200,
        height: 630,
        alt: post.title,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: post.title,
    description: post.description,
    images: [post.image],
  },
}
```

---

## Exemplo 5: Erro comum — params sem await

```typescript
// ERRADO — vai quebrar ou gerar warning no Next.js 15+
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = posts.find((p) => p.slug === params.slug) // params eh Promise!
  // ...
}

// CORRETO
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = posts.find((p) => p.slug === slug)
  // ...
}
```