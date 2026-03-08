---
name: rs-nextjs-app-router-api-busca-produtos
description: "Applies Next.js App Router API route patterns for search endpoints when building product search, filtering, or query parameter handling. Use when user asks to 'create a search route', 'filter products', 'handle query params in Next.js', 'build search API', or 'use NextRequest'. Enforces NextRequest typing, Zod validation of search params, and toLocaleLowerCase filtering. Make sure to use this skill whenever creating API routes that receive query parameters in Next.js App Router. Not for frontend search UI, database queries, or full-text search engine setup."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: next-js
  module: app-router-e-testes
  tags: [api-routes, search, NextRequest, zod, query-params, app-router]
---

# API: Busca de Produtos no Next.js App Router

> Rotas de busca no App Router usam NextRequest para acessar searchParams, validam com Zod, e filtram com toLocaleLowerCase.

## Rules

1. **Use NextRequest, nao Request** — `import { NextRequest } from 'next/server'`, porque Request nativo nao expoe `nextUrl.searchParams`
2. **Valide query params com Zod** — `z.string().parse(searchParams.get('q'))`, porque params de URL sao sempre string ou null e precisam de validacao
3. **Use toLocaleLowerCase para busca case-insensitive** — nao use `.toLowerCase()`, porque `toLocaleLowerCase()` lida corretamente com acentuacao e caracteres locais
4. **Search params vem via query string, nao via path params** — `/search?q=moletom` nao `/search/moletom`, porque path params sao para identificadores, query strings sao para filtros
5. **Retorne array filtrado como JSON** — `NextResponse.json(products)`, mantendo o contrato da API consistente

## How to write

### Rota de busca com NextRequest

```typescript
// app/api/products/search/route.ts
import { z } from 'zod'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const query = z.string().parse(searchParams.get('q'))

  const products = data.products.filter((product) => {
    return product.title
      .toLocaleLowerCase()
      .includes(query.toLocaleLowerCase())
  })

  return NextResponse.json(products)
}
```

## Example

**Before (usando Request nativo e sem validacao):**
```typescript
export async function GET(request: Request) {
  const url = new URL(request.url)
  const query = url.searchParams.get('q') // pode ser null

  const products = data.products.filter((p) =>
    p.title.toLowerCase().includes(query.toLowerCase()) // erro se null
  )

  return Response.json(products)
}
```

**After (com NextRequest e Zod):**
```typescript
import { z } from 'zod'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const query = z.string().parse(searchParams.get('q'))

  const products = data.products.filter((product) => {
    return product.title
      .toLocaleLowerCase()
      .includes(query.toLocaleLowerCase())
  })

  return NextResponse.json(products)
}
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Rota recebe filtro/busca | Use query params (`?q=`) com NextRequest |
| Rota identifica recurso unico | Use path params (`/[slug]`) com params |
| Precisa comparar strings ignorando case | `toLocaleLowerCase()` em ambos os lados |
| Query param pode nao existir | Zod lanca erro automaticamente — trate no error boundary |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `request: Request` em API routes do App Router | `request: NextRequest` |
| `new URL(request.url).searchParams` | `request.nextUrl.searchParams` |
| `.toLowerCase()` para busca | `.toLocaleLowerCase()` |
| `searchParams.get('q')` sem validacao | `z.string().parse(searchParams.get('q'))` |
| Path param para busca `/search/moletom` | Query param `/search?q=moletom` |

## Troubleshooting

### Busca nao retorna resultados
**Symptom:** Campo de busca nao filtra ou retorna lista vazia
**Cause:** Query parameter nao esta sendo lido corretamente ou filtro no servidor esta incorreto
**Fix:** Verificar que o search param esta sendo passado via URL (`?search=termo`). No servidor, usar `searchParams` da pagina para acessar o valor

### Busca recarrega a pagina inteira
**Symptom:** Ao digitar no campo de busca, toda a pagina recarrega
**Cause:** Formulario fazendo submit tradicional ao inves de navegacao client-side
**Fix:** Usar `router.push()` com query params ao inves de form submit. Debounce no onChange para evitar requisicoes excessivas

## Deep reference library

- [deep-explanation.md](../../../data/skills/next-js-app-router-e-testes/rs-next-js-app-router-e-testes-api-busca-de-produtos/references/deep-explanation.md) — O Next.js estende a Native Web Fetch API. Dentro dessa API existem globais como `Headers`, `Request`
- [code-examples.md](../../../data/skills/next-js-app-router-e-testes/rs-next-js-app-router-e-testes-api-busca-de-produtos/references/code-examples.md) — app/
