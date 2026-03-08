---
name: rs-testes-e-atualizar-search-input-com-a-url
description: "Enforces URL-synced search input patterns and test coverage for search components in Next.js. Use when user asks to 'sync input with URL', 'initialize search from URL', 'test search input', 'persist search in URL', or 'hydrate form from query params'. Applies defaultValue from searchParams, controlled input with URL sync, and Testing Library assertions for input values. Make sure to use this skill whenever building search inputs that persist state in the URL. Not for server-side search logic, database queries, or API route filtering."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: testes-e-arquitetura-no-frontend
  module: busca-e-url-state
  tags: [search, url-params, input, testing, next-js, react, searchParams]
---

# Atualizar Search Input com a URL

> O valor do input de busca deve ser inicializado a partir da URL e manter sincronizacao bidirecional, porque o usuario pode compartilhar ou recarregar a pagina com busca ativa.

## Rules

1. **Inicialize o input com o valor da URL** — use `searchParams.get('q')` ou `useQueryState` como defaultValue, porque recarregar a pagina deve preservar a busca
2. **Atualize a URL ao digitar** — cada keystroke ou debounce atualiza o search param, porque a URL e a fonte de verdade
3. **Teste o valor inicial do input** — verifique com `toHaveValue()` que o input renderiza com o valor do search param
4. **Teste a atualizacao apos digitacao** — use `userEvent.type` e verifique que o estado/URL atualizou

## How to write

```typescript
// Componente
function SearchInput({ defaultValue }: { defaultValue?: string }) {
  const [query, setQuery] = useQueryState('q', { defaultValue: defaultValue ?? '' })
  return <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Buscar..." />
}

// Teste
it('deve inicializar com valor da URL', () => {
  render(<SearchInput defaultValue="react" />)
  expect(screen.getByPlaceholderText('Buscar...')).toHaveValue('react')
})
```

## Example

**Before (input sem sincronizacao):**
```typescript
const [query, setQuery] = useState('')
// Recarregar a pagina perde a busca
```

**After (sincronizado com URL):**
```typescript
const [query, setQuery] = useQueryState('q', { defaultValue: '' })
// URL sempre reflete o estado da busca
```

## Troubleshooting

### Input vazio apos recarregar
**Symptom:** Busca funciona mas recarregar a pagina limpa o input
**Cause:** Input usa useState local ao inves de ler da URL
**Fix:** Usar searchParams ou useQueryState como fonte de verdade

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes
