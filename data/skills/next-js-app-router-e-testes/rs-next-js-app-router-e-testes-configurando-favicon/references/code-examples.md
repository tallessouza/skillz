# Code Examples: Configurando Favicon e Metadata Files no Next.js App Router

## Estrutura basica de arquivos metadata

```
src/app/
├── icon.png                  # Favicon global (PNG)
├── layout.tsx                # Layout raiz
├── page.tsx                  # Pagina inicial
├── robots.txt                # Regras de indexacao
├── sitemap.xml               # Mapa do site
├── opengraph-image.png       # Imagem OG global
└── search/
    ├── icon.png              # Favicon especifico para /search
    └── page.tsx
```

## Layout com fonte e idioma corretos

```tsx
// src/app/layout.tsx
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    // className vai no <html>, NAO no <body>
    <html lang="pt" className={inter.className}>
      <body>{children}</body>
    </html>
  )
}
```

**Erro comum:** Colocar o `className` da fonte no `<body>` — a fonte nao sera aplicada corretamente em todos os elementos.

## Favicon com imagem estatica

Basta colocar o arquivo `icon.png` na pasta `app/`:

```
src/app/icon.png
```

O Next.js automaticamente gera a tag:
```html
<link rel="icon" href="/icon.png" type="image/png" />
```

## Favicon dinamico via codigo (preview do que sera feito depois)

```tsx
// src/app/icon.tsx
import { ImageResponse } from 'next/og'

export const size = { width: 32, height: 32 }
export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 24,
          background: 'black',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          borderRadius: '50%',
        }}
      >
        DS
      </div>
    ),
    { ...size }
  )
}
```

## OpenGraph Image dinamica (preview)

```tsx
// src/app/products/[slug]/opengraph-image.tsx
import { ImageResponse } from 'next/og'

export const alt = 'Product Image'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image({
  params,
}: {
  params: { slug: string }
}) {
  // Buscar dados do produto
  const product = await getProduct(params.slug)

  return new ImageResponse(
    (
      <div style={{ display: 'flex', fontSize: 48 }}>
        {product.name} - DevStore
      </div>
    ),
    { ...size }
  )
}
```

Isso gera uma imagem de compartilhamento **unica para cada produto**, sem precisar criar manualmente.

## robots.txt

```
// src/app/robots.txt
User-Agent: *
Allow: /
Disallow: /api/

Sitemap: https://devstore.com/sitemap.xml
```

## Favicon por rota

```
src/app/
├── icon.png              # Favicon padrao (todas as rotas)
├── search/
│   ├── icon.png          # Favicon quando usuario esta em /search
│   └── page.tsx
└── admin/
    ├── icon.png          # Favicon quando usuario esta em /admin
    └── page.tsx
```

Cada subpasta pode ter seu proprio `icon.png`, e o Next.js usa automaticamente o mais proximo da rota atual.