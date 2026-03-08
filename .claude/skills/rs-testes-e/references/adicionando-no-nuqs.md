---
name: rs-testes-e-adicionando-no-nuqs
description: "Applies nuqs library integration for URL search params management in React/Next.js projects. Use when user asks to 'manage search params', 'use nuqs', 'mock useQueryState', 'test URL state', or 'replace useSearchParams with nuqs'. Enforces NuqsAdapter setup, useQueryState over manual URL manipulation, and reactive mock patterns for tests. Make sure to use this skill whenever integrating nuqs or testing components that rely on URL query state in Next.js. Not for server-side routing (use rs-next-js), API route handlers, or non-React frameworks."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: testes-e-arquitetura-no-frontend
  module: busca-e-url-state
  tags: [nuqs, search-params, url-state, next-js, testing, useQueryState, react]
---

# Integracao e Testes com nuqs

> Ao usar nuqs para gerenciar search params, configure o adapter no layout, substitua manipulacao manual de URL por useQueryState, e implemente mocks customizados nos testes.

## Rules

1. **Instale e configure o NuqsAdapter no layout** — nuqs v2+ requer um context provider envolvendo a aplicacao, porque sem ele os hooks lancam erro silencioso
2. **Use useQueryState ao inves de manipulacao manual** — substitua `useSearchParams` + `router.push` por `useQueryState`, porque elimina boilerplate de criacao de URL e sincroniza estado automaticamente
3. **Mock useQueryState com useState interno** — crie um useState dentro do mock para simular reatividade, porque mocks estaticos nao refletem atualizacoes em tempo real
4. **Rode typecheck apos integrar libs novas** — `npm run typecheck` revela incompatibilidades de tipo que testes nao cobrem

## How to write

### Setup do Adapter (App Router)

```typescript
// app/layout.tsx
import { NuqsAdapter } from 'nuqs/adapters/next/app'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <NuqsAdapter>{children}</NuqsAdapter>
      </body>
    </html>
  )
}
```

### Substituindo useSearchParams por useQueryState

```typescript
// Antes: manipulacao manual
const searchParams = useSearchParams()
const router = useRouter()
function handleSearch(value: string) {
  const params = new URLSearchParams(searchParams)
  params.set('q', value)
  router.push(`?${params.toString()}`)
}

// Depois: com nuqs
import { useQueryState } from 'nuqs'
const [query, setQuery] = useQueryState('q', { defaultValue: '' })
```

### Mock do useQueryState para testes

```typescript
vi.mock('nuqs', () => {
  const { useState } = require('react')
  return {
    useQueryState: (key: string) => {
      const [value, setValue] = useState('')
      const mock = vi.fn((next: string) => setValue(next))
      return [value, mock] as const
    },
  }
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
expect(pushMock).toHaveBeenCalledWith('?q=search-term')
```

**After (teste com nuqs mockado):**
```typescript
vi.mock('nuqs', () => {
  const { useState } = require('react')
  return {
    useQueryState: () => {
      const [value, setValue] = useState('')
      return [value, vi.fn((next: string) => setValue(next))] as const
    },
  }
})
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Projeto usa App Router | Import adapter de `nuqs/adapters/next/app` |
| Projeto usa Pages Router | Import adapter de `nuqs/adapters/next/pages` |
| Teste precisa de reatividade do query state | Criar useState interno no mock |
| Multiplos search params | Usar `useQueryStates` (plural) |

## Anti-patterns

| Nunca faca | Faca ao inves |
|------------|---------------|
| `new URLSearchParams()` + `router.push()` manual | `useQueryState('key', { defaultValue: '' })` |
| Mock que retorna valor estatico | Mock com useState interno para simular updates |
| Esquecer o NuqsAdapter no layout | Sempre envolver app com `<NuqsAdapter>` |

## Troubleshooting

### useQueryState retorna undefined
**Symptom:** Hook retorna undefined mesmo com defaultValue configurado
**Cause:** NuqsAdapter nao foi adicionado ao layout raiz
**Fix:** Envolver a aplicacao com `<NuqsAdapter>` no layout.tsx

### Testes nao refletem mudancas no query state
**Symptom:** setQuery e chamado mas o valor no componente nao atualiza
**Cause:** Mock retorna valor estatico sem reatividade
**Fix:** Usar useState dentro do mock para simular ciclo de atualizacao do React

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes
