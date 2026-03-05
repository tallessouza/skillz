# Code Examples: Page Metadata no Next.js (SEO)

## 1. Layout raiz com metadata basico (antes do template)

```typescript
// app/layout.tsx — versao simples
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'DevStore',
}
```

Resultado: todas as paginas mostram "DevStore" no titulo do browser.

## 2. Layout raiz com title template

```typescript
// app/layout.tsx — versao com template
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    template: '%s | DevStore',
    default: 'DevStore',
  },
}
```

- `%s` e substituido pelo titulo que cada pagina exportar
- `default` e usado quando a pagina nao exporta titulo

## 3. Pagina estatica exportando metadata

```typescript
// app/(store)/page.tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Home',
}

export default function Home() {
  return <main>...</main>
}
```

Resultado no browser: "Home | DevStore"

## 4. Pagina dinamica com generateMetadata

```typescript
// app/(store)/product/[slug]/page.tsx
import type { Metadata } from 'next'
import { api } from '@/data/api'

interface ProductPageProps {
  params: { slug: string }
}

async function getProduct(slug: string) {
  const response = await api(`/products/${slug}`, {
    next: { revalidate: 60 * 60 }, // 1 hour cache
  })
  const product = await response.json()
  return product
}

// generateMetadata recebe os mesmos params que o componente
export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const product = await getProduct(params.slug)

  return {
    title: product.title,
  }
}

// O componente tambem chama getProduct — React deduplica o fetch
export default async function ProductPage({ params }: ProductPageProps) {
  const product = await getProduct(params.slug)

  return (
    <div>
      <h1>{product.title}</h1>
      <p>{product.description}</p>
    </div>
  )
}
```

Resultado: acessar `/product/moletom-never-stop-learning` mostra "Moletom Never Stop Learning | DevStore" no titulo.

## 5. Metadata completo com SEO avancado

```typescript
// Exemplo expandido de generateMetadata com mais campos
export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const product = await getProduct(params.slug)

  return {
    title: product.title,
    description: product.description,
    openGraph: {
      title: product.title,
      description: product.description,
      images: [product.image],
    },
    twitter: {
      card: 'summary_large_image',
      title: product.title,
      description: product.description,
      images: [product.image],
    },
  }
}
```

## 6. Todas as propriedades disponiveis no tipo Metadata

```typescript
// Referencia — propriedades principais do tipo Metadata
const metadata: Metadata = {
  title: 'Page Title',
  description: 'Page description for SEO',
  keywords: ['next.js', 'react', 'seo'],
  authors: [{ name: 'Author' }],
  robots: { index: true, follow: true },
  icons: { icon: '/favicon.ico', apple: '/apple-icon.png' },
  manifest: '/manifest.json',
  openGraph: { /* ... */ },
  twitter: { /* ... */ },
  // ... muitas outras opcoes via Ctrl+Space
}
```