# Code Examples: Client e Server Components

## Exemplo 1: Header original (tudo client — problematico)

```tsx
// components/header.tsx
"use client"

import { signIn, signOut, useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

export function Header() {
  const { data: session } = useSession()
  const router = useRouter()

  function handleSearch(term: string) {
    router.push(`/?search=${term}`)
  }

  return (
    <header className="flex items-center justify-between p-4">
      <h1 className="text-xl font-bold">Board</h1>

      <input
        type="text"
        placeholder="Buscar..."
        onChange={(e) => handleSearch(e.target.value)}
      />

      {session ? (
        <>
          <span>{session.user?.name}</span>
          <button onClick={() => signOut()}>Sair</button>
        </>
      ) : (
        <button onClick={() => signIn()}>Entrar</button>
      )}
    </header>
  )
}
```

**Problema:** Todo o HTML do header (titulo, estrutura, estilos) e enviado como JavaScript ao navegador, mesmo sendo puramente estatico.

## Exemplo 2: Header refatorado (isolamento correto)

### header/index.tsx — Server Component
```tsx
import { SearchInput } from "./search-input"
import { UserButton } from "./user-button"

export function Header() {
  return (
    <header className="flex items-center justify-between p-4">
      <h1 className="text-xl font-bold">Board</h1>
      <SearchInput />
      <UserButton />
    </header>
  )
}
```

### header/search-input.tsx — Client Component
```tsx
"use client"

import { useRouter } from "next/navigation"

export function SearchInput() {
  const router = useRouter()

  function handleSearch(term: string) {
    router.push(`/?search=${term}`)
  }

  return (
    <input
      type="text"
      placeholder="Buscar..."
      onChange={(e) => handleSearch(e.target.value)}
    />
  )
}
```

### header/user-button.tsx — Client Component
```tsx
"use client"

import { signIn, signOut, useSession } from "next-auth/react"

export function UserButton() {
  const { data: session } = useSession()

  if (session) {
    return (
      <>
        <span>{session.user?.name}</span>
        <button onClick={() => signOut()}>Sair</button>
      </>
    )
  }

  return <button onClick={() => signIn()}>Entrar</button>
}
```

## Exemplo 3: Server Component com data fetching async

```tsx
// app/board/page.tsx — Server Component (padrao)
import { db } from "@/lib/db"

export default async function BoardPage() {
  // Pode usar await diretamente — e server component
  const issues = await db.issue.findMany({
    orderBy: { createdAt: "desc" },
  })

  return (
    <main>
      {issues.map((issue) => (
        <IssueCard key={issue.id} issue={issue} />
      ))}
    </main>
  )
}
```

**Nota:** Isso so funciona porque `BoardPage` NAO tem `"use client"`. Se tivesse, o `async` e `await` causariam erro.

## Exemplo 4: Atualizacao do layout apos reorganizacao

```tsx
// app/board/layout.tsx
// Antes (header na raiz):
import { Header } from "@/components/header"

// Depois (header em pasta):
import { Header } from "@/components/header/index"
// ou simplesmente:
import { Header } from "@/components/header"
```

## Exemplo 5: Padrao para componentes complexos

Quando um componente grande tem multiplas partes interativas:

```tsx
// sidebar/index.tsx — Server Component
import { NavLinks } from "./nav-links"        // estatico — server
import { ThemeToggle } from "./theme-toggle"  // usa useState — client
import { SearchBar } from "./search-bar"      // usa onChange — client
import { UserMenu } from "./user-menu"        // usa useSession — client

export async function Sidebar() {
  const categories = await fetchCategories()

  return (
    <aside>
      <NavLinks categories={categories} />
      <SearchBar />
      <ThemeToggle />
      <UserMenu />
    </aside>
  )
}
```

O `Sidebar` permanece como server component, pode usar `async/await`, e so os componentes que realmente precisam de interatividade sao enviados como JavaScript ao cliente.