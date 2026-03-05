---
name: rs-next-js-iniciando-o-componente-seach
description: "Applies Next.js Pages Router search component patterns when building search inputs, URL-driven filtering, or query parameter handling. Use when user asks to 'create a search component', 'add search to a page', 'sync input with URL', 'use router.push with query params', or 'handle search input in Next.js'. Enforces stateless URL-driven approach over useState, proper encodeURIComponent usage, and cn() for conditional Tailwind classes. Make sure to use this skill whenever building search or filter inputs in Next.js Pages Router. Not for App Router, server components, or API route search logic."
---

# Search Component com Next.js Pages Router

> Prefira manipular a URL diretamente via `router.push` ao inves de gerenciar estado local com `useState` para componentes de busca.

## Rules

1. **Use router.push ao inves de useState para search** — sincronizar o input diretamente com a URL elimina estado redundante e mantém a busca compartilhavel via link
2. **Sempre use encodeURIComponent na query** — `encodeURIComponent(query)` previne quebra de URL com caracteres especiais
3. **Passe shallow: true no router.push** — atualiza a URL sem reexecutar getServerSideProps/getStaticProps, porque so a parte client precisa reagir
4. **Passe scroll: false no router.push** — evita scroll pro topo a cada keystroke, porque o usuario esta digitando
5. **Use cn() para estilos condicionais com Tailwind** — evita conflitos de classes que template literals com ternarios causam
6. **Mantenha onSubmit com preventDefault** — mesmo com onChange atualizando a URL, o submit via Enter deve ser tratado para evitar refresh da pagina

## How to write

### Abordagem correta: stateless com router

```typescript
import { useRouter } from 'next/router'
import { useCallback } from 'react'

export function Search() {
  const router = useRouter()
  const query = (router.query.q as string) || ''

  function handleQueryChange(event: React.ChangeEvent<HTMLInputElement>) {
    const newQuery = event.target.value
    router.push(`/blog?q=${encodeURIComponent(newQuery)}`, undefined, {
      shallow: true,
      scroll: false,
    })
  }

  const handleSearch = useCallback((event: React.FormEvent) => {
    event.preventDefault()
    if (!query.trim()) return
    router.push(`/blog?q=${encodeURIComponent(query)}`)
  }, [query, router])

  return (
    <form onSubmit={handleSearch}>
      <input
        type="text"
        placeholder="Buscar"
        value={query}
        onChange={handleQueryChange}
      />
    </form>
  )
}
```

### Estilos condicionais com cn()

```typescript
import { cn } from '@/lib/utils'

<SearchIcon
  className={cn(
    'text-gray-300 transition-colors duration-200 group-focus-within:text-blue-300',
    query && 'text-blue-300'
  )}
/>
```

## Example

**Before (com useState — abordagem inferior):**
```typescript
const [query, setQuery] = useState('')
const { query: routerQuery } = useRouter()

useEffect(() => {
  if (routerQuery.q) setQuery(routerQuery.q as string)
}, [routerQuery.q])

// Estado duplicado: URL + useState + useEffect pra sincronizar
```

**After (sem estado — abordagem superior):**
```typescript
const router = useRouter()
const query = (router.query.q as string) || ''

function handleQueryChange(e: React.ChangeEvent<HTMLInputElement>) {
  router.push(`/blog?q=${encodeURIComponent(e.target.value)}`, undefined, {
    shallow: true,
    scroll: false,
  })
}
// Zero estado local, URL e a single source of truth
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Input de busca que filtra conteudo | Use router.push com shallow: true, sem useState |
| Precisa que a busca seja compartilhavel via URL | Leia de router.query, nunca de estado local |
| Icone muda de cor com focus do input | Use `group` no container + `group-focus-within:` no icone |
| Icone muda de cor quando tem valor | Use `cn()` com condicional baseada na query |
| Usuario aperta Enter no input | Trate onSubmit no form com preventDefault |

## Anti-patterns

| Nunca escreva | Escreva ao inves |
|---------------|------------------|
| `useState` + `useEffect` pra sync com URL | `router.query.q` direto |
| `router.push('/blog?q=' + query)` | `router.push(\`/blog?q=\${encodeURIComponent(query)}\`)` |
| `router.push(url)` sem shallow | `router.push(url, undefined, { shallow: true, scroll: false })` |
| Template literal com ternario pra classes | `cn('classes-default', condition && 'classes-condicionais')` |
| `className={query ? 'text-blue-300' : 'text-gray-300'}` | `cn('text-gray-300', query && 'text-blue-300')` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
