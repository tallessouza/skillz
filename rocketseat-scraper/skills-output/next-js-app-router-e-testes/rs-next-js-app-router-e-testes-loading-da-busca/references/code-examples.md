# Code Examples: Loading da Busca

## Exemplo completo: loading.tsx para pagina de busca

```typescript
// app/search/loading.tsx
'use client'

import { useSearchParams } from 'next/navigation'
import { Skeleton } from '@/components/skeleton'

export default function SearchLoading() {
  const searchParams = useSearchParams()
  const query = searchParams.get('q')

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm">
        Resultados para: <span className="font-semibold">{query}</span>
      </p>

      <div className="grid grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-[400px]" />
        ))}
      </div>
    </div>
  )
}
```

## Pagina de busca real (referencia para espelhamento)

```typescript
// app/search/page.tsx (estrutura que o loading espelha)
interface SearchProps {
  searchParams: { q: string }
}

export default async function Search({ searchParams }: SearchProps) {
  const { q: query } = searchParams

  // fetch com delay (simulado em dev)
  const response = await api(`/products/search?q=${query}`)
  const products = await response.json()

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm">
        Resultados para: <span className="font-semibold">{query}</span>
      </p>

      <div className="grid grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}
```

## Erro comum: desestruturar useSearchParams

```typescript
// ERRADO — useSearchParams retorna URLSearchParams, nao objeto plain
const { q } = useSearchParams() // undefined!

// CORRETO
const searchParams = useSearchParams()
const query = searchParams.get('q') // string | null
```

## Componente Skeleton basico (referencia)

```typescript
// components/skeleton.tsx
import { ComponentProps } from 'react'
import { twMerge } from 'tailwind-merge'

export function Skeleton({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      className={twMerge('bg-zinc-700 animate-pulse rounded-md', className)}
      {...props}
    />
  )
}
```

## Testando o loading com delay artificial na API

```typescript
// app/api/products/search/route.ts
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('q')

  // Delay artificial para testar loading (remover em producao)
  await new Promise((resolve) => setTimeout(resolve, 3000))

  const products = await searchProducts(query)
  return Response.json(products)
}
```

## Variacao: loading condicional (sem query)

```typescript
'use client'

import { useSearchParams } from 'next/navigation'
import { Skeleton } from '@/components/skeleton'

export default function SearchLoading() {
  const searchParams = useSearchParams()
  const query = searchParams.get('q')

  return (
    <div className="flex flex-col gap-4">
      {query && (
        <p className="text-sm">
          Resultados para: <span className="font-semibold">{query}</span>
        </p>
      )}

      <div className="grid grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-[400px]" />
        ))}
      </div>
    </div>
  )
}
```