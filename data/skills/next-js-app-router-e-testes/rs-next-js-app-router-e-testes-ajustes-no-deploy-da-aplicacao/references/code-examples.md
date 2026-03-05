# Code Examples: Suspense Boundaries para useSearchParams

## Exemplo 1: SearchForm no Header

O caso mais comum — um formulario de busca no header que usa `useSearchParams` e aparece em todas as paginas.

### search-form.tsx (componente client)
```tsx
'use client'

import { useSearchParams } from 'next/navigation'

export function SearchForm() {
  const searchParams = useSearchParams()
  const query = searchParams.get('q')

  return (
    <form action="/search">
      <input
        name="q"
        defaultValue={query ?? ''}
        placeholder="Buscar produtos..."
      />
    </form>
  )
}
```

### header.tsx (com Suspense boundary)
```tsx
import { Suspense } from 'react'
import { SearchForm } from './search-form'

export function Header() {
  return (
    <header>
      <nav>
        <a href="/">Home</a>
        {/* ... outros links estaticos ... */}
      </nav>

      <Suspense fallback={null}>
        <SearchForm />
      </Suspense>
    </header>
  )
}
```

**Por que funciona:** O `<nav>` e todo o resto do header sao estaticos. Apenas o `<SearchForm>` precisa ser processado no cliente. O Suspense cria essa fronteira.

## Exemplo 2: Pagina de Search com useSearchParams

### Antes (pagina inteira e client component)
```tsx
// app/search/page.tsx
'use client'

import { useSearchParams } from 'next/navigation'

export default function SearchPage() {
  const searchParams = useSearchParams()
  const query = searchParams.get('q')

  return (
    <div>
      <p>
        Resultados para: <span>{query}</span>
      </p>
      {/* ... lista de produtos ... */}
    </div>
  )
}
```

**Problema:** Toda a pagina perde geracao estatica.

### Depois (componente client isolado)

```tsx
// components/current-search.tsx
'use client'

import { useSearchParams } from 'next/navigation'

export function CurrentSearch() {
  const searchParams = useSearchParams()
  const query = searchParams.get('q')

  return (
    <p>
      Resultados para: <span>{query}</span>
    </p>
  )
}
```

```tsx
// app/search/page.tsx (agora server component)
import { Suspense } from 'react'
import { CurrentSearch } from '@/components/current-search'

export default function SearchPage() {
  return (
    <div>
      <Suspense fallback={null}>
        <CurrentSearch />
      </Suspense>
      {/* resto da pagina pode ser estatico */}
    </div>
  )
}
```

## Exemplo 3: Fallback com Skeleton

Quando o componente dinamico e visualmente grande, use skeleton:

```tsx
<Suspense fallback={<SearchFormSkeleton />}>
  <SearchForm />
</Suspense>
```

```tsx
function SearchFormSkeleton() {
  return (
    <div className="h-10 w-64 animate-pulse rounded bg-gray-200" />
  )
}
```

## Verificacao: rodando build localmente

```bash
# Rodar build para verificar se warnings sumiram
npm run build

# Procurar pelo warning especifico
# "Entire page /path deopted into client-side rendering"
# Se nao aparecer, o Suspense boundary esta funcionando
```

## Fluxo de CI/CD mencionado na aula

```bash
# Criar branch
git checkout -b fix/static-boundaries

# Commit
git add .
git commit -m "fix: add suspense boundaries when using useSearchParams"

# Criar PR via GitHub CLI
gh pr create --title "fix: add suspense boundaries" --body "Adds Suspense boundaries around useSearchParams usage to preserve static generation"

# Abrir no navegador
gh pr view --web
```