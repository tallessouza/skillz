# Code Examples: SEO em Paginas de Listagem (Next.js)

## Exemplo completo: metadata na page de listagem

```typescript
// app/blog/page.tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Dicas e estrategias para desenvolvedores que querem evoluir na carreira.',
  openGraph: {
    title: 'Blog',
    description: 'Dicas e estrategias para desenvolvedores que querem evoluir na carreira.',
    siteName: 'DevBlog',
    images: [
      {
        url: '/images/blog-cover.png',
        alt: 'Sitemap do blog',
      },
    ],
  },
}

export default function BlogListPage() {
  // ... renderizacao da lista de posts
}
```

## Exemplo completo: metadata no layout (fallback)

```typescript
// app/layout.tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'DevBlog',
  description: 'Blog sobre desenvolvimento web, React e Next.js.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  )
}
```

## Demonstracao da heranca

### Cenario 1: page define metadata → sobrescreve layout

```typescript
// app/layout.tsx
export const metadata: Metadata = {
  title: 'DevBlog',
  description: 'Blog sobre desenvolvimento web.',
}

// app/blog/page.tsx
export const metadata: Metadata = {
  title: 'Blog',  // sobrescreve "DevBlog"
  description: 'Listagem de posts.',  // sobrescreve description do layout
}

// Resultado no HTML:
// <title>Blog</title>
// <meta name="description" content="Listagem de posts." />
```

### Cenario 2: page NAO define metadata → herda do layout

```typescript
// app/layout.tsx
export const metadata: Metadata = {
  title: 'DevBlog',
  description: 'Blog sobre desenvolvimento web.',
}

// app/about/page.tsx
// Nenhum export de metadata

// Resultado no HTML:
// <title>DevBlog</title>
// <meta name="description" content="Blog sobre desenvolvimento web." />
```

## Variacao: usando template de titulo

```typescript
// app/layout.tsx
export const metadata: Metadata = {
  title: {
    default: 'DevBlog',
    template: '%s | DevBlog',  // %s sera substituido pelo titulo da page
  },
  description: 'Blog sobre desenvolvimento web.',
}

// app/blog/page.tsx
export const metadata: Metadata = {
  title: 'Blog',  // Resultado: "Blog | DevBlog"
}
```

## Comparacao: estatico vs dinamico (proximo passo)

```typescript
// ESTATICO — usado na listagem (esta aula)
export const metadata: Metadata = {
  title: 'Blog',
  description: 'Listagem de posts.',
}

// DINAMICO — usado na pagina do post individual (proxima aula)
export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> {
  const post = await getPost(params.slug)

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [{ url: post.coverImage, alt: post.title }],
    },
  }
}
```