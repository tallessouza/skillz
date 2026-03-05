---
name: rs-next-js-setup-do-react-query
description: "Applies React Query setup pattern in Next.js App Router projects mixing Server and Client Components. Use when user asks to 'setup react query', 'configure tanstack query', 'mix server and client components', 'cache client requests in next', or 'fetch user-specific data in nextjs'. Ensures correct provider pattern with useState, use client boundary, and children composition. Make sure to use this skill whenever setting up React Query in a Next.js App Router project. Not for server-side data fetching, SWR setup, or React Query usage/queries themselves."
---

# Setup do React Query no Next.js App Router

> Separar dados cacheáveis (iguais para todos) em Server Components e dados específicos do usuário em Client Components com React Query.

## Rules

1. **Instancie QueryClient dentro de useState** — `useState(() => new QueryClient())`, porque useState preserva a instância entre re-renders sem recriar o client
2. **Crie um componente Provider separado com "use client"** — nunca adicione "use client" no layout raiz, porque o layout deve permanecer Server Component
3. **Passe Server Components como children** — Server Components dentro de Client Components só funcionam via children prop, nunca como JSX direto dentro do Client Component
4. **Separe requisições por natureza de cache** — dados iguais para todos os usuários vão em Server Component (cacheável), dados que dependem do usuário logado vão em Client Component com React Query, porque requisições que usam cookies/headers do usuário não podem ser cacheadas no Next.js
5. **Envolva o provider por volta do conteúdo no layout** — o QueryClientProvider deve ficar no layout global para estar disponível em toda a aplicação

## How to write

### Provider isolado (lib/react-query.tsx)

```tsx
"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactNode, useState } from "react"

export function ReactQueryProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient())

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}
```

### Layout global (app/layout.tsx)

```tsx
// Este arquivo permanece Server Component — sem "use client"
import { ReactQueryProvider } from "@/lib/react-query"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <ReactQueryProvider>
          {children}
        </ReactQueryProvider>
      </body>
    </html>
  )
}
```

## Example

**Before (errado — "use client" no layout):**

```tsx
"use client" // ERRADO: layout virou Client Component inteiro

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

const queryClient = new QueryClient() // ERRADO: recriado a cada render

export default function RootLayout({ children }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}
```

**After (com esta skill aplicada):**

```tsx
// app/layout.tsx — Server Component mantido
import { ReactQueryProvider } from "@/lib/react-query"

export default function RootLayout({ children }) {
  return (
    <ReactQueryProvider>
      {children}
    </ReactQueryProvider>
  )
}
```

## Heuristics

| Situação | Faça |
|----------|------|
| Dados iguais para todos os usuários (listagem, catálogo) | Server Component com fetch + cache |
| Dados que dependem do usuário logado (likes, comentários) | Client Component com React Query |
| Precisa mostrar ambos na mesma UI | Duas requisições separadas — uma server, uma client |
| Client Component precisa renderizar Server Component | Passe como children, nunca como JSX direto |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `const queryClient = new QueryClient()` (fora de useState) | `const [queryClient] = useState(() => new QueryClient())` |
| `"use client"` no layout raiz | Componente Provider separado com `"use client"` |
| `<ServerComponent />` dentro de arquivo `"use client"` | `{children}` recebendo Server Component via prop |
| Uma única requisição misturando dados públicos + privados | Duas requisições: uma cacheável (server), uma por usuário (client) |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
