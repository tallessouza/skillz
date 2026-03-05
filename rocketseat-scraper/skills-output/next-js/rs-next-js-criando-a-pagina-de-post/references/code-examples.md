# Code Examples: Criando a Pagina de Post no App Router

## Estrutura de pastas completa

```
app/
  blog/
    [slug]/
      page.tsx      ← rota dinamica /blog/:slug
    page.tsx        ← rota estatica /blog

pages/
  blog-page/        ← renomeada para evitar conflito
    [slug].tsx      ← antiga rota dinamica (desativada)
```

## Tipagem dos params (Next.js 15+)

```typescript
type BlogPostPageProps = {
  params: Promise<{ slug: string }>
}
```

Se a pasta fosse `[id]`:
```typescript
type Props = {
  params: Promise<{ id: string }>
}
```

Se a pasta fosse `[postSlug]`:
```typescript
type Props = {
  params: Promise<{ postSlug: string }>
}
```

## Pagina completa do post

```typescript
import { notFound } from 'next/navigation'
import { posts } from '@/data/posts'
import { PostPage } from '@/templates/post-page'

type BlogPostPageProps = {
  params: Promise<{ slug: string }>
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params

  const post = posts.find(post => post.slug === slug)

  if (!post) {
    notFound()
  }

  return <PostPage post={post} />
}
```

## O que NAO fazer: use client na pagina inteira

```typescript
// ERRADO — transforma toda a pagina em client component
"use client"

import { PostPage } from '@/templates/post-page'
// PostPage usa useClipboard internamente

export default function BlogPostPage({ params }) {
  // todo o conteudo (titulo, imagem, texto, autor)
  // agora roda no client sem necessidade
}
```

## O que fazer: isolar o client component

```typescript
// app/blog/[slug]/page.tsx — permanece server component
import { notFound } from 'next/navigation'
import { posts } from '@/data/posts'
import { ShareButton } from './share-button'

type BlogPostPageProps = {
  params: Promise<{ slug: string }>
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params
  const post = posts.find(p => p.slug === slug)

  if (!post) notFound()

  return (
    <article>
      <h1>{post.title}</h1>
      <p>By {post.author}</p>
      <img src={post.coverImage} alt={post.title} />
      <div dangerouslySetInnerHTML={{ __html: post.content }} />
      <ShareButton slug={post.slug} /> {/* unico client component */}
    </article>
  )
}
```

```typescript
// app/blog/[slug]/share-button.tsx
"use client"

import { useClipboard } from '@/hooks/use-clipboard'

export function ShareButton({ slug }: { slug: string }) {
  const { copy, copied } = useClipboard()

  return (
    <button onClick={() => copy(`${window.location.origin}/blog/${slug}`)}>
      {copied ? 'Copiado!' : 'Compartilhar'}
    </button>
  )
}
```

## Console.log no server component

```typescript
export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params
  console.log(slug) // aparece no TERMINAL do servidor, nao no browser
  // ...
}
```

## Props raw do componente (o que o Next.js passa)

```typescript
// Se voce logar props diretamente:
export default async function BlogPostPage(props: any) {
  console.log(props)
  // Output no server:
  // {
  //   params: Promise { { slug: 'primeiro-post' } },
  //   searchParams: Promise { {} }
  // }
}
```