---
name: rs-next-js-componente-header-9
description: "Applies Next.js Pages Router header component patterns when building navigation layouts. Use when user asks to 'create a header', 'add navigation', 'build a navbar', 'highlight active link', or 'organize components' in Next.js Pages Router projects. Enforces barrel export pattern, useRouter active link detection with pathname, and fixed header styling with backdrop blur. Make sure to use this skill whenever creating navigation components in Next.js Pages Router. Not for App Router, server components, or API routes."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: next-js
  module: componentes-navegacao
  tags: [header, navigation, useRouter, barrel-export, pages-router, next-js, tailwind]
---

# Componente Header — Next.js Pages Router

> Organize componentes com barrel exports, detecte rotas ativas via useRouter, e construa headers fixos com backdrop blur.

## Rules

1. **Use barrel exports para componentes** — crie `components/header/index.ts` que re-exporta tudo, porque permite imports limpos e agrupa arquivos relacionados (hooks, types) no mesmo diretorio
2. **Detecte rota ativa com useRouter().pathname** — compare pathname com a rota do link para aplicar estilos condicionais, porque o Next.js Pages Router expoe a rota atual via esse hook
3. **Use startsWith para rotas com sub-rotas** — `router.pathname.startsWith('/blog')` em vez de `===`, porque sub-rotas como `/blog/post-id` precisam manter o link ativo
4. **Use igualdade estrita para rotas exatas** — `router.pathname === '/'` para home, porque startsWith('/') matcharia todas as rotas
5. **Header fixo com z-index e backdrop blur** — `fixed top-0 z-50 w-full backdrop-blur` garante que o header fica acima do conteudo com efeito de transparencia durante scroll
6. **Use cn() para classes condicionais** — combine estilos base com estilos condicionais via `cn()` do shadcn/ui, porque mantém legibilidade e merge correto de classes Tailwind

## How to write

### Estrutura de pasta do componente

```
components/
  header/
    header.tsx        # Componente principal
    index.ts          # Barrel export
    use-header.ts     # Custom hooks (se necessario)
```

```typescript
// components/header/index.ts
export { Header } from './header'
```

### Header com active link

```typescript
import Link from 'next/link'
import { useRouter } from 'next/router'
import { cn } from '@/lib/utils'

export const Header = () => {
  const router = useRouter()
  const isHomePage = router.pathname === '/'
  const isBlogPage = router.pathname.startsWith('/blog')

  return (
    <header className="fixed top-0 z-50 w-full border-b border-white/10 bg-background/95 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/">Logo</Link>
          <nav className="flex gap-6">
            <Link
              href="/"
              className={cn(
                'text-sm font-medium transition-colors hover:text-primary',
                isHomePage ? 'text-blue-500' : 'text-muted-foreground'
              )}
            >
              Inicio
            </Link>
            <Link
              href="/blog"
              className={cn(
                'text-sm font-medium transition-colors hover:text-primary',
                isBlogPage ? 'text-blue-500' : 'text-muted-foreground'
              )}
            >
              Blog
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}
```

## Example

**Before (sem active link, sem organizacao):**
```typescript
// components/header.tsx
import Link from 'next/link'

export default function Header() {
  return (
    <header>
      <Link href="/">Home</Link>
      <Link href="/blog">Blog</Link>
    </header>
  )
}
```

**After (com active link e barrel export):**
```typescript
// components/header/header.tsx
import Link from 'next/link'
import { useRouter } from 'next/router'
import { cn } from '@/lib/utils'

export const Header = () => {
  const router = useRouter()
  const isHomePage = router.pathname === '/'
  const isBlogPage = router.pathname.startsWith('/blog')

  return (
    <header className="fixed top-0 z-50 w-full border-b border-white/10 bg-background/95 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/">Logo</Link>
          <nav className="flex gap-6">
            <Link href="/" className={cn('text-sm font-medium transition-colors hover:text-primary', isHomePage ? 'text-blue-500' : 'text-muted-foreground')}>
              Inicio
            </Link>
            <Link href="/blog" className={cn('text-sm font-medium transition-colors hover:text-primary', isBlogPage ? 'text-blue-500' : 'text-muted-foreground')}>
              Blog
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}

// components/header/index.ts
export { Header } from './header'
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Rota exata (home `/`) | `router.pathname === '/'` |
| Rota com sub-rotas (`/blog`, `/blog/post-1`) | `router.pathname.startsWith('/blog')` |
| Import do componente | `import { Header } from '@/components/header'` (barrel) |
| Estilos condicionais com Tailwind | Use `cn()` do shadcn/ui |
| Header precisa ficar acima do conteudo | `fixed top-0 z-50` |
| Efeito de transparencia no scroll | `bg-background/95 backdrop-blur` |

## Anti-patterns

| Nunca escreva | Escreva assim |
|---------------|---------------|
| `router.pathname === '/blog'` (para rotas com filhos) | `router.pathname.startsWith('/blog')` |
| `router.pathname.startsWith('/')` (para home) | `router.pathname === '/'` |
| `import { Header } from './header/header'` | `import { Header } from './header'` (via barrel) |
| Classes condicionais com ternario inline longo | `cn('base', condition ? 'active' : 'inactive')` |
| `position: sticky` sem z-index | `fixed top-0 z-50` com z-index explicito |

## Troubleshooting

### Erro ao usar hooks em Server Component
**Symptom:** Erro "useState/useEffect is not a function" ou "Hooks can only be called inside a Client Component"
**Cause:** Tentativa de usar hooks React (useState, useEffect, useSession) em um componente sem a diretiva "use client"
**Fix:** Adicionar `"use client"` no topo do arquivo OU extrair a parte interativa para um componente-folha separado com "use client"

### Server Component nao consegue ser async apos adicionar "use client"
**Symptom:** Erro ao usar `async function Component()` com `"use client"`
**Cause:** Client Components nao suportam async/await — essa e uma restricao fundamental do React
**Fix:** Remover "use client" e usar async/await direto (Server Component), ou manter "use client" e buscar dados via hooks (useEffect, React Query)

## Deep reference library

- [deep-explanation.md](../../../data/skills/next-js/rs-next-js-componente-header-9/references/deep-explanation.md) — O instrutor apresenta um padrao de organizacao que ele usa em seus projetos: em vez de criar um `ind
- [code-examples.md](../../../data/skills/next-js/rs-next-js-componente-header-9/references/code-examples.md) — // components/header/index.ts
