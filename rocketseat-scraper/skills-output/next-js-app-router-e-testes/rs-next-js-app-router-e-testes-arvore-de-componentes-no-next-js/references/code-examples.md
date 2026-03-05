# Code Examples: Arvore de Componentes no Next.js

## Exemplo completo: E-commerce com Cart Context

### 1. Cart Context (Client Component)

```tsx
// components/cart-context.tsx
'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

interface CartItem {
  id: string
  name: string
  price: number
}

interface CartContextType {
  items: CartItem[]
  addItem: (item: CartItem) => void
  itemCount: number
}

const CartContext = createContext({} as CartContextType)

// CRITICO: children prop permite que Server Components
// sejam renderizados dentro deste Client Component
export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])

  function addItem(item: CartItem) {
    setItems(prev => [...prev, item])
  }

  return (
    <CartContext.Provider value={{ items, addItem, itemCount: items.length }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
```

### 2. Layout (Server Component) que usa o Provider

```tsx
// app/layout.tsx
import { CartProvider } from '@/components/cart-context'

// Este layout e um Server Component
// CartProvider e Client, mas Header e children continuam Server
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <CartProvider>
          <Header />
          {children}
        </CartProvider>
      </body>
    </html>
  )
}
```

### 3. Header (Server Component) com ilha Client

```tsx
// components/header.tsx
// Sem "use client" — e Server Component por padrao
import { Cart } from './cart'

export function Header() {
  return (
    <header>
      <div>Logo do Site</div>
      <nav>
        <a href="/">Home</a>
        <a href="/catalog">Catalogo</a>
      </nav>
      {/* Cart e Client Component (ilha interativa dentro de Server) */}
      <Cart />
    </header>
  )
}
```

### 4. Cart (Client Component) — ilha interativa

```tsx
// components/cart.tsx
'use client'

import { useCart } from './cart-context'
import { useState } from 'react'

export function Cart() {
  const { items, itemCount } = useCart()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div>
      <button onClick={() => setIsOpen(!isOpen)}>
        Carrinho ({itemCount})
      </button>

      {isOpen && (
        <div className="popover">
          {items.map(item => (
            <div key={item.id}>
              {item.name} - R${item.price}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
```

### 5. Pagina de catalogo (Server Component)

```tsx
// app/catalog/page.tsx
// Server Component — busca dados no servidor
import { ProductList } from '@/components/product-list'

export default async function CatalogPage() {
  const products = await fetch('https://api.example.com/products')
    .then(res => res.json())

  return (
    <main>
      <h1>Catalogo</h1>
      <ProductList products={products} />
    </main>
  )
}
```

### 6. ProductList e Product (Server Components)

```tsx
// components/product-list.tsx
// Server Component
import { Product } from './product'

interface ProductListProps {
  products: Array<{ id: string; name: string; price: number; images: string[] }>
}

export function ProductList({ products }: ProductListProps) {
  return (
    <div className="grid">
      {products.map(product => (
        <Product key={product.id} product={product} />
      ))}
    </div>
  )
}
```

```tsx
// components/product.tsx
// Server Component — mas contem ilhas Client dentro
import { ImageCarousel } from './image-carousel'
import { AddToCart } from './add-to-cart'

interface ProductProps {
  product: { id: string; name: string; price: number; images: string[] }
}

export function Product({ product }: ProductProps) {
  return (
    <div className="product-card">
      {/* Client Component — interatividade de navegacao */}
      <ImageCarousel images={product.images} />

      <h2>{product.name}</h2>
      <p>R${product.price}</p>

      {/* Client Component — onClick para adicionar ao carrinho */}
      <AddToCart item={{ id: product.id, name: product.name, price: product.price }} />
    </div>
  )
}
```

### 7. Ilhas Client dentro de Product

```tsx
// components/image-carousel.tsx
'use client'

import { useState } from 'react'

export function ImageCarousel({ images }: { images: string[] }) {
  const [current, setCurrent] = useState(0)

  return (
    <div>
      <img src={images[current]} alt="" />
      <div className="dots">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={i === current ? 'active' : ''}
          />
        ))}
      </div>
    </div>
  )
}
```

```tsx
// components/add-to-cart.tsx
'use client'

import { useCart } from './cart-context'

interface AddToCartProps {
  item: { id: string; name: string; price: number }
}

export function AddToCart({ item }: AddToCartProps) {
  const { addItem } = useCart()

  return (
    <button onClick={() => addItem(item)}>
      Adicionar ao carrinho
    </button>
  )
}
```

## Visualizacao da arvore completa

```
RootLayout (Server)
└── CartProvider (Client) — recebe tudo via {children}
    ├── Header (Server) — preservado como Server via children
    │   ├── Logo (Server)
    │   ├── Nav (Server)
    │   └── Cart (Client) — "use client", useState, onClick
    └── CatalogPage (Server) — async, fetch no servidor
        └── ProductList (Server)
            └── Product (Server)
                ├── ImageCarousel (Client) — useState para slide atual
                └── AddToCart (Client) — useCart + onClick
```

## Variacao: o que acontece SEM children (anti-pattern)

```tsx
// ERRADO — CartProvider importa e renderiza diretamente
'use client'

import { Header } from './header'     // Header VIRA Client!
import { ProductList } from './product-list'  // ProductList VIRA Client!

export function CartProvider() {
  const [items, setItems] = useState([])

  return (
    <CartContext.Provider value={{ items }}>
      <Header />        {/* Todo JS do Header vai pro navegador */}
      <ProductList />   {/* Todo JS da ProductList vai pro navegador */}
    </CartContext.Provider>
  )
}
```

Neste caso, **toda a arvore abaixo de CartProvider se torna Client Component**, enviando JavaScript desnecessario ao navegador. A solucao e sempre usar `children`.