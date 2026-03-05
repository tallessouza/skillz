# Code Examples: Temas Dark/Light com Next Themes

## Instalacao

```bash
npm install next-themes
```

## Layout global completo

```tsx
// app/layout.tsx
import { ThemeProvider } from 'next-themes'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
```

**Antes (tema fixo):**
```tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className="dark">
      <body>{children}</body>
    </html>
  )
}
```

## ThemeSwitcher completo

```tsx
// components/theme/theme-switcher.tsx
'use client'

import { useTheme } from 'next-themes'
import { Moon, Sun } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export function ThemeSwitcher() {
  const { resolvedTheme, setTheme } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          {resolvedTheme === 'light' ? (
            <Sun className="size-4" />
          ) : (
            <Moon className="size-4" />
          )}
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme('light')}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('dark')}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('system')}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
```

## Integracao no Header

```tsx
// components/header.tsx
import { Separator } from '@/components/ui/separator'
import { ThemeSwitcher } from '@/components/theme/theme-switcher'

export function Header() {
  return (
    <header className="flex items-center gap-4">
      {/* ... outros elementos do header ... */}
      <Separator orientation="vertical" className="h-5" />
      <ThemeSwitcher />
    </header>
  )
}
```

## Variacao: com indicador de tema ativo

```tsx
'use client'

import { useTheme } from 'next-themes'
import { Moon, Sun, Monitor } from 'lucide-react'

export function ThemeSwitcher() {
  const { theme, resolvedTheme, setTheme } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          {resolvedTheme === 'light' ? <Sun className="size-4" /> : <Moon className="size-4" />}
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme('light')}>
          <Sun className="mr-2 size-4" />
          Light
          {theme === 'light' && <span className="ml-auto">✓</span>}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('dark')}>
          <Moon className="mr-2 size-4" />
          Dark
          {theme === 'dark' && <span className="ml-auto">✓</span>}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('system')}>
          <Monitor className="mr-2 size-4" />
          System
          {theme === 'system' && <span className="ml-auto">✓</span>}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
```

**Nota:** aqui usamos `theme` (nao `resolvedTheme`) para o checkmark, porque queremos saber se o usuario selecionou "system" explicitamente, nao qual tema o sistema resolveu.

## Props do ThemeProvider

| Prop | Tipo | Descricao |
|------|------|-----------|
| `attribute` | `"class" \| "data-theme" \| string` | Como aplicar o tema no HTML |
| `defaultTheme` | `string` | Tema padrao antes de preferencia salva |
| `disableTransitionOnChange` | `boolean` | Desabilita CSS transitions durante troca |
| `enableSystem` | `boolean` | Habilita opcao "system" (default: true) |
| `storageKey` | `string` | Chave no localStorage (default: "theme") |
| `themes` | `string[]` | Lista de temas disponiveis |