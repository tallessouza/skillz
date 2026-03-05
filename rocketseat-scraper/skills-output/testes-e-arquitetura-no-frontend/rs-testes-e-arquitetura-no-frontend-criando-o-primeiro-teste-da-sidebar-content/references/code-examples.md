# Code Examples: Primeiro Teste de Componente com Mock do Next.js

## Exemplo completo do arquivo de teste da aula

```typescript
// test/components/sidebar/sidebar-content.spec.tsx

import { render, screen } from '@/lib/test-utils'
import { SidebarContent } from '@/components/sidebar/sidebar-content'

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}))

describe('SidebarContent', () => {
  it('deveria renderizar o botao para criar novo prompt', () => {
    render(<SidebarContent />)

    expect(
      screen.getByRole('button', { name: /novo prompt/i })
    ).toBeVisible()
  })

  it('deveria renderizar a sidebar', () => {
    render(<SidebarContent />)

    expect(screen.getByRole('complementary')).toBeVisible()
  })
})
```

## Componente sendo testado (referencia)

```typescript
// components/sidebar/sidebar-content.tsx
'use client'

import { useRouter } from 'next/navigation'

export function SidebarContent() {
  const router = useRouter()

  return (
    <aside>
      <button onClick={() => router.push('/new')}>
        novo prompt
      </button>
      {/* ... resto do componente */}
    </aside>
  )
}
```

## Comando para rodar o teste

```bash
pnpm test test/components/sidebar/sidebar-content.spec.tsx
```

## Variacoes: mockando mais funcoes do next/navigation

```typescript
// Quando o componente usa usePathname alem de useRouter
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  }),
  usePathname: () => '/prompts',
  useSearchParams: () => new URLSearchParams(),
}))
```

## Variacoes: verificando role implicita de diferentes tags

```typescript
// <nav> → role "navigation"
expect(screen.getByRole('navigation')).toBeVisible()

// <main> → role "main"
expect(screen.getByRole('main')).toBeVisible()

// <header> → role "banner"
expect(screen.getByRole('banner')).toBeVisible()

// <footer> → role "contentinfo"
expect(screen.getByRole('contentinfo')).toBeVisible()

// <aside> → role "complementary"
expect(screen.getByRole('complementary')).toBeVisible()
```

## Roles implicitas comuns (referencia rapida)

| Tag HTML | Role implicita |
|----------|---------------|
| `<button>` | `button` |
| `<a href="...">` | `link` |
| `<input type="text">` | `textbox` |
| `<input type="checkbox">` | `checkbox` |
| `<select>` | `combobox` |
| `<table>` | `table` |
| `<form>` | `form` |
| `<img alt="...">` | `img` |
| `<aside>` | `complementary` |
| `<nav>` | `navigation` |
| `<main>` | `main` |
| `<header>` | `banner` |
| `<footer>` | `contentinfo` |