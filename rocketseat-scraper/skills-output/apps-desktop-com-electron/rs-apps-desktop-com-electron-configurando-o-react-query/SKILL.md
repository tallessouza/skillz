---
name: rs-electron-react-query-config
description: "Applies React Query configuration patterns in Electron apps using IPC as data layer. Use when user asks to 'setup React Query in Electron', 'fetch data with IPC', 'configure useQuery with Electron API', or 'add React Query to desktop app'. Covers QueryClient setup, useQuery with IPC calls, type-safe responses, and refetch behaviors. Make sure to use this skill whenever integrating React Query with Electron IPC communication. Not for HTTP-based React Query usage, server-side rendering, or React Query mutation patterns."
---

# Configurando React Query no Electron

> A API IPC do Electron funciona como promises, permitindo usar React Query da mesma forma que em chamadas HTTP tradicionais.

## Rules

1. **Crie o QueryClient em arquivo separado** — `src/lib/react-query.ts`, porque centraliza a configuracao e facilita reutilizacao
2. **Envolva as rotas com QueryClientProvider** — no componente App, porque todo useQuery precisa do context provider
3. **Use queryKey descritiva** — `['documents']` nao `['data']`, porque a key identifica unicamente cada requisicao no cache
4. **Type a resposta no preload** — defina o retorno como `Promise<Array<{...}>>`, porque o TypeScript nao infere tipos atraves do IPC bridge
5. **Retorne o response explicitamente** — nao retorne direto `window.api.method()`, porque futuramente voce vai transformar o retorno antes de devolver
6. **Entenda o Refetch on Focus** — React Query refaz queries quando o usuario volta a janela, porque mantem dados frescos sem WebSocket ou setInterval

## How to write

### QueryClient setup

```typescript
// src/lib/react-query.ts
import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient()
```

### Provider no App

```typescript
// src/renderer/src/App.tsx
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from './lib/react-query'

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      {/* rotas */}
    </QueryClientProvider>
  )
}
```

### useQuery com IPC

```typescript
const { data, isLoading, isError } = useQuery({
  queryKey: ['documents'],
  queryFn: async () => {
    const response = await window.api.fetchDocuments()
    return response
  },
})
```

### Tipagem no preload

```typescript
// src/preload/index.ts
fetchDocuments: (): Promise<Array<{ id: number; title: string }>> => {
  return ipcRenderer.invoke('fetchDocuments')
}
```

### Renderizacao com optional chaining

```typescript
{data?.map((document) => (
  <NavigationLink key={document.id}>
    {document.title}
  </NavigationLink>
))}
```

## Example

**Before (sem React Query):**
```typescript
function Sidebar() {
  const [documents, setDocuments] = useState([])

  useEffect(() => {
    window.api.fetchDocuments().then(setDocuments)
  }, [])

  return documents.map(doc => <Link>{doc.title}</Link>)
}
```

**After (com React Query):**
```typescript
function Sidebar() {
  const { data } = useQuery({
    queryKey: ['documents'],
    queryFn: async () => {
      const response = await window.api.fetchDocuments()
      return response
    },
  })

  return data?.map(doc => (
    <NavigationLink key={doc.id}>{doc.title}</NavigationLink>
  ))
}
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Chamada IPC retorna dados para exibir | Use useQuery, porque IPC funciona como promise igual HTTP |
| Dados precisam estar sempre atualizados | Aproveite refetchOnWindowFocus (ativo por padrao) |
| IPC demora para retornar | Use isLoading do useQuery para mostrar loading state |
| Precisa de polling | Configure refetchInterval no terceiro parametro |
| Internet cai e volta | refetchOnReconnect recarrega automaticamente |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `useEffect(() => api.fetch().then(set), [])` | `useQuery({ queryKey, queryFn })` |
| `setInterval(() => refetch(), 10000)` | `useQuery({ ..., refetchInterval: 10000 })` |
| `queryKey: ['data']` | `queryKey: ['documents']` (descritivo) |
| `queryFn: () => window.api.fetch()` | `queryFn: async () => { const res = await window.api.fetch(); return res }` |
| Criar QueryClient dentro do componente | Criar em `src/lib/react-query.ts` separado |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
