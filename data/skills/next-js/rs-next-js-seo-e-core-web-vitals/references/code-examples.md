# Code Examples: SEO e Core Web Vitals

## 1. Configuracao completa de Metadata no App Router

```typescript
// app/layout.tsx
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    default: 'Nome do Projeto',
    template: '%s | Nome do Projeto',
  },
  description: 'Descricao otimizada com palavras-chave relevantes',
  openGraph: {
    title: 'Nome do Projeto',
    description: 'Descricao que aparece ao compartilhar o link',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Preview do projeto',
      },
    ],
    type: 'website',
    locale: 'pt_BR',
    siteName: 'Nome do Projeto',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nome do Projeto',
    description: 'Descricao para Twitter/X',
    images: ['/og-image.png'],
  },
}
```

## 2. Metadata por pagina (override do layout)

```typescript
// app/produto/[id]/page.tsx
import { Metadata } from 'next'

interface Props {
  params: { id: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await getProduct(params.id)

  return {
    title: product.name,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: [product.imageUrl],
    },
  }
}
```

## 3. Otimizacao de LCP com next/image

```typescript
// Componente hero — elemento LCP
import Image from 'next/image'

export function Hero() {
  return (
    <section>
      <h1>Titulo Principal</h1>
      <Image
        src="/hero-banner.png"
        alt="Banner principal do site"
        width={1920}
        height={1080}
        priority // Pre-carrega a imagem — essencial para LCP
        quality={85} // Balanco entre qualidade e tamanho
      />
    </section>
  )
}
```

## 4. Prevencao de CLS com dimensoes explicitas

```typescript
// Skeleton loading que mantem o espaco reservado
export function ProductCard({ product }) {
  return (
    <div style={{ minHeight: '400px' }}> {/* Reserva espaco */}
      <Image
        src={product.image}
        alt={product.name}
        width={300}
        height={300}
        // width e height garantem que o browser reserva espaco
        // antes da imagem carregar, evitando layout shift
      />
      <h2>{product.name}</h2>
      <p>{product.price}</p>
    </div>
  )
}
```

## 5. Font loading otimizado (previne CLS e melhora FCP)

```typescript
// app/layout.tsx
import { Inter } from 'next/font/google'

// next/font otimiza automaticamente:
// - Faz self-hosting (sem request externo ao Google Fonts)
// - Aplica font-display: swap
// - Previne layout shift de fontes
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
})

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR" className={inter.className}>
      <body>{children}</body>
    </html>
  )
}
```

## 6. Checklist de verificacao pre-deploy

```bash
# 1. Build de producao local
npm run build

# 2. Testar localmente
npm run start

# 3. Apos deploy, verificar no PageSpeed
# Acessar: https://pagespeed.web.dev/
# Inserir URL do projeto
# Verificar AMBOS: mobile e desktop

# Metricas alvo:
# - Performance: >= 90 (ideal 100)
# - SEO: 100
# - LCP: < 2.5s
# - FCP: < 1.8s
# - CLS: < 0.1
```

## 7. Acessibilidade — corrigindo contraste

```css
/* Antes: contraste insuficiente */
.subtitle {
  color: #999999; /* Ratio ~2.8:1 contra fundo branco — FALHA */
}

/* Depois: contraste WCAG AA */
.subtitle {
  color: #595959; /* Ratio ~7:1 contra fundo branco — PASSA */
}
```