---
name: rs-testes-arq-frontend-busca-url
description: "Enforces URL-driven search state pattern when building search fields in Next.js applications. Use when user asks to 'add search', 'filter by URL', 'share filtered URL', 'sync input with query params', or 'persist search in URL'. Applies useSearchParams hook to hydrate controlled inputs from URL on page load, enabling shareable filtered links. Make sure to use this skill whenever implementing search or filter fields that should survive page refresh or URL sharing. Not for server-side filtering, pagination, or route-based navigation."
---

# Salvando a Busca na URL

> Campos de busca controlados devem hidratar seu estado inicial a partir dos search params da URL, permitindo compartilhamento de links filtrados.

## Rules

1. **Hidrate o estado inicial do input a partir da URL** — `useState(searchParams.get('q') ?? '')`, porque sem isso o campo limpa ao atualizar a pagina mesmo com o filtro na URL
2. **Use `useSearchParams` do Next.js** — nao parse manual de `window.location`, porque o hook integra com o router e funciona em SSR
3. **Fallback para string vazia** — `searchParams.get('q') ?? ''`, porque `.get()` retorna `null` quando ausente e inputs controlados nao aceitam `null`
4. **Mock `useSearchParams` nos testes** — adicione ao mock de `next/navigation` junto com `useRouter`, porque o mock sobrescreve toda a importacao
5. **Use `it.todo()` para mapear testes futuros** — registre o caso de teste antes de implementar, porque da visibilidade do progresso e documenta comportamentos esperados

## How to write

### Hidratacao do estado a partir da URL

```typescript
import { useSearchParams } from 'next/navigation'

export function SearchComponent() {
  const searchParams = useSearchParams()
  const [query, setQuery] = useState(searchParams.get('q') ?? '')

  // Value controlado ja inicia com o valor da URL
  return <Input value={query} onChange={handleQueryChange} placeholder="Buscar" />
}
```

### Mock de useSearchParams no teste

```typescript
let mockSearchParams = new URLSearchParams()

jest.mock('next/navigation', () => ({
  useRouter: () => mockRouter,
  useSearchParams: () => mockSearchParams,
}))
```

### Teste: campo inicia com search param

```typescript
it('should initialize search field with search param value', () => {
  const text = 'initial'
  mockSearchParams = new URLSearchParams({ q: text })

  render(<SidebarContent />)

  const searchInput = screen.getByPlaceholderText('Buscar')
  expect(searchInput).toHaveValue(text)
})
```

## Example

**Before (campo limpa ao recarregar):**
```typescript
const [query, setQuery] = useState('')
```

**After (campo preserva o filtro da URL):**
```typescript
const searchParams = useSearchParams()
const [query, setQuery] = useState(searchParams.get('q') ?? '')
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Input de busca que atualiza URL | Hidratar estado inicial com `useSearchParams` |
| Mock de next/navigation ja existe | Adicionar `useSearchParams` ao mesmo mock |
| Caso de teste identificado mas nao implementado | Usar `it.todo('descricao')` para mapear |
| searchParams.get retorna null | Fallback com `?? ''` para inputs controlados |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `useState('')` ignorando URL | `useState(searchParams.get('q') ?? '')` |
| `window.location.search` manual | `useSearchParams()` do Next.js |
| `searchParams.get('q') \|\| ''` | `searchParams.get('q') ?? ''` (null-safe) |
| Mock apenas de useRouter | Mock de useRouter + useSearchParams juntos |
| Testar sem simular search params | Criar `new URLSearchParams({ q: text })` no mock |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/testes-e/rs-testes-e-arquitetura-no-frontend-salvando-a-busca-na-url/references/deep-explanation.md)
- [Code examples](../../../data/skills/testes-e/rs-testes-e-arquitetura-no-frontend-salvando-a-busca-na-url/references/code-examples.md)
