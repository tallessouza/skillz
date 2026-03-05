# Code Examples: Buscando Produtos da API

## Exemplo 1: Console.log das props para entender a estrutura

```typescript
// app/search/page.tsx
export default async function Search(props: any) {
  console.log(props)
  // Output:
  // {
  //   params: {},
  //   searchParams: { query: 'camiseta' }
  // }
}
```

O `params` esta vazio porque a rota `/search` nao tem segmentos dinamicos como `[slug]`. O `searchParams` contem todos os query params da URL.

## Exemplo 2: Interface tipada e desestruturacao

```typescript
interface SearchProps {
  searchParams: { q: string }
}

export default async function Search({ searchParams }: SearchProps) {
  const { q: query } = searchParams
  // 'query' agora contem o valor de ?q=...
}
```

O Diego renomeia `q` para `query` na desestruturacao para facilitar o uso dentro do componente.

## Exemplo 3: Redirect para parametro ausente

```typescript
import { redirect } from 'next/navigation'

export default async function Search({ searchParams }: SearchProps) {
  const { q: query } = searchParams

  if (!query) {
    redirect('/')
  }

  // ... resto da pagina
}
```

Se o usuario acessa `/search` sem `?q=algo`, e redirecionado para a home. O `redirect` lanca uma excecao internamente que o Next.js captura para fazer o redirecionamento server-side.

## Exemplo 4: Funcao searchProducts completa

```typescript
import { api } from '@/data/api'
import { Product } from '@/data/types/product'

async function searchProducts(query: string): Promise<Product[]> {
  const response = await api(`/products/search?q=${query}`, {
    next: {
      revalidate: 60 * 60, // 1 hora
    },
  })

  const products = await response.json()

  return products
}
```

Baseada na `getFeaturedProducts` da home, mas com:
- Nome descritivo: `searchProducts`
- Parametro `query` recebido
- Endpoint diferente: `/products/search?q=${query}`
- Mesmo padrao de revalidacao

## Exemplo 5: Pagina completa com listagem

```typescript
import { redirect } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'

interface SearchProps {
  searchParams: { q: string }
}

async function searchProducts(query: string): Promise<Product[]> {
  const response = await api(`/products/search?q=${query}`, {
    next: { revalidate: 60 * 60 },
  })
  return response.json()
}

export default async function Search({ searchParams }: SearchProps) {
  const { q: query } = searchParams

  if (!query) {
    redirect('/')
  }

  const products = await searchProducts(query)

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm">
        Resultados para: <span className="font-semibold">{query}</span>
      </p>

      <div className="grid grid-cols-3 gap-6">
        {products.map((product) => (
          <Link key={product.id} href={`/product/${product.slug}`}>
            <Image
              src={product.image}
              width={480}
              height={480}
              quality={100}
              alt=""
            />
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold">{product.title}</span>
              <span className="font-semibold">
                {product.price.toLocaleString('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                })}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
```

## Exemplo 6: Comparacao — useSearchParams vs searchParams props

```typescript
// OPCAO 1: Client Component (desnecessario para este caso)
'use client'
import { useSearchParams } from 'next/navigation'

export default function Search() {
  const searchParams = useSearchParams()
  const query = searchParams.get('q')
  // Problema: nao pode fazer fetch server-side
  // Problema: todo o componente vira client-side
}

// OPCAO 2: Server Component (preferivel)
import { redirect } from 'next/navigation'

interface SearchProps {
  searchParams: { q: string }
}

export default async function Search({ searchParams }: SearchProps) {
  const { q: query } = searchParams
  // Vantagem: fetch no servidor, SSR, SEO, zero JS extra
  const products = await searchProducts(query)
}
```