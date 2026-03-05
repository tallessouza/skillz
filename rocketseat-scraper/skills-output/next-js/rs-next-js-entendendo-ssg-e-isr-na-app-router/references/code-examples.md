# Code Examples: SSG e ISR na App Router

## Exemplo 1: generateStaticParams basico

Estrutura de pastas:
```
app/
  blog/
    [slug]/
      page.tsx
```

```typescript
// app/blog/[slug]/page.tsx
import { allPosts } from 'contentlayer/generated'

// Gera paginas estaticas em build para cada post
export async function generateStaticParams() {
  return allPosts.map((post) => ({
    slug: post.slug,
  }))
}

// Server component — executa em build time gracas ao generateStaticParams
export default function BlogPost({ params }: { params: { slug: string } }) {
  const post = allPosts.find((p) => p.slug === params.slug)

  if (!post) return <div>Post not found</div>

  return (
    <article>
      <h1>{post.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: post.body.html }} />
    </article>
  )
}
```

**Output do build:**
```
Route (app)                    Size     First Load JS
├ ● /blog/[slug]              xxx B    xxx kB
├   ├ /blog/primeiro-post
├   └ /blog/segundo-post
```

O simbolo `●` indica SSG (Static Site Generation).

## Exemplo 2: ISR com revalidate

```typescript
// app/blog/[slug]/page.tsx

// A cada 60 segundos, o Next invalida o cache e regenera a pagina
export const revalidate = 60

export async function generateStaticParams() {
  return allPosts.map((post) => ({
    slug: post.slug,
  }))
}

export default function BlogPost({ params }: { params: { slug: string } }) {
  const post = allPosts.find((p) => p.slug === params.slug)
  return <article>{post?.title}</article>
}
```

## Exemplo 3: dynamicParams = false (404 para rotas nao geradas)

```typescript
// app/blog/[slug]/page.tsx

// Qualquer slug que nao foi retornado por generateStaticParams → 404
export const dynamicParams = false

export async function generateStaticParams() {
  return allPosts.map((post) => ({
    slug: post.slug,
  }))
}

export default function BlogPost({ params }: { params: { slug: string } }) {
  const post = allPosts.find((p) => p.slug === params.slug)
  return <article>{post?.title}</article>
}
```

## Exemplo 4: Combinacao completa (SSG + ISR + dynamicParams)

```typescript
// app/blog/[slug]/page.tsx
import { allPosts } from 'contentlayer/generated'

// ISR: revalida a cada 5 minutos
export const revalidate = 300

// Permite gerar paginas para novos posts que nao existiam em build
export const dynamicParams = true

// Pre-gera paginas para todos os posts conhecidos
export async function generateStaticParams() {
  return allPosts.map((post) => ({
    slug: post.slug,
  }))
}

export default async function BlogPost({ params }: { params: { slug: string } }) {
  const post = allPosts.find((p) => p.slug === params.slug)

  if (!post) {
    return <div>Post nao encontrado</div>
  }

  return (
    <article>
      <h1>{post.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: post.body.html }} />
    </article>
  )
}
```

## Exemplo 5: Equivalencia Pages Router → App Router

### Pages Router (antigo):
```typescript
// pages/blog/[slug].tsx
export async function getStaticPaths() {
  const posts = allPosts
  return {
    paths: posts.map((post) => ({
      params: { slug: post.slug },
    })),
    fallback: true,
  }
}

export async function getStaticProps({ params }) {
  const post = allPosts.find((p) => p.slug === params.slug)
  return {
    props: { post },
    revalidate: 60,
  }
}

export default function BlogPost({ post }) {
  return <article>{post.title}</article>
}
```

### App Router (novo):
```typescript
// app/blog/[slug]/page.tsx
export const revalidate = 60
export const dynamicParams = true // equivale a fallback: true

export async function generateStaticParams() {
  return allPosts.map((post) => ({
    slug: post.slug,
  }))
  // Sem wrapper { paths, fallback } — retorna array direto
}

export default async function BlogPost({ params }: { params: { slug: string } }) {
  const post = allPosts.find((p) => p.slug === params.slug)
  return <article>{post?.title}</article>
}
```

## Erro comum: nome errado da funcao

```typescript
// ERRADO — Next ignora silenciosamente
export async function generateStaticPaths() {
  return allPosts.map((post) => ({ slug: post.slug }))
}

// CORRETO — Next reconhece e gera paginas em build
export async function generateStaticParams() {
  return allPosts.map((post) => ({ slug: post.slug }))
}
```

## Erro comum: nome errado do parametro

```typescript
// ERRADO — pasta e [slug] mas retorna { paths: ... }
export async function generateStaticParams() {
  return allPosts.map((post) => ({
    paths: post.slug,  // Next nao vai fazer match
  }))
}

// CORRETO — nome do campo = nome da pasta dinamica
export async function generateStaticParams() {
  return allPosts.map((post) => ({
    slug: post.slug,  // [slug] → slug
  }))
}
```