# Code Examples: Route Handlers no Next.js

## Estrutura de pastas do projeto

```
app/
├── api/
│   └── products/
│       ├── data.json          # Mock de banco de dados
│       ├── route.ts           # GET /api/products (todos os produtos)
│       └── featured/
│           └── route.ts       # GET /api/products/featured (destaques)
├── layout.tsx
└── page.tsx
```

## data.json — Fonte de dados mock

```json
{
  "products": [
    {
      "id": "1",
      "title": "Camiseta AI Side",
      "slug": "camiseta-ai-side",
      "price": 12990,
      "featured": true,
      "image": "/camiseta-ai-side.png",
      "description": "Descricao do produto..."
    },
    {
      "id": "2",
      "title": "Camiseta Not Found",
      "slug": "camiseta-not-found",
      "price": 7990,
      "featured": false,
      "image": "/camiseta-not-found.png",
      "description": "Descricao do produto..."
    }
  ]
}
```

## Route Handler — Listar todos os produtos

```typescript
// app/api/products/route.ts
import data from './data.json'

export async function GET() {
  return Response.json(data.products)
}
```

**Acesso:** `GET /api/products`
**Retorno:** Array completo de produtos

## Route Handler — Listar produtos em destaque

```typescript
// app/api/products/featured/route.ts
import data from '../data.json'

export async function GET() {
  const featuredProducts = data.products.filter(
    (product) => product.featured
  )
  return Response.json(featuredProducts)
}
```

**Acesso:** `GET /api/products/featured`
**Retorno:** Array filtrado apenas com produtos onde `featured === true`

## Evolucao mostrada na aula

### Tentativa 1 — Retorno direto (ERRO)

```typescript
// app/api/products/route.ts
export async function GET() {
  return 'Hello World' // ERRO - nao funciona
}
```

O Next.js espera um objeto `Response`, nao uma string.

### Tentativa 2 — Response.json (CORRETO)

```typescript
// app/api/products/route.ts
export async function GET() {
  return Response.json({ message: 'Hello World' })
}
```

Agora retorna JSON corretamente ao acessar `/api/products`.

### Tentativa 3 — Dados reais do JSON

```typescript
// app/api/products/route.ts
import data from './data.json'

export async function GET() {
  return Response.json(data.products)
}
```

## Variacoes adicionais

### Route Handler com parametros de busca

```typescript
// app/api/products/search/route.ts
import data from '../../data.json'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('q') ?? ''

  const results = data.products.filter((product) =>
    product.title.toLowerCase().includes(query.toLowerCase())
  )

  return Response.json(results)
}
```

### Route Handler com parametro dinamico

```typescript
// app/api/products/[slug]/route.ts
import data from '../../data.json'

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const product = data.products.find(
    (product) => product.slug === params.slug
  )

  if (!product) {
    return Response.json(
      { message: 'Product not found' },
      { status: 404 }
    )
  }

  return Response.json(product)
}
```

### Multiplos metodos no mesmo arquivo

```typescript
// app/api/products/route.ts
import data from './data.json'

export async function GET() {
  return Response.json(data.products)
}

export async function POST(request: Request) {
  const body = await request.json()
  // Em producao: salvar no banco de dados
  return Response.json(body, { status: 201 })
}
```