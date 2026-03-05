# Code Examples: Adicionando Style Guide

## Tailwind Config completo

```typescript
import type { Config } from 'tailwindcss';

export default {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1200px',
      },
    },
    extend: {
      colors: {
        white: '#FFFFFF',
        blue: {
          100: '#7EA4D7',
          200: '#2C85FC',
          300: '#2266C1',
          400: '#0D284C',
        },
        cyan: {
          100: '#2DEBFC',
          200: '#187D86',
          300: '#0E474C',
        },
        gray: {
          100: '#F9FAFC',
          200: '#D3D5D9',
          300: '#93979F',
          400: '#20242C',
          500: '#16181D',
          600: '#14161A',
          700: '#101216',
          800: '#0B0C0F',
        },
      },
      borderRadius: {
        lg: '0.5rem',
        md: 'calc(0.5rem - 2px)',
        sm: 'calc(0.5rem - 4px)',
      },
      fontFamily: {
        sans: ['PT Sans Caption', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
      fontSize: {
        'heading-hg': ['40px', { lineHeight: '120%', fontWeight: '700' }],
        'heading-xl': ['32px', { lineHeight: '120%', fontWeight: '700' }],
        'heading-lg': ['28px', { lineHeight: '120%', fontWeight: '700' }],
        'heading-md': ['24px', { lineHeight: '120%', fontWeight: '700' }],
        'heading-sm': ['20px', { lineHeight: '120%', fontWeight: '700' }],
        'heading-xs': ['16px', { lineHeight: '120%', fontWeight: '700' }],
        'body-md': ['16px', { lineHeight: '150%', fontWeight: '400' }],
        'body-sm': ['14px', { lineHeight: '150%', fontWeight: '400' }],
        'body-xs': ['12px', { lineHeight: '150%', fontWeight: '400' }],
        'action-md': ['16px', { lineHeight: 'normal', fontWeight: '500' }],
        'action-sm': ['14px', { lineHeight: 'normal', fontWeight: '500' }],
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
} satisfies Config;
```

## Layout com fonte Next.js

```tsx
import { Inter } from 'next/font/google'
import { Header } from './Header'
import { Footer } from './Footer'

const inter = Inter({ subsets: ['latin'] })

interface LayoutProps {
  children: React.ReactNode
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className={`${inter.className}`}>
      <Header />
      {children}
      <Footer />
    </div>
  )
}
```

## Footer refatorado

```tsx
// Antes (com classes da lib UI)
<footer className="border-t">
  <a className="text-primary hover:text-primary/80">Link</a>
</footer>

// Depois (com tokens do Style Guide)
<footer className="bg-gray-500">
  <a className="text-body-sm text-blue-100 hover:text-blue-200">Link</a>
</footer>
```

## ActiveLink refatorado

```tsx
// Antes
<a className={isActive ? 'text-primary font-bold' : 'text-muted-foreground'}>
  {children}
</a>

// Depois
<a className={`text-action-sm ${isActive ? 'text-blue-200' : 'text-white'}`}>
  {children}
</a>
```

## Button — variantes refatoradas

```tsx
// Variante primary
<button className="bg-blue-200 text-white hover:bg-blue-300 transition-colors duration-200">
  Primary
</button>

// Variante outline
<button className="border border-gray-500 bg-gray-700 text-white transition-colors duration-200 hover:text-blue-200 hover:border-blue-200">
  Outline
</button>

// Variante secondary
<button className="bg-white text-gray-800 hover:bg-blue-100 rounded-full">
  Secondary
</button>
```

## Mapeamento Figma → Tailwind

| Figma Token | Tailwind Class | Valor |
|-------------|---------------|-------|
| Blue/100 | `text-blue-100`, `bg-blue-100` | #7EA4D7 |
| Blue/200 | `text-blue-200`, `bg-blue-200` | #2C85FC |
| Blue/300 | `hover:bg-blue-300` | #2266C1 |
| Gray/500 | `bg-gray-500` | #16181D |
| Gray/700 | `bg-gray-700` | #101216 |
| Gray/800 | `text-gray-800` | #0B0C0F |
| Heading HG | `text-heading-hg` | 40px/120%/700 |
| Body SM | `text-body-sm` | 14px/150%/400 |
| Action SM | `text-action-sm` | 14px/normal/500 |