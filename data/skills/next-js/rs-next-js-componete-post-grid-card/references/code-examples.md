# Code Examples: PostGridCard

## Componente PostGridCard completo (da aula)

```tsx
// PostGridCard.tsx
import React from 'react'

interface PostGridCardProps {
  children: React.ReactNode
}

export function PostGridCard({ children }: PostGridCardProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {children}
    </div>
  )
}
```

## Uso na pagina de blog (da aula)

```tsx
// pages/blog.tsx (ou index.tsx da secao blog)
import { PostGridCard } from '../components/PostGridCard'
import { PostCard } from '../components/PostCard'

export default function BlogList() {
  return (
    <>
      <header className="pb-14">
        <h1>Blog</h1>
        {/* Tag component */}
        {/* Search component */}
      </header>
      <PostGridCard>
        <PostCard />
        <PostCard />
        <PostCard />
      </PostGridCard>
    </>
  )
}
```

## Variacao: Grid generico reutilizavel

Se voce precisar de grids com configuracoes diferentes, pode parametrizar as colunas:

```tsx
interface GridProps {
  children: React.ReactNode
  columns?: {
    sm?: number
    lg?: number
  }
}

export function Grid({ children, columns = { sm: 2, lg: 3 } }: GridProps) {
  return (
    <div
      className={`grid grid-cols-1 sm:grid-cols-${columns.sm} lg:grid-cols-${columns.lg} gap-6`}
    >
      {children}
    </div>
  )
}
```

> Nota: classes Tailwind dinamicas assim precisam de safelist no `tailwind.config.js` ou usar classes completas pre-definidas.

## Variacao: Grid com 4 colunas em telas extra-largas

```tsx
export function PostGridCard({ children }: PostGridCardProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {children}
    </div>
  )
}
```

## Estrutura de arquivos resultante

```
components/
├── PostCard.tsx          # Card individual do post
├── PostGridCard.tsx      # Grid responsivo (esta aula)
└── Search.tsx            # Componente de busca (aula anterior)
```