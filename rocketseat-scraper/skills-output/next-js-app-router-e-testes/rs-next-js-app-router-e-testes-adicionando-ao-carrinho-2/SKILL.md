---
name: rs-nextjs-app-router-isolate-client
description: "Enforces client component isolation pattern in Next.js App Router when writing React components. Use when user asks to 'add interactivity', 'use context', 'create a component with hooks', 'add to cart', or any task mixing server and client components. Applies rule: extract only the interactive part into a separate client component, keep parent as server component. Make sure to use this skill whenever generating Next.js App Router components that need hooks or browser APIs. Not for API routes, middleware, or pure server-side logic."
---

# Isolamento de Client Components no Next.js App Router

> Extraia apenas o pedaco interativo em um Client Component separado — nunca transforme o componente pai inteiro em client.

## Rules

1. **Isole ao maximo os Client Components** — se apenas um botao precisa de `useState` ou `useContext`, extraia somente esse botao para um componente separado com `'use client'`, porque todo o restante do HTML estatico nao precisa enviar JavaScript para o navegador
2. **Nunca coloque `'use client'` no componente pai por conveniencia** — funciona, mas envia JavaScript desnecessario para o browser, degradando performance
3. **Crie componentes wrapper para hooks de contexto** — quando um header precisa mostrar dados do carrinho, crie um `CartWidget` que encapsula apenas a parte que usa `useCart`, porque o header inteiro nao precisa ser client
4. **Componentes compartilhados vao em `components/`** — se o componente client sera usado em mais de uma pagina, coloque em `components/`. Se for exclusivo de uma pagina, pode ficar na pasta da propria pagina
5. **Props sao a ponte server-client** — passe dados do server component (como `productId`) via props para o client component, porque o client component nao tem acesso direto aos dados do servidor

## How to write

### Extraindo widget interativo de um Server Component

```tsx
// components/cart-widget.tsx
'use client'

import { useCart } from '@/contexts/cart-context'
import { ShoppingBag } from 'lucide-react'

export function CartWidget() {
  const { items } = useCart()

  return (
    <div>
      <ShoppingBag />
      <span>{items.length}</span>
    </div>
  )
}
```

```tsx
// components/header.tsx  (continua Server Component — SEM 'use client')
import { CartWidget } from './cart-widget'

export function Header() {
  return (
    <header>
      <nav>{/* HTML estatico */}</nav>
      <CartWidget />
    </header>
  )
}
```

### Extraindo botao interativo

```tsx
// components/add-to-cart-button.tsx
'use client'

import { useCart } from '@/contexts/cart-context'

interface AddToCartButtonProps {
  productId: number
}

export function AddToCartButton({ productId }: AddToCartButtonProps) {
  const { addToCart } = useCart()

  function handleAddToCart() {
    addToCart(productId)
  }

  return (
    <button onClick={handleAddToCart}>
      Adicionar ao carrinho
    </button>
  )
}
```

## Example

**Before (componente inteiro vira client — errado):**
```tsx
'use client' // PROBLEMA: pagina inteira vira client component

import { useCart } from '@/contexts/cart-context'

export default function ProductPage({ params }) {
  const product = await api.getProduct(params.slug) // ERRO: await nao funciona em client
  const { addToCart } = useCart()

  return (
    <div>
      <img src={product.image} />
      <h1>{product.name}</h1>
      <p>{product.description}</p>
      <button onClick={() => addToCart(product.id)}>
        Adicionar ao carrinho
      </button>
    </div>
  )
}
```

**After (apenas o botao e client):**
```tsx
// app/store/product/[slug]/page.tsx (Server Component — pode usar async/await)
import { AddToCartButton } from '@/components/add-to-cart-button'

export default async function ProductPage({ params }) {
  const product = await api.getProduct(params.slug)

  return (
    <div>
      <img src={product.image} />
      <h1>{product.name}</h1>
      <p>{product.description}</p>
      <AddToCartButton productId={product.id} />
    </div>
  )
}
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Componente precisa de `useContext`, `useState`, `useEffect` | Extraia apenas a parte que usa o hook em um Client Component |
| Header/layout precisa mostrar dado de contexto | Crie um widget client (ex: `CartWidget`) e use dentro do server component |
| Botao precisa disparar acao com contexto | Crie componente de botao client, receba dados via props |
| Componente usado em multiplas paginas | Coloque em `components/` |
| Componente exclusivo de uma pagina | Pode ficar na pasta da pagina |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `'use client'` no layout ou page inteira | Extrair somente o pedaco interativo |
| `'use client'` no header para acessar carrinho | `CartWidget` separado com `'use client'` |
| Fetch de dados dentro de client component | Fetch no server component, passe via props |
| Logica de contexto espalhada no server component | Componente client encapsulado que usa o hook |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
