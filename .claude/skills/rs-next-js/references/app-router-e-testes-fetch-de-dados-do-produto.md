---
name: rs-nextjs-app-router-fetch-produto
description: "Applies Next.js App Router patterns for fetching single-resource data via dynamic API routes and server components. Use when user asks to 'fetch product details', 'create dynamic API route', 'get data by slug', 'build product page', or 'use params in Next.js route handler'. Covers dynamic [param] folders, route handler typing, Zod parse validation, server-side fetch with revalidation, and page params interface. Make sure to use this skill whenever building detail pages or dynamic API routes in Next.js App Router. Not for client-side fetching, React Query, or Pages Router patterns."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: next-js
  module: app-router-e-testes
  tags: [next-js, dynamic-routes, route-handler, zod, server-components, data-fetching, revalidation]
---

# Fetch de Dados em Pagina Dinamica (Next.js App Router)

> Criar rotas dinamicas na API e consumir nos server components usando params tipados e cache com revalidacao.

## Rules

1. **Use colchetes para parametros dinamicos** — `api/products/[slug]/route.ts` nao `api/products/route.ts?slug=x`, porque o App Router usa file-system routing para parametros
2. **Tipe o segundo argumento do route handler** — `{ params: { slug: string } }` nao `any`, porque o Next passa params como segundo argumento do GET
3. **Use Zod parse (nao safeParse) em route handlers** — parse dispara throw automaticamente e interrompe execucao, safeParse e para quando voce precisa do fluxo condicional sem throw
4. **Retorne status semanticos** — `Response.json({ message }, { status: 400 })` quando o recurso nao existe por input invalido, nao 404 (a rota existe, o produto nao)
5. **Crie funcoes de fetch isoladas por recurso** — `getProduct(slug)` separado de `getFeaturedProducts()`, porque cada um tem seu proprio cache e revalidacao
6. **Inclua revalidate no fetch** — `next: { revalidate: 3600 }` para evitar chamadas repetidas dentro do intervalo, o cache e por URL completa incluindo o slug

## How to write

### Route handler dinamico

```typescript
// app/api/products/[slug]/route.ts
import { z } from 'zod'
import data from '../data.json'

export async function GET(
  _: Request,
  { params }: { params: { slug: string } }
) {
  const slug = z.string().parse(params.slug)

  const product = data.products.find((p) => p.slug === slug)

  if (!product) {
    return Response.json(
      { message: 'Product not found.' },
      { status: 400 }
    )
  }

  return Response.json(product)
}
```

### Funcao de fetch no server component

```typescript
// app/product/[slug]/page.tsx
import { api } from '@/data/api'
import { Product } from '@/data/types/product'

async function getProduct(slug: string): Promise<Product> {
  const response = await api(`/products/${slug}`, {
    next: { revalidate: 60 * 60 }, // 1 hora
  })

  const product = await response.json()
  return product
}
```

### Pagina com params tipados

```typescript
interface ProductProps {
  params: { slug: string }
}

export default async function ProductPage({ params }: ProductProps) {
  const product = await getProduct(params.slug)

  return (
    <div>
      <img src={product.image} alt="" />
      <h1>{product.title}</h1>
      <p>{product.description}</p>
      <span>
        {product.price.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        })}
      </span>
    </div>
  )
}
```

## Example

**Before (sem tipagem, sem validacao):**
```typescript
export async function GET(req, context) {
  const slug = context.params.slug
  const product = data.find(p => p.slug === slug)
  return new Response(JSON.stringify(product))
}
```

**After (com Zod, tipagem e error handling):**
```typescript
export async function GET(
  _: Request,
  { params }: { params: { slug: string } }
) {
  const slug = z.string().parse(params.slug)
  const product = data.products.find((p) => p.slug === slug)

  if (!product) {
    return Response.json({ message: 'Product not found.' }, { status: 400 })
  }

  return Response.json(product)
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Parametro nao usado no handler (ex: request) | Use `_` como nome — pattern para indicar parametro ignorado |
| Parse vs SafeParse | Use `parse` em route handlers (throw automatico), `safeParse` quando precisa de fluxo condicional |
| Cache por recurso | O revalidate do fetch e por URL completa — `/products/camiseta` e `/products/moletom` tem caches independentes |
| Testar sem cache no browser | DevTools > Network > Disable Cache + Ctrl+Shift+R |
| Mesmo dado em 2 componentes | Faca a mesma chamada fetch nos dois — React Request Memoization deduplica automaticamente |

## Anti-patterns

| Nunca escreva | Escreva |
|---------------|---------|
| `export async function GET(req, ctx)` sem tipos | `GET(_: Request, { params }: { params: { slug: string } })` |
| `new Response(JSON.stringify(data))` | `Response.json(data)` |
| `return new NextResponse(null, { status: 404 })` para produto nao encontrado | `Response.json({ message: '...' }, { status: 400 })` |
| fetch sem revalidate em server component | `api('/path', { next: { revalidate: 3600 } })` |
| Passar dados via props entre componentes para evitar refetch | Fazer fetch no componente que precisa — memoization deduplica |

## Troubleshooting

### Dados cacheados nao atualizam apos mutacao
**Symptom:** Apos criar/editar/deletar, a listagem mostra dados antigos
**Cause:** Cache do Next.js serve a versao antiga da pagina
**Fix:** Usar `revalidatePath('/caminho')` ou `revalidateTag('tag')` na server action apos a mutacao. Verificar que o path passado corresponde exatamente a rota da listagem

### fetch retorna dados stale em producao
**Symptom:** Dados frescos em desenvolvimento mas desatualizados em producao
**Cause:** Em producao, Next.js aplica cache agressivo por padrao em fetch requests
**Fix:** Adicionar `{ cache: 'no-store' }` ao fetch para desabilitar cache, ou usar `{ next: { revalidate: N } }` para ISR

## Deep reference library

- [deep-explanation.md](../../../data/skills/next-js-app-router-e-testes/rs-next-js-app-router-e-testes-fetch-de-dados-do-produto/references/deep-explanation.md) — No Next.js App Router, a estrutura de pastas define as rotas. Quando voce cria `api/products/[slug]/
- [code-examples.md](../../../data/skills/next-js-app-router-e-testes/rs-next-js-app-router-e-testes-fetch-de-dados-do-produto/references/code-examples.md) — app/
