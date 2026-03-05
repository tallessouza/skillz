---
name: rs-nextjs-app-router-abstraindo-client-components
description: "Enforces minimal Client Component boundaries in Next.js App Router projects. Use when user asks to 'create a page', 'add interactivity', 'fetch data in Next.js', 'convert to client component', or 'optimize bundle size'. Applies rules: never use async in Client Components, isolate interactivity into small dedicated Client Components, keep parent components as Server Components for data fetching. Make sure to use this skill whenever generating Next.js App Router code with any interactive elements. Not for React SPA projects without Next.js, or API route handlers."
---

# Abstraindo Client Components

> Isole interatividade no menor componente possivel para enviar menos JavaScript ao navegador.

## Rules

1. **Nunca use async em Client Components** — `use client` + `async function` causa re-execucao do fetch a cada re-render (estado, hook, pai), porque Client Components re-executam todo seu codigo em cada renderizacao
2. **Fetch de dados em Client Components usa useEffect ou React Query** — nao use await direto no corpo do componente, porque estrategias como useEffect, React Query (TanStack Query) ou SWR controlam quando o fetch acontece
3. **Isole interatividade no menor componente possivel** — se apenas um botao precisa de JavaScript, extraia so o botao para um Client Component, porque todo JavaScript de um Client Component e enviado ao navegador
4. **Mantenha o pai como Server Component** — quando precisar de fetch + interatividade na mesma pagina, faca o fetch no Server Component pai e passe dados via props ou renderize Client Components filhos
5. **Identifique Client Components por interatividade** — se o HTML sera estatico, e Server Component; se o usuario interage (onClick, estado, hooks), precisa ser Client Component
6. **Quanto menor o Client Component, melhor** — menos `use client` nao significa zero, significa que cada `use client` cobre a menor area possivel de codigo

## How to write

### Server Component com fetch + Client Component filho

```typescript
// app/product/[slug]/page.tsx (Server Component — SEM use client)
import { AddToCartButton } from './add-to-cart-button'

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const product = await fetch(`${env.API_URL}/products/${params.slug}`).then(r => r.json())

  return (
    <div>
      <h1>{product.name}</h1>
      <p>{product.description}</p>
      <span>{product.price}</span>
      <AddToCartButton productId={product.id} />
    </div>
  )
}
```

### Client Component isolado (minimo)

```typescript
// app/product/[slug]/add-to-cart-button.tsx
'use client'

import { useState } from 'react'

export function AddToCartButton({ productId }: { productId: string }) {
  const [quantity, setQuantity] = useState(0)

  function handleAddToCart() {
    setQuantity(state => state + 1)
  }

  return (
    <button onClick={handleAddToCart}>
      Adicionar ao carrinho ({quantity})
    </button>
  )
}
```

### Fetch em Client Component (quando necessario)

```typescript
'use client'

import { useEffect, useState } from 'react'

export function ProductReviews({ productId }: { productId: string }) {
  const [reviews, setReviews] = useState([])

  useEffect(() => {
    fetch(`/api/products/${productId}/reviews`)
      .then(res => res.json())
      .then(setReviews)
  }, [productId])

  return <ul>{reviews.map(r => <li key={r.id}>{r.text}</li>)}</ul>
}
```

## Example

**Before (componente inteiro como Client Component):**
```typescript
'use client'

import { useState } from 'react'

export default async function Product({ params }) {
  // PROBLEMA: async + use client = fetch re-executa a cada render
  const product = await fetch(`/api/products/${params.slug}`).then(r => r.json())
  const [count, setCount] = useState(0)

  return (
    <div>
      <h1>{product.name}</h1>
      <p>{product.description}</p>
      <p>{product.price}</p>
      <button onClick={() => setCount(s => s + 1)}>
        Adicionar ao carrinho ({count})
      </button>
    </div>
  )
}
```

**After (interatividade isolada):**
```typescript
// page.tsx — Server Component
import { AddToCartButton } from './add-to-cart-button'

export default async function Product({ params }) {
  const product = await fetch(`/api/products/${params.slug}`).then(r => r.json())

  return (
    <div>
      <h1>{product.name}</h1>
      <p>{product.description}</p>
      <p>{product.price}</p>
      <AddToCartButton productId={product.id} />
    </div>
  )
}

// add-to-cart-button.tsx — Client Component (minimo)
'use client'
import { useState } from 'react'

export function AddToCartButton({ productId }: { productId: string }) {
  const [count, setCount] = useState(0)
  return (
    <button onClick={() => setCount(s => s + 1)}>
      Adicionar ao carrinho ({count})
    </button>
  )
}
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Pagina precisa de fetch + botao interativo | Server Component faz fetch, Client Component so pro botao |
| Componente tem onClick, onSubmit, onChange | Extrair esse elemento para Client Component proprio |
| Componente usa useState, useEffect, useRef | Esse componente precisa ser Client Component |
| Div, paragrafo, imagem estatica | Manter no Server Component, nao precisa de JS |
| Precisa fetch em Client Component | useEffect, React Query, SWR — nunca async no corpo |
| 90% do componente e estatico, 10% interativo | Separar os 10% em componente filho com use client |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `'use client'` + `async function Page()` | Server Component async, Client Component filho |
| `'use client'` em pagina inteira por causa de 1 botao | Extrair so o botao como Client Component |
| `await fetch()` dentro de Client Component | `useEffect` + `fetch` ou React Query/SWR |
| Componente enorme com `use client` | Quebrar em Server Component pai + Client Components minimos |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/next-js/rs-next-js-app-router-e-testes-abstraindo-client-components/references/deep-explanation.md)
- [Code examples](../../../data/skills/next-js/rs-next-js-app-router-e-testes-abstraindo-client-components/references/code-examples.md)
