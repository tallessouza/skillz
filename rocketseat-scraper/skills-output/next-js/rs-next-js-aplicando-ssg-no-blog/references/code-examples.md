# Code Examples: Aplicando SSG no Blog

## Exemplo completo da aula

### getStaticProps com sort

```typescript
import { allPosts, type Post } from 'contentlayer/generated'
import type { GetStaticProps } from 'next'

export type BlogListProps = {
  posts: Post[]
}

export const getStaticProps: GetStaticProps<BlogListProps> = async () => {
  const sortedPosts = allPosts.sort((a, b) =>
    new Date(b.date).getTime() - new Date(a.date).getTime()
  )

  return {
    props: {
      posts: sortedPosts,
    },
  }
}
```

### Componente da pagina recebendo props

```typescript
export default function BlogPage({ posts }: BlogListProps) {
  // posts ja vem ordenado do servidor
  return <BlogList posts={posts} />
}
```

### Componente BlogList refatorado

```typescript
// Antes: importava allPosts e fazia filtro interno
// Depois: apenas recebe posts via props

export type BlogListProps = {
  posts: Post[]
}

export function BlogList({ posts }: BlogListProps) {
  // usa posts diretamente, sem import de allPosts
  return (
    <ul>
      {posts.map((post) => (
        <li key={post.slug}>{post.title}</li>
      ))}
    </ul>
  )
}
```

## Variacoes

### Com ISR (revalidate)

```typescript
export const getStaticProps: GetStaticProps<BlogListProps> = async () => {
  const sortedPosts = allPosts.sort((a, b) =>
    new Date(b.date).getTime() - new Date(a.date).getTime()
  )

  return {
    props: { posts: sortedPosts },
    revalidate: 60 * 60, // regenera a cada 1 hora
  }
}
```

### Com filtro adicional (apenas publicados)

```typescript
export const getStaticProps: GetStaticProps<BlogListProps> = async () => {
  const sortedPosts = allPosts
    .filter((post) => post.status === 'published')
    .sort((a, b) =>
      new Date(b.date).getTime() - new Date(a.date).getTime()
    )

  return {
    props: { posts: sortedPosts },
  }
}
```

### Debugging com console.log (como o instrutor mostrou)

```typescript
export default function BlogPage({ posts }: BlogListProps) {
  console.log(posts) // aparece no terminal do servidor durante dev
  return <BlogList posts={posts} />
}
```

O instrutor usou `console.log(posts)` para verificar que os dados chegavam corretamente via props. O log aparece no terminal (server-side durante dev) e no browser console (client-side apos hidratacao).