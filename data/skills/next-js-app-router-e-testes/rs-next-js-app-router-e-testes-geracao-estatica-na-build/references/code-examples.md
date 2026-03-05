# Code Examples: Geracao Estatica na Build

## Exemplo 1: generateStaticParams com slugs hardcoded

Abordagem simples para testes ou quando voce sabe exatamente quais paginas gerar:

```typescript
// app/product/[slug]/page.tsx

export function generateStaticParams() {
  return [
    { slug: 'moletom-never-stop-learning' },
  ]
}
```

Resultado no build: a pagina `/product/moletom-never-stop-learning` aparece com circulo branco (SSG).

## Exemplo 2: generateStaticParams buscando dados da API

Abordagem recomendada — busca dinamicamente quais paginas gerar:

```typescript
// app/product/[slug]/page.tsx
import { api } from '@/data/api'
import { Product } from '@/data/types/product'

export async function generateStaticParams() {
  const response = await api('/products/featured')
  const products: Product[] = await response.json()

  return products.map((product) => ({
    slug: product.slug,
  }))
}
```

Neste caso, todos os produtos retornados pela rota `/products/featured` terao suas paginas geradas estaticamente.

## Exemplo 3: Pagina completa com generateStaticParams

```typescript
// app/product/[slug]/page.tsx
import { api } from '@/data/api'
import { Product } from '@/data/types/product'

// Gera versao estatica dos produtos em destaque
export async function generateStaticParams() {
  const response = await api('/products/featured')
  const products: Product[] = await response.json()

  return products.map((product) => ({
    slug: product.slug,
  }))
}

interface ProductPageProps {
  params: {
    slug: string
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const response = await api(`/products/${params.slug}`)
  const product: Product = await response.json()

  return (
    // ... renderizacao do produto
  )
}
```

## Exemplo 4: Multiplos parametros dinamicos

Para rotas como `app/[category]/[slug]/page.tsx`:

```typescript
export async function generateStaticParams() {
  const response = await api('/products/featured')
  const products: Product[] = await response.json()

  return products.map((product) => ({
    category: product.category,
    slug: product.slug,
  }))
}
```

Cada objeto precisa conter **todas** as keys dos parametros dinamicos da rota.

## Verificacao: rodando o build

```bash
# Terminal 1: manter API rodando (se API interna ao Next)
npm run dev

# Terminal 2: executar build
npm run build
```

Na saida do build, procure por:
```
○  /product/[slug]
    ├ /product/moletom-never-stop-learning
    ├ /product/moletom-ai-side
    └ /product/camiseta-wildcats-2022
```

O circulo branco (○) confirma geracao estatica (SSG).

## Testando o cache estatico

```bash
# Parar o servidor de dev (API offline)
# Rodar a versao de producao
npm run start

# Acessar pagina gerada estaticamente — funciona mesmo sem API
# http://localhost:3000/product/moletom-never-stop-learning
```

A pagina carrega instantaneamente. Ctrl+Shift+F5 (hard refresh) nao afeta, porque o cache e do Next, nao do navegador.