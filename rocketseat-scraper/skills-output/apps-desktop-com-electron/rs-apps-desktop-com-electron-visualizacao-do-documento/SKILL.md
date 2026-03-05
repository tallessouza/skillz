---
name: rs-electron-visualizacao-documento
description: "Applies dynamic document viewing patterns in React+Electron apps using React Router and TanStack Query. Use when user asks to 'show document details', 'load item by id', 'create dynamic route', 'fetch single resource', or 'display content from route params'. Covers useParams, NavLink active styling, useQuery with dynamic keys, isFetching vs isLoading, and useMemo for content preparation. Make sure to use this skill whenever implementing detail views with dynamic routing in React. Not for list views, CRUD mutations, or server-side routing."
---

# Visualizacao Dinamica de Documentos

> Ao implementar visualizacao de um recurso individual, combine rota dinamica + query parametrizada + preparacao de conteudo antes de renderizar.

## Rules

1. **Rotas de detalhe recebem ID como parametro** — use `:id` na rota (`/documents/:id`), porque cada recurso precisa de URL unica para navegacao e deep linking
2. **Use NavLink ao inves de Link para menus** — NavLink fornece `isActive` para estilizar o item ativo, porque o usuario precisa saber onde esta
3. **Inclua parametros dinamicos na query key** — `['document', id]` e nao `['document']`, porque o React Query precisa re-executar quando o ID muda
4. **Use isFetching ao inves de isLoading para queries re-executaveis** — `isLoading` so e true no primeiro carregamento; `isFetching` e true em toda execucao, porque troca de ID dispara nova busca
5. **Habilite a query condicionalmente com `enabled`** — `enabled: !!id` evita execucao com parametro undefined, porque a tela pode montar antes do parametro estar disponivel
6. **Prepare conteudo com useMemo antes de passar ao editor** — transformacoes como envolver titulo em `<h1>` devem ser memoizadas com dependencia em `data`, porque evita recalculos desnecessarios

## How to write

### Rota dinamica

```tsx
// routes.tsx
{ path: '/documents/:id', element: <Document /> }
```

### NavLink com estilo ativo (Tailwind + clsx)

```tsx
import { NavLink } from 'react-router-dom'
import clsx from 'clsx'

<NavLink
  to={`/documents/${document.id}`}
  className={({ isActive }) =>
    clsx(
      'flex items-center gap-2 px-3 py-1 rounded',
      { 'bg-rotion-700': isActive }
    )
  }
>
  {document.title}
</NavLink>
```

### Query parametrizada com useParams

```tsx
import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'

const { id } = useParams<{ id: string }>()

const { data, isFetching } = useQuery({
  queryKey: ['document', id],
  queryFn: async () => {
    const response = await window.api.fetchDocument(id!)
    return response.data
  },
  enabled: !!id,
})
```

### Preparacao de conteudo com useMemo

```tsx
const initialContent = useMemo(() => {
  if (data) {
    return `<h1>${data.title}</h1>${data.content ?? '<p></p>'}`
  }
  return ''
}, [data])
```

### Renderizacao condicional

```tsx
{!isFetching && data && (
  <Editor content={initialContent} />
)}
```

## Example

**Before (dados estaticos, sem rota dinamica):**
```tsx
// Rota sem ID
{ path: '/document', element: <Document /> }

// Link simples sem indicacao de ativo
<a href="/document">Acessar documento</a>

// Dados fixos no editor
<Editor content="<h1>Titulo fixo</h1><p>Conteudo fixo</p>" />
```

**After (com esta skill aplicada):**
```tsx
// Rota com parametro
{ path: '/documents/:id', element: <Document /> }

// NavLink com estilo ativo
<NavLink
  to={`/documents/${doc.id}`}
  className={({ isActive }) => clsx(baseClasses, { 'bg-rotion-700': isActive })}
>
  {doc.title}
</NavLink>

// Query dinamica + conteudo preparado
const { id } = useParams<{ id: string }>()
const { data, isFetching } = useQuery({
  queryKey: ['document', id],
  queryFn: async () => (await window.api.fetchDocument(id!)).data,
  enabled: !!id,
})
const initialContent = useMemo(() => {
  if (data) return `<h1>${data.title}</h1>${data.content ?? '<p></p>'}`
  return ''
}, [data])

{!isFetching && data && <Editor content={initialContent} />}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Menu lateral com lista de itens | Use NavLink com callback de className |
| Query depende de parametro de URL | Inclua o parametro na queryKey E use `enabled` |
| Conteudo precisa de transformacao antes de exibir | useMemo com dependencia nos dados |
| Troca frequente entre itens da lista | Use `isFetching` (nao `isLoading`) |
| Parametro pode ser undefined | Use non-null assertion (`id!`) dentro da queryFn + `enabled: !!id` |
| Editor precisa de paragrafo inicial vazio | Fallback `data.content ?? '<p></p>'` |

## Anti-patterns

| Nunca escreva | Escreva ao inves |
|---------------|------------------|
| `queryKey: ['document']` (sem ID) | `queryKey: ['document', id]` |
| `isLoading` para queries re-executaveis | `isFetching` |
| `<Link>` em menus que precisam de estado ativo | `<NavLink>` com `isActive` |
| `className="active"` com Tailwind | `className={({ isActive }) => clsx(...)}` |
| Renderizar editor sem checar carregamento | `{!isFetching && data && <Editor />}` |
| Titulo cru sem tag HTML para o editor | `<h1>${data.title}</h1>` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
