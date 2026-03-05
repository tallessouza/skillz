# Code Examples: Criando Estrutura do App

## Fonte com variable (padrao recomendado)

```tsx
// src/app/layout.tsx
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

export const metadata = {
  title: 'Dev Store',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body>{children}</body>
    </html>
  )
}
```

## Variacao: Multiplas fontes

```tsx
import { Inter, Roboto_Mono } from 'next/font/google'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

const robotoMono = Roboto_Mono({
  subsets: ['latin'],
  variable: '--font-roboto-mono',
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${robotoMono.variable}`}>
      <body>{children}</body>
    </html>
  )
}
```

```ts
// tailwind.config.ts
theme: {
  extend: {
    fontFamily: {
      sans: 'var(--font-inter)',
      mono: 'var(--font-roboto-mono)',
    },
  },
},
```

## Fonte SEM variable (padrao do Next — evitar)

```tsx
// NAO RECOMENDADO — limita a uma unica fonte
const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
```

## globals.css limpo

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

## tailwind.config.ts limpo

```ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: 'var(--font-inter)',
      },
    },
  },
  plugins: [],
}

export default config
```

## ESLint config com Skillz

```json
{
  "extends": ["next/core-web-vitals", "@skillz/eslint-config/next"]
}
```

```bash
npm i -D @skillz/eslint-config
```

## page.tsx inicial

```tsx
export default function Home() {
  return <h1>Hello World</h1>
}
```