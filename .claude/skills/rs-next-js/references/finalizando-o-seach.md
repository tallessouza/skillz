---
name: rs-next-js-finalizando-o-search
description: "Applies Next.js Pages Router search component patterns when building search with clear/reset, responsive sizing, dynamic titles from URL state, and template refactoring. Use when user asks to 'create a search component', 'add clear button to input', 'update page title dynamically', 'use URL state between components', or 'refactor pages to templates'. Make sure to use this skill whenever implementing search functionality in Next.js Pages Router. Not for App Router, server components, or API routes."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: next-js
  module: pages-router-fundamentos
  tags: [search, query-params, shallow-routing, pages-router, responsive, url-state, next-js]
---

# Finalizando o Search — Next.js Pages Router

> Componentes de busca comunicam estado via URL query params, permitindo que componentes distantes reajam a mudancas sem prop drilling.

## Rules

1. **Input responsivo com breakpoint** — use `w-full` por padrao e `md:w-[240px]` para desktop, porque mobile precisa ocupar 100% da tela
2. **Icone de limpar so aparece com texto** — renderize condicionalmente `{query && <CircleX />}`, porque icone sem funcao confunde o usuario
3. **Reset via router.push sem query** — use `router.push('/blog', undefined, { shallow: true, scroll: false })`, porque shallow evita re-fetch desnecessario
4. **Nullish coalescing para query params** — use `(router.query.q as string) ?? ''`, porque query params podem ser undefined e quebrar inputs controlados
5. **Titulo dinamico baseado na busca** — derive o titulo da pagina a partir do query param, porque feedback visual imediato confirma a acao do usuario
6. **Templates separam montagem de roteamento** — mova logica de pagina para `templates/blog/` e importe em `pages/`, porque pages deve ser fino e templates agrupa componentes relacionados

## How to write

### Search com reset e icone condicional

```tsx
import { CircleX, Search } from 'lucide-react'
import { useRouter } from 'next/router'

export function SearchComponent() {
  const router = useRouter()
  const query = (router.query.q as string) ?? ''

  function handleSearch(value: string) {
    router.push({ pathname: '/blog', query: { q: value } },
      undefined, { shallow: true, scroll: false })
  }

  function resetSearch() {
    router.push('/blog', undefined, { shallow: true, scroll: false })
  }

  return (
    <form className="relative w-full md:w-[240px]">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
      <input
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
        className="w-full md:w-[240px] pl-10 pr-8"
      />
      {query && (
        <CircleX
          onClick={resetSearch}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 cursor-pointer"
          size={16}
        />
      )}
    </form>
  )
}
```

### Titulo dinamico na pagina pai

```tsx
import { useRouter } from 'next/router'

export function BlogList() {
  const router = useRouter()
  const query = (router.query.q as string) ?? ''

  const pageTitle = query
    ? `Resultados de busca para "${query}"`
    : 'Dicas e estratégias para impulsionar o seu negócio'

  return (
    <section>
      <h2>{pageTitle}</h2>
      <SearchComponent />
      {/* grid de posts */}
    </section>
  )
}
```

### Estrutura de templates

```
templates/
  blog/
    blog-list.tsx    # Componente com toda a logica
    index.ts         # Re-export

pages/
  blog/
    index.tsx        # Apenas importa e renderiza BlogList
```

## Example

**Before (pagina pages/ inchada, sem reset, sem responsividade):**
```tsx
// pages/blog/index.tsx — tudo misturado
export default function Blog() {
  const router = useRouter()
  const q = router.query.q as string
  return (
    <div>
      <h2>Posts</h2>
      <input value={q} onChange={...} className="w-[240px]" />
      {/* todo o conteudo aqui */}
    </div>
  )
}
```

**After (com this skill applied):**
```tsx
// pages/blog/index.tsx — fino
import { BlogList } from '@/templates/blog'
export default function BlogPage() {
  return <BlogList />
}

// templates/blog/blog-list.tsx — logica organizada
// SearchComponent com reset, icone condicional, responsivo
// Titulo dinamico derivado de URL state
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Input de busca em qualquer pagina | Sempre adicionar botao de limpar condicional |
| Query param pode ser undefined | Sempre usar nullish coalescing `?? ''` |
| Dois componentes distantes precisam compartilhar estado | Usar URL state via query params + shallow routing |
| Pagina em pages/ ficando grande | Extrair para templates/, manter pages/ como wrapper fino |
| Icone posicionado dentro de input | Usar `relative` no container + `absolute` no icone com `top-1/2 -translate-y-1/2` |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `const q = router.query.q as string` (sem fallback) | `const q = (router.query.q as string) ?? ''` |
| `<input className="w-[240px]">` (fixo em mobile) | `<input className="w-full md:w-[240px]">` |
| Icone de limpar sempre visivel | `{query && <CircleX />}` |
| `router.push('/blog')` sem options | `router.push('/blog', undefined, { shallow: true, scroll: false })` |
| Toda logica dentro de `pages/` | Extrair para `templates/`, importar em `pages/` |

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

- [deep-explanation.md](../../../data/skills/next-js/rs-next-js-finalizando-o-seach/references/deep-explanation.md) — O instrutor destaca um padrao poderoso do Next.js Pages Router: usar query params da URL como estado
- [code-examples.md](../../../data/skills/next-js/rs-next-js-finalizando-o-seach/references/code-examples.md) — // Antes — largura fixa quebra no mobile
