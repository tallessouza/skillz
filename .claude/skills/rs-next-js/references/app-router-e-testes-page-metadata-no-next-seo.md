---
name: rs-nextjs-app-router-page-metadata-seo
description: "Applies Next.js App Router metadata patterns for SEO when building pages. Use when user asks to 'add SEO', 'set page title', 'add metadata', 'configure open graph', 'generate dynamic metadata', or creates new Next.js pages. Enforces generateMetadata for dynamic routes, title templates in layouts, and leverages React memoization for deduplicated fetches. Make sure to use this skill whenever creating or editing Next.js App Router pages that need titles or meta tags. Not for Pages Router, static HTML, or non-Next.js frameworks."
---

# Page Metadata no Next.js (SEO)

> Cada pagina exporta seus metadados; layouts definem templates; rotas dinamicas usam generateMetadata com fetch memoizado.

## Rules

1. **Exporte `metadata` estatico em layouts e paginas fixas** — `export const metadata: Metadata = { title: '...' }`, porque e a forma declarativa do App Router para compor meta tags no HTML
2. **Use title template no layout raiz** — `title: { template: '%s | SiteName', default: 'SiteName' }`, porque centraliza o sufixo e define fallback quando a pagina nao exporta titulo
3. **Use `generateMetadata` em rotas dinamicas** — paginas com `[slug]` ou `[id]` precisam de funcao async que recebe params e retorna Metadata, porque o titulo depende de dados do servidor
4. **Reutilize a mesma funcao de fetch no generateMetadata e no componente** — React Server Components memoizam chamadas HTTP identicas na mesma pagina, porque o framework deduplica automaticamente, sem custo extra
5. **Retorne apenas o titulo especifico da pagina** — o template do layout ja adiciona o sufixo, porque duplicar o nome do site no titulo da pagina gera "Site | Site"
6. **Explore todas as propriedades de Metadata** — description, keywords, openGraph, twitter, robots, icons, manifest, porque o tipo Metadata do Next.js cobre todas as meta tags padrao de SEO

## How to write

### Layout com title template

```typescript
// app/layout.tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    template: '%s | DevStore',
    default: 'DevStore',
  },
}
```

### Pagina estatica com metadata

```typescript
// app/(store)/page.tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Home',
}
```

### Rota dinamica com generateMetadata

```typescript
// app/(store)/product/[slug]/page.tsx
import type { Metadata } from 'next'

interface ProductPageProps {
  params: { slug: string }
}

async function getProduct(slug: string) {
  const response = await fetch(`https://api.example.com/products/${slug}`)
  return response.json()
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const product = await getProduct(params.slug)

  return {
    title: product.title,
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await getProduct(params.slug)
  // React memoiza: getProduct NAO e chamado 2x
  return <h1>{product.title}</h1>
}
```

## Example

**Before (sem metadata dinamico):**
```typescript
// Todas as paginas mostram "DevStore" no titulo
// Pagina de produto nao tem titulo proprio
export default async function ProductPage({ params }: Props) {
  const product = await getProduct(params.slug)
  return <div>{product.title}</div>
}
```

**After (com generateMetadata):**
```typescript
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await getProduct(params.slug)
  return { title: product.title }
}

export default async function ProductPage({ params }: Props) {
  const product = await getProduct(params.slug)
  // Resultado no browser: "Camiseta IO 2022 | DevStore"
  return <div>{product.title}</div>
}
```

## Heuristics

| Situacao | Acao |
|----------|------|
| Pagina sem dados dinamicos | Exporte `const metadata: Metadata` estatico |
| Pagina com params dinamicos (slug, id) | Use `generateMetadata` async |
| Layout raiz da aplicacao | Configure `title.template` e `title.default` |
| Precisa de OG image, description | Adicione propriedades ao objeto Metadata |
| Mesmo fetch no componente e no generateMetadata | Reutilize a funcao — React deduplica |

## Anti-patterns

| Nunca faca | Faca assim |
|------------|------------|
| Titulo fixo em pagina dinamica | `generateMetadata` com fetch dos dados |
| `title: 'Produto | DevStore'` na pagina | `title: product.title` (template do layout adiciona sufixo) |
| Criar cache manual para evitar fetch duplo no generateMetadata | Confiar na memoizacao do React Server Components |
| Ignorar metadata em paginas internas | Cada pagina deve exportar pelo menos `title` |
| `title: string` no layout raiz | `title: { template, default }` para flexibilidade |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/next-js/rs-next-js-app-router-e-testes-page-metadata-no-next-seo/references/deep-explanation.md)
- [Code examples](../../../data/skills/next-js/rs-next-js-app-router-e-testes-page-metadata-no-next-seo/references/code-examples.md)
