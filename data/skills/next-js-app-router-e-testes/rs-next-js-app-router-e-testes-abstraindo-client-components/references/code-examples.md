# Code Examples: Abstraindo Client Components

## Exemplo 1: O problema — async em Client Component

Codigo que gera warning do ESLint e causa re-fetches:

```typescript
// app/catalog/product/[slug]/page.tsx
'use client'

import { useState } from 'react'

// ESLint warning: nao use async em Client Components
export default async function Product({ params }: { params: { slug: string } }) {
  const product = await fetch(`/api/products/${params.slug}`).then(r => r.json())

  const [count, setCount] = useState(0)

  function addToCart() {
    setCount(state => state + 1)
  }

  // Problema: cada vez que count muda, todo este codigo re-executa
  // incluindo o fetch acima
  console.log('count', count)

  return (
    <div>
      <h1>{product.name}</h1>
      <p>{product.description}</p>
      <button onClick={addToCart}>
        Adicionar ao carrinho ({count})
      </button>
    </div>
  )
}
```

### Por que e problematico

Ao abrir o console do navegador e clicar no botao "Adicionar ao carrinho", voce vera o `console.log` executando repetidamente. Cada clique causa uma re-renderizacao, que re-executa todo o corpo da funcao — incluindo qualquer `await fetch()`.

## Exemplo 2: A solucao — extrair Client Component

### Passo 1: Criar o Client Component isolado

```typescript
// app/catalog/product/[slug]/add-to-cart-button.tsx
'use client'

import { useState } from 'react'

export function AddToCartButton() {
  const [count, setCount] = useState(0)

  function addToCart() {
    setCount(state => state + 1)
  }

  return (
    <button onClick={addToCart}>
      Adicionar ao carrinho ({count})
    </button>
  )
}
```

### Passo 2: Manter a pagina como Server Component

```typescript
// app/catalog/product/[slug]/page.tsx
// SEM 'use client' — este e um Server Component
import { AddToCartButton } from './add-to-cart-button'

export default async function Product({ params }: { params: { slug: string } }) {
  // await funciona aqui porque e Server Component — executa uma unica vez
  const product = await fetch(`/api/products/${params.slug}`).then(r => r.json())

  return (
    <div>
      <h1>{product.name}</h1>
      <p>{product.description}</p>
      <span>{product.price}</span>
      {/* Client Component filho — so este JS vai pro navegador */}
      <AddToCartButton />
    </div>
  )
}
```

### Resultado

- A pagina `Product` e Server Component: HTML gerado uma vez no servidor, fetch executa uma unica vez
- O `AddToCartButton` e Client Component: apenas o JS deste botao e enviado ao navegador
- Todo o HTML estatico (h1, p, span) nao requer JavaScript no navegador

## Exemplo 3: Fetch em Client Component com useEffect

Quando voce realmente precisa fazer fetch dentro de um Client Component:

```typescript
'use client'

import { useEffect, useState } from 'react'

interface Product {
  id: string
  name: string
  price: number
}

export function ProductSearch() {
  const [query, setQuery] = useState('')
  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    if (!query) return

    fetch(`/api/products?q=${query}`)
      .then(res => res.json())
      .then(data => setProducts(data))
  }, [query])

  return (
    <div>
      <input
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Buscar produtos..."
      />
      <ul>
        {products.map(product => (
          <li key={product.id}>{product.name} - R${product.price}</li>
        ))}
      </ul>
    </div>
  )
}
```

## Exemplo 4: Fetch com React Query (TanStack Query)

```typescript
'use client'

import { useQuery } from '@tanstack/react-query'

interface Product {
  id: string
  name: string
  price: number
}

export function ProductDetails({ productId }: { productId: string }) {
  const { data: product, isLoading } = useQuery<Product>({
    queryKey: ['product', productId],
    queryFn: () =>
      fetch(`/api/products/${productId}`).then(res => res.json()),
  })

  if (isLoading) return <p>Carregando...</p>

  return (
    <div>
      <h2>{product?.name}</h2>
      <p>R$ {product?.price}</p>
    </div>
  )
}
```

## Exemplo 5: Multiplos Client Components isolados em uma pagina

```typescript
// app/product/[slug]/page.tsx — Server Component
import { AddToCartButton } from './add-to-cart-button'
import { ProductImageGallery } from './product-image-gallery'
import { ProductReviews } from './product-reviews'

export default async function ProductPage({ params }) {
  const product = await fetch(`${env.API_URL}/products/${params.slug}`).then(r => r.json())

  return (
    <main>
      {/* Estatico — Server Component, zero JS */}
      <h1>{product.name}</h1>
      <p>{product.description}</p>
      <span>R$ {product.price}</span>

      {/* Interativo — cada um e um Client Component pequeno */}
      <ProductImageGallery images={product.images} />
      <AddToCartButton productId={product.id} />
      <ProductReviews productId={product.id} />
    </main>
  )
}
```

Cada Client Component filho envia apenas seu proprio JavaScript ao navegador. O conteudo estatico (h1, p, span) nao requer JS algum.