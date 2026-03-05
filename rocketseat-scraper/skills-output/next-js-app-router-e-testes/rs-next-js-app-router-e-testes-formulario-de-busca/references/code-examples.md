# Code Examples: Formulário de Busca no Next.js App Router

## Exemplo 1: Abordagem HTML tradicional (hard navigation — evitar)

```typescript
// components/header.tsx
// Esta abordagem funciona mas causa hard navigation
export function Header() {
  return (
    <header>
      <form action="/search" method="get">
        <input name="q" required placeholder="Buscar produtos" />
      </form>
    </header>
  )
}
```

**Problema:** Ao submeter, o browser faz navegação nativa. Todo o JavaScript é recarregado do zero.

## Exemplo 2: SearchForm como Client Component (correto)

```typescript
// components/search-form.tsx
'use client'

import { Search } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'

export function SearchForm() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const query = searchParams.get('q') ?? ''

  function handleSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const data = Object.fromEntries(new FormData(event.currentTarget))
    const searchQuery = data.q as string

    if (!searchQuery) {
      return
    }

    router.push(`/search?q=${searchQuery}`)
  }

  return (
    <form onSubmit={handleSearch} className="...">
      <input
        name="q"
        defaultValue={query}
        placeholder="Buscar produtos"
        className="..."
      />
      <Search className="..." />
    </form>
  )
}
```

## Exemplo 3: Header usando o SearchForm

```typescript
// components/header.tsx (Server Component — sem 'use client')
import { SearchForm } from './search-form'

export function Header() {
  return (
    <header>
      <div>
        <span>Logo</span>
        <SearchForm />
        <div>{/* cart icon */}</div>
      </div>
    </header>
  )
}
```

## Exemplo 4: Lendo FormData sem useState

```typescript
// Forma simples — sem estado React
function handleSearch(event: React.FormEvent<HTMLFormElement>) {
  event.preventDefault()
  const data = Object.fromEntries(new FormData(event.currentTarget))
  // data.q contém o valor do input com name="q"
  console.log(data.q) // "moletom"
}

// Forma com useState — funciona mas é desnecessária para este caso
const [query, setQuery] = useState('')
// <input value={query} onChange={e => setQuery(e.target.value)} />
```

## Exemplo 5: Verificação na Network tab

Ao fazer **soft navigation** (router.push), a aba Network mostra:
```
search?q=moletom    → apenas o chunk da página search
```

Ao fazer **hard navigation** (form action), a aba Network mostra:
```
search?q=moletom
layout.js
page.js
hooks.js
elements.js
webpack.js
main-app.js
... todos os bundles recarregados
```

## Exemplo 6: defaultValue vs value

```typescript
// CORRETO: input não-controlado com valor inicial da URL
<input name="q" defaultValue={searchParams.get('q') ?? ''} />
// Usuário pode digitar livremente, valor inicial vem da URL

// ERRADO para este caso: input controlado
<input name="q" value={query} onChange={e => setQuery(e.target.value)} />
// Desnecessário — adiciona complexidade sem benefício
```