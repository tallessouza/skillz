---
name: rs-nextjs-arvore-de-componentes
description: "Enforces correct Server Component and Client Component nesting patterns when building Next.js App Router applications. Use when user asks to 'create a page', 'add a component', 'build a layout', 'wrap with context', or any Next.js component architecture task. Applies rules: default to Server Components, use Client Components only for interactivity, pass Server Components as children through Client Components to preserve SSR. Make sure to use this skill whenever structuring Next.js App Router component trees. Not for React without Next.js, Pages Router, or API routes."
---

# Arvore de Componentes no Next.js

> Comece sempre com Server Components; promova para Client Component apenas quando interatividade for necessaria, e use children para preservar Server Components dentro de Client Components.

## Rules

1. **Paginas sao Server Components por padrao** — paginas contem a maior quantidade de HTML/CSS, e quanto menos JavaScript enviar ao navegador, melhor
2. **Client Component apenas para interatividade** — event listeners, estado reativo, popovers, carrosseis, botoes com side-effects exigem `"use client"`
3. **Pense Server-first, promova depois** — comece todo componente como Server Component; so mude para Client quando houver necessidade concreta de interatividade
4. **Children para preservar Server Components** — quando um Client Component (ex: Context Provider) envolve Server Components, estes DEVEM ser passados via `children`, porque sem children tudo dentro vira Client Component
5. **Contexto fica por volta, nao por dentro** — para compartilhar estado entre componentes distantes (ex: cart no header e add-to-cart na listagem), o Context Provider envolve ambos via children
6. **Encadeamento e ilimitado** — Server > Client > Server (via children) > Client > Server... funciona em qualquer profundidade

## How to write

### Layout com Context Provider envolvendo Server Components

```tsx
// app/layout.tsx — Server Component
import { CartProvider } from './cart-context'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      {children}
    </CartProvider>
  )
}
```

```tsx
// app/cart-context.tsx — Client Component
'use client'
import { createContext, useState } from 'react'

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<string[]>([])

  return (
    <CartContext.Provider value={{ items, setItems }}>
      {children}  {/* Server Components passam aqui */}
    </CartContext.Provider>
  )
}
```

### Componente de pagina (Server) com ilhas Client

```tsx
// app/catalog/page.tsx — Server Component
import { ProductList } from './product-list'
import { Header } from './header'

export default function CatalogPage() {
  return (
    <>
      <Header />
      <ProductList />
    </>
  )
}
```

```tsx
// app/catalog/header.tsx — Server Component
import { Cart } from './cart'

export default function Header() {
  return (
    <header>
      <Logo />
      <Nav />
      <Cart />  {/* Client island dentro de Server Component */}
    </header>
  )
}
```

## Example

**Before (tudo vira Client Component):**
```tsx
'use client'
// CartProvider importa diretamente Header e ProductList
export function CartProvider() {
  const [items, setItems] = useState([])
  return (
    <CartContext.Provider value={{ items, setItems }}>
      <Header />        {/* Virou Client Component! */}
      <ProductList />   {/* Virou Client Component! */}
    </CartContext.Provider>
  )
}
```

**After (Server Components preservados via children):**
```tsx
'use client'
export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState([])
  return (
    <CartContext.Provider value={{ items, setItems }}>
      {children}  {/* Header e ProductList continuam Server Components */}
    </CartContext.Provider>
  )
}
```

## Heuristics

| Situacao | Decisao |
|----------|---------|
| Componente so exibe HTML/CSS sem interacao | Server Component |
| Componente tem onClick, onChange, useState | Client Component |
| Componente precisa de contexto do React | O Provider e Client, consumidores podem ser Server se receberem dados via props |
| Client Component precisa renderizar Server Components dentro | Receba via `children` prop |
| Duvida se Server ou Client | Comece Server, promova quando quebrar |

## Anti-patterns

| Nunca faca | Faca assim |
|------------|------------|
| Colocar `"use client"` na pagina inteira | Extraia apenas os componentes interativos como Client |
| Importar Server Components diretamente dentro de Client Component | Passe Server Components como `children` |
| Criar Context Provider sem `children` | Sempre aceite e renderize `{children}` |
| Marcar Header como Client so porque tem um Cart Client dentro | Header fica Server, Cart e uma ilha Client dentro dele |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/next-js/rs-next-js-app-router-e-testes-arvore-de-componentes-no-next-js/references/deep-explanation.md)
- [Code examples](../../../data/skills/next-js/rs-next-js-app-router-e-testes-arvore-de-componentes-no-next-js/references/code-examples.md)
