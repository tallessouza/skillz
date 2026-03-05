---
name: rs-testes-arquitetura-fe-nuqs
description: "Applies nuqs library integration and mock patterns when writing React/Next.js code with URL search params. Use when user asks to 'manage search params', 'use nuqs', 'mock useQueryState', 'test URL state', or 'replace useSearchParams with nuqs'. Covers installation, adapter setup, useQueryState usage, and vitest mock implementation. Make sure to use this skill whenever integrating nuqs or testing components that use URL query state. Not for server-side routing, API route handlers, or non-React frameworks."
---

# Integração e Testes com nuqs

> Ao usar nuqs para gerenciar search params, configure o adapter no layout, substitua manipulação manual de URL por useQueryState, e implemente mocks customizados nos testes.

## Rules

1. **Instale e configure o adapter no layout** — nuqs v2+ requer um context provider (NuqsAdapter) envolvendo a aplicação, porque sem ele os hooks não funcionam
2. **Use useQueryState ao invés de manipulação manual de URL** — substitua `useSearchParams` + `router.push` por `useQueryState`, porque elimina código boilerplate de criação de URL
3. **Mock useQueryState com estado interno no teste** — crie um useState dentro do mock para simular reatividade, porque os exemplos da documentação não cobrem cenários de atualização em tempo real
4. **Adicione as configurações de teste no vitest.config** — nuqs exige `serverComponentsExternalPackages` e configurações específicas no config de teste
5. **Sempre rode typecheck após integrar libs novas** — `npm run typecheck` pode revelar erros de tipo que passam despercebidos, porque o compilador pega incompatibilidades que os testes não cobrem

## How to write

### Setup do Adapter (App Router)

```typescript
// app/layout.tsx
import { NuqsAdapter } from 'nuqs/adapters/next/app'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <NuqsAdapter>
          {children}
        </NuqsAdapter>
      </body>
    </html>
  )
}
```

### Substituindo useSearchParams por useQueryState

```typescript
// Antes: manipulação manual
const searchParams = useSearchParams()
const router = useRouter()
const query = searchParams.get('q') ?? ''

function handleSearch(value: string) {
  const params = new URLSearchParams(searchParams)
  params.set('q', value)
  router.push(`?${params.toString()}`)
}

// Depois: com nuqs
import { useQueryState } from 'nuqs'

const [query, setQuery] = useQueryState('q', { defaultValue: '' })
// setQuery já atualiza a URL automaticamente
```

### Mock do useQueryState para Vitest

```typescript
vi.mock('nuqs', () => {
  const { useState } = require('react')

  return {
    useQueryState: (key: string) => {
      const mockSearchParams = new URLSearchParams()
      const [value, setValue] = useState(mockSearchParams.get(key) ?? '')

      const setQueryMock = vi.fn((nextValue: string) => {
        setValue(nextValue)
      })

      return [value, setQueryMock] as const
    },
  }
})
```

### Configuração do Vitest para nuqs

```typescript
// vitest.config.ts
export default defineConfig({
  test: {
    // Adicionar conforme documentação do nuqs
    server: {
      deps: {
        inline: ['nuqs'],
      },
    },
  },
})
```

## Example

**Before (teste com useSearchParams manual):**
```typescript
const pushMock = vi.fn()
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: pushMock }),
  useSearchParams: () => new URLSearchParams(),
}))

// No assertion:
expect(pushMock).toHaveBeenCalledWith('?q=search-term')
```

**After (teste com nuqs mockado):**
```typescript
const setQueryMock = vi.fn()

vi.mock('nuqs', () => {
  const { useState } = require('react')
  return {
    useQueryState: (key: string) => {
      const [value, setValue] = useState('')
      const mock = vi.fn((next: string) => setValue(next))
      setQueryMock.mockImplementation(mock)
      return [value, mock] as const
    },
  }
})

// No assertion:
const lastCall = setQueryMock.mock.calls.at(-1)
expect(lastCall?.[0]).toBe('search-term')
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Projeto usa App Router (Next.js) | Import adapter de `nuqs/adapters/next/app` |
| Projeto usa Pages Router | Import adapter de `nuqs/adapters/next/pages` |
| Projeto usa React Router / Remix | Import adapter correspondente |
| Teste precisa de reatividade do query state | Criar useState interno no mock |
| Múltiplos search params | Usar `useQueryStates` (plural) ao invés de múltiplos `useQueryState` |
| Valor é array | Consultar documentação de parsers do nuqs |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `new URLSearchParams()` + `router.push()` manual | `useQueryState('key', { defaultValue: '' })` |
| Mock que retorna valor estático sem reatividade | Mock com useState interno para simular updates |
| Esquecer o NuqsAdapter no layout | Sempre envolver app com `<NuqsAdapter>` |
| Testar sem rodar typecheck depois | Sempre `npm run typecheck` após integrar lib nova |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/testes-e/rs-testes-e-arquitetura-no-frontend-adicionando-no-nuqs/references/deep-explanation.md)
- [Code examples](../../../data/skills/testes-e/rs-testes-e-arquitetura-no-frontend-adicionando-no-nuqs/references/code-examples.md)
