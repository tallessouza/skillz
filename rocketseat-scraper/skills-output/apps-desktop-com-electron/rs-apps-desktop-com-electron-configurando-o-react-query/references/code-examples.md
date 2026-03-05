# Code Examples: Configurando React Query no Electron

## 1. Dados simulados no main process (IPC handler)

O instrutor substituiu o handler que retornava "hello world" por dados simulados:

```typescript
// src/main/ipc.ts
// Simulando documentos como se viessem de um banco de dados
ipcMain.handle('fetchDocuments', () => {
  return [
    { id: 1, title: 'Ignite' },
    { id: 2, title: 'Discover' },
    { id: 3, title: 'Rocketseat' },
    { id: 4, title: 'Docs' },
  ]
})
```

Nota: o handler nao recebe parametros neste caso — o instrutor removeu o parametro que existia anteriormente pois era apenas para exemplificar.

## 2. Instalacao do React Query

```bash
npm install @tanstack/react-query
```

## 3. Criacao do QueryClient

```typescript
// src/lib/react-query.ts
import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient()
```

## 4. QueryClientProvider envolvendo as rotas

```typescript
// src/renderer/src/App.tsx
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from './lib/react-query'

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      {/* rotas da aplicacao */}
    </QueryClientProvider>
  )
}
```

## 5. Tipagem do fetchDocuments no preload

```typescript
// src/preload/index.ts
const api = {
  fetchDocuments: (): Promise<Array<{ id: number; title: string }>> => {
    return ipcRenderer.invoke('fetchDocuments')
  },
}
```

Sem essa tipagem, o `response` dentro do useQuery seria `any`.

## 6. useQuery na Sidebar (versao completa)

```typescript
// src/renderer/src/components/Sidebar.tsx
import { useQuery } from '@tanstack/react-query'

function Sidebar() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['documents'],
    queryFn: async () => {
      const response = await window.api.fetchDocuments()
      return response
    },
  })

  return (
    <nav>
      {data?.map((document) => (
        <NavigationLink key={document.id}>
          {document.title}
        </NavigationLink>
      ))}
    </nav>
  )
}
```

Pontos importantes:
- `data?.map()` com optional chaining porque data pode ser undefined ate a query resolver
- `key={document.id}` obrigatorio no React para listas
- `isLoading` e `isError` disponiveis mas nao usados neste momento

## 7. Demonstracao do Refetch on Focus

O instrutor adicionou um console.log para demonstrar:

```typescript
const { data } = useQuery({
  queryKey: ['documents'],
  queryFn: async () => {
    const response = await window.api.fetchDocuments()
    console.log(response) // aparece toda vez que a janela ganha foco
    return response
  },
})
```

Comportamento observado no DevTools:
- F5 → log aparece
- Clicar fora da janela e voltar → log aparece novamente
- Cada vez que a janela ganha foco → query e refeita

## 8. Opcoes de configuracao do useQuery (mencionadas)

```typescript
const { data } = useQuery({
  queryKey: ['documents'],
  queryFn: async () => {
    const response = await window.api.fetchDocuments()
    return response
  },
  // Opcoes mencionadas pelo instrutor:
  refetchOnWindowFocus: true,       // padrao: true
  refetchOnReconnect: true,         // refetch quando internet volta
  refetchInterval: 10000,           // polling a cada 10s
  // staleTime: ...                 // controle de dados obsoletos (avancado)
})
```

## 9. Versao simplificada (mencionada mas nao recomendada)

```typescript
// Funciona, mas o instrutor preferiu a versao explicita
const { data } = useQuery({
  queryKey: ['documents'],
  queryFn: () => window.api.fetchDocuments(),
})
```

O instrutor explicou que preferiu nao simplificar porque futuramente o retorno seria transformado (ex: extrair `response.data` de um objeto).