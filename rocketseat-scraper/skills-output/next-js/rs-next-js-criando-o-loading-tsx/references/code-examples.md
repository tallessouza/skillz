# Code Examples: Loading.tsx no Next.js App Router

## Exemplo 1: Componente de Loading visual com animacao CSS

Retirado diretamente da aula — um loader com icone girando e borda animada:

```typescript
// app/loading.tsx
import { Loader2 } from "lucide-react"

export default function Loading() {
  return (
    <div className="min-h-[400px] flex flex-col items-center justify-center px-4">
      <div className="relative">
        <Loader2 className="text-gray-400 animate-spin size-12" />
        <div
          className="absolute top-0 left-0 w-full h-full rounded-full border-t-2 border-cyan-100 animate-[spin_3s_linear_infinite]"
        />
      </div>
    </div>
  )
}
```

Detalhes:
- `Loader2` do Lucide React com `animate-spin` padrao do Tailwind
- Uma div absoluta por cima com `border-top` cyan e animacao de spin mais lenta (3s) criando efeito de "anel orbital"
- Container com `min-h-[400px]` para evitar layout shift

## Exemplo 2: Page com Server Component assincrono

```typescript
// app/user/page.tsx

// Tipagem dos dados
interface UserListProps {
  id: number
  name: string
}

// Funcao que simula fetch de API
async function fetchUsers(): Promise<UserListProps[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: 1, name: "Alice" },
        { id: 2, name: "Bob" },
      ])
    }, 2000) // 2 segundos de delay para visualizar o loading
  })
}

// Componente que faz fetch (Server Component assincrono)
async function UserList() {
  const users = await fetchUsers()

  console.log("User list", "Server") // Aparece no client em dev, so servidor em prod

  return (
    <div className="mt-5 text-white">
      {users.map((user) => (
        <p key={user.id}>{user.name}</p>
      ))}
    </div>
  )
}

// Page component (exportado como rota)
export default function UserListPage() {
  return <UserList />
}
```

Pontos importantes:
- `UserListPage` e o componente da rota (export default)
- `UserList` e um componente auxiliar no mesmo arquivo — nao precisa estar em arquivo separado
- A funcao `fetchUsers` simula um delay com `setTimeout` + `Promise`
- Sem `"use client"` — tudo roda no servidor

## Exemplo 3: Variacao — Loading escopado para um segmento

```
app/
├── loading.tsx          ← Loading global (todas as rotas)
├── page.tsx
├── blog/
│   ├── loading.tsx      ← Loading apenas para /blog e subrotas
│   ├── page.tsx
│   └── [slug]/
│       └── page.tsx
└── user/
    └── page.tsx         ← Usa o loading.tsx global (app/)
```

Se `/blog` tiver seu proprio `loading.tsx`, ele sera usado para `/blog` e `/blog/[slug]`. A rota `/user` usara o `loading.tsx` da raiz.

## Exemplo 4: Variacao com fetch real (aplicacao pratica)

```typescript
// app/users/page.tsx
interface User {
  id: number
  name: string
  email: string
}

async function getUsers(): Promise<User[]> {
  const response = await fetch("https://jsonplaceholder.typicode.com/users", {
    cache: "no-store", // SSR em cada request
  })
  return response.json()
}

export default async function UsersPage() {
  const users = await getUsers()

  return (
    <ul>
      {users.map((user) => (
        <li key={user.id}>
          {user.name} — {user.email}
        </li>
      ))}
    </ul>
  )
}
```

Mesmo padrao, mas com `fetch` real em vez de `setTimeout`. O `loading.tsx` do segmento (ou global) cuida automaticamente do estado de carregamento.