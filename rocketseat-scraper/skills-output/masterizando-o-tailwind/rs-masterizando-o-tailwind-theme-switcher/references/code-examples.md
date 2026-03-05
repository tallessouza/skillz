# Code Examples: Theme Switcher

## 1. Configuracao do tailwind.config

### Modo media (padrao — herda do SO)
```typescript
// tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'media', // Padrao, pode ser omitido
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [],
}

export default config
```

### Modo class (controle manual)
```typescript
// tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class', // Troca para controle via classe
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [],
}

export default config
```

## 2. Toggle manual da classe dark

### Vanilla JavaScript
```typescript
// Ativar dark mode
document.documentElement.classList.add('dark')

// Desativar dark mode (light)
document.documentElement.classList.remove('dark')

// Toggle entre dark e light
document.documentElement.classList.toggle('dark')
```

### Componente React simples
```tsx
import { useState, useEffect } from 'react'

function ThemeToggle() {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [isDark])

  return (
    <button onClick={() => setIsDark(!isDark)}>
      {isDark ? '☀️ Light' : '🌙 Dark'}
    </button>
  )
}
```

## 3. Next.js com NextThemes

### Instalacao
```bash
npm install next-themes
```

### Layout com ThemeProvider (App Router)
```tsx
// app/layout.tsx
import { ThemeProvider } from 'next-themes'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
```

### Componente de toggle com NextThemes
```tsx
'use client'

import { useTheme } from 'next-themes'

function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
      {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
    </button>
  )
}
```

## 4. HTML resultante

### Quando dark mode esta ativo
```html
<html class="dark" lang="pt-BR" style="color-scheme: dark;">
  <body>
    <!-- Todos os dark:* do Tailwind sao aplicados -->
  </body>
</html>
```

### Quando light mode esta ativo
```html
<html lang="pt-BR" style="color-scheme: light;">
  <body>
    <!-- Apenas estilos base do Tailwind sao aplicados -->
  </body>
</html>
```

## 5. Usando classes dark: nos componentes

```tsx
// As classes dark: funcionam independente do metodo (media ou class)
function Card() {
  return (
    <div className="bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 p-6 rounded-lg">
      <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200">
        Titulo do Card
      </h2>
      <p className="text-zinc-600 dark:text-zinc-400">
        Conteudo do card que respeita o tema.
      </p>
    </div>
  )
}
```