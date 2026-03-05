---
name: rs-nextjs-app-router-formulario-de-busca
description: "Applies Next.js App Router search form patterns when building search functionality with client-side navigation. Use when user asks to 'create a search form', 'add search to header', 'implement search redirect', 'handle form submission in Next.js', or 'preserve search state on refresh'. Enforces soft navigation via useRouter.push, useSearchParams for URL state persistence, and proper client component extraction. Make sure to use this skill whenever implementing search or form-based navigation in Next.js App Router projects. Not for API route handlers, server actions, or database query logic."
---

# Formulário de Busca no Next.js App Router

> Formulários de busca no App Router usam soft navigation via useRouter.push e preservam estado via useSearchParams — nunca hard navigation com action ou âncoras nativas.

## Rules

1. **Use soft navigation, nunca hard navigation** — `router.push()` no lugar de `form action` ou `<a href>`, porque hard navigation zera todo o JavaScript já carregado e recalcula tudo do zero, perdendo o benefício de SPA
2. **Extraia o formulário para um Client Component** — `useRouter` e `useSearchParams` só funcionam em Client Components, então o form de busca deve ser um componente separado com `'use client'`
3. **Importe useRouter de next/navigation** — nunca de `next/router`, porque `next/router` é para o Pages Router (versão antiga), `next/navigation` é para o App Router
4. **Use FormData + Object.fromEntries para ler inputs** — evita useState desnecessário, porque é a forma mais simples de extrair dados de um formulário nativo
5. **Preserve estado da busca com useSearchParams** — use `defaultValue` no input com o valor do search param, porque ao dar F5 o input perde o estado e o usuário não sabe o que buscou
6. **Sempre preventDefault no submit** — porque o comportamento padrão do form é fazer hard navigation

## How to write

### Search Form Component

```typescript
'use client'

import { useRouter, useSearchParams } from 'next/navigation'

export function SearchForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const query = searchParams.get('q') ?? ''

  function handleSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const data = Object.fromEntries(new FormData(event.currentTarget))
    const searchQuery = data.q as string

    if (!searchQuery) return

    router.push(`/search?q=${searchQuery}`)
  }

  return (
    <form onSubmit={handleSearch}>
      <input name="q" defaultValue={query} placeholder="Buscar produtos" />
    </form>
  )
}
```

### Usando no Header (Server Component)

```typescript
import { SearchForm } from './search-form'

export function Header() {
  return (
    <header>
      <SearchForm />
    </header>
  )
}
```

## Example

**Before (hard navigation — errado):**
```typescript
// Header como Server Component com form action
export function Header() {
  return (
    <form action="/search" method="get">
      <input name="q" required />
    </form>
  )
}
// Funciona, mas faz hard navigation: recarrega TODO o JS do zero
```

**After (soft navigation — correto):**
```typescript
'use client'

import { useRouter, useSearchParams } from 'next/navigation'

export function SearchForm() {
  const router = useRouter()
  const searchParams = useSearchParams()

  function handleSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = Object.fromEntries(new FormData(event.currentTarget))
    if (!data.q) return
    router.push(`/search?q=${data.q}`)
  }

  return (
    <form onSubmit={handleSearch}>
      <input name="q" defaultValue={searchParams.get('q') ?? ''} />
    </form>
  )
}
// Soft navigation: só carrega o conteúdo da nova página, mantém JS já carregado
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Formulário redireciona para outra página | Extrair para Client Component, usar router.push |
| Input precisa manter valor após refresh | useSearchParams + defaultValue |
| Precisa ler dados do form sem useState | FormData + Object.fromEntries |
| Importando useRouter | Verificar se é de `next/navigation` (App Router) |
| Link de navegação interna | Usar `<Link>` do Next, nunca `<a href>` |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `<form action="/search" method="get">` | `<form onSubmit={handleSearch}>` com router.push |
| `import { useRouter } from 'next/router'` | `import { useRouter } from 'next/navigation'` |
| `<a href="/search?q=...">` | `router.push('/search?q=...')` |
| `const [query, setQuery] = useState('')` para ler input no submit | `Object.fromEntries(new FormData(e.currentTarget))` |
| `<input value={query}>` para preservar busca | `<input defaultValue={searchParams.get('q') ?? ''}>` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
