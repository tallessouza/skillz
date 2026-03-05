---
name: rs-nextjs-app-router-suspense-boundaries
description: "Enforces React Suspense boundaries around useSearchParams in Next.js App Router to prevent static generation bailout. Use when user asks to 'fix build warnings', 'use useSearchParams', 'fix deopted into client-side rendering', 'optimize Next.js static generation', or 'deploy Next.js app'. Applies Suspense frontiers between static and dynamic content. Make sure to use this skill whenever generating Next.js pages or components that use useSearchParams, even if the user doesn't mention build warnings. Not for general React Suspense for data fetching, loading states, or server components without search params."
---

# Suspense Boundaries para useSearchParams no Next.js

> Sempre envolver componentes que usam useSearchParams em um Suspense boundary para preservar a geracao estatica do restante da pagina.

## Rules

1. **Sempre envolva useSearchParams com Suspense** — porque no momento da build nao existe URL no navegador, entao o Next nao consegue gerar a pagina estaticamente se useSearchParams esta exposto sem boundary
2. **Extraia o uso de useSearchParams para um componente client isolado** — porque isso minimiza a superficie dinamica e permite que o resto da pagina seja estatico
3. **Use fallback={null} quando o componente nao precisa de skeleton** — porque evita flash de conteudo vazio sem complexidade desnecessaria
4. **Remova 'use client' da pagina quando possivel** — mova o useSearchParams para um componente filho client e mantenha a pagina como server component

## How to write

### Componente no header (usado em todas as paginas)

```tsx
// components/header.tsx
import { Suspense } from 'react'
import { SearchForm } from './search-form'

export function Header() {
  return (
    <header>
      {/* Conteudo estatico do header */}
      <Suspense fallback={null}>
        <SearchForm />
      </Suspense>
    </header>
  )
}
```

### Extrair useSearchParams para componente isolado

```tsx
// components/current-search.tsx
'use client'

import { useSearchParams } from 'next/navigation'

export function CurrentSearch() {
  const searchParams = useSearchParams()
  const query = searchParams.get('q')

  return <p>Resultados para: {query}</p>
}
```

```tsx
// app/search/page.tsx (server component)
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

## Example

**Before (build warning: entire page deopted into client-side rendering):**
```tsx
// app/search/page.tsx
'use client'

import { useSearchParams } from 'next/navigation'

export default function SearchPage() {
  const searchParams = useSearchParams()
  const query = searchParams.get('q')

  return (
    <div>
      <p>Resultados para: {query}</p>
      <ProductList query={query} />
    </div>
  )
}
```

**After (static generation preserved):**
```tsx
// app/search/page.tsx
import { Suspense } from 'react'
import { CurrentSearch } from '@/components/current-search'
import { ProductList } from '@/components/product-list'

export default function SearchPage() {
  return (
    <div>
      <Suspense fallback={null}>
        <CurrentSearch />
      </Suspense>
      <ProductList />
    </div>
  )
}
```

## Heuristics

| Situation | Do |
|-----------|-----|
| useSearchParams em componente de header/layout | Envolver com Suspense no ponto de uso |
| useSearchParams em pagina inteira | Extrair para componente client isolado + Suspense |
| Loading page usa useSearchParams | Menor prioridade, mas mesmo padrao se possivel |
| Multiplos useSearchParams na mesma pagina | Cada um em seu proprio componente client + Suspense |
| Fallback visual necessario | Usar skeleton screen no fallback do Suspense |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `'use client'` na pagina so por causa de useSearchParams | Extrair para componente filho client |
| useSearchParams direto no layout/header sem Suspense | `<Suspense fallback={null}><SearchForm /></Suspense>` |
| Ignorar warnings de build "deopted into client-side rendering" | Adicionar Suspense boundaries |
| Suspense envolvendo a pagina inteira | Suspense apenas no componente que usa useSearchParams |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/next-js/rs-next-js-app-router-e-testes-ajustes-no-deploy-da-aplicacao/references/deep-explanation.md)
- [Code examples](../../../data/skills/next-js/rs-next-js-app-router-e-testes-ajustes-no-deploy-da-aplicacao/references/code-examples.md)
