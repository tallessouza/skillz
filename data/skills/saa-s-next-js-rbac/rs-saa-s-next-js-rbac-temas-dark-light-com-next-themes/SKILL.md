---
name: rs-saas-nextjs-rbac-next-themes
description: "Applies Next Themes dark/light theme switching pattern when building Next.js App Router applications. Use when user asks to 'add dark mode', 'implement theme switching', 'create theme toggle', 'add light/dark toggle', or 'configure next-themes'. Enforces correct ThemeProvider setup, useTheme hook usage, resolvedTheme vs theme distinction, and accessibility. Make sure to use this skill whenever implementing theme switching in Next.js projects. Not for CSS theming systems, Tailwind config, or non-Next.js frameworks."
---

# Temas Dark/Light com Next Themes

> Configure theme switching no Next.js App Router usando next-themes com ThemeProvider, useTheme hook, e resolvedTheme para icones condicionais.

## Rules

1. **ThemeProvider e um Client Component** — envolva o children no layout global, nunca o HTML inteiro, porque Server Components nao podem ser filhos de Client Components
2. **Use attribute="class"** — troca de tema via classe CSS (`dark`/`light` no HTML), nao via `data-mode`, porque Tailwind e shadcn/ui usam classes
3. **Use disableTransitionOnChange** — desabilita transitions CSS durante troca de tema, porque animacoes de cor (preto→branco) em botoes e elementos ficam estranhas
4. **resolvedTheme, nao theme** — `theme` pode ser "system", mas `resolvedTheme` sempre retorna "light" ou "dark", porque voce precisa saber a cor real para exibir icones
5. **suppressHydrationWarning no html** — necessario porque next-themes injeta classe no HTML antes do React hidratar, causando mismatch
6. **Acessibilidade com sr-only** — todo botao de icone precisa de texto invisivel para screen readers

## How to write

### ThemeProvider no layout global

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

### ThemeSwitcher com resolvedTheme

```tsx
'use client'

import { useTheme } from 'next-themes'
import { Sun, Moon } from 'lucide-react'
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
          {resolvedTheme === 'light' ? <Sun className="size-4" /> : <Moon className="size-4" />}
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme('light')}>Light</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('dark')}>Dark</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('system')}>System</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
```

## Example

**Before (tema fixo no layout):**
```tsx
<html lang="pt-BR" className="dark">
  <body>{children}</body>
</html>
```

**After (com next-themes):**
```tsx
<html lang="pt-BR" suppressHydrationWarning>
  <body>
    <ThemeProvider attribute="class" defaultTheme="dark" disableTransitionOnChange>
      {children}
    </ThemeProvider>
  </body>
</html>
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Precisa saber o tema real para icone/logica | Use `resolvedTheme` (nunca `theme`) |
| Tema "system" selecionado | `resolvedTheme` retorna "light" ou "dark" automaticamente |
| Botao de tema e so icone | Use `size="icon"` + `<span className="sr-only">` |
| Troca de tema causa flash de animacao | Adicione `disableTransitionOnChange` no ThemeProvider |
| Hydration mismatch warning | Adicione `suppressHydrationWarning` no `<html>` |

## Anti-patterns

| Nunca faca | Faca assim |
|------------|------------|
| `className="dark"` fixo no HTML | `ThemeProvider` com `defaultTheme="dark"` |
| `if (theme === 'dark')` para icone | `if (resolvedTheme === 'dark')` |
| ThemeProvider envolvendo `<html>` | ThemeProvider dentro de `<body>` envolvendo `{children}` |
| `data-theme` attribute | `attribute="class"` para compatibilidade com Tailwind |
| Animacao na troca de tema | `disableTransitionOnChange` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
