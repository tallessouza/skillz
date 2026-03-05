# Code Examples: Gerando OpenGraph Image

## Exemplo 1: OpenGraph Image estatico

Basta colocar o arquivo na pasta da rota:

```
app/
  opengraph-image.png    ← imagem estatica para a home
```

Especificacoes recomendadas:
- OpenGraph: 1200x630
- Twitter: pode ser maior

## Exemplo 2: OpenGraph Image dinamico basico (da documentacao)

```typescript
// app/about/opengraph-image.tsx
import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'About Acme'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 128,
          background: 'white',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        About Acme
      </div>
    ),
    { ...size },
  )
}
```

## Exemplo 3: OpenGraph Image dinamico com produto (aula)

```typescript
// app/product/[slug]/opengraph-image.tsx
import { ImageResponse } from 'next/og'
import colors from 'tailwindcss/colors'
import { api } from '@/data/api'

export const alt = 'Product image'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

async function getProduct(slug: string) {
  const response = await api(`/products/${slug}`)
  const product = await response.json()
  return product
}

export default async function OgImage({
  params,
}: {
  params: { slug: string }
}) {
  const product = await getProduct(params.slug)

  const productImageUrl = new URL(
    product.image,
    process.env.APP_URL,
  ).toString()

  return new ImageResponse(
    (
      <div
        style={{
          background: colors.zinc[950],
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <img src={productImageUrl} alt="" style={{ width: '100%' }} />
      </div>
    ),
    { ...size },
  )
}
```

## Exemplo 4: Com fonte customizada

```typescript
import { ImageResponse } from 'next/og'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function OgImage({
  params,
}: {
  params: { slug: string }
}) {
  const interBold = fetch(
    new URL('./Inter-Bold.ttf', import.meta.url),
  ).then((res) => res.arrayBuffer())

  return new ImageResponse(
    (
      <div
        style={{
          fontFamily: 'Inter',
          fontWeight: 700,
          fontSize: 64,
          color: 'white',
          background: '#09090b',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        Titulo do Produto
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: 'Inter',
          data: await interBold,
          weight: 700,
          style: 'normal',
        },
      ],
    },
  )
}
```

## Exemplo 5: Usando cores do Tailwind sem classes

```typescript
import colors from 'tailwindcss/colors'

// Acessando cores programaticamente
colors.zinc[950]    // '#09090b'
colors.zinc[100]    // '#f4f4f5'
colors.emerald[500] // '#10b981'
```

## Exemplo 6: Variavel de ambiente para URL base

```env
# .env.local
APP_URL=http://localhost:3000

# NAO precisa de NEXT_PUBLIC_ porque og-image roda no servidor
# NEXT_PUBLIC_API_BASE_URL=http://localhost:3333/api  ← esta e para a API
```

```typescript
// env.ts
export const env = {
  appUrl: process.env.APP_URL!,
  apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL!,
}
```

## Exemplo 7: Construindo URL absoluta com new URL()

```typescript
// product.image = '/camiseta-ai.png'
// process.env.APP_URL = 'http://localhost:3000'

const productImageUrl = new URL(
  product.image,         // path: /camiseta-ai.png
  process.env.APP_URL,   // base: http://localhost:3000
).toString()
// Resultado: 'http://localhost:3000/camiseta-ai.png'
```

## Verificacao: como testar a og-image

1. Acesse a pagina do produto no navegador
2. View Page Source (Ctrl+U) → procure por `og:image`
3. Copie a URL do `content` da meta tag
4. Cole no navegador — deve renderizar a imagem gerada
5. Ou: Inspecionar → Elements → `<head>` → procure `og:image`