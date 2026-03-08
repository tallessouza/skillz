---
name: rs-next-js-seo-listagem-posts
description: "Applies Next.js metadata patterns for listing pages and layout inheritance. Use when user asks to 'add SEO to a page', 'configure metadata', 'set metatags in Next.js', 'improve SEO', or 'add Open Graph tags'. Enforces metadata hierarchy: layout provides defaults, pages override specific fields. Make sure to use this skill whenever creating or editing Next.js pages that need SEO metadata. Not for dynamic per-item metadata, sitemap generation, or robots.txt configuration."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: next-js
  module: seo
  tags: [seo, metadata, open-graph, layout-inheritance, listing-page, next-js]
---

# SEO em Paginas de Listagem (Next.js)

> Defina metadata no layout como fallback global e sobrescreva em cada page com dados especificos.

## Rules

1. **Exporte `metadata` tipado com `Metadata`** — importe `type { Metadata } from 'next'` e exporte como const, porque o Next.js detecta automaticamente e injeta as metatags
2. **Layout define metadata padrao** — title e description no layout servem como fallback para qualquer pagina filha que nao defina os proprios, porque evita paginas sem SEO
3. **Page sobrescreve layout** — quando a page exporta `metadata`, os campos definidos substituem os do layout, porque o Next.js faz merge automatico com prioridade para a page
4. **Titulo reflete o contexto da pagina** — use "Blog" para listagem, nao o nome do site, porque o titulo aparece na aba e nos resultados de busca
5. **Description especifica para cada pagina** — nunca reutilize a mesma description do layout em pages de listagem, porque cada pagina precisa de texto unico para SEO
6. **Open Graph espelha title e description** — mantenha `openGraph.title` e `openGraph.description` consistentes com os valores principais, porque redes sociais usam OG tags

## How to write

### Metadata no layout (fallback global)

```typescript
// app/layout.tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Meu Site',
  description: 'Descricao padrao do site que aparece quando a page nao define a propria.',
}
```

### Metadata na page de listagem

```typescript
// app/blog/page.tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Dicas e estrategias sobre o tema do blog.',
  openGraph: {
    title: 'Blog',
    description: 'Dicas e estrategias sobre o tema do blog.',
    siteName: 'Meu Site',
    images: [
      {
        url: '/images/blog-cover.png',
        alt: 'Sitemap do blog',
      },
    ],
  },
}
```

## Example

**Before (page sem metadata — herda tudo do layout):**
```typescript
// app/blog/page.tsx
export default function BlogPage() {
  return <div>Lista de posts</div>
}
// Resultado: titulo e description sao os do layout (genéricos)
```

**After (page com metadata especifica):**
```typescript
// app/blog/page.tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Dicas e estrategias para desenvolvedores.',
  openGraph: {
    title: 'Blog',
    description: 'Dicas e estrategias para desenvolvedores.',
    images: [{ url: '/images/blog-cover.png', alt: 'Blog cover' }],
  },
}

export default function BlogPage() {
  return <div>Lista de posts</div>
}
// Resultado: titulo "Blog", description especifica, OG tags para compartilhamento
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Pagina de listagem (blog, produtos, categorias) | Exporte metadata estatica com titulo e description unicos |
| Pagina que nao precisa de SEO customizado | Nao exporte metadata — o layout fornece o fallback |
| Pagina com dados dinamicos (post individual) | Use `generateMetadata()` em vez de export estatico |
| Imagem OG compartilhada entre paginas | Defina no layout; sobrescreva na page apenas se diferente |
| Texto alternativo da imagem OG | Descreva o conteudo visual (ex: "Sitemap do blog") |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| Page de listagem sem `export const metadata` | Sempre exporte metadata com title e description |
| `title: 'Meu Site'` na page de listagem | `title: 'Blog'` (contexto da pagina) |
| Mesma description no layout e na page | Description unica por pagina |
| `openGraph` sem `images` | Sempre inclua ao menos uma imagem OG |
| `generateMetadata()` para paginas estaticas | `export const metadata` (mais simples, sem overhead) |

## Troubleshooting

### Meta tags nao aparecem no preview de compartilhamento
**Symptom:** Ao compartilhar link no WhatsApp/Twitter/LinkedIn, preview aparece sem imagem ou descricao
**Cause:** Falta de tags Open Graph ou tags com valores vazios/incorretos
**Fix:** Adicionar `og:title`, `og:description`, `og:image` via metadata export ou generateMetadata. Verificar com https://cards-dev.twitter.com/validator

### Title duplicado ou generico no Google
**Symptom:** Google mostra title diferente do configurado ou igual para todas as paginas
**Cause:** Title identico em todas as paginas ou faltando configuracao especifica por rota
**Fix:** Configurar metadata unica por pagina usando `export const metadata` ou `generateMetadata` com dados dinamicos

## Deep reference library

- [deep-explanation.md](../../../data/skills/next-js/rs-next-js-melhorando-seo-na-pagina-de-listagem-de-posts/references/deep-explanation.md) — O Next.js implementa um sistema de merge de metadata ao longo da arvore de componentes. O `layout.ts
- [code-examples.md](../../../data/skills/next-js/rs-next-js-melhorando-seo-na-pagina-de-listagem-de-posts/references/code-examples.md) — // app/blog/page.tsx
