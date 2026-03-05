---
name: rs-nextjs-app-router-fetch-produtos-home
description: "Applies Next.js App Router server-side data fetching patterns when building pages that load data from an API. Use when user asks to 'fetch data in Next.js', 'load products on homepage', 'create server component with API call', 'display API data in Next.js page', or 'fetch in App Router'. Enforces async server components, proper typing, URL construction with base URL, and locale-aware price formatting. Make sure to use this skill whenever implementing data fetching in Next.js App Router server components. Not for client components, React Query, SWR, or client-side fetching patterns."
---

# Fetch de Dados em Server Components (Next.js App Router)

> Em Next.js App Router, busque dados diretamente no server component como funcao async — sem useEffect, sem useState, sem loading states client-side.

## Rules

1. **Separe a funcao de fetch do componente** — crie uma funcao dedicada (ex: `getFeaturedProducts`) acima do componente, porque isola a logica de dados da logica de apresentacao
2. **Type o retorno com Promise** — funcoes async sempre retornam Promise, entao tipar como `Promise<Product[]>` garante autocomplete e seguranca de tipos
3. **Base URL sem path segments** — ao usar `new URL(path, baseURL)`, a baseURL nao pode ter caminhos como `/api`, porque `new URL` substitui qualquer path existente na base
4. **Formate precos com toLocaleString** — use `toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })` com `minimumFractionDigits: 0` e `maximumFractionDigits: 0` para remover centavos quando o preco ja esta em centavos
5. **Desestruture arrays para destaque** — use `const [highlighted, ...others] = products` para separar o item principal dos demais, porque e um pattern limpo para layouts com hero + grid
6. **console.log aparece no terminal do servidor** — em server components o log nao aparece no navegador, aparece no terminal onde `next dev` esta rodando

## How to write

### Funcao de fetch tipada

```typescript
import { api } from '@/data/api'

async function getFeaturedProducts(): Promise<Product[]> {
  const response = await api('/products/featured')
  const products = await response.json()
  return products
}
```

### Tipo do produto

```typescript
// @/data/types/product.ts
export interface Product {
  id: number
  title: string
  slug: string
  price: number
  image: string
  description: string
  featured: boolean
}
```

### Server component consumindo dados

```typescript
export default async function Home() {
  const [highlightedProduct, ...otherProducts] = await getFeaturedProducts()

  return (
    <div>
      <Link href={`/product/${highlightedProduct.slug}`}>
        <Image src={highlightedProduct.image} alt="" />
        <span>{highlightedProduct.title}</span>
        <span>
          {highlightedProduct.price.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          })}
        </span>
      </Link>

      {otherProducts.map((product) => (
        <Link key={product.id} href={`/product/${product.slug}`}>
          <Image src={product.image} alt="" />
          <span>{product.title}</span>
          <span>
            {product.price.toLocaleString('pt-BR', {
              style: 'currency',
              currency: 'BRL',
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            })}
          </span>
        </Link>
      ))}
    </div>
  )
}
```

## Example

**Before (client-side fetching — errado em App Router):**
```typescript
'use client'
import { useState, useEffect } from 'react'

export default function Home() {
  const [products, setProducts] = useState([])

  useEffect(() => {
    fetch('/api/products/featured')
      .then(res => res.json())
      .then(setProducts)
  }, [])

  return <div>{products.map(p => <span>{p.title}</span>)}</div>
}
```

**After (server component — correto):**
```typescript
async function getFeaturedProducts(): Promise<Product[]> {
  const response = await api('/products/featured')
  return await response.json()
}

export default async function Home() {
  const [highlighted, ...others] = await getFeaturedProducts()

  return (
    <div>
      <span>{highlighted.title}</span>
      {others.map(p => <span key={p.id}>{p.title}</span>)}
    </div>
  )
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Pagina precisa de dados para renderizar | Server component async + fetch direto |
| Layout hero + grid de itens | Desestruture `[first, ...rest]` |
| Base URL com `new URL()` | Mantenha base URL sem path segments |
| Preco em centavos | `toLocaleString` com `maximumFractionDigits: 0` |
| Precisa testar se dados estao vindo | `console.log` — olhe no terminal do servidor |
| JavaScript desabilitado no browser | Dados continuam aparecendo (server-side) |

## Anti-patterns

| Nunca faca | Faca ao inves |
|------------|---------------|
| `'use client'` + `useEffect` para fetch de pagina | Server component `async function` |
| `useState` para guardar dados de pagina | `const data = await fetchFn()` direto |
| Base URL com path: `http://host/api` | Base URL limpa: `http://host` + prefixo separado |
| `product.price` sem formatacao | `product.price.toLocaleString('pt-BR', {...})` |
| Dados sem tipagem | `Promise<Product[]>` no retorno da funcao |
| Um `<Link>` copiado para cada produto | `.map()` com `key={product.id}` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/next-js/rs-next-js-app-router-e-testes-fetch-de-produtos-na-home/references/deep-explanation.md)
- [Code examples](../../../data/skills/next-js/rs-next-js-app-router-e-testes-fetch-de-produtos-na-home/references/code-examples.md)
