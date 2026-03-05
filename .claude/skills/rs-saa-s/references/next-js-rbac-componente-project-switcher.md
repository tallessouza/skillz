---
name: rs-saas-next-rbac-project-switcher
description: "Applies Client Component data-fetching patterns when building switcher/selector components in Next.js App Router. Use when user asks to 'create a switcher', 'fetch data in client component', 'use react-query in Next.js', 'access URL params in component', or 'setup query provider'. Covers useParams typing, react-query setup with providers pattern, and conditional queries. Make sure to use this skill whenever creating client components that need HTTP data or URL params in Next.js App Router. Not for Server Component data fetching, API route creation, or cookie-based state."
---

# Client Component Data Fetching com React Query no Next.js

> Em Client Components no Next.js App Router, use react-query para data fetching e useParams para acessar dados da URL.

## Rules

1. **Use useParams para acessar dados da URL em componentes** — Server Components so acessam params se forem paginas diretas no diretorio app, componentes aninhados precisam ser Client Components com useParams
2. **Type useParams com generic** — `useParams<{ slug: string }>()` porque evita erros de tipagem e documenta quais params a rota espera
3. **Use react-query ao inves do hook use para data fetching** — porque react-query oferece cache, deduplication, revalidation e loading states que o hook `use` nao tem
4. **Inclua o parametro variavel na queryKey** — `queryKey: [orgSlug, 'projects']` porque garante cache separado por organizacao
5. **Use enabled para queries condicionais** — `enabled: !!orgSlug` porque o componente pode ser renderizado em paginas sem o parametro na URL
6. **Crie um arquivo providers.tsx para agrupar context providers** — porque Client Components com providers nao podem ficar diretamente no layout (Server Component)

## How to write

### Setup do QueryClient

```typescript
// src/lib/react-query.ts
import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient()
```

### Providers wrapper (padrao Next.js)

```typescript
// src/app/providers.tsx
'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from 'next-themes'
import { queryClient } from '@/lib/react-query'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>{children}</ThemeProvider>
    </QueryClientProvider>
  )
}
```

### Client Component com useParams + useQuery

```typescript
'use client'

import { useParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'

export function ProjectSwitcher() {
  const { slug: orgSlug } = useParams<{ slug: string }>()

  const { data, isLoading } = useQuery({
    queryKey: [orgSlug, 'projects'],
    queryFn: () => getProjects(orgSlug!),
    enabled: !!orgSlug,
  })
}
```

## Example

**Before (usando hook use do React 19):**
```typescript
'use client'
import { use } from 'react'

export function ProjectSwitcher() {
  const { slug: orgSlug } = useParams<{ slug: string }>()
  const projects = use(getProjects(orgSlug!))
  // Sem loading state, sem cache, sem error handling
}
```

**After (com react-query):**
```typescript
'use client'
import { useParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { getProjects } from '@/http/get-projects'

export function ProjectSwitcher() {
  const { slug: orgSlug } = useParams<{ slug: string }>()

  const { data, isLoading } = useQuery({
    queryKey: [orgSlug, 'projects'],
    queryFn: () => getProjects(orgSlug!),
    enabled: !!orgSlug,
  })

  if (isLoading) return <Skeleton />
  // render com data.projects
}
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Componente precisa de dados da URL | Tornar Client Component, usar useParams |
| Server Component precisa de params | So funciona se for pagina direta (page.tsx), nao componente aninhado |
| Providers de contexto no layout | Criar arquivo providers.tsx com 'use client' e passar children |
| Query depende de param opcional | Usar `enabled: !!param` para evitar requests invalidos |
| Children dentro de Client Component provider | Continuam Server Components normalmente (passados via children prop) |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `use(fetchPromise())` para data fetching | `useQuery({ queryFn, queryKey })` |
| QueryClientProvider direto no layout.tsx | Arquivo providers.tsx separado com 'use client' |
| `queryKey: ['projects']` sem parametro variavel | `queryKey: [orgSlug, 'projects']` |
| Componente aninhado tentando params como Server Component | Client Component com useParams |
| Componente importado diretamente dentro de Client Component | Passar como children para manter Server Component |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/saa-s/rs-saa-s-next-js-rbac-componente-project-switcher/references/deep-explanation.md)
- [Code examples](../../../data/skills/saa-s/rs-saa-s-next-js-rbac-componente-project-switcher/references/code-examples.md)
