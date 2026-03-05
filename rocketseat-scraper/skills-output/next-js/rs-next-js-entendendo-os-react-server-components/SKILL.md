---
name: rs-next-js-react-server-components
description: "Enforces React Server Components patterns when building Next.js App Router applications. Use when user asks to 'create a component', 'build a page', 'fetch data in Next.js', 'add server component', or works with App Router. Applies rules: default to server components, fetch data on server, use composition pattern for mixing server/client, never use hooks in server components. Make sure to use this skill whenever generating Next.js App Router code. Not for Pages Router, pure client-side React, or API routes."
---

# React Server Components no Next.js App Router

> Todo componente dentro da pasta `app/` e server component por default — so marque como client component quando precisar de interatividade.

## Rules

1. **Server component por default** — todo componente em `app/` ja e server component, porque o Next.js App Router assume esse default e isso reduz JavaScript enviado ao client
2. **Fetch de dados no servidor** — faca fetch diretamente no server component com async/await, porque elimina useEffect, estados de loading e expoe menos logica ao client
3. **Use `"use client"` apenas quando necessario** — so adicione a diretiva quando precisar de hooks, APIs do browser ou interatividade, porque client components adicionam JavaScript ao bundle
4. **Composition pattern obrigatorio** — ao misturar server e client components, passe server components como `children` ou props para client components, porque importar server component dentro de client component o transforma em client
5. **Nunca use hooks em server components** — useState, useEffect, useReducer e todos os hooks do React sao client-side only, porque server components nao passam por hydration
6. **Informacoes sensiveis no servidor** — tokens, API keys e secrets devem ficar em server components, porque nada do server component e enviado ao client
7. **Grandes dependencias no servidor** — libs pesadas de parsing, formatacao ou calculo devem rodar em server components, porque o bundle dessas libs nao sera enviado ao browser

## How to write

### Server Component (default, sem diretiva)

```typescript
// app/products/page.tsx
// SEM "use client" = server component por default
async function ProductsPage() {
  const products = await fetch('https://api.example.com/products').then(r => r.json())

  return (
    <main>
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </main>
  )
}
```

### Client Component (apenas quando precisa interatividade)

```typescript
// components/add-to-cart-button.tsx
"use client"

import { useState } from 'react'

export function AddToCartButton({ productId }: { productId: string }) {
  const [added, setAdded] = useState(false)

  return (
    <button onClick={() => setAdded(true)}>
      {added ? 'Adicionado' : 'Adicionar ao carrinho'}
    </button>
  )
}
```

### Composition Pattern (misturando server e client)

```typescript
// app/layout.tsx (server component)
import { Sidebar } from './sidebar' // client component com interatividade
import { UserProfile } from './user-profile' // server component

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Sidebar>
        {/* Server component passado como children para client component */}
        <UserProfile />
      </Sidebar>
      {children}
    </div>
  )
}
```

## Example

**Before (padrao antigo com client-side fetch):**
```typescript
"use client"
import { useState, useEffect } from 'react'

export default function UsersPage() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/users')
      .then(r => r.json())
      .then(data => { setUsers(data); setLoading(false) })
  }, [])

  if (loading) return <p>Carregando...</p>
  return <ul>{users.map(u => <li key={u.id}>{u.name}</li>)}</ul>
}
```

**After (server component no App Router):**
```typescript
// app/users/page.tsx — server component, zero JavaScript enviado
export default async function UsersPage() {
  const users = await fetch('https://api.example.com/users').then(r => r.json())

  return <ul>{users.map(u => <li key={u.id}>{u.name}</li>)}</ul>
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Componente so exibe dados | Server component (default) |
| Precisa de onClick, onChange | Client component com `"use client"` |
| Header estatico, footer | Server component |
| Formulario com validacao | Client component |
| Fetch de dados | Server component com async/await |
| Precisa de localStorage/sessionStorage | Client component |
| Lib pesada de markdown/syntax highlight | Server component (nao vai pro bundle) |
| Mistura de interativo + dados do server | Composition: server passa children para client |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| `"use client"` em tudo por habito | Deixe o default (server component) |
| `useEffect` para fetch no App Router | `async function` direto no server component |
| Importar server component dentro de client | Passar como `children` via composition |
| Colocar API key em client component | Manter em server component |
| Instalar lib so para fetch client-side | Usar fetch nativo no server component |
| Adicionar estado so para dados do servidor | Retornar dados direto do server component |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
