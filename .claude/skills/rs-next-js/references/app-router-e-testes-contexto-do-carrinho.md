---
name: rs-nextjs-app-router-contexto-carrinho
description: "Applies React Context pattern for shared state in Next.js App Router when writing cart, auth, theme, or any cross-component state. Use when user asks to 'create a context', 'share state between components', 'add to cart', 'use context in Next.js', or 'wrap app with provider'. Enforces correct Client Component boundaries, children pattern for Server Component preservation, and immutable state updates. Make sure to use this skill whenever creating React Context in App Router projects. Not for server-side data fetching, URL state, or simple prop drilling between parent-child."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: next-js
  module: app-router-e-testes
  tags: [react-context, cart, provider, client-component, immutable-state, useContext]
---

# Contexto React no Next.js App Router

> Ao criar contexto compartilhado no App Router, isole o Client Component no provider e preserve Server Components via children.

## Rules

1. **Provider em arquivo separado com 'use client'** — crie em `src/contexts/nome-do-contexto.tsx`, porque o provider precisa ser Client Component mas nao deve forcar os filhos a serem Client Components
2. **Exporte um hook customizado, nunca o contexto direto** — `useCart` em vez de exportar `CartContext`, porque evita importar `useContext` + contexto em cada consumidor
3. **Tipagem via interface + object as Type** — `createContext({} as CartContextType)`, porque garante type safety sem valores default reais
4. **Children como Server Components** — quando um Client Component recebe `children`, o conteudo passado como children continua sendo Server Component por padrao, porque o Next.js nao propaga 'use client' para children
5. **Estado imutavel com callback no setter** — use `setItems(state => ...)` com spread e map, nunca mute o array diretamente, porque React nao detecta mutacoes
6. **Nomes de arquivo em kebab-case** — `cart-context.tsx` nao `CartContext.tsx`, porque consistencia com convencoes do ecossistema

## How to write

### Estrutura do contexto

```typescript
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

### Wrapping no layout (preservando Server Components)

```typescript
// src/app/(store)/layout.tsx — SEM 'use client' aqui
import { CartProvider } from '@/contexts/cart-context'

export default function StoreLayout({ children }: { children: ReactNode }) {
  return (
    <CartProvider>
      <Header />  {/* continua Server Component */}
      {children}   {/* continua Server Component */}
    </CartProvider>
  )
}
```

## Example

**Before (estado duplicado, sem compartilhamento):**
```typescript
// Pagina do produto — estado local, nao compartilha com header
export default function ProductPage() {
  const [cart, setCart] = useState([])
  // Header nunca sabe quantos itens tem
}
```

**After (contexto compartilhado):**
```typescript
// Pagina do produto — usa contexto
'use client'
import { useCart } from '@/contexts/cart-context'

export default function AddToCartButton({ productId }: { productId: number }) {
  const { addToCart } = useCart()
  return <button onClick={() => addToCart(productId)}>Adicionar</button>
}

// Header — acessa o mesmo estado
'use client'
import { useCart } from '@/contexts/cart-context'

export function CartWidget() {
  const { items } = useCart()
  return <span>{items.length} itens</span>
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Estado precisa ser lido em componentes distantes na arvore | Crie um contexto |
| Provider precisa de hooks (useState, useEffect) | Marque com 'use client' |
| Layout wrapa children com provider | Children continuam Server Components |
| Produto ja esta no array | Map + spread para incrementar quantity |
| Produto novo no array | Spread do estado + novo item no final |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| `export const CartContext = createContext(...)` e usar `useContext(CartContext)` em cada arquivo | Exporte `useCart()` como hook unico |
| Colocar `'use client'` no layout para usar o provider | Mantenha o layout como Server Component, o provider ja e Client Component |
| `cartItems.push(newItem)` | `setCartItems(state => [...state, newItem])` |
| `createContext(null)` sem tipagem | `createContext({} as CartContextType)` |
| Criar o contexto dentro do layout | Crie em `src/contexts/` separado |

## Troubleshooting

### Erro ao usar hooks em Server Component
**Symptom:** Erro "useState/useEffect is not a function" ou "Hooks can only be called inside a Client Component"
**Cause:** Tentativa de usar hooks React (useState, useEffect, useSession) em um componente sem a diretiva "use client"
**Fix:** Adicionar `"use client"` no topo do arquivo OU extrair a parte interativa para um componente-folha separado com "use client"

### Server Component nao consegue ser async apos adicionar "use client"
**Symptom:** Erro ao usar `async function Component()` com `"use client"`
**Cause:** Client Components nao suportam async/await — essa e uma restricao fundamental do React
**Fix:** Remover "use client" e usar async/await direto (Server Component), ou manter "use client" e buscar dados via hooks (useEffect, React Query)

## Deep reference library

- [deep-explanation.md](../../../data/skills/next-js-app-router-e-testes/rs-next-js-app-router-e-testes-contexto-do-carrinho/references/deep-explanation.md) — O instrutor começa mostrando o problema concreto: ao clicar em "adicionar ao carrinho" na pagina do 
- [code-examples.md](../../../data/skills/next-js-app-router-e-testes/rs-next-js-app-router-e-testes-contexto-do-carrinho/references/code-examples.md) — // src/contexts/cart-context.tsx
