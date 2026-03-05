# Code Examples: Fetch de Dados no Produto

## 1. Estrutura de pastas

```
app/
├── api/
│   └── products/
│       ├── route.ts              # GET /api/products (lista)
│       └── [slug]/
│           └── route.ts          # GET /api/products/:slug (detalhe)
└── product/
    └── [slug]/
        └── page.tsx              # Pagina de produto
```

## 2. Route handler completo com delay

```typescript
// app/api/products/[slug]/route.ts
import { z } from 'zod'
import data from '../data.json'

export async function GET(
  _: Request,
  { params }: { params: { slug: string } }
) {
  await new Promise((resolve) => setTimeout(resolve, 1000))

  const slug = z.string().parse(params.slug)

  const product = data.products.find((product) => product.slug === slug)

  if (!product) {
    return Response.json(
      { message: 'Product not found.' },
      { status: 400 }
    )
  }

  return Response.json(product)
}
```

## 3. Funcao de fetch isolada

```typescript
import { api } from '@/data/api'
import { Product } from '@/data/types/product'

async function getProduct(slug: string): Promise<Product> {
  const response = await api(`/products/${slug}`, {
    next: {
      revalidate: 60 * 60, // 1 hora
    },
  })

  const product = await response.json()

  return product
}
```

## 4. Pagina de produto completa

```typescript
// app/product/[slug]/page.tsx
import { api } from '@/data/api'
import { Product } from '@/data/types/product'

async function getProduct(slug: string): Promise<Product> {
  const response = await api(`/products/${slug}`, {
    next: { revalidate: 60 * 60 },
  })
  const product = await response.json()
  return product
}

interface ProductProps {
  params: { slug: string }
}

export default async function ProductPage({ params }: ProductProps) {
  const product = await getProduct(params.slug)

  return (
    <div>
      <img src={product.image} alt="" />

      <h1>{product.title}</h1>
      <p>{product.description}</p>

      <span>
        {product.price.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        })}
      </span>

      <span>
        Em 12x sem juros de{' '}
        {(product.price / 12).toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        })}
      </span>
    </div>
  )
}
```

## 5. Comparacao: console.log do segundo parametro

```typescript
// Demonstracao do instrutor — o que o segundo parametro contem
export async function GET(_: Request, other: any) {
  console.log(other)
  // Output: { params: { slug: 'moletom' } }
  return new Response('')
}
```

## 6. Pattern: underscore para parametro nao utilizado

```typescript
// Request nao usado — convencao de underscore
export async function GET(
  _: Request,  // <-- underscore indica "existe mas nao uso"
  { params }: { params: { slug: string } }
) {
  // ...
}
```

## 7. Zod parse vs safeParse

```typescript
// Parse — throw automatico se falhar (usado em route handlers)
const slug = z.string().parse(params.slug)
// Se params.slug for undefined, dispara erro e o codigo para aqui

// SafeParse — sem throw, retorna resultado (usado em env vars)
const result = z.string().safeParse(params.slug)
if (!result.success) {
  return Response.json({ error: 'Invalid slug' }, { status: 400 })
}
const slug = result.data
```

## 8. Desabilitando cache para testes

Para testar sem cache durante desenvolvimento:
1. Abrir DevTools (F12)
2. Aba Network
3. Marcar "Disable cache"
4. Ctrl+Shift+R (hard refresh)

Isso forca que nenhuma requisicao HTTP seja cacheada, permitindo ver o comportamento real (incluindo delays da API).