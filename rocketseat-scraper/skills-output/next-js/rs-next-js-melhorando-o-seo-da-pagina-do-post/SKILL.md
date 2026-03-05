---
name: rs-next-js-seo-pagina-post
description: "Generates dynamic metadata for Next.js pages using generateMetadata function. Use when user asks to 'add SEO to a page', 'dynamic meta tags', 'open graph for posts', 'generateMetadata Next.js', or 'improve SEO on dynamic routes'. Applies correct pattern for async params, fallback metadata in layout, and structured open graph. Make sure to use this skill whenever creating or editing Next.js pages that need dynamic meta tags or SEO optimization. Not for static-only metadata, sitemap generation, or robots.txt configuration."
---

# SEO Dinâmico com generateMetadata no Next.js

> Paginas dinamicas exportam `generateMetadata` para gerar meta tags baseadas nos parametros da rota.

## Rules

1. **Exporte `generateMetadata` com esse nome exato** — o Next.js detecta por convencao, qualquer typo resulta em metadata ignorada silenciosamente
2. **Defina metadata padrao no layout** — incluindo imagem OG, porque paginas sem metadata propria herdam do layout e nao podem ficar sem imagem ao compartilhar
3. **Receba params como Promise** — no App Router, params eh assincrono: `const { slug } = await params`
4. **Retorne objeto vazio se post nao existir** — evita erro em tempo de build para slugs invalidos
5. **Inclua sempre: title, description, authors, robots, openGraph.images** — sao os campos minimos para SEO funcional e preview em redes sociais

## How to write

### generateMetadata em pagina dinamica

```typescript
import { Metadata } from 'next'

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
```

### Metadata padrao no layout (fallback)

```typescript
// app/layout.tsx
export const metadata: Metadata = {
  title: {
    default: 'Meu Blog',
    template: '%s | Meu Blog',
  },
  description: 'Descricao padrao do site',
  openGraph: {
    images: ['/default-og-image.png'],
  },
}
```

## Example

**Before (pagina dinamica sem metadata):**
```typescript
// app/blog/[slug]/page.tsx
export default async function BlogPost({ params }: Props) {
  // Apenas renderiza o post, sem metadata
  const { slug } = await params
  const post = posts.find((p) => p.slug === slug)
  return <article>{post?.title}</article>
}
// Resultado: herda apenas title/description do layout, sem imagem OG
```

**After (com generateMetadata):**
```typescript
// app/blog/[slug]/page.tsx
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = posts.find((p) => p.slug === slug)

  if (!post) return {}

  return {
    title: post.title,
    description: post.description,
    authors: [{ name: post.author.name }],
    robots: { index: true, follow: true },
    openGraph: { images: [post.image] },
  }
}

export default async function BlogPost({ params }: Props) {
  const { slug } = await params
  const post = posts.find((p) => p.slug === slug)
  return <article>{post?.title}</article>
}
// Resultado: meta tags completas, preview rico no Discord/Twitter/LinkedIn
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Pagina estatica (sem params) | Use `export const metadata: Metadata = {...}` diretamente |
| Pagina dinamica (com params) | Use `export async function generateMetadata()` |
| Post sem imagem propria | Defina imagem padrao no layout para fallback |
| Dados vem de API externa | Use fetch dentro de generateMetadata (Next.js deduplica automaticamente) |
| Mesma tipagem de Props no componente e no generateMetadata | Crie um type Props compartilhado no topo do arquivo |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `export function generatemetadata()` (lowercase) | `export function generateMetadata()` (camelCase exato) |
| `params.slug` direto sem await | `const { slug } = await params` |
| Layout sem imagem OG padrao | Layout com `openGraph: { images: [...] }` |
| Retornar undefined quando post nao existe | Retornar `{}` (objeto vazio) |
| Duplicar tipagem de Props para componente e metadata | Compartilhar um unico type Props |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
