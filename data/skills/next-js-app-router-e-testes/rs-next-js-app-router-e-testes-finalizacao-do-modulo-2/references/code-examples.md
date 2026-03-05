# Code Examples: React Fundamentals vs Next.js Específicos

## Exemplos de Server Components (React — portável)

### Fetch de dados em Server Component
```typescript
// app/products/page.tsx
// Isso é REACT — Server Component buscando dados no servidor
// Nenhum JavaScript é enviado ao navegador para este componente
async function ProductsPage() {
  const products = await fetch('https://api.example.com/products')
    .then(res => res.json())

  return (
    <ul>
      {products.map(product => (
        <li key={product.id}>{product.name}</li>
      ))}
    </ul>
  )
}

export default ProductsPage
```

### Separação Client vs Server (React)
```typescript
// components/add-to-cart-button.tsx
// "use client" é diretiva do REACT, não do Next.js
"use client"

import { useState } from 'react'

export function AddToCartButton({ productId }: { productId: string }) {
  const [adding, setAdding] = useState(false)

  async function handleClick() {
    setAdding(true)
    await addToCart(productId)
    setAdding(false)
  }

  return (
    <button onClick={handleClick} disabled={adding}>
      {adding ? 'Adicionando...' : 'Adicionar ao carrinho'}
    </button>
  )
}
```

## Exemplos de features Next.js (específicas)

### Caching e revalidação (Next.js)
```typescript
// Isso é NEXT.JS — configuração de cache específica do framework
async function getProducts() {
  const response = await fetch('https://api.example.com/products', {
    next: { revalidate: 60 * 60 } // revalida a cada hora — API do Next.js
  })
  return response.json()
}
```

### Roteamento por pastas (Next.js)
```
// Estrutura de pastas — convenção NEXT.JS
app/
├── (store)/              # Route group — Next.js
│   ├── layout.tsx        # Layout aninhado — Next.js
│   ├── page.tsx
│   └── product/
│       └── [slug]/
│           └── page.tsx  # Rota dinâmica — Next.js
├── layout.tsx
└── loading.tsx           # Loading UI — Next.js
```

### Metadata (Next.js)
```typescript
// app/product/[slug]/page.tsx
// generateMetadata é API do NEXT.JS
export async function generateMetadata({ params }: Props) {
  const product = await getProduct(params.slug)
  return {
    title: product.name,
    description: product.description,
  }
}
```

## Padrão recomendado: maximizar código React

```typescript
// PREFERIR: lógica no Server Component (React, portável)
async function ProductPage({ params }: { params: { slug: string } }) {
  const product = await getProduct(params.slug)

  return (
    <div>
      <h1>{product.name}</h1>
      <p>{product.description}</p>
      <span>R$ {(product.priceInCents / 100).toFixed(2)}</span>
      {/* Só o botão precisa ser Client Component */}
      <AddToCartButton productId={product.id} />
    </div>
  )
}

// EVITAR: tudo como Client Component (mais JS no navegador)
"use client"
function ProductPage() {
  const [product, setProduct] = useState(null)
  useEffect(() => {
    fetch(`/api/product/${slug}`).then(r => r.json()).then(setProduct)
  }, [slug])
  // ... todo o JS vai para o navegador
}
```