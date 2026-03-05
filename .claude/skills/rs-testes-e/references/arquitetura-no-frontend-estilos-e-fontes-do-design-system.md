---
name: rs-testes-arq-frontend-estilos-fontes-ds
description: "Applies Design System styles and fonts setup in Next.js projects using Tailwind CSS. Use when user asks to 'setup design system', 'configure fonts', 'add custom colors', 'setup tailwind theme', or 'integrate figma styles'. Follows pattern: extract design tokens from Figma, configure CSS variables, setup Google Fonts via next/font, apply base styles in root layout. Make sure to use this skill whenever setting up initial styling in a Next.js project with Tailwind. Not for component styling, responsive design, or animation implementation."
---

# Estilos e Fontes do Design System

> Extraia tokens do Design System (cores, tipografia) e configure-os como variaveis CSS e Tailwind antes de estilizar qualquer componente.

## Rules

1. **Defina design tokens como CSS variables no `:root`** — cores, fontes e espacamentos vem do Figma Style Guide, porque centralizar tokens evita inconsistencias visuais
2. **Use `next/font/google` para fontes** — nunca importe via `<link>` ou `@import`, porque next/font otimiza carregamento e elimina layout shift
3. **Exporte a fonte com CSS variable** — passe `variable: '--font-nome'` na configuracao, porque Tailwind consome CSS variables para aplicar fontes
4. **Aplique estilos base no root layout** — `bg-`, `text-`, `antialiased` vao no `<body>` do `layout.tsx`, porque sao herdados por toda a aplicacao
5. **Remova boilerplate desnecessario** — delete fontes e estilos padrao do Next.js que nao pertencem ao seu Design System, porque codigo morto confunde a equipe
6. **Valide com aba Computed do DevTools** — use Computed (nao Styles) para ver valores resolvidos pelo browser, porque mostra o resultado final apos calculos e heranca

## How to write

### Configuracao de fonte com next/font

```typescript
// app/layout.tsx
import { Inter } from 'next/font/google'

const inter = Inter({
  variable: '--font-sans',
  subsets: ['latin'],
  weight: ['400', '600', '700'],
})
```

### Aplicacao no root layout

```tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.variable} antialiased bg-grey-900 text-white`}>
        {children}
      </body>
    </html>
  )
}
```

### CSS variables no globals.css

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --font-sans: 'Inter', sans-serif;
  --grey-900: #0a0a0a;
  --grey-800: #1a1a1a;
  /* demais tokens extraidos do Figma Style Guide */
}
```

## Example

**Before (boilerplate padrao do Next.js):**
```tsx
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'

const geist = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] })

export default function RootLayout({ children }) {
  return (
    <html>
      <body className={`${geist.variable} ${geistMono.variable}`}>
        {children}
      </body>
    </html>
  )
}
```

**After (com Design System aplicado):**
```tsx
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({
  variable: '--font-sans',
  subsets: ['latin'],
  weight: ['400', '600', '700'],
})

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.variable} antialiased bg-grey-900 text-white`}>
        {children}
      </body>
    </html>
  )
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Projeto novo com Next.js + Tailwind | Remova fontes padrao, configure as do Design System |
| Figma tem Style Guide | Extraia todos os tokens antes de codar |
| Precisa validar se estilos aplicaram | Use aba Computed no DevTools, nao Styles |
| Fonte precisa de multiplos pesos | Passe array em `weight`: `['400', '600', '700']` |
| Cor customizada no Tailwind | Defina como CSS variable no `:root`, estenda no `tailwind.config` |

## Anti-patterns

| Nunca faca | Faca ao inves |
|------------|---------------|
| Importar fonte via `<link>` no `<head>` | Usar `next/font/google` com `variable` |
| Manter fontes padrao que nao usa | Remover e substituir pelas do Design System |
| Hardcodar cores diretamente nos componentes | Definir como CSS variables e usar via Tailwind |
| Importar `globals.css` duas vezes no layout | Importar uma unica vez no topo do arquivo |
| Verificar estilos apenas na aba Styles | Usar aba Computed para ver valores resolvidos |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/testes-e/rs-testes-e-arquitetura-no-frontend-estilos-e-fontes-do-design-system/references/deep-explanation.md)
- [Code examples](../../../data/skills/testes-e/rs-testes-e-arquitetura-no-frontend-estilos-e-fontes-do-design-system/references/code-examples.md)
