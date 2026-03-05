# Code Examples: Search Component com Next.js Pages Router

## Exemplo completo — Abordagem com useState (inferior)

```typescript
import { useRouter } from 'next/router'
import { useState, useEffect, useCallback } from 'react'
import { SearchIcon } from 'lucide-react'

export function Search() {
  const router = useRouter()
  const routerQuery = router.query.q as string

  const [query, setQuery] = useState('')

  // Sincroniza estado local com URL
  useEffect(() => {
    if (routerQuery) {
      setQuery(routerQuery)
    }
  }, [routerQuery])

  const handleSearch = useCallback((event: React.FormEvent) => {
    event.preventDefault()
    if (!query.trim()) return
    router.push(`/blog?q=${encodeURIComponent(query)}`)
  }, [query, router])

  return (
    <form onSubmit={handleSearch}>
      <div className="relative">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300" />
        <input
          type="text"
          placeholder="Buscar"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="h-10 w-full max-w-[288px] bg-transparent border border-gray-400 pl-9 text-gray-100 rounded-md text-body-sm outline-none"
        />
      </div>
    </form>
  )
}
```

**Problemas desta abordagem:**
- Estado duplicado (URL + useState)
- useEffect para sincronizar
- Mais codigo, mais pontos de falha

---

## Exemplo completo — Abordagem sem estado (superior)

```typescript
import { useRouter } from 'next/router'
import { useCallback } from 'react'
import { SearchIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

export function Search() {
  const router = useRouter()
  const query = (router.query.q as string) || ''

  function handleQueryChange(event: React.ChangeEvent<HTMLInputElement>) {
    const newQuery = event.target.value
    router.push(
      `/blog?q=${encodeURIComponent(newQuery)}`,
      undefined,
      { shallow: true, scroll: false }
    )
  }

  const handleSearch = useCallback((event: React.FormEvent) => {
    event.preventDefault()
    if (!query.trim()) return
    router.push(`/blog?q=${encodeURIComponent(query)}`)
  }, [query, router])

  return (
    <form onSubmit={handleSearch} className="group relative">
      <SearchIcon
        className={cn(
          'absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300 transition-colors duration-200 group-focus-within:text-blue-300',
          query && 'text-blue-300'
        )}
      />
      <input
        type="text"
        placeholder="Buscar"
        value={query}
        onChange={handleQueryChange}
        className="h-10 w-full max-w-[288px] bg-transparent border border-gray-400 pl-9 text-gray-100 rounded-md text-body-sm outline-none transition-all duration-200 hover:border-blue-300 focus:border-blue-300 focus:ring-1 focus:ring-blue-300 placeholder:text-gray-300"
      />
    </form>
  )
}
```

---

## Estilizacao do input — Breakdown

```typescript
// Classes do input, separadas por responsabilidade:

// Dimensoes
"h-10 w-full max-w-[288px]"

// Background e borda
"bg-transparent border border-gray-400"

// Texto e padding
"pl-9 text-gray-100 text-body-sm"

// Forma e outline
"rounded-md outline-none"

// Transicoes
"transition-all duration-200"

// Estados interativos
"hover:border-blue-300 focus:border-blue-300 focus:ring-1 focus:ring-blue-300"

// Placeholder
"placeholder:text-gray-300"
```

---

## Estilizacao do icone com cn()

```typescript
// Sem cn() — sujeito a conflitos
<SearchIcon
  className={`absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300 transition-colors duration-200 group-focus-within:text-blue-300 ${
    query ? 'text-blue-300' : ''
  }`}
/>

// Com cn() — merge inteligente, sem conflitos
<SearchIcon
  className={cn(
    'absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300 transition-colors duration-200 group-focus-within:text-blue-300',
    query && 'text-blue-300'
  )}
/>
```

---

## Layout responsivo na pagina

```tsx
// Na home do blog
<div className="flex flex-col sm:flex-row sm:items-end sm:justify-between">
  <h1>Posts</h1>
  <Search />
</div>
```

- Mobile: empilhado verticalmente
- Desktop: lado a lado com `flex-row` e `justify-between`
- Alinhamento inferior com `items-end`

---

## Funcao cn() — Referencia

```typescript
// lib/utils.ts (vem configurado com shadcn/ui)
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

`clsx` concatena classes condicionalmente. `twMerge` resolve conflitos do Tailwind (ultima classe vence).