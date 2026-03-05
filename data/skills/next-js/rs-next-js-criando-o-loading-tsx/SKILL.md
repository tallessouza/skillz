---
name: rs-next-js-criando-o-loading-tsx
description: "Applies Next.js loading.tsx special file pattern when creating routes with async data fetching. Use when user asks to 'add loading state', 'create a loading page', 'fetch data in server component', 'add suspense to route', or 'create loading.tsx'. Enforces correct placement of loading files in App Router folder hierarchy and async server component data fetching. Make sure to use this skill whenever generating Next.js App Router routes that fetch data. Not for client-side loading states with useState, React Query, or SWR."
---

# Loading.tsx — Special File do Next.js App Router

> Utilize o arquivo `loading.tsx` para criar estados de carregamento automaticos via React Suspense, eliminando a necessidade de estados manuais com useState.

## Rules

1. **Coloque loading.tsx no nivel correto da arvore de rotas** — na raiz de `app/` aplica a todas as paginas; dentro de `app/blog/` aplica apenas desse nivel para dentro, porque o Next.js envolve automaticamente o conteudo daquele segmento com React Suspense
2. **Exporte um componente default** — o nome da funcao nao importa (e default export), mas o arquivo deve ser exatamente `loading.tsx`, porque e um special file reconhecido pelo App Router
3. **loading.tsx pode ser Server ou Client Component** — diferente do `error.tsx` que exige `"use client"`, o loading aceita ambos, porque ele apenas renderiza UI de fallback
4. **Faca fetch de dados diretamente no Server Component assincrono** — use `async function` no componente e `await` na chamada, porque o componente roda exclusivamente no servidor e o Suspense cuida do loading automaticamente
5. **Nunca crie useState para loading quando usar App Router** — o loading.tsx elimina essa necessidade, porque o Suspense boundary ja gerencia o estado de carregamento
6. **console.log em Server Components aparece no client apenas em dev** — isso e uma feature do React, nao um bug; em build de producao, o log aparece somente no servidor

## How to write

### Estrutura do loading.tsx

```typescript
// app/loading.tsx — aplica globalmente
// app/blog/loading.tsx — aplica apenas para rotas dentro de /blog
export default function Loading() {
  return (
    <div className="min-h-[400px] flex flex-col items-center justify-center px-4">
      {/* Seu componente visual de loading */}
      <div className="relative">
        <Loader2 className="text-gray-400 animate-spin size-12" />
        <div className="absolute top-0 left-0 w-full h-full rounded-full border-t-2 border-cyan-100 animate-[spin_3s_linear_infinite]" />
      </div>
    </div>
  )
}
```

### Server Component com fetch assincrono

```typescript
// app/users/page.tsx
export default function UsersPage() {
  return <UserList />
}

async function UserList() {
  const users = await fetchUsers() // await direto no componente

  return (
    <div>
      {users.map(user => (
        <p key={user.id}>{user.name}</p>
      ))}
    </div>
  )
}
```

## Example

**Before (gerenciamento manual com useState):**
```typescript
"use client"
import { useState, useEffect } from "react"

export default function UsersPage() {
  const [users, setUsers] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetch("/api/users")
      .then(res => res.json())
      .then(data => { setUsers(data); setIsLoading(false) })
  }, [])

  if (isLoading) return <Spinner />
  return <ul>{users.map(u => <li key={u.id}>{u.name}</li>)}</ul>
}
```

**After (com loading.tsx + Server Component):**
```typescript
// app/users/loading.tsx
export default function Loading() {
  return <Spinner />
}

// app/users/page.tsx (Server Component — sem "use client")
async function getUsers() {
  const res = await fetch("https://api.example.com/users")
  return res.json()
}

export default async function UsersPage() {
  const users = await getUsers()
  return <ul>{users.map(u => <li key={u.id}>{u.name}</li>)}</ul>
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Loading global para todas as rotas | `app/loading.tsx` |
| Loading apenas para um segmento | `app/{segmento}/loading.tsx` |
| Dados vem de API externa | `async` no componente + `await fetch()` direto |
| Precisa de interatividade no loader | Adicione `"use client"` no loading.tsx (permitido) |
| console.log aparece no browser | Normal em dev; em prod aparece so no servidor |

## Anti-patterns

| Nunca faca | Faca assim |
|------------|------------|
| `useState` + `useEffect` para fetch em rota App Router | Server Component assincrono + `loading.tsx` |
| `"use client"` na page so para fazer fetch | Remova `"use client"`, use fetch direto no server |
| Loading inline com ternario no componente | Arquivo `loading.tsx` separado no segmento |
| `loading.js` (sem extensao tsx) em projeto TypeScript | `loading.tsx` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
