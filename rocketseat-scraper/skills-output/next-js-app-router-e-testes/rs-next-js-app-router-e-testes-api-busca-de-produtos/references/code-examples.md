# Code Examples: API Busca de Produtos

## Estrutura de pastas

```
app/
└── api/
    └── products/
        ├── [slug]/
        │   └── route.ts      # GET /api/products/:slug
        └── search/
            └── route.ts      # GET /api/products/search?q=moletom
```

## Rota completa de busca

```typescript
// app/api/products/search/route.ts
import { z } from 'zod'
import { type NextRequest, NextResponse } from 'next/server'
import data from '@/data.json'

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl

  const query = z.string().parse(searchParams.get('q'))

  const products = data.products.filter((product) => {
    return product.title
      .toLocaleLowerCase()
      .includes(query.toLocaleLowerCase())
  })

  return NextResponse.json(products)
}
```

## Comparacao: rota com path param vs query param

### Path param (busca por slug — identificador unico)

```typescript
// app/api/products/[slug]/route.ts
import data from '@/data.json'
import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const product = data.products.find((p) => p.slug === params.slug)

  if (!product) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  return NextResponse.json(product)
}
```

### Query param (busca por texto — filtro)

```typescript
// app/api/products/search/route.ts
import { z } from 'zod'
import { type NextRequest, NextResponse } from 'next/server'
import data from '@/data.json'

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const query = z.string().parse(searchParams.get('q'))

  const products = data.products.filter((product) => {
    return product.title
      .toLocaleLowerCase()
      .includes(query.toLocaleLowerCase())
  })

  return NextResponse.json(products)
}
```

## Testando a rota

```bash
# Busca por "moletom" — retorna todos os produtos com "moletom" no titulo
curl "http://localhost:3000/api/products/search?q=moletom"

# Busca por "camiseta" — retorna apenas camisetas
curl "http://localhost:3000/api/products/search?q=camiseta"

# Sem query param — Zod lanca erro (400)
curl "http://localhost:3000/api/products/search"
```

## Importacao do NextRequest

```typescript
// Importacao apenas do tipo (nao inclui no bundle)
import { type NextRequest } from 'next/server'

// Importacao do valor (necessario se usar em runtime, mas neste caso e so tipagem)
import { NextRequest } from 'next/server'
```

Ambas funcionam. O instrutor menciona que pode usar `import type` se preferir, ja que `NextRequest` aqui e usado apenas como tipagem do parametro.