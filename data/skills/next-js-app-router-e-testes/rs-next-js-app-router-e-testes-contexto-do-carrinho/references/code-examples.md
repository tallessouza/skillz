# Code Examples: Contexto do Carrinho

## Exemplo completo do contexto

```typescript
// src/contexts/cart-context.tsx
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
  const [cartItems, setCartItems] = useState<CartItem[]>([])

  function addToCart(productId: number) {
    setCartItems((state) => {
      const productInCart = state.some(
        (item) => item.productId === productId,
      )

      if (productInCart) {
        return state.map((item) => {
          if (item.productId === productId) {
            return { ...item, quantity: item.quantity + 1 }
          }
          return item
        })
      }

      return [...state, { productId, quantity: 1 }]
    })
  }

  return (
    <CartContext.Provider value={{ items: cartItems, addToCart }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  return useContext(CartContext)
}
```

## Layout envolvendo com provider

```typescript
// src/app/(store)/layout.tsx
import { CartProvider } from '@/contexts/cart-context'
import { Header } from '@/components/header'
import { ReactNode } from 'react'

export default function StoreLayout({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto grid min-h-screen w-full max-w-[1600px] grid-rows-app gap-5 p-8">
      <CartProvider>
        <Header />
        {children}
      </CartProvider>
    </div>
  )
}
```

## Consumindo o contexto — botao de adicionar

```typescript
// src/components/add-to-cart-button.tsx
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

## Consumindo o contexto — contador no header

```typescript
// src/components/cart-widget.tsx
'use client'

import { useCart } from '@/contexts/cart-context'
import { ShoppingBag } from 'lucide-react'

export function CartWidget() {
  const { items } = useCart()

  return (
    <div className="flex items-center gap-2">
      <ShoppingBag className="h-4 w-4" />
      <span className="text-sm">{items.length}</span>
    </div>
  )
}
```

## Walkthrough da logica addToCart

### Cenario 1: Carrinho vazio, adicionando produto ID 5

```typescript
// Estado inicial: []
// Chamada: addToCart(5)

setCartItems((state) => {
  // state = []
  const productInCart = state.some(item => item.productId === 5)
  // productInCart = false

  // Entra no else: produto NAO esta no carrinho
  return [...state, { productId: 5, quantity: 1 }]
  // Resultado: [{ productId: 5, quantity: 1 }]
})
```

### Cenario 2: Carrinho com produto 5, adicionando produto 5 de novo

```typescript
// Estado: [{ productId: 5, quantity: 1 }]
// Chamada: addToCart(5)

setCartItems((state) => {
  // state = [{ productId: 5, quantity: 1 }]
  const productInCart = state.some(item => item.productId === 5)
  // productInCart = true

  // Entra no if: produto JA esta no carrinho
  return state.map((item) => {
    if (item.productId === 5) {
      return { ...item, quantity: item.quantity + 1 }
      // { productId: 5, quantity: 2 }
    }
    return item
  })
  // Resultado: [{ productId: 5, quantity: 2 }]
})
```

### Cenario 3: Carrinho com produto 5, adicionando produto 8

```typescript
// Estado: [{ productId: 5, quantity: 2 }]
// Chamada: addToCart(8)

setCartItems((state) => {
  const productInCart = state.some(item => item.productId === 8)
  // productInCart = false

  return [...state, { productId: 8, quantity: 1 }]
  // Resultado: [{ productId: 5, quantity: 2 }, { productId: 8, quantity: 1 }]
})
```

## Variacao: Contexto com funcao removeFromCart

```typescript
// Extensao natural do mesmo pattern
interface CartContextType {
  items: CartItem[]
  addToCart: (productId: number) => void
  removeFromCart: (productId: number) => void
}

function removeFromCart(productId: number) {
  setCartItems((state) => {
    return state
      .map((item) => {
        if (item.productId === productId) {
          return { ...item, quantity: item.quantity - 1 }
        }
        return item
      })
      .filter((item) => item.quantity > 0)
  })
}
```

## Demonstracao: children como Server Component

```typescript
// Este layout NAO tem 'use client'
// Header e {children} continuam Server Components
// Apenas CartProvider e Client Component

export default function StoreLayout({ children }: { children: ReactNode }) {
  return (
    <CartProvider>
      {/* Server Component — zero JS no client */}
      <Header />
      {/* Server Component — zero JS no client */}
      {children}
    </CartProvider>
  )
}

// CartProvider tem 'use client' mas recebe children como prop
// O React renderiza children no servidor e passa o HTML pronto
// O CartProvider apenas "encaixa" esse HTML no lugar do {children}
```