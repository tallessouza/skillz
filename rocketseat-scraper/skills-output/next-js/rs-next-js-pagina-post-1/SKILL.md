---
name: rs-next-js-pagina-post-1
description: "Applies Next.js Pages Router dynamic route patterns when building detail pages with [slug].tsx. Use when user asks to 'create a post page', 'dynamic route next.js', 'pages router slug', 'breadcrumb navigation', or 'detail page from list'. Covers useRouter query extraction, content filtering by slug, breadcrumb component setup, and article layout structure. Make sure to use this skill whenever building detail/single-item pages in Next.js Pages Router. Not for App Router, API routes, or static-only pages."
---

# Pagina de Post com Rota Dinamica (Pages Router)

> Paginas de detalhe usam rotas dinamicas com `[slug].tsx` e extraem o parametro via `useRouter().query`.

## Rules

1. **Nomeie o arquivo pelo parametro dinamico** — `[slug].tsx` onde `slug` corresponde ao segmento dinamico da URL, porque o Next.js usa o nome entre colchetes como chave no `router.query`
2. **Extraia o slug do useRouter** — `router.query.slug` retorna exatamente o valor da URL, porque o nome da propriedade em `query` corresponde ao nome do arquivo
3. **Filtre o conteudo pelo slug** — use `find()` com `includes(slug)` para localizar o item correto na lista de posts
4. **Use breadcrumb para navegacao hierarquica** — paginas de detalhe precisam de caminho de volta claro, porque o usuario precisa saber onde esta na hierarquia
5. **Use tags semanticas** — `main`, `article`, `figure` para o conteudo do post, porque melhora acessibilidade e SEO
6. **Trate o caso undefined** — `find()` pode retornar `undefined`, adicione fallback com operador `!` ou verificacao condicional

## How to write

### Rota dinamica

```typescript
// src/pages/blog/[slug].tsx
// O nome entre colchetes define router.query.slug
import { useRouter } from 'next/router'

export default function PostPage() {
  const router = useRouter()
  const slug = router.query.slug as string
  // slug contem o valor dinamico da URL
}
```

### Busca do post pelo slug

```typescript
import { allPosts } from 'contentlayer/generated'

const post = allPosts.find(
  (post) => post.slug?.includes(slug)
)!
```

### Breadcrumb com Link do Next

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
        <Link href="/blog">Blog</Link>
      </BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <span>{post.title}</span>
    </BreadcrumbItem>
  </BreadcrumbList>
</Breadcrumb>
```

### Layout do artigo

```tsx
<main>
  <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6 lg:gap-12">
    <article className="bg-gray-600 rounded-lg overflow-hidden border border-gray-400">
      <figure className="relative w-full overflow-hidden rounded">
        <Image
          src={post.image}
          alt={post.title}
          className="object-cover"
        />
      </figure>
      {/* Titulo e corpo do post */}
    </article>
  </div>
</main>
```

## Example

**Before (pagina 404 ao clicar no post):**
```
src/pages/blog/
  └── index.tsx  // lista posts, mas clicar leva a 404
```

**After (rota dinamica funcionando):**
```
src/pages/blog/
  ├── index.tsx      // lista de posts
  └── [slug].tsx     // pagina de detalhe do post
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Nome do arquivo entre colchetes | Corresponde a `router.query.nomeDoArquivo` |
| Precisa debugar o router | `console.log(router)` mostra todas as propriedades disponiveis |
| Post pode ser undefined | Use `!` assertion ou early return com 404 |
| Navegacao de volta | Breadcrumb com Link do Next, nao `<a>` nativo |
| Layout com sidebar futura | Use grid com `grid-cols-[1fr_300px]` |

## Anti-patterns

| Nunca faca | Faca assim |
|------------|------------|
| `<a href="/blog">` | `<Link href="/blog">` (client-side navigation) |
| `post.tsx` (nome fixo) | `[slug].tsx` (rota dinamica) |
| `window.location.pathname.split('/')` | `router.query.slug` |
| Ignorar caso undefined do find | Tratar com `!` ou verificacao + 404 |
| Usar `filter()[0]` para item unico | Usar `find()` diretamente |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
