# Code Examples: Separacao de Client e Server Components

## Exemplo completo da aula

### Antes — pagina monolitica com `'use client'`

```typescript
// app/posts/[slug]/page.tsx
'use client'

import { Button } from '@/components/ui/button'
import { useShare } from '@/hooks/use-share'

export default function PostPage({ params }: { params: { slug: string } }) {
  // PROBLEMA: nao pode usar async/await em client component
  // PROBLEMA: todo o conteudo estatico vira JavaScript no client
  const postUrl = `${process.env.NEXT_PUBLIC_URL}/posts/${params.slug}`

  const { share } = useShare()

  return (
    <article>
      <h1>{/* titulo */}</h1>
      <div>{/* conteudo do post */}</div>

      <aside>
        <Button
          onClick={() =>
            share({
              url: postUrl,
              title: 'Post Title',
              text: 'Post description',
            })
          }
        >
          Compartilhar
        </Button>
      </aside>
    </article>
  )
}
```

### Depois — componente client isolado

#### 1. Client component extraido

```typescript
// components/post-share/post-share.tsx
'use client'

import { Button } from '@/components/ui/button'
import { useShare } from '@/hooks/use-share'

interface PostShareProps {
  url: string
  title: string
  description: string // renomeado de 'text' para ter significado no contexto
}

export const PostShare = ({ url, title, description }: PostShareProps) => {
  const { share } = useShare()

  return (
    <aside>
      <Button
        onClick={() =>
          share({
            url,
            title,
            text: description, // mapeamento: prop contextual → API generica
          })
        }
      >
        Compartilhar
      </Button>
    </aside>
  )
}
```

#### 2. Barrel export

```typescript
// components/post-share/index.ts
export { PostShare } from './post-share'
```

#### 3. Pagina server component

```typescript
// app/posts/[slug]/page.tsx
// SEM 'use client' — e server component automaticamente
import { PostShare } from '@/components/post-share'

export default async function PostPage({
  params,
}: {
  params: { slug: string }
}) {
  const post = await getPost(params.slug)
  const postUrl = `${process.env.NEXT_PUBLIC_URL}/posts/${params.slug}`

  return (
    <article>
      <h1>{post.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: post.content }} />

      {/* Unico client component na pagina */}
      <PostShare
        url={postUrl}
        title={post.title}
        description={post.description}
      />
    </article>
  )
}
```

## Variacoes do padrao

### Multiplos client components na mesma pagina

```typescript
// page.tsx (server component)
import { PostShare } from '@/components/post-share'
import { CommentForm } from '@/components/comment-form'  // outro client component
import { LikeButton } from '@/components/like-button'     // outro client component

export default async function PostPage({ params }) {
  const post = await getPost(params.slug)

  return (
    <article>
      {/* Server: renderizado no servidor, zero JS */}
      <h1>{post.title}</h1>
      <div>{post.content}</div>
      <p>Publicado em {post.createdAt}</p>

      {/* Client islands: apenas estes enviam JS */}
      <LikeButton postId={post.id} initialCount={post.likes} />
      <PostShare url={`/posts/${params.slug}`} title={post.title} description={post.description} />
      <CommentForm postId={post.id} />
    </article>
  )
}
```

### Erro demonstrado na aula — esquecendo `'use client'`

```typescript
// components/post-share/post-share.tsx
// ESQUECEU 'use client' — ERRO em runtime!

import { useShare } from '@/hooks/use-share'

export const PostShare = ({ url, title, description }) => {
  const { share } = useShare() // ERRO: useShare usa APIs do browser

  return (
    <button onClick={() => share({ url, title, text: description })}>
      Share
    </button>
  )
}
// Error: useShare is not a function / navigator is not defined
// Solucao: adicionar 'use client' na primeira linha
```

### Mapeamento de props — nome contextual para API generica

```typescript
// O hook useShare espera { url, title, text }
// Mas no contexto do PostShare, 'text' e na verdade a 'description' do post

interface PostShareProps {
  url: string
  title: string
  description: string  // nome com significado no dominio
}

export const PostShare = ({ url, title, description }: PostShareProps) => {
  const { share } = useShare()

  return (
    <button
      onClick={() =>
        share({
          url,
          title,
          text: description,  // mapeamento interno
        })
      }
    >
      Compartilhar
    </button>
  )
}
```