# Code Examples: Salvando a Busca na URL

## Exemplo completo: SidebarContent com useSearchParams

### Antes (sem hidratacao da URL)

```typescript
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export function SidebarContent() {
  const router = useRouter()
  const [query, setQuery] = useState('')

  function handleQueryChange(event: React.ChangeEvent<HTMLInputElement>) {
    const value = event.target.value
    setQuery(value)

    const params = new URLSearchParams()
    if (value) params.set('q', value)
    router.push(`/?${params.toString()}`)
  }

  return (
    <input
      value={query}
      onChange={handleQueryChange}
      placeholder="Buscar"
    />
  )
}
```

### Depois (com hidratacao da URL)

```typescript
'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export function SidebarContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [query, setQuery] = useState(searchParams.get('q') ?? '')

  function handleQueryChange(event: React.ChangeEvent<HTMLInputElement>) {
    const value = event.target.value
    setQuery(value)

    const params = new URLSearchParams()
    if (value) params.set('q', value)
    router.push(`/?${params.toString()}`)
  }

  return (
    <input
      value={query}
      onChange={handleQueryChange}
      placeholder="Buscar"
    />
  )
}
```

## Exemplo completo: arquivo de teste

```typescript
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SidebarContent } from './SidebarContent'

const mockRouter = {
  push: jest.fn(),
  replace: jest.fn(),
  prefetch: jest.fn(),
}

let mockSearchParams = new URLSearchParams()

jest.mock('next/navigation', () => ({
  useRouter: () => mockRouter,
  useSearchParams: () => mockSearchParams,
}))

describe('SidebarContent', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockSearchParams = new URLSearchParams()
  })

  it('should initialize search field with search param value', () => {
    const text = 'initial'
    mockSearchParams = new URLSearchParams({ q: text })

    render(<SidebarContent />)

    const searchInput = screen.getByPlaceholderText('Buscar')
    expect(searchInput).toHaveValue(text)
  })

  it('should start with empty search when no params', () => {
    render(<SidebarContent />)

    const searchInput = screen.getByPlaceholderText('Buscar')
    expect(searchInput).toHaveValue('')
  })

  it('should update URL when user types', async () => {
    render(<SidebarContent />)

    const searchInput = screen.getByPlaceholderText('Buscar')
    await userEvent.type(searchInput, 'prompt')

    expect(mockRouter.push).toHaveBeenCalled()
  })
})
```

## Usando it.todo() para mapear testes futuros

```typescript
describe('SidebarContent', () => {
  // Testes ja implementados
  it('should render search input', () => { /* ... */ })
  it('should update query on type', () => { /* ... */ })

  // Testes mapeados para implementar depois
  it.todo('should initialize search field with search param value')
  it.todo('should clear search when X button is clicked')
  it.todo('should debounce URL updates')
})
```

Output do test runner com todos:
```
 ✓ should render search input
 ✓ should update query on type
 ✎ todo should initialize search field with search param value
 ✎ todo should clear search when X button is clicked
 ✎ todo should debounce URL updates
```

## Variacoes: diferentes parametros de busca

```typescript
// Busca simples por texto
const [query, setQuery] = useState(searchParams.get('q') ?? '')

// Filtro por categoria
const [category, setCategory] = useState(searchParams.get('category') ?? 'all')

// Multiplos filtros
const [filters, setFilters] = useState({
  q: searchParams.get('q') ?? '',
  category: searchParams.get('category') ?? 'all',
  sort: searchParams.get('sort') ?? 'newest',
})
```