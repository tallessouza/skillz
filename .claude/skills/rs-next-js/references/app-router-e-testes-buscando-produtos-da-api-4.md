---
name: rs-nextjs-app-router-busca-api
description: "Applies Next.js App Router search page patterns when building product search, filtering, or query-based pages. Use when user asks to 'create a search page', 'fetch products by query', 'use searchParams', 'redirect if no query', or 'server component URL params'. Covers searchParams props vs useSearchParams, redirect for missing params, and API fetching with revalidation. Make sure to use this skill whenever implementing search or filter pages in Next.js App Router. Not for client-side state management, pagination, or static page generation."
---

# Buscando Produtos da API — Search Page no Next.js App Router

> Em Server Components, acesse parametros de busca via props `searchParams` em vez de `useSearchParams`, e proteja a pagina com redirect quando o parametro obrigatorio estiver ausente.

## Rules

1. **Use `searchParams` das props em Server Components** — `useSearchParams` so funciona em Client Components, porque depende do browser. Server Components recebem `searchParams` automaticamente nas props da pagina
2. **Redirecione quando parametro obrigatorio estiver ausente** — use `redirect('/')` de `next/navigation` no topo da funcao, porque uma pagina de busca sem query nao faz sentido para o usuario
3. **Crie funcoes de fetch separadas por contexto** — `getFeaturedProducts` para home, `searchProducts` para busca, porque cada uma tem URL, parametros e revalidacao diferentes
4. **Passe query params na URL do fetch** — use template literal com `?q=${query}`, porque Next.js server-side fetch nao tem acesso automatico aos search params do browser
5. **Configure `revalidate` adequado ao contexto** — busca pode ter revalidate menor que dados estaticos, porque resultados de busca mudam com mais frequencia
6. **Tipagem explicita para props da pagina** — crie interface com `searchParams` tipado, porque garante autocomplete e previne erros de acesso a propriedades

## How to write

### Props da pagina com searchParams

```typescript
interface SearchProps {
  searchParams: { q: string }
}

export default async function Search({ searchParams }: SearchProps) {
  const { q: query } = searchParams

  if (!query) {
    redirect('/')
  }

  const products = await searchProducts(query)
  // render products
}
```

### Funcao de busca na API

```typescript
async function searchProducts(query: string): Promise<Product[]> {
  const response = await fetch(`${env.APP_URL}/api/products/search?q=${query}`, {
    next: { revalidate: 60 * 60 }, // 1 hora
  })
  const products = await response.json()
  return products
}
```

### Listagem com map

```typescript
return (
  <div>
    <p>Resultados para: <span>{query}</span></p>
    {products.map((product) => (
      <Link key={product.id} href={`/product/${product.slug}`}>
        <Image src={product.image} alt="" width={480} height={480} />
        <span>{product.title}</span>
        <span>{product.price}</span>
      </Link>
    ))}
  </div>
)
```

## Example

**Before (usando useSearchParams em Server Component — erro):**
```typescript
// app/search/page.tsx
'use client' // forçado a virar Client Component

import { useSearchParams } from 'next/navigation'

export default function Search() {
  const searchParams = useSearchParams()
  const query = searchParams.get('q')
  // perde SSR, perde SEO, perde performance
}
```

**After (searchParams via props — Server Component):**
```typescript
// app/search/page.tsx
import { redirect } from 'next/navigation'

interface SearchProps {
  searchParams: { q: string }
}

export default async function Search({ searchParams }: SearchProps) {
  const { q: query } = searchParams

  if (!query) {
    redirect('/')
  }

  const products = await searchProducts(query)

  return (
    <div>
      <p>Resultados para: <span>{query}</span></p>
      {products.map((product) => (
        <Link key={product.id} href={`/product/${product.slug}`}>
          <Image src={product.image} alt="" width={480} height={480} />
          <span>{product.title}</span>
          <span>{product.price}</span>
        </Link>
      ))}
    </div>
  )
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Precisa de search params em Server Component | Use props `searchParams` da pagina |
| Precisa de search params em Client Component filho | Use `useSearchParams()` hook |
| Pagina nao faz sentido sem um parametro | `redirect('/')` no topo |
| Fetch de busca vs fetch de listagem | Funcoes separadas com nomes descritivos |
| Revalidacao de resultados de busca | 60s a 3600s dependendo da frequencia de atualizacao |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| `'use client'` so para acessar searchParams | `searchParams` nas props do Server Component |
| Deixar pagina de busca acessivel sem query | `if (!query) redirect('/')` |
| Reusar `getFeaturedProducts` para busca | Criar `searchProducts(query)` dedicada |
| Hardcodar texto de busca | Usar o valor de `query` dinamicamente |
| Fetch sem revalidate em pagina de busca | `next: { revalidate: 3600 }` explicito |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/next-js/rs-next-js-app-router-e-testes-buscando-produtos-da-api-4/references/deep-explanation.md)
- [Code examples](../../../data/skills/next-js/rs-next-js-app-router-e-testes-buscando-produtos-da-api-4/references/code-examples.md)
