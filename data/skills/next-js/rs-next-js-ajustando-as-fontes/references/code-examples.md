# Code Examples: Centralizacao de Fontes no Next.js Pages Router

## Configuracao completa do layout

```typescript
// src/components/layout.tsx
import { Inter, PT_Sans_Caption } from 'next/font/google'

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-inter',
})

const ptSansCaption = PT_Sans_Caption({
  subsets: ['latin'],
  weight: '700',
  variable: '--font-sans',
})

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className={`${inter.variable} ${ptSansCaption.variable} font-inter`}>
      <Header />
      <main className="mt-10">{children}</main>
      <Footer />
    </div>
  )
}
```

## Tailwind config com font families

```javascript
// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        inter: 'var(--font-inter)',
        sans: 'var(--font-sans)',
      },
    },
  },
  plugins: [],
}
```

## Secao ANTES da refatoracao (cada uma instanciava a fonte)

```typescript
// src/sections/support-section.tsx (ANTES)
import { PT_Sans_Caption } from 'next/font/google'

const ptSansCaption = PT_Sans_Caption({
  subsets: ['latin'],
  weight: '700',
})

export function SupportSection() {
  return (
    <section>
      <h2 className={`${ptSansCaption.className} text-3xl`}>
        Suporte
      </h2>
      <p>Conteudo da secao...</p>
    </section>
  )
}
```

## Secao DEPOIS da refatoracao (usa classe Tailwind)

```typescript
// src/sections/support-section.tsx (DEPOIS)
export function SupportSection() {
  return (
    <section>
      <h2 className="font-sans text-3xl">
        Suporte
      </h2>
      <p>Conteudo da secao...</p>
    </section>
  )
}
```

## Hero Section com fonte aplicada

```typescript
// src/sections/hero-section.tsx
export function HeroSection() {
  return (
    <section>
      <h1 className="font-sans text-5xl font-bold">
        Titulo principal da landing page
      </h1>
      <p>Este texto herda font-inter do layout</p>
    </section>
  )
}
```

## Features Section com multiplos h2

```typescript
// src/sections/features-section.tsx
export function FeaturesSection() {
  return (
    <section>
      <h2 className="font-sans text-3xl">Feature 1</h2>
      <p>Descricao herda Inter</p>

      <h2 className="font-sans text-3xl">Feature 2</h2>
      <p>Descricao herda Inter</p>

      <h2 className="font-sans text-3xl">Feature 3</h2>
      <p>Descricao herda Inter</p>
    </section>
  )
}
```

## Call to Action Section

```typescript
// src/sections/cta-section.tsx
export function CallToActionSection() {
  return (
    <section>
      <h2 className="font-sans text-4xl">
        Comece agora
      </h2>
      <p>Texto em Inter herdado do layout</p>
    </section>
  )
}
```

## Dica: verificando fontes no DevTools

O instrutor demonstra como inspecionar elementos no navegador para verificar qual fonte esta sendo aplicada:
1. Clique direito → Inspecionar
2. Selecione o elemento de texto
3. Na aba Computed, verifique `font-family`
4. Alterne classes no DevTools para ver a diferenca visual (ex: trocar `font-sans` por `font-inter`)