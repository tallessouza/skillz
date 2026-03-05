# Code Examples: SSG em Rotas Dinamicas

## Exemplo completo da aula — [slug].tsx

### getStaticPaths com ordenacao e limite

```typescript
import { allPosts, Post } from "contentlayer/generated"
import { GetStaticPaths, GetStaticProps } from "next"

export const getStaticPaths: GetStaticPaths = async () => {
  // Ordena por data (mais recente primeiro) e pega os 5 ultimos
  const sortedPosts = allPosts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )
  const recentPosts = sortedPosts.slice(0, 5)

  // Mapeia para o formato que o Next espera: { params: { slug } }
  const paths = recentPosts.map((post) => ({
    params: { slug: post.slug },
  }))

  // blocking: gera sob demanda para posts fora dos 5 ultimos
  return { paths, fallback: "blocking" }
}
```

### getStaticProps com busca por slug

```typescript
interface PostPageProps {
  post: Post
}

export const getStaticProps: GetStaticProps<PostPageProps> = async (context) => {
  const { slug } = context.params as { slug: string }

  const post = allPosts.find((p) => p.slug === slug)

  // Guard: retorna 404 se post nao encontrado
  if (!post) {
    return { notFound: true }
  }

  return {
    props: { post },
  }
}
```

### Componente da pagina

```typescript
export default function PostPage({ post }: PostPageProps) {
  return (
    <div>
      <h1>{post.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: post.body.html }} />
    </div>
  )
}
```

## Variacoes

### Com ISR (Incremental Static Regeneration)

```typescript
export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slug = params?.slug as string
  const post = allPosts.find((p) => p.slug === slug)

  if (!post) return { notFound: true }

  return {
    props: { post },
    revalidate: 60 * 60, // Revalida a cada 1 hora
  }
}
```

### Com fallback: false (conjunto fechado)

```typescript
export const getStaticPaths: GetStaticPaths = async () => {
  // Gera TODAS as paginas, nenhuma nova sera criada
  const paths = allPosts.map((post) => ({
    params: { slug: post.slug },
  }))

  return { paths, fallback: false }
}
```

### Com API externa em vez de contentlayer

```typescript
export const getStaticPaths: GetStaticPaths = async () => {
  const response = await fetch("https://api.exemplo.com/posts?limit=5&sort=-date")
  const posts = await response.json()

  const paths = posts.map((post: { slug: string }) => ({
    params: { slug: post.slug },
  }))

  return { paths, fallback: "blocking" }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const response = await fetch(`https://api.exemplo.com/posts/${params?.slug}`)

  if (!response.ok) {
    return { notFound: true }
  }

  const post = await response.json()

  return {
    props: { post },
    revalidate: 60 * 30, // ISR: 30 minutos
  }
}
```

### Multiplos parametros dinamicos — [category]/[slug].tsx

```typescript
export const getStaticPaths: GetStaticPaths = async () => {
  const paths = allPosts.map((post) => ({
    params: {
      category: post.category,
      slug: post.slug,
    },
  }))

  return { paths, fallback: "blocking" }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { category, slug } = params as { category: string; slug: string }
  const post = allPosts.find(
    (p) => p.category === category && p.slug === slug
  )

  if (!post) return { notFound: true }

  return { props: { post } }
}
```