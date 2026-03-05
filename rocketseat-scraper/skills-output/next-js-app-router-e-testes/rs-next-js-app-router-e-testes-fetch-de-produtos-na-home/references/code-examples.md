# Code Examples: Fetch de Produtos na Home

## 1. Wrapper da API com correcao de base URL

```typescript
// @/data/api.ts
const apiPrefix = '/api'

export function api(path: string, init?: RequestInit) {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? ''
  const url = new URL(apiPrefix.concat(path), baseUrl)
  return fetch(url, init)
}
```

**Nota:** A base URL no `.env` deve ser apenas o host, sem path segments:
```env
# CORRETO
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000

# ERRADO — new URL vai ignorar /api
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api
```

## 2. Tipo do produto

```typescript
// @/data/types/product.ts
export interface Product {
  id: number
  title: string
  slug: string
  price: number
  image: string
  description: string
  featured: boolean
}
```

## 3. Funcao de fetch isolada

```typescript
import { api } from '@/data/api'
import { Product } from '@/data/types/product'

async function getFeaturedProducts(): Promise<Product[]> {
  const response = await api('/products/featured')
  const products = await response.json()
  return products
}
```

## 4. Pagina Home completa

```typescript
import Image from 'next/image'
import Link from 'next/link'
import { api } from '@/data/api'
import { Product } from '@/data/types/product'

async function getFeaturedProducts(): Promise<Product[]> {
  const response = await api('/products/featured')
  const products = await response.json()
  return products
}

export default async function Home() {
  const [highlightedProduct, ...otherProducts] = await getFeaturedProducts()

  return (
    <div className="grid max-h-[860px] grid-cols-9 grid-rows-6 gap-6">
      <Link
        href={`/product/${highlightedProduct.slug}`}
        className="group relative col-span-6 row-span-6 rounded-lg bg-zinc-900 overflow-hidden"
      >
        <Image
          src={highlightedProduct.image}
          className="group-hover:scale-105 transition-transform duration-500"
          width={920}
          height={920}
          quality={100}
          alt=""
        />
        <div className="absolute bottom-28 right-28 h-12 flex items-center gap-2 max-w-[280px] rounded-full border-2 border-zinc-500 bg-black/60 p-1 pl-5">
          <span className="text-sm truncate">{highlightedProduct.title}</span>
          <span className="flex h-full items-center justify-center rounded-full bg-violet-500 px-4 font-semibold">
            {highlightedProduct.price.toLocaleString('pt-BR', {
              style: 'currency',
              currency: 'BRL',
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            })}
          </span>
        </div>
      </Link>

      {otherProducts.map((product) => (
        <Link
          key={product.id}
          href={`/product/${product.slug}`}
          className="group relative col-span-3 row-span-3 rounded-lg bg-zinc-900 overflow-hidden"
        >
          <Image
            src={product.image}
            className="group-hover:scale-105 transition-transform duration-500"
            width={920}
            height={920}
            quality={100}
            alt=""
          />
          <div className="absolute bottom-10 right-10 h-12 flex items-center gap-2 max-w-[280px] rounded-full border-2 border-zinc-500 bg-black/60 p-1 pl-5">
            <span className="text-sm truncate">{product.title}</span>
            <span className="flex h-full items-center justify-center rounded-full bg-violet-500 px-4 font-semibold">
              {product.price.toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              })}
            </span>
          </div>
        </Link>
      ))}
    </div>
  )
}
```

## 5. Verificacao com console.log (debug)

```typescript
export default async function Home() {
  const products = await getFeaturedProducts()

  // Aparece no terminal do servidor, NAO no browser
  console.log(products)

  // ...
}
```

## 6. Teste de SSR: desabilitar JavaScript

Para confirmar que o fetch acontece server-side:
1. Abra DevTools > Settings > Debugger
2. Marque "Disable JavaScript"
3. Recarregue a pagina
4. Os dados dos produtos continuam aparecendo — prova que o HTML ja veio completo do servidor