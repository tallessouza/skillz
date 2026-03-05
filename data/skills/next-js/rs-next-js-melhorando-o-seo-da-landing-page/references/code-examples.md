# Code Examples: SEO com Metadata Estatica no Next.js

## Exemplo completo da aula

O codigo final da landing page (`src/app/page.tsx`) com metadata:

```typescript
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Site.Set",
  description: "Venda seus produtos como afiliado em um unico lugar",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Site.Set",
    description: "Venda seus produtos como afiliado em um unico lugar",
    url: "https://site-set.vercel.app",
    siteName: "Site.Set",
    locale: "pt_BR",
    type: "website",
    images: [
      {
        url: "https://site-set.vercel.app/og-image.jpg",
        width: 800,
        height: 600,
        alt: "Site.Set",
      },
    ],
  },
};

export default function Home() {
  // ... componente da landing page
}
```

## Estrutura de arquivos

```
public/
  og-image.jpg          # Imagem exportada do Figma (JPEG)
src/
  app/
    page.tsx            # Landing page com export const metadata
```

## Verificando meta tags geradas

No navegador, ao inspecionar o `<head>` da pagina, o Next.js gera automaticamente:

```html
<title>Site.Set</title>
<meta name="description" content="Venda seus produtos como afiliado em um unico lugar" />
<meta name="robots" content="index, follow" />
<meta property="og:title" content="Site.Set" />
<meta property="og:description" content="Venda seus produtos como afiliado em um unico lugar" />
<meta property="og:url" content="https://site-set.vercel.app" />
<meta property="og:site_name" content="Site.Set" />
<meta property="og:locale" content="pt_BR" />
<meta property="og:type" content="website" />
<meta property="og:image" content="https://site-set.vercel.app/og-image.jpg" />
<meta property="og:image:width" content="800" />
<meta property="og:image:height" content="600" />
<meta property="og:image:alt" content="Site.Set" />
```

## Sem metadata vs com metadata

### Sem (apenas tags padrao do Next.js):
```html
<head>
  <title></title>
  <!-- poucas meta tags internas do Next.js -->
</head>
```

### Com (dezenas de tags geradas):
```html
<head>
  <title>Site.Set</title>
  <meta name="description" content="..." />
  <meta name="robots" content="index, follow" />
  <meta property="og:title" content="..." />
  <meta property="og:description" content="..." />
  <!-- ... muitas mais -->
</head>
```

## Verificacao externa com opengraph.xyz

Apos deploy, acesse:
```
https://opengraph.xyz
```

Cole a URL de producao para verificar que titulo, descricao e imagem OG estao aparecendo corretamente no preview social.

## Verificacao da imagem OG no navegador

Para confirmar que a imagem esta acessivel:
```
https://dominio-producao.com/og-image.jpg
```

Se abrir a imagem no navegador, a URL esta correta para uso no Open Graph.