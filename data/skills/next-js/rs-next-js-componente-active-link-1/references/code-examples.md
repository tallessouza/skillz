# Code Examples: Componente ActiveLink

## Exemplo 1: Estrutura de arquivos

```
src/
  components/
    ActiveLink/
      ActiveLink.tsx    # Componente principal
      index.ts          # Barrel export
```

### index.ts (barrel file)
```typescript
export { ActiveLink } from './ActiveLink'
```

## Exemplo 2: ActiveLink completo (como na aula)

```typescript
// src/components/ActiveLink/ActiveLink.tsx
import Link, { LinkProps } from 'next/link'
import { useRouter } from 'next/router'
import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface ActiveLinkProps extends LinkProps {
  children: ReactNode
}

export function ActiveLink({ children, href, ...rest }: ActiveLinkProps) {
  const router = useRouter()

  const isCurrentPath =
    router.asPath === String(href) ||
    router.asPath.startsWith(String(href))

  return (
    <Link
      href={href}
      {...rest}
      className={cn(
        'text-muted-foreground transition-colors',
        isCurrentPath && 'text-foreground font-semibold'
      )}
    >
      {children}
    </Link>
  )
}
```

## Exemplo 3: Header antes da refatoracao

```tsx
// ANTES — logica duplicada, header com muita responsabilidade
import Link from 'next/link'
import { useRouter } from 'next/router'
import { cn } from '@/lib/utils'

export function Header() {
  const router = useRouter()

  const isHome = router.asPath === '/'
  const isBlog =
    router.asPath === '/blog' || router.asPath.startsWith('/blog')

  return (
    <header>
      <nav>
        <Link
          href="/"
          className={cn(
            'text-muted-foreground',
            isHome && 'text-foreground font-semibold'
          )}
        >
          Início
        </Link>
        <Link
          href="/blog"
          className={cn(
            'text-muted-foreground',
            isBlog && 'text-foreground font-semibold'
          )}
        >
          Blog
        </Link>
      </nav>
    </header>
  )
}
```

## Exemplo 4: Header depois da refatoracao

```tsx
// DEPOIS — limpo, sem logica de rota ativa
import { ActiveLink } from '@/components/ActiveLink'

export function Header() {
  return (
    <header>
      <nav>
        <ActiveLink href="/">Início</ActiveLink>
        <ActiveLink href="/blog">Blog</ActiveLink>
      </nav>
      <Button asChild>
        <Link href="/comecar">Começar</Link>
      </Button>
    </header>
  )
}
```

## Exemplo 5: Botao convertido para Link

```tsx
// ANTES — botao sem navegacao
<Button>Começar</Button>

// DEPOIS — botao que navega via Link (usando asChild pattern)
<Button asChild>
  <Link href="/comecar">Começar</Link>
</Button>
```

O `asChild` (pattern do Radix UI / Shadcn) faz o Button delegar a renderizacao para o filho, mantendo os estilos do botao mas usando a semantica de link.

## Exemplo 6: Variacao com className customizado

```tsx
// O ActiveLink pode receber className adicional via rest props
<ActiveLink href="/sobre" className="text-sm">
  Sobre
</ActiveLink>
```

Para combinar className do usuario com o className de ativo, use `cn()`:

```typescript
export function ActiveLink({ children, href, className, ...rest }: ActiveLinkProps & { className?: string }) {
  const router = useRouter()
  const isCurrentPath = router.asPath === String(href) || router.asPath.startsWith(String(href))

  return (
    <Link
      href={href}
      {...rest}
      className={cn(
        'text-muted-foreground',
        isCurrentPath && 'text-foreground font-semibold',
        className
      )}
    >
      {children}
    </Link>
  )
}
```