---
name: rs-testes-arq-frontend-search-url
description: "Enforces URL-synced search input pattern with startTransition in Next.js/React apps. Use when user asks to 'sync search with URL', 'update URL on input change', 'add search params', 'filter with query string', or 'implement search input'. Applies controlled input with router.push, encodeURIComponent, and React startTransition for non-urgent state updates. Make sure to use this skill whenever implementing search/filter inputs that update URL query params. Not for server-side search logic, database queries, or API route implementation."
---

# Search Input Sincronizado com URL

> Ao implementar busca com input, atualize a URL com query params usando startTransition para marcar a navegacao como nao-urgente.

## Rules

1. **Input controlado com estado** — use `useState` para o valor do input, porque inputs controlados permitem sincronizar valor exibido com estado interno
2. **Atualize a URL com router.push** — use `router.push(url, { scroll: false })` dentro de `startTransition`, porque a atualizacao de URL nao e urgente e nao deve bloquear a digitacao do usuario
3. **Codifique a query na URL** — use `encodeURIComponent(query)` para garantir que espacos e caracteres especiais sejam tratados corretamente
4. **Limpe a URL ao apagar** — quando o input estiver vazio, faca push para `/` sem query params, porque a URL deve refletir o estado atual da busca
5. **Use startTransition para desafogar o React** — atualizacoes de URL sao transicoes nao-urgentes; sem startTransition, o React prioriza essas atualizacoes desnecessariamente, causando gargalos conforme a lista cresce
6. **Teste digitacao E limpeza** — o teste deve cobrir tanto a insercao de texto quanto a remocao, validando a URL em ambos os casos

## How to write

### Estado e handler do input

```typescript
"use client"

import { useState, startTransition } from "react"
import { useRouter } from "next/navigation"

function SearchInput() {
  const [query, setQuery] = useState("")
  const router = useRouter()

  function handleQueryChange(event: React.ChangeEvent<HTMLInputElement>) {
    const newQuery = event.target.value
    setQuery(newQuery)

    startTransition(() => {
      const url = newQuery ? `?q=${encodeURIComponent(newQuery)}` : "/"
      router.push(url, { scroll: false })
    })
  }

  return (
    <input
      placeholder="Buscar prompt"
      value={query}
      onChange={handleQueryChange}
    />
  )
}
```

### Teste com Vitest/Testing Library

```typescript
it("deveria navegar com URL codificado ao digitar e limpar", async () => {
  const { user } = setup()

  const searchInput = screen.getByPlaceholderText("Buscar prompt")
  await user.type(searchInput, "a b")

  const lastCall = pushMock.mock.calls.at(-1)
  expect(lastCall?.[0]).toBe("?q=a%20b")

  await user.clear(searchInput)

  const lastClearCall = pushMock.mock.calls.at(-1)
  expect(lastClearCall?.[0]).toBe("/")
})
```

## Example

**Before (sem startTransition, URL nao sincronizada):**
```typescript
function handleChange(e) {
  const value = e.target.value
  router.push(`?q=${value}`) // bloqueia renderizacao, sem encoding
}
```

**After (com startTransition e encoding):**
```typescript
function handleQueryChange(event: React.ChangeEvent<HTMLInputElement>) {
  const newQuery = event.target.value
  setQuery(newQuery)

  startTransition(() => {
    const url = newQuery ? `?q=${encodeURIComponent(newQuery)}` : "/"
    router.push(url, { scroll: false })
  })
}
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Input de busca que filtra lista | Sempre usar startTransition para o router.push |
| URL precisa ser compartilhavel | Usar query params com encodeURIComponent |
| Usuario apaga todo o texto | Push para rota limpa sem query params |
| Lista grande sendo filtrada | startTransition evita gargalo de re-render |
| Teste de busca | Validar tanto digitacao quanto limpeza do input |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `router.push("?q=" + query)` | `router.push("?q=" + encodeURIComponent(query))` |
| `router.push(url)` sem scroll false | `router.push(url, { scroll: false })` |
| router.push direto no onChange | router.push dentro de startTransition |
| Testar so digitacao sem testar clear | Testar digitacao E limpeza do input |
| `if (query) push("?q=") else push("")` | `push(query ? "?q=..." : "/")` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
