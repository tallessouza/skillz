# Code Examples: Setup do React Query no Next.js App Router

## Instalação

```bash
npm install @tanstack/react-query
```

## Arquivo do Provider (lib/react-query.tsx)

```tsx
"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactNode, useState } from "react"

export function ReactQueryProvider({ children }: { children: ReactNode }) {
  // useState garante que o QueryClient é instanciado uma única vez
  // e não é recriado entre re-renders
  const [queryClient] = useState(() => new QueryClient())

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}
```

## Layout global (app/layout.tsx)

```tsx
// Permanece Server Component — sem "use client"
import { ReactQueryProvider } from "@/lib/react-query"
// Outros providers podem ser aninhados normalmente
import { NextAdapter } from "@/lib/next-adapter" // exemplo

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <ReactQueryProvider>
          {/* children aqui são Server Components (as páginas) */}
          {/* funciona porque são passados como children, não como JSX direto */}
          {children}
        </ReactQueryProvider>
      </body>
    </html>
  )
}
```

## O que NÃO fazer — Server Component dentro de Client Component

```tsx
"use client"

// ERRADO: Chamar Server Component diretamente dentro de "use client"
import { ServerComponent } from "./server-component"

export function ClientWrapper() {
  return (
    <div>
      {/* Isso NÃO funciona — ServerComponent é async, não pode ser chamado aqui */}
      <ServerComponent />
    </div>
  )
}
```

## O que FAZER — Composição via children

```tsx
// layout.tsx (Server Component)
import { ClientWrapper } from "./client-wrapper"
import { ServerComponent } from "./server-component"

export default function Layout() {
  return (
    <ClientWrapper>
      {/* ServerComponent passado como children — funciona */}
      <ServerComponent />
    </ClientWrapper>
  )
}
```

```tsx
// client-wrapper.tsx
"use client"

import { ReactNode } from "react"

export function ClientWrapper({ children }: { children: ReactNode }) {
  // Pode usar hooks aqui
  return <div>{children}</div>
}
```

## Padrão de separação de requisições (arquitetura do board)

### Requisição 1: Dados públicos (Server Component)

```tsx
// app/board/page.tsx — Server Component
async function getIssues() {
  // Esta requisição é cacheável — dados iguais para todos
  const response = await fetch("https://api.example.com/issues")
  return response.json()
}

export default async function BoardPage() {
  const issues = await getIssues()

  return (
    <Board issues={issues}>
      {/* Interações carregadas no client */}
      <IssueInteractions />
    </Board>
  )
}
```

### Requisição 2: Dados do usuário (Client Component com React Query)

```tsx
"use client"

import { useQuery } from "@tanstack/react-query"

export function IssueInteractions() {
  // Esta requisição depende do usuário logado (cookies enviados automaticamente)
  // Não é cacheável no nível do Next.js
  const { data: interactions } = useQuery({
    queryKey: ["issue-interactions"],
    queryFn: async () => {
      const response = await fetch("/api/interactions")
      return response.json()
    },
  })

  return (
    // Renderizar likes, comentários, etc.
  )
}
```

## Variação: QueryClient com opções default

```tsx
"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactNode, useState } from "react"

export function ReactQueryProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minuto
            refetchOnWindowFocus: false,
          },
        },
      })
  )

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}
```