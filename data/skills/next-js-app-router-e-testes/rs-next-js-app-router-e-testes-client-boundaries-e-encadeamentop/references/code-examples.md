# Code Examples: Client Boundaries e Encadeamento

## Exemplo 1: Componente filho vira Client Component automaticamente

```tsx
// components/AddToCartButton.tsx
'use client'

import { Test } from './Test'

export function AddToCartButton() {
  return (
    <div>
      <button onClick={() => console.log('add')}>Add to cart</button>
      <Test />
    </div>
  )
}
```

```tsx
// components/Test.tsx — SEM 'use client'
export function Test() {
  // Funciona! Porque esta dentro da boundary do AddToCartButton
  return <p onClick={() => console.log('click')}>Hello World</p>
}
```

**Ponto critico:** Test nao tem `'use client'`, mas como e declarado dentro de AddToCartButton (que tem), ele vira Client Component. O `onClick` funciona — prova de que e Client Component.

## Exemplo 2: Tentativa de async em componente dentro de boundary (ERRO)

```tsx
// components/Test.tsx — dentro de Client Boundary
export default async function Test() {
  // ERRO em runtime! Async nao funciona em Client Components
  await new Promise(resolve => setTimeout(resolve, 1000))
  return <p>Hello World</p>
}
```

O instrutor mostra: "se eu vier aqui tentar usar o teste, voltar la no navegador, nao vai dar certo. Esse teste aqui nao e um server component."

## Exemplo 3: Solucao com children (PADRAO CORRETO)

### Client Component recebendo children

```tsx
// components/AddToCartButton.tsx
'use client'

import { ReactNode } from 'react'

interface AddToCartButtonProps {
  children?: ReactNode
}

export function AddToCartButton({ children }: AddToCartButtonProps) {
  return (
    <div>
      <button onClick={() => console.log('add')}>Add to cart</button>
      {children}
    </div>
  )
}
```

### Server Component (agora sim funciona async)

```tsx
// components/Test.tsx — NENHUMA referencia ao AddToCartButton
export default async function Test() {
  // Funciona! Porque e Server Component de verdade
  await new Promise(resolve => setTimeout(resolve, 1000))
  return <p>Hello World</p>
}
```

### Composicao na page (Server Component)

```tsx
// app/product/page.tsx
import { AddToCartButton } from '@/components/AddToCartButton'
import Test from '@/components/Test'

export default function ProductPage() {
  return (
    <AddToCartButton>
      <Test />
    </AddToCartButton>
  )
}
```

**Verificacao do instrutor:** "agora veja, volto no navegador, ta tudo funcionando. Se eu venho aqui e boto um onClick, ele ja da erro, porque agora ele e um server component."

## Exemplo 4: Simulando fetch de dados (padrao da aula)

```tsx
// components/ProductInfo.tsx — Server Component
export default async function ProductInfo() {
  // Simula chamada API com delay de 1 segundo
  await new Promise(resolve => setTimeout(resolve, 1000))

  return <p>Informacoes do produto carregadas do servidor</p>
}
```

```tsx
// app/product/page.tsx
import { AddToCartButton } from '@/components/AddToCartButton'
import ProductInfo from '@/components/ProductInfo'

export default function ProductPage() {
  return (
    <div>
      <h1>Produto</h1>
      <AddToCartButton>
        <ProductInfo /> {/* Renderizado no servidor, zero JS no browser */}
      </AddToCartButton>
    </div>
  )
}
```

## Diagrama mental: fluxo da boundary

```
Page (Server Component)
  └── AddToCartButton ('use client') ← CLIENT BOUNDARY AQUI
        ├── <button> ← Client (dentro da boundary)
        ├── <ComponenteDeclarado /> ← Client (AUTOMATICAMENTE)
        └── {children} ← PRESERVA o tipo original
              └── <Test /> ← Server Component (passado via children)
```