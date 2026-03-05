---
name: rs-next-js-special-files-client-components
description: "Applies Next.js App Router special files and client component isolation patterns when writing Next.js code. Use when user asks to 'create a layout', 'add loading state', 'fix hydration error', 'add interactivity', 'use onClick in Next.js', or 'migrate to app router'. Enforces rules: root layout is mandatory, nested layouts for route groups, use-client only on interactive leaves, server components by default, composition pattern to minimize client boundaries. Make sure to use this skill whenever generating Next.js App Router components or debugging client/server component errors. Not for API routes, data fetching strategies, or React Server Components theory without Next.js context."
---

# Arquivos Especiais e Client Components no App Router

> Maximize server components e isole client components apenas onde interatividade e obrigatoria.

## Rules

1. **Root layout e obrigatorio** — `app/layout.tsx` deve sempre existir na raiz da pasta app, porque o Next.js exige esse arquivo para renderizar qualquer rota
2. **Nested layouts para rotas agrupadas** — crie `layout.tsx` dentro de subpastas (ex: `app/dashboard/layout.tsx`) para UI compartilhada naquele grupo de rotas, porque evita duplicacao e o layout nested herda do root automaticamente
3. **Nunca duplique a tag HTML em nested layouts** — apenas o root layout define `<html>` e `<body>`, nested layouts usam `<div>` ou fragmentos, porque tags HTML duplicadas causam erro de hidratacao
4. **Server component por default** — todo componente no App Router e server component ate que voce marque `"use client"`, porque isso maximiza performance ao reduzir JavaScript enviado ao browser
5. **use-client apenas no componente folha** — nao marque o componente pai inteiro como client so porque um botao precisa de onClick; extraia o trecho interativo para um componente separado e marque apenas ele, porque isso minimiza a fronteira client
6. **Server pode importar client, mas client nao pode importar server** — server components importam client components livremente, o inverso nao e valido, porque server components executam apenas no servidor

## How to write

### Root Layout (obrigatorio)

```typescript
// app/layout.tsx — unico lugar com <html> e <body>
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  )
}
```

### Nested Layout (sem html/body)

```typescript
// app/dashboard/layout.tsx — herda do root layout
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-300">
      <nav>Dashboard Nav</nav>
      {children}
    </div>
  )
}
```

### Isolando Client Component (Composition Pattern)

```typescript
// app/components/header.tsx — server component
import { InteractiveButton } from './interactive-button'

export function Header() {
  return (
    <header>
      <h1>My App</h1>
      <InteractiveButton />  {/* apenas este trecho e client */}
    </header>
  )
}
```

```typescript
// app/components/interactive-button.tsx — client component isolado
"use client"

export function InteractiveButton() {
  return <button onClick={() => console.log('clicked')}>Menu</button>
}
```

## Example

**Before (header inteiro como client — errado):**

```typescript
"use client"
// header.tsx inteiro marcado como client so por causa de um onClick
export function Header() {
  return (
    <header>
      <h1>My App</h1>
      <nav>{/* links estaticos */}</nav>
      <button onClick={() => console.log('click')}>Menu</button>
    </header>
  )
}
```

**After (composition pattern — correto):**

```typescript
// header.tsx — server component
import { MenuButton } from './menu-button'

export function Header() {
  return (
    <header>
      <h1>My App</h1>
      <nav>{/* links estaticos */}</nav>
      <MenuButton />
    </header>
  )
}
```

```typescript
// menu-button.tsx — client component minimo
"use client"

export function MenuButton() {
  return <button onClick={() => console.log('click')}>Menu</button>
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Componente usa onClick, onChange, hooks | Extraia para client component isolado |
| Componente e puramente visual/estatico | Mantenha como server component |
| Precisa de layout compartilhado em grupo de rotas | Crie nested layout na pasta da rota |
| Erro "html cannot be nested" | Remova html/body do nested layout |
| Precisa de loading state por rota | Crie `loading.tsx` na pasta (usa Suspense) |
| Precisa de error boundary por rota | Crie `error.tsx` na pasta |

## Anti-patterns

| Nunca faca | Faca assim |
|------------|------------|
| `"use client"` no header inteiro por causa de um botao | Extraia o botao para componente client separado |
| `<html>` e `<body>` em nested layout | Apenas `<div>` ou fragment em nested layouts |
| Marcar page.tsx como client sem necessidade | Mantenha pages como server components |
| Importar server component dentro de client component | Passe como children via composition |
| Ignorar special files (loading, error) | Use-os para UX granular por rota |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
