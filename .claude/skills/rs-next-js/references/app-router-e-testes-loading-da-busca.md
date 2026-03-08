---
name: rs-nextjs-app-router-loading-da-busca
description: "Applies Next.js App Router loading page patterns for search routes using Skeleton UI. Use when user asks to 'create loading state', 'add search skeleton', 'loading page for search', 'improve search UX', or 'add loading.tsx'. Enforces useSearchParams workaround since searchParams props are unavailable in loading files. Make sure to use this skill whenever creating loading.tsx files for routes that depend on search params. Not for API loading states, Suspense boundaries, or server-side data fetching patterns."

metadata:
  author: Rocketseat
  version: 2.0.0
  course: next-js
  module: app-router-e-testes
  tags: [next-js, loading-state, skeleton, useSearchParams, search, client-component]
---

# Loading da Busca (Next.js App Router)

> Em loading pages do App Router, use `useSearchParams` com client component porque searchParams nao esta disponivel como props.

## Rules

1. **Loading page espelha a estrutura da pagina real** — mesma grid, mesmos gaps, mesma hierarquia, porque o usuario percebe transicoes suaves quando o layout nao pula
2. **Use `'use client'` + `useSearchParams` em loading pages que precisam de query** — `searchParams` nao e passado como props em `loading.tsx`, essa e a unica forma de acessar parametros de busca
3. **Use `searchParams.get('q')` nao desestruturacao** — `useSearchParams()` retorna URLSearchParams, nao um objeto plain
4. **Skeleton heights devem corresponder ao tamanho real do componente** — ajuste ate o skeleton ter a mesma altura do card renderizado, porque layout shift degrada a experiencia
5. **Quantidade de skeletons deve ser multipla da grid** — se grid tem 3 colunas, use 3 ou 6 skeletons para manter simetria visual

## How to write

### Loading page para busca

```typescript
'use client'

import { useSearchParams } from 'next/navigation'
import { Skeleton } from '@/components/skeleton'

export default function SearchLoading() {
  const searchParams = useSearchParams()
  const query = searchParams.get('q')

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm">
        Resultados para: <span className="font-semibold">{query}</span>
      </p>

      <div className="grid grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-[400px]" />
        ))}
      </div>
    </div>
  )
}
```

## Example

**Before (loading generico):**
```typescript
export default function Loading() {
  return <p>Carregando...</p>
}
```

**After (loading estruturado com query):**
```typescript
'use client'

import { useSearchParams } from 'next/navigation'
import { Skeleton } from '@/components/skeleton'

export default function SearchLoading() {
  const searchParams = useSearchParams()
  const query = searchParams.get('q')

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm">
        Resultados para: <span className="font-semibold">{query}</span>
      </p>

      <div className="grid grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-[400px]" />
        ))}
      </div>
    </div>
  )
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Loading page precisa de search params | `'use client'` + `useSearchParams()` |
| Loading page NAO precisa de params | Server component normal (sem `'use client'`) |
| Skeleton muito menor que o card real | Ajuste height ate coincidir (teste visual) |
| Grid com numero impar de colunas | Use quantidade de skeletons multipla do numero de colunas |
| Query pode ser null | Nao exiba o paragrafo de resultados se `query` for null |

## Anti-patterns

| Nunca faca | Faca isso |
|------------|-----------|
| `export default function Loading({ searchParams })` | `useSearchParams().get('q')` com `'use client'` |
| `const { q } = useSearchParams()` | `const q = searchParams.get('q')` |
| Skeleton com altura fixa sem testar | Ajuste altura ate coincidir com o componente real |
| 5 skeletons em grid de 3 colunas | 6 skeletons (multiplo de 3) |
| Loading generico com "Carregando..." | Skeleton que espelha o layout da pagina |

## Troubleshooting

### Loading state nao aparece durante carregamento
**Symptom:** Pagina fica em branco durante o carregamento, sem skeleton ou spinner
**Cause:** Arquivo `loading.tsx` ausente no diretorio da rota, ou Suspense boundary nao configurado
**Fix:** Criar arquivo `loading.tsx` no diretorio da pagina que demora para carregar. Para granularidade maior, envolver componentes lentos com `<Suspense fallback={...}>`

### Streaming SSR nao funciona
**Symptom:** Pagina inteira espera todos os dados antes de renderizar
**Cause:** Dados sao carregados na pagina principal sem Suspense boundary
**Fix:** Mover fetch de dados para componentes filhos async e envolver com `<Suspense>`. Cada Suspense boundary habilita streaming independente

## Deep reference library

- [deep-explanation.md](../../../data/skills/next-js-app-router-e-testes/rs-next-js-app-router-e-testes-loading-da-busca/references/deep-explanation.md) — No Next.js App Router, arquivos `loading.tsx` sao renderizados automaticamente pelo framework como f
- [code-examples.md](../../../data/skills/next-js-app-router-e-testes/rs-next-js-app-router-e-testes-loading-da-busca/references/code-examples.md) — // app/search/loading.tsx
