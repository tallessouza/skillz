---
name: rs-next-js-criando-pagina-de-post
description: "Enforces Next.js App Router dynamic route patterns when creating detail pages with slugs. Use when user asks to 'create a dynamic page', 'add a post page', 'handle route params in app router', 'fix 404 in next.js', or 'type async params'. Applies rules: folder-based dynamic routes with [slug], async params with Promise typing, notFound() for missing data, isolate client components. Make sure to use this skill whenever building dynamic routes in Next.js App Router. Not for Pages Router, static pages, or API routes."
---

# Criando Pagina Dinamica no App Router

> Rotas dinamicas no App Router usam pastas com colchetes, params assincronos tipados, e isolamento cirurgico de client components.

## Rules

1. **Rotas devem ser unicas entre app/ e pages/** — nao pode existir `/blog` em ambos, porque o Next.js bloqueia rotas duplicadas entre os dois sistemas de roteamento
2. **Rotas dinamicas usam pasta com colchetes** — crie `[slug]/page.tsx` nao `[slug].tsx`, porque no App Router toda rota precisa de um `page.tsx` dentro de uma pasta
3. **Params sao assincronos (Next.js 15+)** — type como `Promise<{ slug: string }>` e use `await` para extrair, porque desde a versao 15 params retornam promises
4. **Use `notFound()` para dados inexistentes** — importe de `next/navigation` e chame quando `find()` retorna undefined, porque redireciona automaticamente para a pagina 404 customizada
5. **Nunca transforme pagina inteira em client component** — isole apenas o trecho que precisa de hooks/interatividade em um componente separado com `"use client"`, porque o objetivo e manter o maximo como server components
6. **Nomeie o tipo dos params explicitamente** — crie um type com apenas os params utilizados, porque torna explicito o contrato da rota

## How to write

### Estrutura de pastas para rota dinamica

```
app/
  blog/
    [slug]/
      page.tsx    ← pagina do post
    page.tsx      ← listagem do blog
```

### Tipagem e extracao de params assincronos

```typescript
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

### Isolamento de client component

```typescript
// app/blog/[slug]/page.tsx — SERVER component (default)
import { ShareButton } from './share-button'

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params
  const post = posts.find(p => p.slug === slug)
  if (!post) notFound()

  return (
    <article>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
      <ShareButton url={post.slug} /> {/* apenas este e client */}
    </article>
  )
}

// app/blog/[slug]/share-button.tsx — CLIENT component
"use client"
export function ShareButton({ url }: { url: string }) {
  // hooks e interatividade aqui
}
```

## Example

**Before (erro: use client na pagina inteira):**
```typescript
"use client" // transforma TUDO em client component

import { useClipboard } from '@/hooks/use-clipboard'

export default function BlogPostPage({ params }) {
  // titulo, autor, imagem, conteudo — tudo client side
  // apenas por causa do useClipboard
}
```

**After (isolamento correto):**
```typescript
// page.tsx — server component, sem "use client"
import { ShareSection } from './share-section'

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params
  const post = posts.find(p => p.slug === slug)
  if (!post) notFound()

  return (
    <article>
      <h1>{post.title}</h1>
      <img src={post.image} alt={post.title} />
      <div>{post.content}</div>
      <ShareSection slug={post.slug} />
    </article>
  )
}
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Nome da pasta entre colchetes e `[slug]` | O param acessivel sera `slug` — nome deve coincidir |
| Se fosse `[id]` na pasta | O param seria `id` no type |
| Componente importado em page.tsx usa hook | Extraia para arquivo separado com `"use client"` |
| `find()` pode retornar undefined | Chame `notFound()` antes de continuar |
| Migrating de pages/ para app/ | Renomeie a rota antiga para evitar conflito |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `"use client"` no page.tsx inteiro | Isole apenas o componente interativo |
| `params.slug` sincrono (Next 15+) | `const { slug } = await params` |
| `if (!post) return <div>Not found</div>` | `if (!post) notFound()` |
| Mesma rota em app/ e pages/ | Renomeie uma delas para evitar conflito |
| `props: any` nos params | Type explicitamente com `Promise<{ slug: string }>` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
