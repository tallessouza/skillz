# Code Examples: Componente Header — Next.js Pages Router

## 1. Barrel export basico

```typescript
// components/header/index.ts
export { Header } from './header'
```

Se houver custom hooks ou tipos:
```typescript
// components/header/index.ts
export { Header } from './header'
export { useHeader } from './use-header'
export type { HeaderProps } from './header'
```

## 2. Import simplificado via barrel

```typescript
// pages/index.tsx
import { Header } from '@/components/header'
// Em vez de: import { Header } from '@/components/header/header'
```

## 3. Deteccao de rota ativa

```typescript
import { useRouter } from 'next/router'

const router = useRouter()

// Rota exata
const isHomePage = router.pathname === '/'

// Rota com sub-rotas
const isBlogPage = router.pathname.startsWith('/blog')
// Funciona para: /blog, /blog/post-1, /blog/category/tech
```

## 4. Classe condicional com cn()

```typescript
import { cn } from '@/lib/utils'

// Estilos base + condicional
className={cn(
  'text-sm font-medium transition-colors hover:text-primary',
  isHomePage ? 'text-blue-500' : 'text-muted-foreground'
)}
```

## 5. Header completo da aula

```typescript
import Link from 'next/link'
import { useRouter } from 'next/router'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

export const Header = () => {
  const router = useRouter()
  const isHomePage = router.pathname === '/'
  const isBlogPage = router.pathname.startsWith('/blog')

  return (
    <header className="fixed top-0 z-50 w-full border-b border-white/10 bg-background/95 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/">
            {/* Logo SVG exportado do Figma */}
          </Link>

          <nav className="flex gap-6">
            <Link
              href="/"
              className={cn(
                'text-sm font-medium transition-colors hover:text-blue-500',
                isHomePage ? 'text-blue-500' : 'text-muted-foreground'
              )}
            >
              Inicio
            </Link>
            <Link
              href="/blog"
              className={cn(
                'text-sm font-medium transition-colors hover:text-blue-500',
                isBlogPage ? 'text-blue-500' : 'text-muted-foreground'
              )}
            >
              Blog
            </Link>
          </nav>

          <Button variant="secondary">Comecar</Button>
        </div>
      </div>
    </header>
  )
}
```

## 6. Pagina usando o header

```typescript
// pages/index.tsx
import { Header } from '@/components/header'

export default function Home() {
  return (
    <>
      <Header />
      {/* Conteudo da pagina */}
    </>
  )
}
```

## 7. Variacao: NavLink reutilizavel (melhoria sugerida pelo instrutor)

O instrutor notou duplicacao nos links e sugeriu extrair um componente:

```typescript
// components/header/nav-link.tsx
import Link from 'next/link'
import { useRouter } from 'next/router'
import { cn } from '@/lib/utils'

interface NavLinkProps {
  href: string
  children: React.ReactNode
  exact?: boolean
}

export const NavLink = ({ href, children, exact = false }: NavLinkProps) => {
  const router = useRouter()
  const isActive = exact
    ? router.pathname === href
    : router.pathname.startsWith(href)

  return (
    <Link
      href={href}
      className={cn(
        'text-sm font-medium transition-colors hover:text-blue-500',
        isActive ? 'text-blue-500' : 'text-muted-foreground'
      )}
    >
      {children}
    </Link>
  )
}
```

Uso:
```typescript
<nav className="flex gap-6">
  <NavLink href="/" exact>Inicio</NavLink>
  <NavLink href="/blog">Blog</NavLink>
</nav>
```

## 8. Exportando assets do Figma

O instrutor mencionou o fluxo para exportar a logo:
1. Selecionar o elemento no Figma
2. Ir em "Export" no painel direito
3. Selecionar formato SVG
4. Exportar e colocar na pasta `public/`
5. Referenciar via `<Image src="/logo.svg" />` ou SVG inline