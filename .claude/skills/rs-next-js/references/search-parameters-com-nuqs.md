---
name: rs-next-js-search-parameters-com-nuqs
description: "Enforces URL state management with nuqs library in Next.js applications. Use when user asks to 'add search', 'filter products', 'manage URL params', 'share state via URL', 'add query string', or 'implement search with debounce'. Applies rules: use nuqs instead of useState for shareable state, configure NuqsAdapter in layout, add debounce for text inputs, type searchParams as Promise in server components. Make sure to use this skill whenever implementing filters, search, sorting, or any user selection that should persist in the URL. Not for server-side data fetching, database queries, or authentication state."
---

# URL State com nuqs no Next.js

> Todo estado que o usuario seleciona, filtra, busca ou customiza deve ser salvo na URL, nunca em useState local.

## Rules

1. **Use nuqs ao inves de useState para estado compartilhavel** — `useQueryState('q')` nao `useState('')`, porque useState nao persiste na URL e o usuario perde selecoes ao compartilhar o link
2. **Configure NuqsAdapter no layout raiz** — envolva `{children}` com `<NuqsAdapter>` importado de `nuqs/adapters/next/app`, porque todas as paginas precisam do provider
3. **Componentes com useQueryState devem ser Client Components** — adicione `'use client'` no topo, porque hooks de estado exigem hidratacao no navegador
4. **Use debounce em inputs de texto** — `limitURLUpdates` com debounce de 500ms, porque cada keystroke sem debounce causa uma atualizacao na URL e potencialmente uma requisicao
5. **Remova debounce quando o campo esvazia** — passe `undefined` no limitURLUpdates quando valor for vazio, porque limpar a busca deve ser instantaneo para feedback visual rapido
6. **Type searchParams como Promise em server components** — `searchParams: Promise<{ q?: string }>`, porque no App Router do Next.js searchParams e uma Promise que precisa de await

## How to write

### Setup do NuqsAdapter no layout

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

### useQueryState com debounce

```typescript
'use client'
import { useQueryState, parseAsString } from 'nuqs'

export function SearchInput() {
  const [search, setSearch] = useQueryState(
    'q',
    parseAsString.withDefault('')
  )

  function handleSearchUpdate(event: React.ChangeEvent<HTMLInputElement>) {
    setSearch(event.target.value, {
      limitURLUpdates: event.target.value !== ''
        ? { debounce: 500 }
        : undefined
    })
  }

  return <input value={search} onChange={handleSearchUpdate} />
}
```

### Acessar searchParams em server component

```typescript
// app/page.tsx
interface BoardProps {
  searchParams: Promise<{ q?: string }>
}

export default async function Board({ searchParams }: BoardProps) {
  const { q } = await searchParams
  // usar q para filtrar conteudo
}
```

## Example

**Before (estado perdido ao compartilhar URL):**
```typescript
'use client'
import { useState } from 'react'

export function ProductPage() {
  const [size, setSize] = useState('S')
  const [color, setColor] = useState('preto')
  const [search, setSearch] = useState('')
  // usuario seleciona G + azul, compartilha link, amigo ve S + preto
}
```

**After (estado preservado na URL):**
```typescript
'use client'
import { useQueryState, parseAsString } from 'nuqs'

export function ProductPage() {
  const [size, setSize] = useQueryState('tamanho', parseAsString.withDefault('S'))
  const [color, setColor] = useQueryState('cor', parseAsString.withDefault('preto'))
  const [search, setSearch] = useQueryState('q', parseAsString.withDefault(''))
  // URL: /product/camiseta?tamanho=G&cor=azul — compartilhavel
}
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Filtro, ordenacao, busca, selecao de variante | Salvar na URL com useQueryState |
| Estado temporario de UI (modal aberto, tooltip) | useState normal |
| Input de texto que dispara busca/filtro | Debounce 500ms no setSearch |
| Usuario apaga campo de busca completamente | Remover debounce (instantaneo) |
| Acessar query params em server component | Props searchParams com await |
| Valor pode ser numero, array ou JSON | Usar parseAsInteger, parseAsJson etc |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `useState` para filtros compartilhaveis | `useQueryState('filtro', parseAsString)` |
| `useQueryState` sem `'use client'` | Adicionar `'use client'` no topo do arquivo |
| `setSearch(value)` direto em input de texto | `setSearch(value, { limitURLUpdates: { debounce: 500 } })` |
| `searchParams.q` direto (sem await) | `const { q } = await searchParams` |
| NuqsAdapter ausente no layout | Envolver children com `<NuqsAdapter>` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/next-js/rs-next-js-search-parameters-com-nuqs/references/deep-explanation.md)
- [Code examples](../../../data/skills/next-js/rs-next-js-search-parameters-com-nuqs/references/code-examples.md)
