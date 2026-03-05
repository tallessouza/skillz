# Code Examples: Integração e Testes com nuqs

## 1. Instalação

```bash
pnpm add nuqs
```

## 2. Setup do Adapter no Layout (App Router)

```typescript
// app/layout.tsx
import { NuqsAdapter } from 'nuqs/adapters/next/app'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <NuqsAdapter>
          <Sidebar />
          {children}
        </NuqsAdapter>
      </body>
    </html>
  )
}
```

## 3. Componente antes (manipulação manual de search params)

```typescript
// sidebar-content.tsx (ANTES)
import { useSearchParams, useRouter } from 'next/navigation'

export function SidebarContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const query = searchParams.get('q') ?? ''

  function handleSearch(value: string) {
    const url = new URL(window.location.href)
    url.searchParams.set('q', value)
    router.push(url.toString())
  }

  return (
    <input
      value={query}
      onChange={(e) => handleSearch(e.target.value)}
    />
  )
}
```

## 4. Componente depois (com nuqs)

```typescript
// sidebar-content.tsx (DEPOIS)
import { useQueryState } from 'nuqs'

export function SidebarContent() {
  const [query, setQuery] = useQueryState('q', { defaultValue: '' })

  return (
    <input
      value={query}
      onChange={(e) => setQuery(e.target.value)}
    />
  )
}
```

**O que mudou:**
- Removido `useSearchParams` e `useRouter`
- Removida criação manual de URL
- Removido `router.push`
- `setQuery` faz tudo automaticamente (atualiza estado + URL)

## 5. Mock completo para testes com Vitest

```typescript
// sidebar-content.spec.tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi, describe, it, expect } from 'vitest'

const setQueryMock = vi.fn()

vi.mock('nuqs', () => {
  const { useState } = require('react')

  return {
    useQueryState: (key: string) => {
      const mockSearchParams = new URLSearchParams()
      const [value, setValue] = useState(mockSearchParams.get(key) ?? '')

      const setQuery = vi.fn((nextValue: string) => {
        setQueryMock(nextValue)
        setValue(nextValue)
      })

      return [value, setQuery] as const
    },
  }
})

describe('Sidebar search', () => {
  it('should update query state on search', async () => {
    const user = userEvent.setup()
    render(<SidebarContent />)

    const searchInput = screen.getByRole('textbox')
    const text = 'search term'

    await user.type(searchInput, text)

    const lastCall = setQueryMock.mock.calls.at(-1)
    expect(lastCall?.[0]).toBe(text)
  })
})
```

## 6. Configuração do Vitest para nuqs

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'jsdom',
    server: {
      deps: {
        inline: ['nuqs'],
      },
    },
  },
})
```

## 7. Testando custom hooks com nuqs (da documentação)

```typescript
import { renderHook } from '@testing-library/react'
import { withNuqsTestingAdapter } from 'nuqs/adapters/testing'

it('should work with custom hook', () => {
  const { result } = renderHook(() => useMyCustomHook(), {
    wrapper: withNuqsTestingAdapter(),
  })

  // assertions...
})
```

## 8. Verificação completa após integração

```bash
# 1. Testes unitários
pnpm test --coverage

# 2. Testes E2E
pnpm playwright test

# 3. Type check (pegou erro no projeto!)
pnpm typecheck
```

O instrutor descobriu um erro de tipo rodando typecheck que não apareceu nos testes — reforçando a importância de rodar todas as verificações.