---
name: rs-nextjs-app-router-client-boundaries
description: "Enforces correct Client Boundary and Server/Client Component encadeamento patterns when writing Next.js App Router code. Use when user asks to 'create a component', 'add interactivity', 'use useState in Next.js', 'pass server component to client component', or 'optimize bundle size'. Applies rules: children pattern for server-inside-client, understand boundary propagation, minimize client boundaries. Make sure to use this skill whenever generating Next.js App Router components with mixed server/client needs. Not for API routes, data fetching strategies, or routing configuration."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: next-js
  module: app-router-e-testes
  tags: [client-boundary, children-pattern, server-component, client-component, encadeamento]
---

# Client Boundaries e Encadeamento

> Ao declarar `'use client'`, todos os componentes filhos declarados dentro daquele componente tornam-se automaticamente Client Components — use a prop `children` como unica forma de manter Server Components dentro de Client Components.

## Rules

1. **Client Boundary propaga para baixo** — qualquer componente declarado dentro do `return` de um `'use client'` component vira Client Component automaticamente, porque o bundler inclui todo o javascript daquela arvore no bundle do navegador
2. **Server Component dentro de Client Component so via children** — a unica forma de um Server Component existir dentro de um Client Component e sendo passado como `children` (ou qualquer prop que aceite ReactNode), porque assim o componente e resolvido no servidor antes de ser injetado
3. **Minimize Client Boundaries** — coloque `'use client'` apenas no componente que precisa de interatividade (useState, onClick, etc), porque cada boundary adiciona javascript ao bundle do navegador
4. **Sem `'use client'` nao significa Server Component** — um componente sem a diretiva que e importado dentro de um Client Component sera tratado como Client Component, porque a boundary do pai propaga
5. **Teste com onClick** — se voce consegue usar `onClick` sem erro, o componente e Client Component; se da erro, e Server Component. Use isso como verificacao rapida

## How to write

### Client Component isolado (boundary minima)

```tsx
// components/AddToCartButton.tsx
'use client'

import { ReactNode } from 'react'

interface AddToCartButtonProps {
  children?: ReactNode
}

export function AddToCartButton({ children }: AddToCartButtonProps) {
  function handleAddToCart() {
    // logica de interatividade aqui
  }

  return (
    <div>
      <button onClick={handleAddToCart}>Adicionar ao carrinho</button>
      {children}
    </div>
  )
}
```

### Server Component passado via children

```tsx
// app/product/page.tsx (Server Component — sem 'use client')
import { AddToCartButton } from '@/components/AddToCartButton'
import { ProductDetails } from '@/components/ProductDetails'

export default async function ProductPage() {
  const product = await fetchProduct()

  return (
    <AddToCartButton>
      <ProductDetails product={product} />
    </AddToCartButton>
  )
}
```

## Example

**Before (Server Component perdido dentro de Client Boundary):**

```tsx
// components/AddToCartButton.tsx
'use client'

import { Test } from './Test'

export function AddToCartButton() {
  return (
    <div>
      <button onClick={() => {}}>Add</button>
      <Test /> {/* Test vira Client Component automaticamente! */}
    </div>
  )
}

// components/Test.tsx — SEM 'use client', mas nao importa
export async function Test() {
  // ERRO: async nao funciona porque e Client Component por estar dentro da boundary
  const data = await fetch('/api/data')
  return <p>{data}</p>
}
```

**After (Server Component preservado via children):**

```tsx
// components/AddToCartButton.tsx
'use client'

import { ReactNode } from 'react'

export function AddToCartButton({ children }: { children?: ReactNode }) {
  return (
    <div>
      <button onClick={() => {}}>Add</button>
      {children}
    </div>
  )
}

// components/Test.tsx — agora SIM e Server Component
export default async function Test() {
  const data = await fetch('/api/data')
  return <p>{data}</p>
}

// app/product/page.tsx — composicao no nivel da page
import { AddToCartButton } from '@/components/AddToCartButton'
import Test from '@/components/Test'

export default function ProductPage() {
  return (
    <AddToCartButton>
      <Test /> {/* Server Component renderizado no servidor, injetado via children */}
    </AddToCartButton>
  )
}
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Componente precisa de useState/useEffect/onClick | Adicione `'use client'` apenas nele, mantenha boundary minima |
| Componente pesado (fetch de dados) dentro de Client Component | Extraia para fora e passe via `children` |
| Componente sem diretiva importado em Client Component | Trate como Client Component — a boundary propaga |
| Duvida se e Server ou Client | Teste: adicione `onClick` — se funcionar sem erro, e Client |
| Page inteira precisa de interatividade | Isole a parte interativa em um componente pequeno com `'use client'`, mantenha a page como Server Component |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `'use client'` na page inteira | `'use client'` apenas no componente interativo |
| Importar Server Component diretamente dentro de Client Component | Passar Server Component via `children` prop |
| Assumir que sem `'use client'` = Server Component sempre | Verificar se o pai tem `'use client'` (boundary propaga) |
| Colocar fetch de dados em componente dentro de Client Boundary | Mover fetch para Server Component e passar via children |

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

- [deep-explanation.md](../../../data/skills/next-js-app-router-e-testes/rs-next-js-app-router-e-testes-client-boundaries-e-encadeamentop/references/deep-explanation.md) — Client Boundary e o nome dado a barreira que divide a camada de Server Components e Client Component
- [code-examples.md](../../../data/skills/next-js-app-router-e-testes/rs-next-js-app-router-e-testes-client-boundaries-e-encadeamentop/references/code-examples.md) — // components/AddToCartButton.tsx
