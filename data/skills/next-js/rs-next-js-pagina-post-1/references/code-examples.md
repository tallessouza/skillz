# Code Examples: Pagina de Post com Rota Dinamica

## Exemplo 1: Estrutura basica do arquivo [slug].tsx

```typescript
// src/pages/blog/[slug].tsx
import { useRouter } from 'next/router'

export default function PostPage() {
  const router = useRouter()
  
  // Debug: inspecionar o objeto router
  console.log(router)
  // { query: { slug: "primeiro-post" }, asPath: "/blog/primeiro-post", ... }
  
  const slug = router.query.slug as string
  console.log(slug) // "primeiro-post"
  
  return (
    <div className="mt-20 text-gray-100">
      <h2>Post Page</h2>
    </div>
  )
}
```

## Exemplo 2: Busca do post pelo slug

```typescript
import { allPosts } from 'contentlayer/generated'
import { useRouter } from 'next/router'

export default function PostPage() {
  const router = useRouter()
  const slug = router.query.slug as string

  const post = allPosts.find(
    (post) => post.slug?.includes(slug)
  )!

  console.log(post) // { title: "Primeiro Post", slug: "primeiro-post", image: "...", ... }

  return (
    // ...
  )
}
```

## Exemplo 3: Breadcrumb completo

```tsx
import Link from 'next/link'
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'

<Breadcrumb>
  <BreadcrumbList>
    <BreadcrumbItem>
      <BreadcrumbLink asChild>
        <Link href="/blog" className="text-gray-100 text-sm">
          Blog
        </Link>
      </BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <span className="text-blue-200 text-sm">
        {post.title}
      </span>
    </BreadcrumbItem>
  </BreadcrumbList>
</Breadcrumb>
```

## Exemplo 4: Layout completo da pagina

```tsx
import { useRouter } from 'next/router'
import Link from 'next/link'
import Image from 'next/image'
import { allPosts } from 'contentlayer/generated'
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'

export default function PostPage() {
  const router = useRouter()
  const slug = router.query.slug as string

  const post = allPosts.find(
    (post) => post.slug?.includes(slug)
  )!

  return (
    <main>
      {/* Breadcrumb */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/blog" className="text-gray-100 text-sm">
                Blog
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <span className="text-blue-200 text-sm">
              {post.title}
            </span>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Grid layout: conteudo + sidebar futura */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6 lg:gap-12">
        <article className="bg-gray-600 rounded-lg overflow-hidden border border-gray-400 border-[1px]">
          {/* Imagem do post */}
          <figure className="relative w-full overflow-hidden rounded">
            <Image
              src={post.image!}
              alt={post.title!}
              className="object-cover"
              fill
            />
          </figure>

          {/* Titulo e corpo serao adicionados na proxima aula */}
        </article>
      </div>
    </main>
  )
}
```

## Exemplo 5: Variacao — verificacao de post nao encontrado

```tsx
export default function PostPage() {
  const router = useRouter()
  const slug = router.query.slug as string

  const post = allPosts.find(
    (post) => post.slug?.includes(slug)
  )

  // Melhor que usar ! assertion
  if (!post) {
    return <div>Post nao encontrado</div>
  }

  return (
    // ... resto do componente com post garantidamente definido
  )
}
```

## Estrutura de arquivos resultante

```
src/
  pages/
    blog/
      index.tsx        # Listagem de posts (ja existia)
      [slug].tsx       # Pagina de detalhe do post (criado nesta aula)
```