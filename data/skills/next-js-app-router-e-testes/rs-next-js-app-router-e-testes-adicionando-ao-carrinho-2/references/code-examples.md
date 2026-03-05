# Code Examples: Isolamento de Client Components

## Exemplo completo: CartWidget

### Antes — header inteiro como client (nao recomendado)

```tsx
// components/header.tsx
'use client' // Todo o header vira client — desnecessario

import { useCart } from '@/contexts/cart-context'
import { ShoppingBag } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export function Header() {
  const { items } = useCart()

  return (
    <header className="flex items-center justify-between">
      <Link href="/">
        <Image src="/logo.svg" width={120} height={24} alt="Logo" />
      </Link>

      <nav>
        <Link href="/catalog">Catalog</Link>
        <Link href="/about">About</Link>
      </nav>

      <div className="flex items-center gap-2">
        <ShoppingBag className="h-4 w-4" />
        <span>{items.length}</span>
      </div>
    </header>
  )
}
```

### Depois — apenas CartWidget como client

```tsx
// components/cart-widget.tsx
'use client'

import { ShoppingBag } from 'lucide-react'
import { useCart } from '@/contexts/cart-context'

export function CartWidget() {
  const { items } = useCart()

  return (
    <div className="flex items-center gap-2">
      <ShoppingBag className="h-4 w-4" />
      <span>{items.length}</span>
    </div>
  )
}
```

```tsx
// components/header.tsx (Server Component — sem 'use client')
import Image from 'next/image'
import Link from 'next/link'
import { CartWidget } from './cart-widget'

export function Header() {
  return (
    <header className="flex items-center justify-between">
      <Link href="/">
        <Image src="/logo.svg" width={120} height={24} alt="Logo" />
      </Link>

      <nav>
        <Link href="/catalog">Catalog</Link>
        <Link href="/about">About</Link>
      </nav>

      <CartWidget />
    </header>
  )
}
```

## Exemplo completo: AddToCartButton

### Contexto do carrinho (provider)

```tsx
// contexts/cart-context.tsx
'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

interface CartItem {
  productId: number
  quantity: number
}

interface CartContextType {
  items: CartItem[]
  addToCart: (productId: number) => void
}

const CartContext = createContext({} as CartContextType)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])

  function addToCart(productId: number) {
    setItems((state) => {
      const existingItem = state.find((item) => item.productId === productId)

      if (existingItem) {
        return state.map((item) =>
          item.productId === productId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }

      return [...state, { productId, quantity: 1 }]
    })
  }

  return (
    <CartContext.Provider value={{ items, addToCart }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
```

### Layout com provider

```tsx
// app/store/layout.tsx
import { CartProvider } from '@/contexts/cart-context'
import { Header } from '@/components/header'

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <Header />
      {children}
    </CartProvider>
  )
}
```

### Componente do botao (client)

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
    <button
      type="button"
      onClick={handleAddToCart}
      className="flex h-12 items-center justify-center rounded-full bg-emerald-600 font-semibold text-white"
    >
      Adicionar ao carrinho
    </button>
  )
}
```

### Pagina de produto (server — usa o botao client)

```tsx
// app/store/product/[slug]/page.tsx
import { api } from '@/data/api'
import { AddToCartButton } from '@/components/add-to-cart-button'
import Image from 'next/image'

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const product = await api.getProduct(params.slug)

  return (
    <div className="grid grid-cols-3 gap-8">
      <div className="col-span-2">
        <Image src={product.image} width={800} height={800} alt={product.name} />
      </div>

      <div className="flex flex-col justify-center">
        <h1 className="text-3xl font-bold">{product.name}</h1>

        <span className="text-2xl font-semibold">
          {product.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
        </span>

        <p className="text-sm text-zinc-400">
          Em ate 12x sem juros de{' '}
          {(product.price / 12).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
        </p>

        <p className="mt-4 text-zinc-300">{product.description}</p>

        <AddToCartButton productId={product.id} />
      </div>
    </div>
  )
}
```

## Detalhe importante: tipagem do productId

O instrutor originalmente usou `string` para `productId` no contexto, mas percebeu que o ID do produto era numerico e corrigiu para `number` em todos os locais. Sempre alinhe o tipo do ID com o que a API retorna.