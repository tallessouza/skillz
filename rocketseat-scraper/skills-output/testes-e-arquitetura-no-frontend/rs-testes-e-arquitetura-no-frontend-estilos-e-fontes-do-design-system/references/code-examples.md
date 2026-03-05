# Code Examples: Estilos e Fontes do Design System

## Exemplo completo do globals.css

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  /* Cores extraidas do Figma Style Guide */
  --grey-900: #0a0a0a;
  --grey-800: #1a1a1a;
  --grey-700: #2a2a2a;
  --grey-600: #3a3a3a;
  --grey-500: #6b7280;
  --grey-400: #9ca3af;
  --grey-300: #d1d5db;
  --grey-200: #e5e7eb;
  --grey-100: #f3f4f6;

  /* Fonte */
  --font-sans: 'Inter', sans-serif;
}
```

## Configuracao da fonte Inter

```typescript
import { Inter } from 'next/font/google'

const inter = Inter({
  variable: '--font-sans',
  subsets: ['latin'],
  weight: ['400', '600', '700'],
})
```

### Explicacao dos pesos:
- `400` — texto normal, paragrafos
- `600` — semi-bold, subtitulos e destaques
- `700` — bold/extra-bold, titulos principais

## Root layout completo

```tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({
  variable: '--font-sans',
  subsets: ['latin'],
  weight: ['400', '600', '700'],
})

export const metadata: Metadata = {
  title: 'Prompt Manager',
  description: 'Gerencie seus prompts',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.variable} antialiased bg-grey-900 text-white`}>
        {children}
      </body>
    </html>
  )
}
```

## Estendendo cores customizadas no Tailwind

```typescript
// tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        grey: {
          900: 'var(--grey-900)',
          800: 'var(--grey-800)',
          700: 'var(--grey-700)',
          // demais tons
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)'],
      },
    },
  },
  plugins: [],
}

export default config
```

## Validacao no DevTools

### Aba Styles (o que voce escreveu)
```
.body {
  --font-sans: 'Inter', sans-serif;
  background-color: var(--grey-900);
  color: white;
}
```

### Aba Computed (o que o browser resolveu)
```
background-color: rgb(10, 10, 10)
color: rgb(255, 255, 255)
font-family: Inter, sans-serif
font-size: 16px          ← valor herdado/padrao, nao declarado explicitamente
-webkit-font-smoothing: antialiased
```

A aba Computed e mais util para debugging porque mostra valores finais em pixels/rgb, independente de como foram declarados (variables, heranca, calc, etc).